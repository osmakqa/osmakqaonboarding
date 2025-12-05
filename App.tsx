
import React, { useState, useEffect, useMemo } from 'react';
import Header from './components/Header';
import ModuleCard from './components/ModuleCard';
import Player from './components/Player';
import { Module, UserState, ModuleProgress, AppView } from './types';
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
  
  // Group modules by section
  const sections = useMemo(() => {
    const groups: Record<string, Module[]> = {};
    MODULES.forEach(m => {
      if (!groups[m.section]) {
        groups[m.section] = [];
      }
      groups[m.section].push(m);
    });
    return groups;
  }, []);

  const sectionNames = useMemo(() => Object.keys(sections).sort(), [sections]);

  // Tab State
  const [activeTab, setActiveTab] = useState<string>(() => sectionNames[0] || '');

  const [userState, setUserState] = useState<UserState>(() => {
    // Load from local storage if available
    const saved = localStorage.getItem('osmak_qa_progress');
    return saved ? JSON.parse(saved) : { progress: INITIAL_PROGRESS, activeModuleId: null };
  });

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

  // Ensure activeTab is valid
  useEffect(() => {
    if (sectionNames.length > 0 && !sections[activeTab]) {
      setActiveTab(sectionNames[0]);
    }
  }, [sections, sectionNames, activeTab]);

  // Persist progress
  useEffect(() => {
    localStorage.setItem('osmak_qa_progress', JSON.stringify(userState));
  }, [userState]);

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

  // Calculate stats
  const completedCount = Object.values(userState.progress).filter((p: any) => p.isCompleted).length;
  const progressPercent = Math.round((completedCount / MODULES.length) * 100);

  const activeModule = activeModuleId ? MODULES.find(m => m.id === activeModuleId) : null;

  return (
    <div className="min-h-screen bg-gray-50 flex flex-col">
      {view === AppView.DASHBOARD && (
        <>
          <Header />
          
          <main className="flex-1 max-w-7xl mx-auto w-full p-6 space-y-8">
            {/* Welcome / Progress Section */}
            <section className="bg-white rounded-xl p-6 shadow-sm border border-gray-200 flex flex-col md:flex-row items-center justify-between gap-6">
              <div>
                <h2 className="text-2xl font-bold text-gray-900 mb-2">Welcome, Healthcare Professional</h2>
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
                      {completedCount}/{MODULES.length}
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
              <div className="flex overflow-x-auto border-b border-gray-200 scrollbar-hide">
                {sectionNames.map(sectionName => {
                  const isActive = activeTab === sectionName;
                  const modulesInSection = sections[sectionName] || [];
                  const isSectionComplete = modulesInSection.every(m => userState.progress[m.id]?.isCompleted);

                  return (
                    <button
                      key={sectionName}
                      onClick={() => setActiveTab(sectionName)}
                      className={`
                        flex items-center gap-2 px-6 py-4 text-sm font-semibold transition-all whitespace-nowrap border-b-2
                        ${isActive 
                          ? 'border-osmak-green text-osmak-green bg-green-50/50' 
                          : 'border-transparent text-gray-500 hover:text-gray-800 hover:bg-gray-50'}
                      `}
                    >
                      {sectionName}
                      {isSectionComplete && (
                        <Star className="text-yellow-500 fill-yellow-500 animate-pulse" size={16} />
                      )}
                    </button>
                  );
                })}
              </div>

              {/* Modules Grid */}
              <div className="mt-6 animate-fadeIn">
                {sections[activeTab] ? (
                  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                    {sections[activeTab].map(module => {
                      const modProgress = userState.progress[module.id];
                      // Guard against missing progress if local storage is old
                      if (!modProgress) return null;
                      
                      return (
                        <ModuleCard 
                          key={module.id} 
                          module={module}
                          progress={modProgress}
                          onStart={handleStartModule}
                        />
                      );
                    })}
                  </div>
                ) : (
                  <div className="text-center py-12 text-gray-500">
                    Select a topic to view modules
                  </div>
                )}
              </div>
            </div>

            {/* Helper Hint */}
            <div className="text-center text-xs text-gray-400 mt-12 pb-8">
              Note: Video content will be streamed from the Hospital Intranet securely. <br/>
              Quizzes are generated dynamically to ensure comprehension.
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
