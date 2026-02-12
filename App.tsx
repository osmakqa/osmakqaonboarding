
import React, { useState, useEffect, useMemo } from 'react';
import Header from './components/Header';
import ModuleCard from './components/ModuleCard';
import Player from './components/Player';
import LoginModal from './components/LoginModal';
import AdminDashboard from './components/AdminDashboard';
import CourseManager from './components/CourseManager';
import RoleAccessSettings from './components/RoleAccessSettings';
import SessionManager from './components/SessionManager';
import SessionChoiceView from './components/SessionChoiceView';
import TrainingEvaluation from './components/TrainingEvaluation';
import { MODULES, PASSING_SCORE } from './constants';
import { Module, ModuleProgress, AppView, UserRole, UserProfile, RegistrationData, TrainingSession, Attempt, SessionEvaluation } from './types';
import { dataService } from './services/dataService';
import { 
  Trophy, Activity, Star, Users, LayoutDashboard, Eye, Award, X, Download, Loader2,
  ShieldCheck, HeartPulse, FileText, Microscope, Syringe, BookOpen, Settings, Calendar, ArrowLeft,
  Mail, Phone, CheckCircle, ExternalLink, MessageCircle, ClipboardCheck
} from 'lucide-react';

const INITIAL_PROGRESS_TEMPLATE: Record<string, ModuleProgress> = {};
MODULES.forEach((m) => {
  INITIAL_PROGRESS_TEMPLATE[m.id] = {
    isUnlocked: true,
    isCompleted: false,
    highScore: 0,
    attempts: []
  };
});

const getSectionIcon = (section: string) => {
  if (section.includes('Quality Assurance')) return <ShieldCheck size={18} />;
  if (section.includes('Infection Prevention')) return <Syringe size={18} />;
  if (section.includes('Quality Management')) return <Settings size={18} />;
  if (section.includes('Advanced Infection')) return <Microscope size={18} />;
  return <BookOpen size={18} />;
};

