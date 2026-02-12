
import React, { useState, useMemo } from 'react';
import { TrainingSession, Module, UserProfile } from '../types';
import { LayoutDashboard, Calendar, ChevronRight, Clock, Video, Lock, ArrowRight, ArrowLeft, UserPlus, CheckCircle } from 'lucide-react';

interface SessionChoiceViewProps {
  allSessions: TrainingSession[];
  currentUser: UserProfile | null;
  onSelectSession: (session: TrainingSession | null) => void;
  onJoinSession: (session: TrainingSession) => void;
  modules: Module[];
  userProgress: Record<string, any>;
}

const SessionChoiceView: React.FC<SessionChoiceViewProps> = ({ 
  allSessions = [], 
  currentUser, 
  onSelectSession, 
  onJoinSession,
  modules, 
  userProgress 
}) => {
  const [step, setStep] = useState<'INITIAL' | 'SESSION_LIST'>('INITIAL');

  // Categorize sessions
  const categorizedSessions = useMemo(() => {
    if (!currentUser) return { assigned: [], joinable: [] };
    const now = new Date();
    
    // Sessions currently open and within time bounds
    const openSessions = allSessions.filter(s => 
      s.status === 'open' && 
      now >= new Date(s.startDateTime) && 
      now <= new Date(s.endDateTime)
    );

    const assigned = openSessions.filter(s => s.employeeHospitalNumbers.includes(currentUser.hospitalNumber));
    const joinable = openSessions.filter(s => !s.employeeHospitalNumbers.includes(currentUser.hospitalNumber));

    return { assigned, joinable };
  }, [allSessions, currentUser]);

  const totalSessionsCount = categorizedSessions.assigned.length + categorizedSessions.joinable.length;

  const formatSessionDateTime = (iso: string) => {
    return new Date(iso).toLocaleString('en-US', {
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  if (step === 'INITIAL') {
    return (
      <div className="flex-1 flex flex-col items-center justify-center p-6 bg-gray-50/50 animate-fadeIn">
        <div className="max-w-4xl w-full space-y-12">
          <div className="text-center space-y-4">
            <h1 className="text-4xl font-black text-gray-900 uppercase tracking-tight">Portal Entry</h1>
            <p className="text-gray-500 font-medium text-lg max-w-xl mx-auto">
              Please choose how you would like to proceed with your training today.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            {/* Session Path */}
            <button
              onClick={() => setStep('SESSION_LIST')}
              className="group relative bg-white border-2 border-osmak-green/10 hover:border-osmak-green p-10 rounded-[2rem] shadow-sm hover:shadow-2xl transition-all text-left flex flex-col gap-6"
            >
              <div className="w-16 h-16 bg-green-50 text-osmak-green rounded-2xl flex items-center justify-center group-hover:scale-110 transition-transform">
                <Calendar size={32} />
              </div>
              <div className="space-y-2">
                <h3 className="text-2xl font-black text-gray-900">Training Session</h3>
                <p className="text-gray-500 text-sm font-medium leading-relaxed">
                  Join a specific scheduled training session or view sessions assigned to you by the QA Division.
                </p>
              </div>
              <div className="mt-4 flex items-center justify-between">
                <span className="text-xs font-black uppercase text-osmak-green bg-green-50 px-3 py-1 rounded-full">
                  {totalSessionsCount} Active {totalSessionsCount === 1 ? 'Session' : 'Sessions'}
                </span>
                <ChevronRight className="text-osmak-green group-hover:translate-x-2 transition-transform" />
              </div>
            </button>

            {/* General Library Path */}
            <button
              onClick={() => onSelectSession(null)}
              className="group relative bg-gray-900 text-white p-10 rounded-[2rem] shadow-sm hover:shadow-2xl transition-all text-left flex flex-col gap-6"
            >
              <div className="w-16 h-16 bg-white/10 text-white rounded-2xl flex items-center justify-center group-hover:scale-110 transition-transform">
                <LayoutDashboard size={32} />
              </div>
              <div className="space-y-2">
                <h3 className="text-2xl font-black">All Training Videos</h3>
                <p className="text-gray-400 text-sm font-medium leading-relaxed">
                  Browse the complete library of all Quality Assurance modules available for your role.
                </p>
              </div>
              <div className="mt-4 flex items-center justify-between">
                <span className="text-xs font-black uppercase text-white/40">Open Access</span>
                <ChevronRight className="text-white group-hover:translate-x-2 transition-transform" />
              </div>
            </button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="flex-1 max-w-5xl mx-auto w-full p-6 py-12 space-y-10 animate-fadeIn overflow-y-auto">
      <div className="flex items-center gap-4 mb-4">
        <button
          onClick={() => setStep('INITIAL')}
          className="p-2 hover:bg-gray-100 rounded-full transition-colors text-gray-500"
        >
          <ArrowLeft size={24} />
        </button>
        <div>
          <h2 className="text-2xl font-black text-gray-900 uppercase">Training Sessions</h2>
          <p className="text-gray-500 font-medium">Select an assigned session or join an active one.</p>
        </div>
      </div>

      <div className="space-y-12">
        {categorizedSessions.assigned.length > 0 && (
          <section className="space-y-6">
            <h3 className="text-xs font-black text-gray-400 uppercase tracking-widest flex items-center gap-2">
                <CheckCircle size={16} className="text-osmak-green" /> 
                Your Assigned Sessions
            </h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {categorizedSessions.assigned.map(session => {
                const sessionModules = modules.filter(m => session.moduleIds.includes(m.id));
                const completed = sessionModules.filter(m => userProgress[m.id]?.isCompleted).length;
                const percent = sessionModules.length > 0 ? Math.round((completed / sessionModules.length) * 100) : 0;

                return (
                  <button
                    key={session.id}
                    onClick={() => onSelectSession(session)}
                    className="bg-white border-2 border-osmak-green/20 hover:border-osmak-green p-6 rounded-2xl shadow-sm hover:shadow-xl transition-all text-left group relative overflow-hidden"
                  >
                    <div className="relative z-10 space-y-4">
                      <div className="flex justify-between items-start">
                        <h3 className="text-xl font-black text-gray-900 leading-tight">{session.name}</h3>
                        <span className="bg-osmak-green text-white text-[10px] font-black px-2.5 py-1 rounded-full uppercase shrink-0 tracking-widest">Assigned</span>
                      </div>
                      <div className="space-y-1 text-xs text-gray-500 font-bold">
                        <div className="flex items-center gap-2"><Clock size={12} className="text-blue-500" /> Ends {formatSessionDateTime(session.endDateTime)}</div>
                        <div className="flex items-center gap-2 mt-2"><Video size={12} className="text-osmak-green" /> {session.moduleIds.length} Required Modules</div>
                      </div>
                      <div className="pt-4 border-t border-gray-100 flex items-center justify-between">
                        <div className="flex-1 mr-4">
                          <div className="flex justify-between text-[10px] font-black mb-1">
                            <span className="text-gray-400 uppercase">My Progress</span>
                            <span className="text-osmak-green">{percent}%</span>
                          </div>
                          <div className="h-1.5 w-full bg-gray-100 rounded-full overflow-hidden">
                            <div className="h-full bg-osmak-green transition-all duration-700" style={{ width: `${percent}%` }} />
                          </div>
                        </div>
                        <ChevronRight className="text-osmak-green group-hover:translate-x-1 transition-transform" />
                      </div>
                    </div>
                  </button>
                );
              })}
            </div>
          </section>
        )}

        {categorizedSessions.joinable.length > 0 && (
          <section className="space-y-6">
            <h3 className="text-xs font-black text-gray-400 uppercase tracking-widest flex items-center gap-2">
                <UserPlus size={16} className="text-blue-500" /> 
                Open Active Sessions
            </h3>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {categorizedSessions.joinable.map(session => (
                <div
                  key={session.id}
                  className="bg-white border border-gray-200 p-6 rounded-2xl shadow-sm hover:shadow-lg transition-all text-left flex flex-col justify-between"
                >
                  <div className="space-y-4">
                    <div className="flex justify-between items-start">
                      <h3 className="text-lg font-bold text-gray-800 leading-tight">{session.name}</h3>
                    </div>
                    <div className="space-y-1 text-[11px] text-gray-500 font-medium">
                      <div className="flex items-center gap-2"><Clock size={12} className="text-gray-400" /> Ends {formatSessionDateTime(session.endDateTime)}</div>
                      <div className="flex items-center gap-2"><Video size={12} className="text-gray-400" /> {session.moduleIds.length} Modules included</div>
                    </div>
                  </div>
                  <button 
                    onClick={() => onJoinSession(session)}
                    className="mt-6 w-full py-2.5 bg-blue-600 hover:bg-blue-700 text-white rounded-xl font-black text-xs uppercase tracking-widest flex items-center justify-center gap-2 transition-all active:scale-95 shadow-lg shadow-blue-200"
                  >
                    <UserPlus size={14} />
                    Join Session
                  </button>
                </div>
              ))}
            </div>
          </section>
        )}

        {totalSessionsCount === 0 && (
           <div className="py-20 text-center space-y-4 bg-white rounded-3xl border-2 border-dashed border-gray-100">
              <Calendar size={64} className="mx-auto text-gray-200" />
              <div className="space-y-1">
                  <h3 className="text-xl font-bold text-gray-400">No Active Sessions</h3>
                  <p className="text-gray-400 text-sm font-medium">There are currently no scheduled training sessions running.</p>
              </div>
              <button 
                onClick={() => onSelectSession(null)}
                className="inline-flex items-center gap-2 px-6 py-2.5 bg-gray-900 text-white rounded-xl font-bold text-sm hover:bg-black transition-all"
              >
                  Go to Course Library
                  <ArrowRight size={18} />
              </button>
           </div>
        )}
      </div>
    </div>
  );
};

export default SessionChoiceView;
