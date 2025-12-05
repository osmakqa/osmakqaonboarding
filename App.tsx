import React, { useState, useEffect, useMemo } from 'react';
import Header from './components/Header';
import ModuleCard from './components/ModuleCard';
import Player from './components/Player';
import LoginModal from './components/LoginModal';
import { Module, UserState, ModuleProgress, AppView, UserRole } from './types';
import { MODULES, PASSING_SCORE } from './constants';
import { Trophy, Activity, Star } from 'lucide-react';

const INITIAL_PROGRESS: Record<string, ModuleProgress> = {};
MODULES.forEach((m) => {
  INITIAL_PROGRESS[m.id] = {
    isUnlocked: true, // All modules start unlocked now
    isCompleted: false,
    highScore: 0
  };
});

function App() {
  const [view, setView] = useState<AppView>(AppView.DASHBOARD);
  const [activeModuleId, setActiveModuleId] = useState<string | null>(null);
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [currentUserRole, setCurrentUserRole] = useState<UserRole | null>(null);

  const [userState, setUserState] = useState<UserState>(() => {
    // Load from local storage if available
    const saved = localStorage.getItem('osmak_qa_progress');
    return saved ? JSON.parse(saved) : { progress: INITIAL_PROGRESS, activeModuleId: null };
  });

  // --- Filtering Logic based on Roles ---
  const filteredModules = useMemo(() => {
    if (!currentUserRole) return [];

    if (currentUserRole === 'QA Admin') {
      return MODULES;
    }

    return MODULES.filter(m => {
      // 1. Doctors, Nurse, Specialized Nurse
      if (['Doctor', 'Nurse', 'Specialized Nurse'].includes(currentUserRole)) {
        // Show all EXCEPT "Risk and Opportunities Management" (ID: m_ps_1)
        return m.id !== 'm_ps_1';
      }

      // 2. Non-Clinical, Others
      if (['Non-clinical', 'Others'].includes(currentUserRole)) {
        // QA -> Patients rights (m_qa_1)
        // IPC -> Hand Hygiene (m1)
        if (m.id === 'm_qa_1' || m.id === 'm1') {
          return true;
        }
        return false;
      }

      // 3. Medical Intern
      if (currentUserRole === 'Medical Intern') {
        // QA -> Patients rights (m_qa_1)
        if (m.id === 'm_qa_1') return true;
        
        // IPC -> All modules in Section B
        if (m.section === 'B. Infection Prevention and Control') return true;

        // PS -> Only IPSG (m_ps_2)
        if (m.id === 'm_ps_2') return true;

        return false;
      }

      return false;
    });
  }, [currentUserRole]);

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

  // Update active tab when sections change (e.g. after login)
  useEffect(() => {
    if (sectionNames.length > 0) {
      // If current tab is invalid for this user, switch to first available
      if (!activeTab || !sections[activeTab]) {
        setActiveTab(sectionNames[0]);
      }
    }
  }, [sectionNames, sections, activeTab]);

  // Ensure new modules are in state even if loading old localStorage data
  useEffect(() => {
    setUserState(prev => {
      const newProgress = { ...prev.progress };
      let changed = false;
      MODULES.forEach(m => {
        if (!newProgress[m.id]) {
          newProgress[m.id] = {
            isUnlocked: true,
            isCompleted: false,
            highScore: 0
          };
          changed = true;
        }
      });
      return changed ? { ...prev, progress: newProgress } : prev;
    });
  }, []);

  // Persist progress
  useEffect(() => {
    localStorage.setItem('osmak_qa_progress', JSON.stringify(userState));
  }, [userState]);

  const handleLogin = (role: UserRole) => {
    setCurrentUserRole(role);
    setIsLoggedIn(true);
  };

  const handleLogout = () => {
    setIsLoggedIn(false);
    setCurrentUserRole(null);
    setView(AppView.DASHBOARD);
    setActiveModuleId(null);
  };

  const handleStartModule = (moduleId: string) => {
    setActiveModuleId(moduleId);
    setView(AppView.PLAYER);
  };

  const handleExitPlayer = () => {
    setActiveModuleId(null);
    setView(AppView.DASHBOARD);
  };

  const handleModuleCompletion = (score: number) => {
    if (!activeModuleId) return;

    setUserState(prev => {
      const currentModuleProgress = prev.progress[activeModuleId];
      // Type safety check
      if (!currentModuleProgress) return prev;

      const isPassed = score >= PASSING_SCORE;
      
      const newProgress = { ...prev.progress };
      
      // Update current module
      newProgress[activeModuleId] = {
        ...currentModuleProgress,
        highScore: Math.max(currentModuleProgress.highScore, score),
        isCompleted: currentModuleProgress.isCompleted || isPassed
      };

      return { ...prev, progress: newProgress };
    });

    handleExitPlayer();
  };

  // Calculate stats based on VISIBLE modules for this user role
  const visibleModuleIds = filteredModules.map(m => m.id);
  const completedCount = visibleModuleIds.filter(id => userState.progress[id]?.isCompleted).length;
  const totalVisibleModules = visibleModuleIds.length;
  const progressPercent = totalVisibleModules > 0 ? Math.round((completedCount / totalVisibleModules) * 100) : 0;

  const activeModule = activeModuleId ? MODULES.find(m => m.id === activeModuleId) : null;

  if (!isLoggedIn) {
    return <LoginModal onLogin={handleLogin} />;
  }

  return (
    <div className="min-h-screen bg-gray-50 flex flex-col">
      {view === AppView.DASHBOARD && (
        <>
          <Header 
            userRole={currentUserRole}
            onLogout={handleLogout}
            onLogoClick={() => setView(AppView.DASHBOARD)}
          />
          
          <main className="flex-1 max-w-7xl mx-auto w-full p-6 space-y-8">
            {/* Welcome / Progress Section */}
            <section className="bg-white rounded-xl p-6 shadow-sm border border-gray-200 flex flex-col md:flex-row items-center justify-between gap-6">
              <div>
                <div className="flex items-center gap-3 mb-2">
                  <h2 className="text-2xl font-bold text-gray-900">Welcome, {currentUserRole}</h2>
                  <span className="px-3 py-1 bg-gray-100 text-gray-600 text-xs rounded-full font-medium border border-gray-200">
                    {currentUserRole === 'QA Admin' ? 'Administrator' : 'Learner'}
                  </span>
                </div>
                <p className="text-gray-600 max-w-xl">
                  Complete the following video modules and assessments to finish your Quality Assurance onboarding. 
                  You must score at least <strong className="text-osmak-green">90%</strong> on each assessment to pass.
                </p>
              </div>
              
              <div className="flex items-center gap-8 bg-gray-50 px-8 py-4 rounded-lg border border-gray-100">
                 <div className="text-center">
                    <div className="text-sm text-gray-500 font-medium mb-1">Modules</div>
                    <div className="text-2xl font-bold text-gray-900 flex items-center gap-2 justify-center">
                      <Activity className="text-osmak-green" size={20} />
                      {completedCount}/{totalVisibleModules}
                    </div>
                 </div>
                 <div className="w-px h-12 bg-gray-200"></div>
                 <div className="text-center">
                    <div className="text-sm text-gray-500 font-medium mb-1">Total Progress</div>
                    <div className="text-2xl font-bold text-gray-900 flex items-center gap-2 justify-center">
                       <Trophy className={progressPercent === 100 ? "text-yellow-500" : "text-gray-300"} size={20} />
                       {progressPercent}%
                    </div>
                 </div>
              </div>
            </section>

            {/* Tabbed Navigation */}
            <div>
              <div className="flex overflow-x-auto gap-2 pb-2 scrollbar-hide mb-4">
                {sectionNames.length > 0 ? sectionNames.map(sectionName => {
                  const isActive = activeTab === sectionName;
                  const modulesInSection = sections[sectionName] || [];
                  const isSectionComplete = modulesInSection.length > 0 && modulesInSection.every(m => userState.progress[m.id]?.isCompleted);

                  return (
                    <button
                      key={sectionName}
                      onClick={() => setActiveTab(sectionName)}
                      className={`
                        flex items-center gap-2 px-5 py-3 text-sm font-semibold transition-all whitespace-nowrap rounded-full border
                        ${isActive 
                          ? 'border-osmak-green bg-osmak-green text-white shadow-md' 
                          : 'border-gray-200 bg-white text-gray-600 hover:bg-gray-100'}
                      `}
                    >
                      {sectionName}
                      {isSectionComplete && <Star size={16} className="fill-yellow-400 text-yellow-400 ml-1" />}
                    </button>
                  );
                }) : (
                   <div className="text-gray-500 text-sm italic py-2">No modules available for your role.</div>
                )}
              </div>
            </div>

            {/* Modules Grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 animate-fadeIn">
               {sections[activeTab]?.map(module => (
                 <ModuleCard 
                   key={module.id} 
                   module={module} 
                   progress={userState.progress[module.id]} 
                   onStart={handleStartModule}
                 />
               ))}
               
               {(!sections[activeTab] || sections[activeTab].length === 0) && sectionNames.length > 0 && (
                  <div className="col-span-full py-12 text-center text-gray-500 border-2 border-dashed border-gray-200 rounded-xl">
                    No modules found in this section.
                  </div>
               )}
            </div>

          </main>
        </>
      )}

      {view === AppView.PLAYER && activeModule && (
        <Player 
          module={activeModule} 
          onExit={handleExitPlayer}
          onComplete={handleModuleCompletion}
        />
      )}
    </div>
  );
}

export default App;