function App() {
  const [view, setView] = useState<AppView>(AppView.DASHBOARD);
  const [activeModuleId, setActiveModuleId] = useState<string | null>(null);
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [currentUser, setCurrentUser] = useState<UserProfile | null>(null);
  const [currentSession, setCurrentSession] = useState<TrainingSession | null>(null);
  
  const [modules, setModules] = useState<Module[]>(MODULES);
  const [sessions, setSessions] = useState<TrainingSession[]>([]);
  const [isLoadingModules, setIsLoadingModules] = useState(true);
  
  const [adminPreviewRole, setAdminPreviewRole] = useState<string>('All');

  const [users, setUsers] = useState<UserProfile[]>([]);
  const [isLoadingUsers, setIsLoadingUsers] = useState(true);
  const [isProcessing, setIsProcessing] = useState(false);

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
        setSessions(fetchedSessions || []);

        const mergedModules = [...MODULES];
        fetchedModules.forEach(dbModule => {
          const index = mergedModules.findIndex(m => m.id === dbModule.id);
          if (index !== -1) mergedModules[index] = dbModule;
          else mergedModules.push(dbModule);
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
    
    if (currentSession && currentUser.role !== 'QA Admin') {
        return modules.filter(m => currentSession.moduleIds.includes(m.id));
    }

    let effectiveRole = currentUser.role;
    if (currentUser.role === 'QA Admin' && adminPreviewRole !== 'All') {
        effectiveRole = adminPreviewRole as UserRole;
    }

    if (effectiveRole === 'QA Admin' || effectiveRole === 'Head / Assistant Head') return modules;

    return modules.filter(m => {
      if (m.allowedRoles && m.allowedRoles.length > 0) return m.allowedRoles.includes(effectiveRole as UserRole);
      const clinicalRoles: UserRole[] = ['Doctor', 'Nurse', 'Nurse (High-risk Area)', 'Other Clinical (Med Tech, Rad Tech, etc)'];
      return clinicalRoles.includes(effectiveRole as UserRole);
    });
  }, [currentUser, adminPreviewRole, modules, currentSession]);

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

  const handleSelectSession = (session: TrainingSession | null) => {
    if (session) {
      localStorage.setItem(`osmak_session_${currentUser?.hospitalNumber}`, session.id);
    } else {
      localStorage.removeItem(`osmak_session_${currentUser?.hospitalNumber}`);
    }
    setCurrentSession(session);
    setView(AppView.DASHBOARD);
  };

  const handleJoinSession = async (session: TrainingSession) => {
    if (!currentUser) return;
    setIsProcessing(true);
    try {
      const updated = {
        ...session,
        employeeHospitalNumbers: [...new Set([...session.employeeHospitalNumbers, currentUser.hospitalNumber])]
      };
      await handleUpdateSession(updated);
      handleSelectSession(updated);
    } finally {
      setIsProcessing(false);
    }
  };

  const handleLogin = (role: UserRole, userProfile: UserProfile) => {
    setCurrentUser(userProfile);
    setIsLoggedIn(true);
    
    if (role === 'QA Admin') {
      setView(AppView.ADMIN_DASHBOARD);
    } else {
      const now = new Date();
      const active = sessions.filter(s => 
        s.status === 'open' && 
        now >= new Date(s.startDateTime) && 
        now <= new Date(s.endDateTime) &&
        s.employeeHospitalNumbers.includes(userProfile.hospitalNumber)
      );

      const savedSessionId = localStorage.getItem(`osmak_session_${userProfile.hospitalNumber}`);
      const enrolledSession = active.find(s => s.id === savedSessionId);

      if (enrolledSession) {
        setCurrentSession(enrolledSession);
        setView(AppView.DASHBOARD);
      } else if (active.length === 1) {
        const singleSession = active[0];
        localStorage.setItem(`osmak_session_${userProfile.hospitalNumber}`, singleSession.id);
        setCurrentSession(singleSession);
        setView(AppView.DASHBOARD);
      } else {
        setView(AppView.SESSION_CHOICE);
      }
    }
  };

  const handleModuleCompletion = async (score: number, answers: Record<string, number>) => {
    if (!activeModuleId || !currentUser) return;
    const isPassed = score >= PASSING_SCORE;
    const currentProg = currentUserProgress[activeModuleId] || { isUnlocked: true, isCompleted: false, highScore: 0, attempts: [] };
    
    const newAttempt: Attempt = {
        date: new Date().toISOString(),
        score,
        answers
    };

    const updatedProg: ModuleProgress = {
        ...currentProg,
        highScore: Math.max(currentProg.highScore, score),
        isCompleted: currentProg.isCompleted || isPassed,
        lastAttemptAnswers: answers,
        attempts: [...(currentProg.attempts || []), newAttempt]
    };

    // Update locally
    setUsers(prev => prev.map(u => u.hospitalNumber === currentUser.hospitalNumber ? { ...u, progress: { ...u.progress, [activeModuleId]: updatedProg } } : u));
    await dataService.updateUserProgress(currentUser.hospitalNumber, activeModuleId, updatedProg);
    
    // Check if session is finished
    if (currentSession) {
        const sessionModuleIds = currentSession.moduleIds;
        // Check updated local progress for current user
        const completedSessionCount = sessionModuleIds.filter(mid => mid === activeModuleId ? updatedProg.isCompleted : currentUserProgress[mid]?.isCompleted).length;
        
        if (completedSessionCount === sessionModuleIds.length) {
            // Check if already evaluated
            const isEvaluated = currentSession.evaluations?.[currentUser.hospitalNumber];
            if (!isEvaluated) {
                setActiveModuleId(null);
                setView(AppView.EVALUATION);
                return;
            } else {
                setActiveModuleId(null);
                setView(AppView.COMPLETION_SUCCESS);
                return;
            }
        }
    }

    setActiveModuleId(null);
    setView(AppView.DASHBOARD);
  };

  const handleEvaluationSubmit = async (evaluation: SessionEvaluation) => {
      if (!currentSession || !currentUser) return;
      setIsProcessing(true);
      try {
          const updatedSession = {
              ...currentSession,
              evaluations: {
                  ...(currentSession.evaluations || {}),
                  [currentUser.hospitalNumber]: evaluation
              }
          };
          await handleUpdateSession(updatedSession);
          setView(AppView.COMPLETION_SUCCESS);
      } finally {
          setIsProcessing(false);
      }
  };

  const handleLogout = () => {
    setIsLoggedIn(false);
    setCurrentUser(null);
    setCurrentSession(null);
    setView(AppView.DASHBOARD);
    setAdminPreviewRole('All');
  };

  const handleRegister = async (data: RegistrationData) => { setIsProcessing(true); try { const newUser = await dataService.registerUser(data); if (newUser) { setUsers(prev => [...prev, newUser]); if (!isLoggedIn && newUser.role) handleLogin(newUser.role as UserRole, newUser); } } finally { setIsProcessing(false); } };
  const handleUpdateUser = async (hospitalNumber: string, data: RegistrationData) => { setIsProcessing(true); try { const updatedUser = await dataService.updateUser(hospitalNumber, data); if (updatedUser) { setUsers(prev => prev.map(u => u.hospitalNumber === hospitalNumber ? updatedUser : u)); if (currentUser?.hospitalNumber === hospitalNumber) setCurrentUser(updatedUser); } } finally { setIsProcessing(false); } };
  const handleDeleteUser = async (hospitalNumber: string) => { if (await dataService.deleteUser(hospitalNumber)) { setUsers(prev => prev.filter(u => u.hospitalNumber !== hospitalNumber)); } };
  const handleAddModule = async (newModule: Module) => { if (await dataService.saveModule(newModule)) { setModules(prev => [...prev, newModule]); } };
  const handleUpdateModule = async (updatedModule: Module) => { if (await dataService.saveModule(updatedModule)) { setModules(prev => prev.map(m => m.id === updatedModule.id ? updatedModule : m)); } };
  const handleUpdateModules = async (updatedModules: Module[]) => { setIsProcessing(true); try { for (const mod of updatedModules) { await dataService.saveModule(mod); } setModules(updatedModules); } finally { setIsProcessing(false); } };
  const handleDeleteModule = async (moduleId: string) => { if (await dataService.deleteModule(moduleId)) { setModules(prev => prev.filter(m => m.id !== moduleId)); } };
  const handleAddSession = async (session: TrainingSession) => { if (await dataService.saveSession(session)) { setSessions(prev => [...prev, session]); } };
  const handleUpdateSession = async (session: TrainingSession) => { if (await dataService.saveSession(session)) { setSessions(prev => prev.map(s => s.id === session.id ? session : s)); } };
  const handleDeleteSession = async (sessionId: string) => { if (await dataService.deleteSession(sessionId)) { setSessions(prev => prev.filter(s => s.id !== sessionId)); } };

  const visibleModuleIds = filteredModules.map(m => m.id); 
  const completedCount = visibleModuleIds.filter(id => currentUserProgress[id]?.isCompleted).length;
  const progressPercent = visibleModuleIds.length > 0 ? Math.round((completedCount / visibleModuleIds.length) * 100) : 0;
  const isAllCompleted = visibleModuleIds.length > 0 && completedCount === visibleModuleIds.length;
  const activeModule = activeModuleId ? modules.find(m => m.id === activeModuleId) : null;

  if ((isLoadingUsers || isLoadingModules) && !isLoggedIn) {
      return (
          <div className="min-h-screen bg-gray-50 flex flex-col items-center justify-center">
              <div className="bg-white p-8 rounded-xl shadow-lg flex flex-col items-center gap-4"><div className="bg-osmak-green p-3 rounded-full text-white"><Loader2 className="animate-spin" size={32} /></div><h2 className="text-xl font-bold text-gray-800">Synchronizing Portal...</h2></div>
          </div>
      );
  }

  if (!isLoggedIn) return <LoginModal users={users} onLogin={handleLogin} onRegister={handleRegister} isLoading={isProcessing} />;

  return (
    <div className="min-h-screen bg-gray-50 flex flex-col">
      <Header 
        userRole={currentUser?.role || undefined}
        onLogout={handleLogout}
        onLogoClick={() => {
            if (currentUser?.role === 'QA Admin') setView(AppView.ADMIN_DASHBOARD);
            else setView(AppView.SESSION_CHOICE);
        }}
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
          </div>
      )}

      {view === AppView.SESSION_CHOICE && (
        <SessionChoiceView 
            allSessions={sessions}
            currentUser={currentUser}
            modules={modules}
            userProgress={currentUserProgress}
            onSelectSession={handleSelectSession}
            onJoinSession={handleJoinSession}
        />
      )}

      {view === AppView.EVALUATION && currentSession && currentUser && (
          <TrainingEvaluation 
            session={currentSession} 
            user={currentUser} 
            existingEvaluation={currentSession.evaluations?.[currentUser.hospitalNumber]}
            onSubmit={handleEvaluationSubmit} 
            isSubmitting={isProcessing}
            onClose={() => setView(AppView.DASHBOARD)}
          />
      )}

      {view === AppView.COMPLETION_SUCCESS && (
          <div className="flex-1 flex items-center justify-center p-6 animate-fadeIn">
              <div className="bg-white rounded-[3rem] shadow-2xl max-w-2xl w-full p-12 text-center space-y-8 border border-gray-100">
                  <div className="relative">
                      <div className="w-24 h-24 bg-green-100 text-osmak-green rounded-full flex items-center justify-center mx-auto ring-8 ring-green-50">
                          <CheckCircle size={48} />
                      </div>
                  </div>
                  
                  <div className="space-y-4">
                      <h2 className="text-4xl font-black text-gray-900 tracking-tight leading-tight uppercase">Session Complete!</h2>
                      <div className="h-1.5 w-24 bg-osmak-green mx-auto rounded-full"></div>
                      <p className="text-gray-500 font-medium text-lg leading-relaxed">
                          Congratulations! You have successfully finished <b>{currentSession?.name}</b> and submitted your evaluation.
                      </p>
                  </div>

                  <div className="bg-blue-50/50 rounded-3xl p-8 border border-blue-100/50 space-y-6">
                      <p className="text-blue-800 font-bold text-sm leading-relaxed">
                          You can still access the training videos at any time for review. Do not hesitate to contact Quality Assurance for questions or clarifications.
                      </p>
                      
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                          <div className="flex items-center gap-3 bg-white p-4 rounded-2xl shadow-sm border border-blue-100">
                              <Phone className="text-blue-600" size={18} />
                              <div className="text-left">
                                  <div className="text-[10px] font-black uppercase text-gray-400">Local Line</div>
                                  <div className="text-sm font-bold text-blue-900">Ext. 2101 / 2102</div>
                              </div>
                          </div>
                          <div className="flex items-center gap-3 bg-white p-4 rounded-2xl shadow-sm border border-blue-100">
                              <MessageCircle className="text-blue-600" size={18} />
                              <div className="text-left">
                                  <div className="text-[10px] font-black uppercase text-gray-400">Office</div>
                                  <div className="text-sm font-bold text-blue-900">QA Division</div>
                              </div>
                          </div>
                      </div>
                  </div>

                  <div className="pt-4 flex flex-col gap-3">
                      <button 
                        onClick={() => {
                            setCurrentSession(null);
                            setView(AppView.DASHBOARD);
                        }}
                        className="w-full py-4 bg-gray-900 text-white rounded-2xl font-black text-lg uppercase tracking-widest hover:bg-black transition-all shadow-lg active:scale-95"
                      >
                          Return to Library
                      </button>
                      <button 
                        onClick={() => setView(AppView.EVALUATION)}
                        className="w-full py-4 bg-osmak-green text-white rounded-2xl font-black text-lg uppercase tracking-widest hover:bg-osmak-green-dark transition-all shadow-lg active:scale-95 flex items-center justify-center gap-3"
                      >
                          <ClipboardCheck size={24} />
                          Review My Evaluation
                      </button>
                  </div>
              </div>
          </div>
      )}

      {view === AppView.ADMIN_DASHBOARD && <main className="flex-1 max-w-7xl mx-auto w-full p-6 animate-fadeIn"><AdminDashboard users={users} modules={modules} onRegisterUser={handleRegister} onUpdateUser={handleUpdateUser} onDeleteUser={handleDeleteUser} isLoading={isProcessing} /></main>}
      {view === AppView.SESSIONS && <main className="flex-1 max-w-7xl mx-auto w-full p-6 animate-fadeIn"><SessionManager sessions={sessions} modules={modules} users={users} onAddSession={handleAddSession} onUpdateSession={handleUpdateSession} onDeleteSession={handleDeleteSession} /></main>}
      {view === AppView.COURSE_MANAGER && <main className="flex-1 max-w-7xl mx-auto w-full p-6 animate-fadeIn"><CourseManager modules={modules} onAddModule={handleAddModule} onUpdateModule={handleUpdateModule} onDeleteModule={handleDeleteModule} /></main>}
      {view === AppView.ROLE_ACCESS && <main className="flex-1 max-w-7xl mx-auto w-full p-6 animate-fadeIn"><RoleAccessSettings modules={modules} onUpdateModules={handleUpdateModules} /></main>}

      {view === AppView.DASHBOARD && (
        <main className="flex-1 max-w-7xl mx-auto w-full p-6 space-y-6 animate-fadeIn">
            {(currentSession || sessions.length > 0) && currentUser?.role !== 'QA Admin' && (
                <div className={`${currentSession ? 'bg-blue-600' : 'bg-gray-800'} text-white p-4 rounded-xl flex justify-between items-center shadow-lg transition-colors`}>
                    <div className="flex items-center gap-3">
                        <Calendar size={20}/>
                        <span className="font-bold">
                            {currentSession ? `Active Session: ${currentSession.name}` : 'General Training Library'}
                        </span>
                    </div>
                    <button 
                        onClick={() => { 
                            setCurrentSession(null); 
                            setView(AppView.SESSION_CHOICE); 
                        }} 
                        className="text-xs font-black px-4 py-2 bg-white/10 hover:bg-white/20 rounded-lg flex items-center gap-2 transition-all uppercase"
                    >
                        <ArrowLeft size={14} />
                        Portal Entry
                    </button>
                </div>
            )}
            
            {isAllCompleted && currentUser?.role !== 'QA Admin' && (
               <div className="bg-gradient-to-r from-green-50 to-blue-50 border border-green-200 rounded-xl p-6 shadow-sm flex flex-col md:flex-row items-center justify-between gap-6 relative overflow-hidden">
                   <div className="absolute top-0 right-0 p-4 opacity-10"><ClipboardCheck size={120} className="text-green-500" /></div>
                   <div className="z-10 flex items-center gap-4">
                       <div className="p-4 bg-green-100 text-green-600 rounded-full shadow-inner"><Trophy size={32} /></div>
                       <div>
                           <h2 className="text-xl font-bold text-gray-900">Congratulations, {currentUser?.firstName}!</h2>
                           <p className="text-gray-700 mt-1">You have successfully completed all required training modules and evaluations.</p>
                       </div>
                   </div>
                   <button onClick={() => setView(AppView.EVALUATION)} className="z-10 bg-osmak-green text-white px-6 py-3 rounded-lg shadow-lg font-bold flex items-center gap-2 hover:scale-105 transition-transform">
                       <ClipboardCheck size={20} /> View Training Evaluation
                   </button>
               </div>
            )}

            <section className="bg-white rounded-xl p-5 shadow-sm border border-gray-200 flex flex-col md:flex-row items-center justify-between gap-6"><div><h2 className="text-xl font-bold text-gray-900">Welcome, {currentUser?.firstName} {currentUser?.lastName}</h2><p className="text-sm text-gray-600 leading-relaxed">Quality Assurance Training Portal - {currentUser?.role}</p></div>{currentUser?.role !== 'QA Admin' && (<div className="flex items-center gap-6 bg-gray-50 px-6 py-3 rounded-lg border border-gray-100 shrink-0"><div className="text-center"><div className="text-xs text-gray-500 font-medium mb-1">In {currentSession ? 'Session' : 'Total'}</div><div className="text-lg font-bold text-gray-900 flex items-center gap-1.5">{completedCount}/{visibleModuleIds.length}</div></div><div className="w-px h-8 bg-gray-200"></div><div className="text-center"><div className="text-xs text-gray-500 font-medium mb-1">Progress</div><div className="text-lg font-bold text-gray-900">{progressPercent}%</div></div></div>)}</section>

            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-5 gap-3">
              {sectionNames.map(section => (
                <button key={section} onClick={() => setActiveTab(section)} className={`flex items-center p-3 rounded-lg border transition-all ${activeTab === section ? 'border-osmak-green bg-osmak-green/5 ring-1 ring-osmak-green' : 'border-gray-200 bg-white hover:border-osmak-green/50'}`}><div className={`w-8 h-8 rounded-md flex items-center justify-center mr-3 ${activeTab === section ? 'bg-osmak-green text-white' : 'bg-gray-100 text-gray-500'}`}>{getSectionIcon(section)}</div><div className="flex-1 min-w-0 text-left"><div className="text-xs font-bold leading-tight truncate text-black">{section}</div></div></button>
              ))}
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-6 gap-6">{sections[activeTab]?.map(module => (<div key={module.id} className="md:col-span-1 lg:col-span-2"><ModuleCard module={module} progress={currentUserProgress[module.id] || { isUnlocked: true, isCompleted: false, highScore: 0, attempts: [] }} onStart={(id) => { setActiveModuleId(id); setView(AppView.PLAYER); }} /></div>))}</div>
        </main>
      )}

      {view === AppView.PLAYER && activeModule && <Player module={activeModule} onExit={() => { setActiveModuleId(null); setView(AppView.DASHBOARD); }} onComplete={handleModuleCompletion} />}
    </div>
  );
}

export default App;
