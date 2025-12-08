

import React, { useState, useEffect, useMemo } from 'react';
import Header from './components/Header';
import ModuleCard from './components/ModuleCard';
import Player from './components/Player';
import LoginModal from './components/LoginModal';
import AdminDashboard from './components/AdminDashboard';
import { MODULES, PASSING_SCORE } from './constants';
import { Module, UserState, ModuleProgress, AppView, UserRole, UserProfile, RegistrationData } from './types';
import { dataService } from './services/dataService';
import { 
  Trophy, Activity, Star, Users, LayoutDashboard, Eye, Award, X, Download, Loader2,
  ShieldCheck, HeartPulse, FileText, Microscope, Syringe, CheckCircle2
} from 'lucide-react';

// --- SEED DATA for Demo (Initial Fallback if DB is empty, logic can be removed if strictly using DB) ---
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
  
  // State to handle Admin's preview role
  const [adminPreviewRole, setAdminPreviewRole] = useState<string>('All');

  // Certificate Modal State
  const [showCertificate, setShowCertificate] = useState(false);

  // --- User Database State ---
  const [users, setUsers] = useState<UserProfile[]>([]);
  const [isLoadingUsers, setIsLoadingUsers] = useState(true);
  
  // Separate loading state for registration to prevent UI unmounting
  const [isRegistering, setIsRegistering] = useState(false);

  // Load users from Supabase on mount
  useEffect(() => {
    loadUsers();
  }, []);

  const loadUsers = async () => {
    setIsLoadingUsers(true);
    try {
        const fetchedUsers = await dataService.fetchUsers();
        setUsers(fetchedUsers);
    } catch (e) {
        console.error("Failed to load users", e);
    } finally {
        setIsLoadingUsers(false);
    }
  };

  // --- Helper: Get Current User's Progress ---
  // We use the 'users' array as the source of truth, but we keep a reference to 'currentUser'
  // to know WHO is logged in. When updating progress, we update 'users' and then sync 'currentUser'.
  const currentUserProgress = useMemo(() => {
    if (!currentUser) return INITIAL_PROGRESS_TEMPLATE;
    const found = users.find(u => u.hospitalNumber === currentUser.hospitalNumber);
    return found ? found.progress : INITIAL_PROGRESS_TEMPLATE;
  }, [users, currentUser]);

  // --- Filtering Logic based on Roles ---
  const filteredModules = useMemo(() => {
    if (!currentUser) return [];
    
    // Determine the effective role for filtering
    let effectiveRole = currentUser.role;
    
    // If Admin is in preview mode, override the role
    if (currentUser.role === 'QA Admin' && adminPreviewRole !== 'All') {
        effectiveRole = adminPreviewRole as UserRole;
    }

    // QA Admin (All) and Head / Assistant Head see everything
    if (effectiveRole === 'QA Admin' || effectiveRole === 'Head / Assistant Head') {
      return MODULES;
    }

    return MODULES.filter(m => {
      // Data privacy module is for everyone
      if (m.id === 'm_qa_dataprivacy') return true;

      // 1. Doctors, Nurse, Nurse (High-risk Area)
      if (['Doctor', 'Nurse', 'Nurse (High-risk Area)'].includes(effectiveRole as string)) {
        return m.id !== 'm_ps_1';
      }
      
      // 2. Non-Clinical, Others
      if (['Non-clinical', 'Others'].includes(effectiveRole as string)) {
        if (m.id === 'm_qa_1' || m.id === 'm1') return true;
        return false;
      }
      
      // 3. Medical Intern
      if (effectiveRole === 'Medical Intern') {
        if (m.id === 'm_qa_1') return true;
        if (m.section === 'B. Infection Prevention and Control') return true;
        if (m.section === 'D. Quality Management System') return true; // Add QMS
        if (m.section === 'E. Advanced Infection Prevention and Control') return true; // Add Adv IPC
        if (m.id === 'm_ps_2') return true;
        if (m.id === 'm_ps_pedia_fall') return true;
        if (m.id === 'm_ps_adult_fall') return true;
        if (m.id === 'm_ps_error_abbrev') return true;
        if (m.id === 'm_ipc_waste') return true;
        return false;
      }

      // 4. Other Clinical
      if (effectiveRole === 'Other Clinical') {
        // Display all Quality Assurance modules
        if (m.section === 'A. Quality Assurance') return true;
        
        // Display all QMS modules
        if (m.section === 'D. Quality Management System') return true;
        
        // Display hand hygiene (m1), standard and isolation precautions (m2), PPE (m_ipc_ppe), waste management (m_ipc_waste)
        if (['m1', 'm2', 'm_ipc_ppe', 'm_ipc_waste'].includes(m.id)) return true;

        // Display Advanced IPC Modules if specific ones are needed, or all of them. 
        // Assuming Other Clinical might need advanced IPC too:
        if (m.section === 'E. Advanced Infection Prevention and Control') return true;
        
        // Display IPSG (m_ps_2)
        if (m.id === 'm_ps_2') return true;

        // Display Error Prone Abbrev
        if (m.id === 'm_ps_error_abbrev') return true;
        
        return false;
      }

      return false; // Fallback for roles without specific rules
    });
  }, [currentUser, adminPreviewRole]);


  // Group modules by section based on the FILTERED list
  const sections = useMemo(() => {
    const groups: Record<string, Module[]> = {};
    filteredModules.forEach(m => {
      if (!groups[m.section]) {
        groups[m.section] = [];
      }
      groups[m.section].push(m);
    });
    return groups;
  }, [filteredModules]);

  const sectionNames = useMemo(() => Object.keys(sections).sort(), [sections]);

  // Tab State
  const [activeTab, setActiveTab] = useState<string>('');

  // Reset tab when filters change to avoid empty views
  useEffect(() => {
    if (sectionNames.length > 0) {
      if (!activeTab || !sections[activeTab]) {
        setActiveTab(sectionNames[0]);
      }
    } else {
        setActiveTab('');
    }
  }, [sectionNames, sections, activeTab]);

  // Helper for Section Icons
  const getSectionIcon = (sectionName: string) => {
    if (sectionName.includes('Quality Assurance')) return <ShieldCheck size={18} />;
    if (sectionName.includes('Advanced')) return <Microscope size={18} />;
    if (sectionName.includes('Infection Prevention')) return <Syringe size={18} />;
    if (sectionName.includes('Patient Safety')) return <HeartPulse size={18} />;
    if (sectionName.includes('Quality Management')) return <FileText size={18} />;
    return <Activity size={18} />;
  };

  // --- Actions ---

  const handleLogin = (role: UserRole, userProfile: UserProfile) => {
    setCurrentUser(userProfile);
    setIsLoggedIn(true);
    // If Admin, go straight to Admin Dashboard
    if (role === 'QA Admin') {
        setView(AppView.ADMIN_DASHBOARD);
    } else {
        setView(AppView.DASHBOARD);
    }
  };

  const handleRegister = async (data: RegistrationData) => {
    // Use local registering state so we don't trigger the full page loader (which unmounts the modal)
    setIsRegistering(true);
    
    try {
        const newUser = await dataService.registerUser(data);
        
        if (newUser) {
            setUsers(prev => [...prev, newUser]);
            // Auto login if it came from the LoginModal (not admin dashboard)
            if (!isLoggedIn && newUser.role) {
                handleLogin(newUser.role as UserRole, newUser);
            }
        }
    } catch (e) {
        console.error("Registration failed", e);
    } finally {
        setIsRegistering(false);
    }
  };

  const handleUpdateUser = async (hospitalNumber: string, data: RegistrationData) => {
    setIsRegistering(true); // Reuse loading state for updates
    try {
        const updatedUser = await dataService.updateUser(hospitalNumber, data);
        if (updatedUser) {
            // Update local state with the returned user from DB for consistency
            setUsers(prevUsers => prevUsers.map(u => 
                u.hospitalNumber === hospitalNumber ? updatedUser : u
            ));
            // If the currently logged-in user is the one being edited, update their state too
            if (currentUser?.hospitalNumber === hospitalNumber) {
                setCurrentUser(updatedUser);
            }
        }
    } catch (e) {
        console.error("Update failed", e);
    } finally {
        setIsRegistering(false);
    }
  };

  const handleDeleteUser = async (hospitalNumber: string) => {
    const success = await dataService.deleteUser(hospitalNumber);
    if (success) {
      // Optimistic update locally
      setUsers(prevUsers => prevUsers.filter(u => u.hospitalNumber !== hospitalNumber));
    }
    // Error is handled via alerts in dataService, so no need for else block here.
  };

  const handleLogout = () => {
    setIsLoggedIn(false);
    setCurrentUser(null);
    setView(AppView.DASHBOARD);
    setActiveModuleId(null);
    setAdminPreviewRole('All'); // Reset preview
    setShowCertificate(false);
    loadUsers(); // Refresh data on logout to ensure consistency
  };

  const handleStartModule = (moduleId: string) => {
    setActiveModuleId(moduleId);
    setView(AppView.PLAYER);
  };

  const handleExitPlayer = () => {
    setActiveModuleId(null);
    setView(AppView.DASHBOARD);
  };

  const handleModuleCompletion = async (score: number) => {
    if (!activeModuleId || !currentUser) return;

    // Calculate new state logic
    const currentUserData = users.find(u => u.hospitalNumber === currentUser.hospitalNumber);
    if (!currentUserData) return;

    const currentModuleProgress = currentUserData.progress[activeModuleId] || INITIAL_PROGRESS_TEMPLATE[activeModuleId] || { isUnlocked: true, isCompleted: false, highScore: 0 };
    const isPassed = score >= PASSING_SCORE;

    const newModuleProgress: ModuleProgress = {
        ...currentModuleProgress,
        highScore: Math.max(currentModuleProgress.highScore, score),
        isCompleted: currentModuleProgress.isCompleted || isPassed
    };

    // Optimistic Update locally
    setUsers(prevUsers => {
        return prevUsers.map(u => {
            if (u.hospitalNumber === currentUser.hospitalNumber) {
                return {
                    ...u,
                    progress: {
                        ...u.progress,
                        [activeModuleId]: newModuleProgress
                    }
                };
            }
            return u;
        });
    });

    // Update Supabase
    await dataService.updateUserProgress(currentUser.hospitalNumber, activeModuleId, newModuleProgress);

    handleExitPlayer();
  };

  // Calculate stats based on VISIBLE modules for this user role
  const visibleModuleIds = filteredModules.map(m => m.id);
  const completedCount = visibleModuleIds.filter(id => currentUserProgress[id]?.isCompleted).length;
  const totalVisibleModules = visibleModuleIds.length;
  const progressPercent = totalVisibleModules > 0 ? Math.round((completedCount / totalVisibleModules) * 100) : 0;
  const isAllCompleted = totalVisibleModules > 0 && completedCount === totalVisibleModules;

  const activeModule = activeModuleId ? MODULES.find(m => m.id === activeModuleId) : null;

  // Only show full page loader if we are loading initial data
  if (isLoadingUsers && !isLoggedIn && users.length === 0) {
      return (
          <div className="min-h-screen bg-gray-50 flex flex-col items-center justify-center">
              <div className="bg-white p-8 rounded-xl shadow-lg flex flex-col items-center gap-4">
                  <div className="bg-osmak-green p-3 rounded-full text-white">
                      <Loader2 className="animate-spin" size={32} />
                  </div>
                  <h2 className="text-xl font-bold text-gray-800">Connecting to OsMak Server...</h2>
                  <p className="text-gray-500 text-sm">Please wait while we load user data.</p>
              </div>
          </div>
      );
  }

  if (!isLoggedIn) {
    return (
        <LoginModal 
            users={users} 
            onLogin={handleLogin} 
            onRegister={handleRegister}
            isLoading={isRegistering} 
        />
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 flex flex-col">
      <Header 
        userRole={currentUser?.role || undefined}
        onLogout={handleLogout}
        onLogoClick={() => setView(currentUser?.role === 'QA Admin' ? AppView.ADMIN_DASHBOARD : AppView.DASHBOARD)}
      />
      
      {/* QA Admin Toggle Bar */}
      {currentUser?.role === 'QA Admin' && (
          <div className="bg-gray-800 text-white px-6 py-2 flex flex-col md:flex-row gap-4 text-sm justify-between items-center shadow-inner">
              <div className="flex gap-4">
                  <button 
                    onClick={() => setView(AppView.ADMIN_DASHBOARD)}
                    className={`flex items-center gap-2 px-3 py-1 rounded transition-colors ${view === AppView.ADMIN_DASHBOARD ? 'bg-white/20 font-bold' : 'hover:bg-white/10 opacity-70'}`}
                  >
                      <Users size={16} /> Employees
                  </button>
                  <button 
                    onClick={() => setView(AppView.DASHBOARD)}
                    className={`flex items-center gap-2 px-3 py-1 rounded transition-colors ${view === AppView.DASHBOARD ? 'bg-white/20 font-bold' : 'hover:bg-white/10 opacity-70'}`}
                  >
                      <LayoutDashboard size={16} /> Course Preview
                  </button>
              </div>
              
              {/* Preview Role Filter - Only visible in Dashboard/Preview mode */}
              {view === AppView.DASHBOARD && (
                  <div className="flex items-center gap-2 bg-gray-700 p-1 pl-3 rounded border border-gray-600">
                      <span className="text-gray-300 text-xs font-bold uppercase flex items-center gap-1">
                          <Eye size={12} />
                          Preview as:
                      </span>
                      <select 
                          value={adminPreviewRole}
                          onChange={(e) => setAdminPreviewRole(e.target.value)}
                          className="bg-gray-800 text-white border-none rounded px-2 py-1 text-xs focus:ring-1 focus:ring-osmak-green outline-none cursor-pointer"
                      >
                          <option value="All">QA Admin (View All)</option>
                          <option value="Head / Assistant Head">Head / Assistant Head</option>
                          <option value="Doctor">Doctor</option>
                          <option value="Nurse">Nurse</option>
                          <option value="Nurse (High-risk Area)">Nurse (High-risk Area)</option>
                          <option value="Other Clinical">Other Clinical</option>
                          <option value="Medical Intern">Medical Intern</option>
                          <option value="Non-clinical">Non-clinical</option>
                          <option value="Others">Others</option>
                      </select>
                  </div>
              )}
          </div>
      )}

      {view === AppView.ADMIN_DASHBOARD && currentUser?.role === 'QA Admin' && (
        <main className="flex-1 max-w-7xl mx-auto w-full p-6 space-y-8 animate-fadeIn">
            <div className="flex items-center justify-between">
                <h1 className="text-2xl font-bold text-gray-900">Employee Management</h1>
                <div className="bg-white px-4 py-2 rounded-lg shadow-sm border border-gray-200 text-sm">
                    <span className="text-gray-500">Total Registered:</span> <span className="font-bold text-gray-900">{users.length}</span>
                </div>
            </div>
            <AdminDashboard 
                users={users} 
                onRegisterUser={handleRegister} 
                onUpdateUser={handleUpdateUser}
                onDeleteUser={handleDeleteUser}
                isLoading={isRegistering}
            />
        </main>
      )}

      {view === AppView.DASHBOARD && (
        <main className="flex-1 max-w-7xl mx-auto w-full p-6 space-y-6 animate-fadeIn">
            
            {/* Completion Banner for Employees */}
            {isAllCompleted && currentUser?.role !== 'QA Admin' && (
               <div className="bg-gradient-to-r from-yellow-50 to-orange-50 border border-yellow-200 rounded-xl p-6 shadow-sm flex flex-col md:flex-row items-center justify-between gap-6 relative overflow-hidden">
                   <div className="absolute top-0 right-0 p-4 opacity-10">
                       <Award size={120} className="text-yellow-500" />
                   </div>
                   <div className="z-10 flex items-center gap-4">
                       <div className="p-4 bg-yellow-100 text-yellow-600 rounded-full shadow-inner">
                           <Trophy size={32} />
                       </div>
                       <div>
                           <h2 className="text-xl font-bold text-gray-900">Congratulations, {currentUser?.firstName}!</h2>
                           <p className="text-gray-700 mt-1">
                               You have successfully completed all required training modules for the Quality Assurance Division Onboarding.
                           </p>
                       </div>
                   </div>
                   <button 
                       onClick={() => setShowCertificate(true)}
                       className="z-10 bg-gradient-to-r from-yellow-500 to-orange-500 hover:from-yellow-600 hover:to-orange-600 text-white px-6 py-3 rounded-lg shadow-lg font-bold flex items-center gap-2 transform transition-transform hover:scale-105 active:scale-95 whitespace-nowrap"
                   >
                       <Award size={20} />
                       View Certificate
                   </button>
               </div>
            )}

            {/* Welcome / Progress Section */}
            <section className="bg-white rounded-xl p-5 shadow-sm border border-gray-200 flex flex-col md:flex-row items-center justify-between gap-6">
              <div>
                <div className="flex items-center gap-3 mb-1">
                  <h2 className="text-xl font-bold text-gray-900">Welcome, {currentUser?.firstName} {currentUser?.lastName}</h2>
                  <span className="px-2 py-0.5 bg-gray-100 text-gray-600 text-xs rounded-full font-medium border border-gray-200">
                    {currentUser?.role}
                  </span>
                </div>
                <p className="text-sm text-gray-600 max-w-xl leading-relaxed">
                  {currentUser?.role === 'QA Admin' 
                    ? 'Use the preview tools to test role-specific content.'
                    : 'Complete the video modules and score 90%+ on assessments to pass.'
                  }
                </p>
              </div>
              
              {/* Hide progress stats for Admin */}
              {currentUser?.role !== 'QA Admin' && (
                  <div className="flex items-center gap-6 bg-gray-50 px-6 py-3 rounded-lg border border-gray-100 shrink-0">
                     <div className="text-center">
                        <div className="text-xs text-gray-500 font-medium mb-1">Modules</div>
                        <div className="text-lg font-bold text-gray-900 flex items-center gap-1.5 justify-center">
                          <Activity className="text-osmak-green" size={16} />
                          {completedCount}/{totalVisibleModules}
                        </div>
                     </div>
                     <div className="w-px h-8 bg-gray-200"></div>
                     <div className="text-center">
                        <div className="text-xs text-gray-500 font-medium mb-1">Total Progress</div>
                        <div className="text-lg font-bold text-gray-900 flex items-center gap-1.5 justify-center">
                           <Trophy className={progressPercent === 100 ? "text-yellow-500" : "text-gray-300"} size={16} />
                           {progressPercent}%
                        </div>
                     </div>
                  </div>
              )}
            </section>

            {/* Compact Section Selector */}
            <div className="mb-4">
              <div className="flex items-center justify-between mb-3">
                 <h3 className="text-xs font-bold text-gray-500 uppercase tracking-wider">Course Sections</h3>
                 <span className="text-[10px] bg-gray-100 px-2 py-0.5 rounded-full text-gray-500 font-medium">{sectionNames.length} Sections Available</span>
              </div>
              
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-5 gap-3">
                {sectionNames.length > 0 ? sectionNames.map(sectionName => {
                  const isActive = activeTab === sectionName;
                  const modulesInSection = sections[sectionName] || [];
                  const isSectionComplete = modulesInSection.length > 0 && modulesInSection.every(m => currentUserProgress[m.id]?.isCompleted);
                  
                  // Parse Section Name "A. Title"
                  const parts = sectionName.split('. ');
                  const letter = parts.length > 1 ? parts[0] : ''; 
                  const title = parts.length > 1 ? parts.slice(1).join('. ') : sectionName;

                  return (
                    <button
                      key={sectionName}
                      onClick={() => setActiveTab(sectionName)}
                      className={`
                        flex items-center text-left p-3 rounded-lg border transition-all duration-200 h-full group
                        ${isActive 
                          ? 'border-osmak-green bg-osmak-green/5 ring-1 ring-osmak-green shadow-sm' 
                          : 'border-gray-200 bg-white hover:border-osmak-green/50 hover:shadow-sm'}
                      `}
                    >
                        <div className={`
                          w-8 h-8 rounded-md flex items-center justify-center shrink-0 transition-colors mr-3
                          ${isActive ? 'bg-osmak-green text-white shadow-sm' : 'bg-gray-100 text-gray-500 group-hover:bg-osmak-green/10 group-hover:text-osmak-green'}
                        `}>
                           {getSectionIcon(sectionName)}
                        </div>

                        <div className="flex-1 min-w-0">
                           {letter && (
                               <div className={`text-[10px] font-bold uppercase tracking-wider leading-none mb-0.5 ${isActive ? 'text-osmak-green' : 'text-gray-400'}`}>
                                  Section {letter}
                               </div>
                           )}
                           <div className={`text-xs font-bold leading-tight truncate ${isActive ? 'text-gray-900' : 'text-gray-700'}`}>
                              {title}
                           </div>
                        </div>

                        {isSectionComplete ? (
                           <div className="ml-2 bg-yellow-100 text-yellow-600 p-1 rounded-full shrink-0">
                              <Star size={12} fill="currentColor" />
                           </div>
                        ) : (
                           <div className={`ml-2 text-[10px] font-medium px-1.5 py-0.5 rounded-full shrink-0 ${isActive ? 'bg-white text-osmak-green border border-osmak-green/20' : 'bg-gray-100 text-gray-500'}`}>
                              {modulesInSection.length}
                           </div>
                        )}
                    </button>
                  );
                }) : (
                   <div className="col-span-full py-4 text-center text-sm text-gray-500 border border-dashed border-gray-200 rounded-lg bg-gray-50">
                      No training sections available for your role.
                   </div>
                )}
              </div>
            </div>

            {/* Modules Grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-6 gap-6 animate-fadeIn">
               {sections[activeTab]?.map(module => (
                 <div key={module.id} className="md:col-span-1 lg:col-span-2">
                    <ModuleCard 
                      module={module} 
                      progress={currentUserProgress[module.id] || { isUnlocked: true, isCompleted: false, highScore: 0 }} 
                      onStart={handleStartModule}
                    />
                 </div>
               ))}
               
               {(!sections[activeTab] || sections[activeTab].length === 0) && sectionNames.length > 0 && (
                  <div className="col-span-full py-12 text-center text-gray-500 border-2 border-dashed border-gray-200 rounded-xl">
                    No modules found in this section.
                  </div>
               )}
            </div>
        </main>
      )}

      {view === AppView.PLAYER && activeModule && currentUser && (
        <Player 
          module={activeModule} 
          onExit={handleExitPlayer}
          onComplete={handleModuleCompletion}
        />
      )}

      {/* Certificate Modal */}
      {showCertificate && currentUser && (
        <div className="fixed inset-0 z-[300] bg-black/80 flex items-center justify-center p-4 backdrop-blur-sm animate-fadeIn">
           <div className="bg-white rounded-lg shadow-2xl max-w-4xl w-full flex flex-col relative overflow-hidden">
              {/* Controls */}
              <div className="bg-gray-800 text-white p-4 flex justify-between items-center no-print">
                 <h3 className="font-bold flex items-center gap-2"><Award size={20}/> Certificate of Completion</h3>
                 <div className="flex gap-2">
                     <button 
                        onClick={() => window.print()}
                        className="px-4 py-2 bg-blue-600 hover:bg-blue-700 rounded text-sm font-bold flex items-center gap-2 transition-colors"
                     >
                        <Download size={16} /> Print / Save PDF
                     </button>
                     <button onClick={() => setShowCertificate(false)} className="hover:text-red-400 transition-colors p-1">
                        <X size={24} />
                     </button>
                 </div>
              </div>

              {/* Certificate Content - Printable Area */}
              <div className="p-10 md:p-16 text-center border-[20px] border-double border-gray-100 m-2 flex flex-col items-center justify-center min-h-[600px] relative bg-white certificate-container">
                  {/* Decorative corner borders could act as CSS enhancements */}
                  <div className="absolute top-4 left-4 w-16 h-16 border-t-4 border-l-4 border-osmak-green"></div>
                  <div className="absolute top-4 right-4 w-16 h-16 border-t-4 border-r-4 border-osmak-green"></div>
                  <div className="absolute bottom-4 left-4 w-16 h-16 border-b-4 border-l-4 border-osmak-green"></div>
                  <div className="absolute bottom-4 right-4 w-16 h-16 border-b-4 border-r-4 border-osmak-green"></div>

                  <img 
                      src="https://maxterrenal-hash.github.io/justculture/osmak-logo.png" 
                      alt="OsMak Logo" 
                      className="h-24 w-auto mb-6"
                  />
                  
                  <h1 className="text-4xl md:text-5xl font-serif font-bold text-gray-900 mb-2 uppercase tracking-wide">Certificate of Completion</h1>
                  <p className="text-gray-500 italic mb-12">is hereby presented to</p>

                  <h2 className="text-3xl md:text-5xl font-bold text-osmak-green border-b-2 border-gray-300 pb-4 px-12 mb-8 font-serif">
                      {currentUser.firstName} {currentUser.middleInitial ? `${currentUser.middleInitial}.` : ''} {currentUser.lastName}
                  </h2>

                  <p className="text-xl text-gray-700 max-w-2xl mx-auto leading-relaxed mb-12">
                      For successfully completing the required training modules for the
                      <br/>
                      <span className="font-bold">Quality Assurance Division Onboarding Course</span>
                  </p>

                  <div className="flex justify-around w-full max-w-3xl mt-auto pt-12">
                      <div className="text-center">
                          <div className="w-48 border-t border-gray-400 mx-auto mb-2"></div>
                          <p className="font-bold text-gray-900">Dr. Quality Assurance</p>
                          <p className="text-sm text-gray-500">Head, Quality Assurance Division</p>
                      </div>
                      <div className="text-center">
                          <div className="w-48 border-t border-gray-400 mx-auto mb-2 pt-2 text-lg font-serif">
                             {new Date().toLocaleDateString('en-US', { year: 'numeric', month: 'long', day: 'numeric' })}
                          </div>
                          <p className="text-sm text-gray-500">Date Completed</p>
                      </div>
                  </div>
              </div>
           </div>
        </div>
      )}
      
      {/* Print Styles */}
      <style>{`
        @media print {
          body * {
            visibility: hidden;
          }
          .certificate-container, .certificate-container * {
            visibility: visible;
          }
          .certificate-container {
            position: absolute;
            left: 0;
            top: 0;
            width: 100%;
            height: 100%;
            margin: 0;
            padding: 0;
            border: 10px double #ccc;
          }
          .no-print {
            display: none !important;
          }
        }
      `}</style>
    </div>
  );
}

export default App;
