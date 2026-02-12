
import React, { useState, useEffect, useMemo } from 'react';
import Header from './components/Header';
import ModuleCard from './components/ModuleCard';
import Player from './components/Player';
import LoginModal from './components/LoginModal';
import AdminDashboard from './components/AdminDashboard';
import CourseManager from './components/CourseManager';
import RoleAccessSettings from './components/RoleAccessSettings';
import SessionManager from './components/SessionManager';
import { MODULES, PASSING_SCORE } from './constants';
import { Module, UserState, ModuleProgress, AppView, UserRole, UserProfile, RegistrationData, TrainingSession } from './types';
import { dataService } from './services/dataService';
import { 
  Trophy, Activity, Star, Users, LayoutDashboard, Eye, Award, X, Download, Loader2,
  ShieldCheck, HeartPulse, FileText, Microscope, Syringe, BookOpen, Settings, Calendar
} from 'lucide-react';

const INITIAL_PROGRESS_TEMPLATE: Record<string, ModuleProgress> = {};
MODULES.forEach((m) => {
  INITIAL_PROGRESS_TEMPLATE[m.id] = {
    isUnlocked: true,
    isCompleted: false,
    highScore: 0
  };
});

function App() {
  const [view, setView] = useState<AppView>(AppView.DASHBOARD);
  const [activeModuleId, setActiveModuleId] = useState<string | null>(null);
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [currentUser, setCurrentUser] = useState<UserProfile | null>(null);
  
  // Modules managed locally with hybrid sync from Firebase
  const [modules, setModules] = useState<Module[]>(MODULES);
  const [sessions, setSessions] = useState<TrainingSession[]>([]);
  const [isLoadingModules, setIsLoadingModules] = useState(true);
  
  const [adminPreviewRole, setAdminPreviewRole] = useState<string>('All');
  const [showCertificate, setShowCertificate] = useState(false);

  const [users, setUsers] = useState<UserProfile[]>([]);
  const [isLoadingUsers, setIsLoadingUsers] = useState(true);
  const [isProcessing, setIsProcessing] = useState(false);

  // Load data on mount
  useEffect(() => {
    const initData = async () => {
      setIsLoadingUsers(true);
      setIsLoadingModules(true);
      try {
        const [fetchedUsers, fetchedModules, fetchedSessions] = await Promise.all([
          dataService.fetchUsers(),
          dataService.fetchModules(),
          dataService.fetchSessions()
        ]);
        
        setUsers(fetchedUsers);
        setSessions(fetchedSessions);

        // Hybrid Merge: Database versions override hardcoded ones
        const mergedModules = [...MODULES];
        fetchedModules.forEach(dbModule => {
          const index = mergedModules.findIndex(m => m.id === dbModule.id);
          if (index !== -1) {
            mergedModules[index] = dbModule;
          } else {
            mergedModules.push(dbModule);
          }
        });
        setModules(mergedModules);

      } catch (e) {
        console.error("Failed to load initial data", e);
      } finally {
        setIsLoadingUsers(false);
        setIsLoadingModules(false);
      }
    };
    initData();
  }, []);

  const currentUserProgress = useMemo(() => {
    if (!currentUser) return INITIAL_PROGRESS_TEMPLATE;
    const found = users.find(u => u.hospitalNumber === currentUser.hospitalNumber);
    return found ? found.progress : INITIAL_PROGRESS_TEMPLATE;
  }, [users, currentUser]);

  const filteredModules = useMemo(() => {
    if (!currentUser) return [];
    
    // Determine the effective role for preview/filtering
    let effectiveRole = currentUser.role;
    if (currentUser.role === 'QA Admin' && adminPreviewRole !== 'All') {
        effectiveRole = adminPreviewRole as UserRole;
    }

    // Role-Based Access Logic (RBAC)
    // 1. QA Admin & Managers always see all modules
    if (effectiveRole === 'QA Admin' || effectiveRole === 'Head / Assistant Head') {
      return modules;
    }

    // 2. Filter modules based on their "allowedRoles" property
    return modules.filter(m => {
      // If a module has explicitly defined allowedRoles, check against effectiveRole
      if (m.allowedRoles && m.allowedRoles.length > 0) {
        return m.allowedRoles.includes(effectiveRole as UserRole);
      }
      
      // Fallback: Default to allowing clinical roles if allowedRoles is missing/undefined
      const clinicalRoles: UserRole[] = ['Doctor', 'Nurse', 'Nurse (High-risk Area)', 'Other Clinical (Med Tech, Rad Tech, etc)'];
      return clinicalRoles.includes(effectiveRole as UserRole);
    });
  }, [currentUser, adminPreviewRole, modules]);

  const sections = useMemo(() => {
    const groups: Record<string, Module[]> = {};
    filteredModules.forEach(m => {
      if (!groups[m.section]) groups[m.section] = [];
      groups[m.section].push(m);
    });
    return groups;
  }, [filteredModules]);

  const sectionNames = useMemo(() => Object.keys(sections).sort(), [sections]);
  const [activeTab, setActiveTab] = useState<string>('');

  useEffect(() => {
    if (sectionNames.length > 0 && (!activeTab || !sections[activeTab])) {
        setActiveTab(sectionNames[0]);
    }
  }, [sectionNames, activeTab, sections]);

  const getSectionIcon = (name: string) => {
    if (name.includes('Quality Assurance')) return <ShieldCheck size={18} />;
    if (name.includes('Advanced')) return <Microscope size={18} />;
    if (name.includes('Infection Prevention')) return <Syringe size={18} />;
    if (name.includes('Patient Safety')) return <HeartPulse size={18} />;
    if (name.includes('Quality Management')) return <FileText size={18} />;
    return <Activity size={18} />;
  };

  const handleLogin = (role: UserRole, userProfile: UserProfile) => {
    setCurrentUser(userProfile);
    setIsLoggedIn(true);
    setView(role === 'QA Admin' ? AppView.ADMIN_DASHBOARD : AppView.DASHBOARD);
  };

  const handleRegister = async (data: RegistrationData) => {
    setIsProcessing(true);
    try {
        const newUser = await dataService.registerUser(data);
        if (newUser) {
            setUsers(prev => [...prev, newUser]);
            if (!isLoggedIn && newUser.role) handleLogin(newUser.role as UserRole, newUser);
        }
    } finally {
        setIsProcessing(false);
    }
  };

  const handleUpdateUser = async (hospitalNumber: string, data: RegistrationData) => {
    setIsProcessing(true);
    try {
        const updatedUser = await dataService.updateUser(hospitalNumber, data);
        if (updatedUser) {
            setUsers(prev => prev.map(u => u.hospitalNumber === hospitalNumber ? updatedUser : u));
            if (currentUser?.hospitalNumber === hospitalNumber) setCurrentUser(updatedUser);
        }
    } finally {
        setIsProcessing(false);
    }
  };

  const handleDeleteUser = async (hospitalNumber: string) => {
    if (await dataService.deleteUser(hospitalNumber)) {
      setUsers(prev => prev.filter(u => u.hospitalNumber !== hospitalNumber));
    }
  };

  const handleLogout = () => {
    setIsLoggedIn(false);
    setCurrentUser(null);
    setView(AppView.DASHBOARD);
    setAdminPreviewRole('All');
    setShowCertificate(false);
  };

  const handleModuleCompletion = async (score: number, answers: Record<string, number>) => {
    if (!activeModuleId || !currentUser) return;
    const isPassed = score >= PASSING_SCORE;
    const currentProg = currentUserProgress[activeModuleId] || { isUnlocked: true, isCompleted: false, highScore: 0 };
    
    const updatedProg: ModuleProgress = {
        ...currentProg,
        highScore: Math.max(currentProg.highScore, score),
        isCompleted: currentProg.isCompleted || isPassed,
        lastAttemptAnswers: answers
    };

    setUsers(prev => prev.map(u => u.hospitalNumber === currentUser.hospitalNumber ? { ...u, progress: { ...u.progress, [activeModuleId]: updatedProg } } : u));
    await dataService.updateUserProgress(currentUser.hospitalNumber, activeModuleId, updatedProg);
    setActiveModuleId(null);
    setView(AppView.DASHBOARD);
  };

  const handleAddModule = async (newModule: Module) => {
    if (await dataService.saveModule(newModule)) {
      setModules(prev => [...prev, newModule]);
    }
  };

  const handleUpdateModule = async (updatedModule: Module) => {
    if (await dataService.saveModule(updatedModule)) {
      setModules(prev => prev.map(m => m.id === updatedModule.id ? updatedModule : m));
    }
  };

  const handleUpdateModules = async (updatedModules: Module[]) => {
    setIsProcessing(true);
    try {
        for (const mod of updatedModules) {
            await dataService.saveModule(mod);
        }
        setModules(updatedModules);
    } finally {
        setIsProcessing(false);
    }
  };

  const handleDeleteModule = async (moduleId: string) => {
    if (await dataService.deleteModule(moduleId)) {
      setModules(prev => prev.filter(m => m.id !== moduleId));
    }
  };

  const handleAddSession = async (session: TrainingSession) => {
    if (await dataService.saveSession(session)) {
      setSessions(prev => [...prev, session]);
    }
  };

  const handleUpdateSession = async (session: TrainingSession) => {
    if (await dataService.saveSession(session)) {
      setSessions(prev => prev.map(s => s.id === session.id ? session : s));
    }
  };

  const handleDeleteSession = async (sessionId: string) => {
    if (await dataService.deleteSession(sessionId)) {
      setSessions(prev => prev.filter(s => s.id !== sessionId));
    }
  };

  // Fixed the mapping here: using m.id instead of non-existent id
  const visibleModuleIds = filteredModules.map(m => m.id); 
  const completedCount = visibleModuleIds.filter(id => currentUserProgress[id]?.isCompleted).length;
  const progressPercent = visibleModuleIds.length > 0 ? Math.round((completedCount / visibleModuleIds.length) * 100) : 0;
  const isAllCompleted = visibleModuleIds.length > 0 && completedCount === visibleModuleIds.length;
  const activeModule = activeModuleId ? modules.find(m => m.id === activeModuleId) : null;

  if ((isLoadingUsers || isLoadingModules) && !isLoggedIn) {
      return (
          <div className="min-h-screen bg-gray-50 flex flex-col items-center justify-center">
              <div className="bg-white p-8 rounded-xl shadow-lg flex flex-col items-center gap-4">
                  <div className="bg-osmak-green p-3 rounded-full text-white"><Loader2 className="animate-spin" size={32} /></div>
                  <h2 className="text-xl font-bold text-gray-800">Synchronizing Quality Training Portal...</h2>
                  <p className="text-gray-500 text-sm">Loading course modules and employee data.</p>
              </div>
          </div>
      );
  }

  if (!isLoggedIn) return <LoginModal users={users} onLogin={handleLogin} onRegister={handleRegister} isLoading={isProcessing} />;

  return (
    <div className="min-h-screen bg-gray-50 flex flex-col">
      <Header 
        userRole={currentUser?.role || undefined}
        onLogout={handleLogout}
        onLogoClick={() => setView(currentUser?.role === 'QA Admin' ? AppView.ADMIN_DASHBOARD : AppView.DASHBOARD)}
      />
      
      {currentUser?.role === 'QA Admin' && (
          <div className="bg-gray-800 text-white px-6 py-2 flex flex-col md:flex-row gap-4 text-sm justify-between items-center shadow-inner overflow-x-auto">
              <div className="flex gap-4 shrink-0">
                  <button onClick={() => setView(AppView.ADMIN_DASHBOARD)} className={`flex items-center gap-2 px-3 py-1 rounded transition-colors ${view === AppView.ADMIN_DASHBOARD ? 'bg-white/20 font-bold' : 'hover:bg-white/10 opacity-70'}`}><Users size={16} /> Employees</button>
                  <button onClick={() => setView(AppView.SESSIONS)} className={`flex items-center gap-2 px-3 py-1 rounded transition-colors ${view === AppView.SESSIONS ? 'bg-white/20 font-bold' : 'hover:bg-white/10 opacity-70'}`}><Calendar size={16} /> Sessions</button>
                  <button onClick={() => setView(AppView.COURSE_MANAGER)} className={`flex items-center gap-2 px-3 py-1 rounded transition-colors ${view === AppView.COURSE_MANAGER ? 'bg-white/20 font-bold' : 'hover:bg-white/10 opacity-70'}`}><BookOpen size={16} /> Course Manager</button>
                  <button onClick={() => setView(AppView.ROLE_ACCESS)} className={`flex items-center gap-2 px-3 py-1 rounded transition-colors ${view === AppView.ROLE_ACCESS ? 'bg-white/20 font-bold' : 'hover:bg-white/10 opacity-70'}`}><ShieldCheck size={16} /> Role Access</button>
                  <button onClick={() => setView(AppView.DASHBOARD)} className={`flex items-center gap-2 px-3 py-1 rounded transition-colors ${view === AppView.DASHBOARD ? 'bg-white/20 font-bold' : 'hover:bg-white/10 opacity-70'}`}><LayoutDashboard size={16} /> Course Preview</button>
              </div>
              {view === AppView.DASHBOARD && (
                  <div className="flex items-center gap-2 bg-gray-700 p-1 pl-3 rounded border border-gray-600 shrink-0">
                      <span className="text-gray-300 text-xs font-bold uppercase flex items-center gap-1"><Eye size={12} /> Preview as:</span>
                      <select value={adminPreviewRole} onChange={(e) => setAdminPreviewRole(e.target.value)} className="bg-white text-black border-none rounded px-2 py-1 text-xs outline-none cursor-pointer">
                          <option value="All">QA Admin (View All)</option>
                          <option value="Head / Assistant Head">Head / Assistant Head</option>
                          <option value="Doctor">Doctor</option>
                          <option value="Nurse">Nurse</option>
                          <option value="Nurse (High-risk Area)">Nurse (High-risk Area)</option>
                          <option value="Other Clinical (Med Tech, Rad Tech, etc)">Other Clinical (Med Tech, Rad Tech, etc)</option>
                          <option value="Medical Intern">Medical Intern</option>
                          <option value="Non-clinical">Non-clinical</option>
                      </select>
                  </div>
              )}
          </div>
      )}

      {view === AppView.ADMIN_DASHBOARD && currentUser?.role === 'QA Admin' && (
        <main className="flex-1 max-w-7xl mx-auto w-full p-6 animate-fadeIn">
            <AdminDashboard users={users} modules={modules} onRegisterUser={handleRegister} onUpdateUser={handleUpdateUser} onDeleteUser={handleDeleteUser} isLoading={isProcessing} />
        </main>
      )}

      {view === AppView.SESSIONS && currentUser?.role === 'QA Admin' && (
        <main className="flex-1 max-w-7xl mx-auto w-full p-6 animate-fadeIn">
            <SessionManager 
                sessions={sessions} 
                modules={modules} 
                users={users} 
                onAddSession={handleAddSession} 
                onUpdateSession={handleUpdateSession} 
                onDeleteSession={handleDeleteSession} 
            />
        </main>
      )}

      {view === AppView.COURSE_MANAGER && currentUser?.role === 'QA Admin' && (
        <main className="flex-1 max-w-7xl mx-auto w-full p-6 animate-fadeIn">
            <CourseManager modules={modules} onAddModule={handleAddModule} onUpdateModule={handleUpdateModule} onDeleteModule={handleDeleteModule} />
        </main>
      )}

      {view === AppView.ROLE_ACCESS && currentUser?.role === 'QA Admin' && (
        <main className="flex-1 max-w-7xl mx-auto w-full p-6 animate-fadeIn">
            <RoleAccessSettings modules={modules} onUpdateModules={handleUpdateModules} />
        </main>
      )}

      {view === AppView.DASHBOARD && (
        <main className="flex-1 max-w-7xl mx-auto w-full p-6 space-y-6 animate-fadeIn">
            {isAllCompleted && currentUser?.role !== 'QA Admin' && (
               <div className="bg-gradient-to-r from-yellow-50 to-orange-50 border border-yellow-200 rounded-xl p-6 shadow-sm flex flex-col md:flex-row items-center justify-between gap-6 relative overflow-hidden">
                   <div className="absolute top-0 right-0 p-4 opacity-10"><Award size={120} className="text-yellow-500" /></div>
                   <div className="z-10 flex items-center gap-4">
                       <div className="p-4 bg-yellow-100 text-yellow-600 rounded-full shadow-inner"><Trophy size={32} /></div>
                       <div>
                           <h2 className="text-xl font-bold text-gray-900">Congratulations, {currentUser?.firstName}!</h2>
                           <p className="text-gray-700 mt-1">You have successfully completed all required training modules.</p>
                       </div>
                   </div>
                   <button onClick={() => setShowCertificate(true)} className="z-10 bg-gradient-to-r from-yellow-500 to-orange-500 text-white px-6 py-3 rounded-lg shadow-lg font-bold flex items-center gap-2 hover:scale-105 transition-transform"><Award size={20} /> View Certificate</button>
               </div>
            )}

            <section className="bg-white rounded-xl p-5 shadow-sm border border-gray-200 flex flex-col md:flex-row items-center justify-between gap-6">
              <div>
                <h2 className="text-xl font-bold text-gray-900">Welcome, {currentUser?.firstName} {currentUser?.lastName}</h2>
                <p className="text-sm text-gray-600 leading-relaxed">Quality Assurance Training Portal - {currentUser?.role}</p>
              </div>
              {currentUser?.role !== 'QA Admin' && (
                  <div className="flex items-center gap-6 bg-gray-50 px-6 py-3 rounded-lg border border-gray-100 shrink-0">
                     <div className="text-center">
                        <div className="text-xs text-gray-500 font-medium mb-1">Status</div>
                        <div className="text-lg font-bold text-gray-900 flex items-center gap-1.5">{completedCount}/{visibleModuleIds.length}</div>
                     </div>
                     <div className="w-px h-8 bg-gray-200"></div>
                     <div className="text-center">
                        <div className="text-xs text-gray-500 font-medium mb-1">Progress</div>
                        <div className="text-lg font-bold text-gray-900">{progressPercent}%</div>
                     </div>
                  </div>
              )}
            </section>

            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-5 gap-3">
              {sectionNames.map(section => (
                <button key={section} onClick={() => setActiveTab(section)} className={`flex items-center p-3 rounded-lg border transition-all ${activeTab === section ? 'border-osmak-green bg-osmak-green/5 ring-1 ring-osmak-green' : 'border-gray-200 bg-white hover:border-osmak-green/50'}`}>
                  <div className={`w-8 h-8 rounded-md flex items-center justify-center mr-3 ${activeTab === section ? 'bg-osmak-green text-white' : 'bg-gray-100 text-gray-500'}`}>{getSectionIcon(section)}</div>
                  <div className="flex-1 min-w-0 text-left">
                    <div className="text-xs font-bold leading-tight truncate text-black">{section}</div>
                  </div>
                </button>
              ))}
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-6 gap-6">
               {sections[activeTab]?.map(module => (
                 <div key={module.id} className="md:col-span-1 lg:col-span-2">
                    <ModuleCard module={module} progress={currentUserProgress[module.id] || { isUnlocked: true, isCompleted: false, highScore: 0 }} onStart={(id) => { setActiveModuleId(id); setView(AppView.PLAYER); }} />
                 </div>
               ))}
            </div>
        </main>
      )}

      {view === AppView.PLAYER && activeModule && (
        <Player module={activeModule} onExit={() => { setActiveModuleId(null); setView(AppView.DASHBOARD); }} onComplete={handleModuleCompletion} />
      )}
      
      {showCertificate && currentUser && (
        <div className="fixed inset-0 z-[300] bg-black/80 flex items-center justify-center p-4 backdrop-blur-sm animate-fadeIn">
           <div className="bg-white rounded-lg shadow-2xl max-w-4xl w-full flex flex-col relative overflow-hidden">
              <div className="bg-gray-800 text-white p-4 flex justify-between items-center no-print">
                 <h3 className="font-bold flex items-center gap-2"><Award size={20}/> Certificate of Completion</h3>
                 <div className="flex gap-2">
                     <button onClick={() => window.print()} className="px-4 py-2 bg-blue-600 hover:bg-blue-700 rounded text-sm font-bold flex items-center gap-2"><Download size={16} /> Print / Save PDF</button>
                     <button onClick={() => setShowCertificate(false)} className="hover:text-red-400 p-1"><X size={24} /></button>
                 </div>
              </div>
              <div className="p-10 md:p-16 text-center border-[20px] border-double border-gray-100 m-2 flex flex-col items-center min-h-[600px] relative bg-white certificate-container">
                  <img src="https://maxterrenal-hash.github.io/justculture/osmak-logo.png" alt="OsMak Logo" className="h-24 w-auto mb-6" />
                  <h1 className="text-4xl md:text-5xl font-serif font-bold text-gray-900 mb-2 uppercase">Certificate of Completion</h1>
                  <p className="text-gray-500 italic mb-12">is hereby presented to</p>
                  <h2 className="text-3xl md:text-5xl font-bold text-osmak-green border-b-2 border-gray-300 pb-4 px-12 mb-8 font-serif">{currentUser.firstName} {currentUser.lastName}</h2>
                  <p className="text-xl text-gray-700 max-w-2xl mx-auto leading-relaxed mb-12">Quality Assurance Division Training Portal</p>
                  <div className="flex justify-around w-full max-w-3xl mt-auto pt-12">
                      <div className="text-center"><div className="w-48 border-t border-gray-400 mx-auto mb-2"></div><p className="font-bold">QA Division Head</p></div>
                      <div className="text-center"><div className="w-48 border-t border-gray-400 mx-auto mb-2 pt-2 text-lg font-serif">{new Date().toLocaleDateString()}</div><p className="text-sm">Date</p></div>
                  </div>
              </div>
           </div>
        </div>
      )}
      <style>{`@media print { body * { visibility: hidden; } .certificate-container, .certificate-container * { visibility: visible; } .certificate-container { position: absolute; left: 0; top: 0; width: 100%; height: 100%; margin: 0; border: 10px double #ccc; } .no-print { display: none !important; } }`}</style>
    </div>
  );
}

export default App;
