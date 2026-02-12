
import React, { useState, useMemo } from 'react';
import { TrainingSession, Module, UserProfile, UserRole } from '../types';
// Added ClipboardCheck to the imports from lucide-react
import { Calendar, Plus, Search, Edit2, Trash2, X, Check, Users, BookOpen, BarChart3, ChevronRight, CheckCircle, Info, Loader2, Save, Clock, Lock, Unlock, ArrowRight, XCircle, Star, MessageSquare, ClipboardCheck } from 'lucide-react';

interface SessionManagerProps {
  sessions: TrainingSession[];
  modules: Module[];
  users: UserProfile[];
  onAddSession: (session: TrainingSession) => Promise<void>;
  onUpdateSession: (session: TrainingSession) => Promise<void>;
  onDeleteSession: (sessionId: string) => Promise<void>;
}

// Helper to format ISO to datetime-local input string (YYYY-MM-DDTHH:mm)
const toDatetimeLocal = (iso: string) => {
    if (!iso) return '';
    const d = new Date(iso);
    const year = d.getFullYear();
    const month = String(d.getMonth() + 1).padStart(2, '0');
    const day = String(d.getDate()).padStart(2, '0');
    const hours = String(d.getHours()).padStart(2, '0');
    const minutes = String(d.getMinutes()).padStart(2, '0');
    return `${year}-${month}-${day}T${hours}:${minutes}`;
};

const SessionManager: React.FC<SessionManagerProps> = ({ sessions, modules, users, onAddSession, onUpdateSession, onDeleteSession }) => {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingSession, setEditingSession] = useState<TrainingSession | null>(null);
  const [selectedSession, setSelectedSession] = useState<TrainingSession | null>(null);
  const [activeDetailTab, setActiveDetailTab] = useState<'PROGRESS' | 'EVALUATIONS'>('PROGRESS');
  const [isProcessing, setIsProcessing] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');

  // Form State
  const [formData, setFormData] = useState<Partial<TrainingSession>>({
    name: '',
    startDateTime: new Date().toISOString(),
    endDateTime: new Date(Date.now() + 8 * 60 * 60 * 1000).toISOString(),
    moduleIds: [],
    employeeHospitalNumbers: [],
    status: 'open'
  });

  const [moduleSearch, setModuleSearch] = useState('');
  const [userSearch, setUserSearch] = useState('');

  const filteredSessions = sessions.filter(s => 
    s.name.toLowerCase().includes(searchTerm.toLowerCase())
  ).sort((a, b) => new Date(b.startDateTime).getTime() - new Date(a.startDateTime).getTime());

  const handleOpenAdd = () => {
    setEditingSession(null);
    setFormData({
      name: '',
      startDateTime: new Date().toISOString(),
      endDateTime: new Date(Date.now() + 8 * 60 * 60 * 1000).toISOString(),
      moduleIds: [],
      employeeHospitalNumbers: [],
      status: 'open'
    });
    setIsModalOpen(true);
  };

  const handleOpenEdit = (session: TrainingSession) => {
    setEditingSession(session);
    setFormData({ ...session });
    setIsModalOpen(true);
  };

  const handleSave = async () => {
    if (!formData.name || !formData.startDateTime || !formData.endDateTime || (formData.moduleIds || []).length === 0 || (formData.employeeHospitalNumbers || []).length === 0) {
      alert("Please fill in all fields and select at least one module and one employee.");
      return;
    }

    if (new Date(formData.startDateTime) >= new Date(formData.endDateTime)) {
        alert("End date and time must be after the start date and time.");
        return;
    }

    setIsProcessing(true);
    const sessionData: TrainingSession = {
      ...formData,
      id: editingSession ? editingSession.id : `sess_${Date.now()}`,
      name: formData.name!,
      startDateTime: formData.startDateTime!,
      endDateTime: formData.endDateTime!,
      moduleIds: formData.moduleIds || [],
      employeeHospitalNumbers: formData.employeeHospitalNumbers || [],
      status: formData.status || 'open',
      evaluations: editingSession?.evaluations || {}
    } as TrainingSession;

    try {
      if (editingSession) {
        await onUpdateSession(sessionData);
      } else {
        await onAddSession(sessionData);
      }
      setIsModalOpen(false);
    } catch (e) {
      console.error(e);
    } finally {
      setIsProcessing(false);
    }
  };

  const toggleModule = (id: string) => {
    setFormData(prev => {
      const current = prev.moduleIds || [];
      const updated = current.includes(id) ? current.filter(mId => mId !== id) : [...current, id];
      return { ...prev, moduleIds: updated };
    });
  };

  const toggleUser = (hospitalNumber: string) => {
    setFormData(prev => {
      const current = prev.employeeHospitalNumbers || [];
      const updated = current.includes(hospitalNumber) ? current.filter(hId => hId !== hospitalNumber) : [...current, hospitalNumber];
      return { ...prev, employeeHospitalNumbers: updated };
    });
  };

  const getSessionStats = (session: TrainingSession) => {
    const sessionUsers = users.filter(u => session.employeeHospitalNumbers.includes(u.hospitalNumber));
    const sessionModules = modules.filter(m => session.moduleIds.includes(m.id));
    
    if (sessionUsers.length === 0 || sessionModules.length === 0) return { completion: 0, completedCount: 0, totalWork: 0 };

    let totalModulesExpected = sessionUsers.length * sessionModules.length;
    let completedModulesCount = 0;

    sessionUsers.forEach(u => {
        sessionModules.forEach(m => {
            if (u.progress?.[m.id]?.isCompleted) {
                completedModulesCount++;
            }
        });
    });

    return {
        completion: Math.round((completedModulesCount / totalModulesExpected) * 100),
        completedCount: completedModulesCount,
        totalWork: totalModulesExpected
    };
  };

  const getEvaluationStats = (session: TrainingSession) => {
      const evals = Object.values(session.evaluations || {});
      if (evals.length === 0) return null;

      const sums = { q1: 0, q2: 0, q3: 0, q4: 0, q5: 0 };
      evals.forEach(ev => {
          sums.q1 += ev.scores.q1;
          sums.q2 += ev.scores.q2;
          sums.q3 += ev.scores.q3;
          sums.q4 += ev.scores.q4;
          sums.q5 += ev.scores.q5;
      });

      return {
          avg: {
              q1: (sums.q1 / evals.length).toFixed(1),
              q2: (sums.q2 / evals.length).toFixed(1),
              q3: (sums.q3 / evals.length).toFixed(1),
              q4: (sums.q4 / evals.length).toFixed(1),
              q5: (sums.q5 / evals.length).toFixed(1),
          },
          totalEvals: evals.length,
          overall: ((sums.q1 + sums.q2 + sums.q3 + sums.q4 + sums.q5) / (evals.length * 5)).toFixed(1)
      };
  };

  const filteredUsersForSelection = useMemo(() => {
    const s = userSearch.toLowerCase();
    return users.filter(u => {
        return (
            u.lastName.toLowerCase().includes(s) || 
            u.firstName.toLowerCase().includes(s) || 
            u.hospitalNumber.toLowerCase().includes(s) ||
            u.role.toLowerCase().includes(s)
        );
    });
  }, [users, userSearch]);

  const filteredModulesForSelection = useMemo(() => {
    const s = moduleSearch.toLowerCase();
    return modules.filter(m => 
      m.title.toLowerCase().includes(s) || 
      m.section.toLowerCase().includes(s)
    );
  }, [modules, moduleSearch]);

  const formatSessionDateTime = (iso: string) => {
      return new Date(iso).toLocaleString('en-US', {
          month: 'short',
          day: 'numeric',
          hour: '2-digit',
          minute: '2-digit'
      });
  };

  return (
    <div className="space-y-6 animate-fadeIn">
      <div className="bg-white p-6 rounded-xl border border-gray-200 shadow-sm flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h2 className="text-xl font-bold text-gray-900 flex items-center gap-2">
            <Calendar className="text-osmak-green" size={24} />
            Training Sessions
          </h2>
          <p className="text-sm text-gray-500 mt-1">Manage cohort training, set durations, and monitor progress.</p>
        </div>
        
        <div className="flex items-center gap-3">
            <div className="relative">
                <Search size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
                <input 
                    type="text" 
                    placeholder="Search sessions..."
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    className="pl-9 pr-4 py-2 border rounded-lg text-sm bg-white text-black focus:ring-2 focus:ring-osmak-green focus:border-osmak-green outline-none w-64"
                />
            </div>
            <button 
                onClick={handleOpenAdd}
                className="bg-osmak-green hover:bg-osmak-green-dark text-white px-6 py-2 rounded-lg font-bold shadow-md transition-all flex items-center gap-2"
            >
                <Plus size={18} />
                Create Session
            </button>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {filteredSessions.map(session => {
            const stats = getSessionStats(session);
            const isClosed = session.status === 'closed';
            const isActive = !isClosed && (new Date() >= new Date(session.startDateTime) && new Date() <= new Date(session.endDateTime));
            const evalCount = Object.keys(session.evaluations || {}).length;
            
            return (
                <div key={session.id} className={`bg-white rounded-xl border border-gray-200 shadow-sm hover:shadow-md transition-all overflow-hidden flex flex-col group ${isClosed ? 'opacity-80 grayscale-[0.2]' : ''}`}>
                    <div className="p-5 flex-1">
                        <div className="flex justify-between items-start mb-4">
                            <div>
                                <h3 className="font-bold text-gray-900 group-hover:text-osmak-green transition-colors">{session.name}</h3>
                                <div className="space-y-0.5 mt-2">
                                    <p className="text-[10px] text-gray-500 flex items-center gap-1.5"><Calendar size={12} className="text-blue-500" /> Start: {formatSessionDateTime(session.startDateTime)}</p>
                                    <p className="text-[10px] text-gray-500 flex items-center gap-1.5"><Calendar size={12} className="text-red-400" /> End: {formatSessionDateTime(session.endDateTime)}</p>
                                </div>
                            </div>
                            <div className="flex flex-col items-end gap-1">
                                <span className={`px-2 py-1 rounded text-[10px] font-black uppercase ${isClosed ? 'bg-red-100 text-red-700' : isActive ? 'bg-green-100 text-green-700' : 'bg-blue-100 text-blue-700'}`}>
                                    {isClosed ? 'Closed' : isActive ? 'Ongoing' : 'Scheduled'}
                                </span>
                                {evalCount > 0 && <span className="text-[9px] font-black uppercase text-blue-600 bg-blue-50 px-1.5 py-0.5 rounded">{evalCount} Feedback</span>}
                            </div>
                        </div>

                        <div className="grid grid-cols-2 gap-4 mb-6">
                            <div className="bg-gray-50 p-3 rounded-lg border border-gray-100">
                                <p className="text-[10px] font-bold text-gray-400 uppercase">Attendees</p>
                                <p className="text-lg font-black text-gray-800 flex items-center gap-2"><Users size={16} className="text-blue-500" /> {session.employeeHospitalNumbers.length}</p>
                            </div>
                            <div className="bg-gray-50 p-3 rounded-lg border border-gray-100">
                                <p className="text-[10px] font-bold text-gray-400 uppercase">Assigned</p>
                                <p className="text-lg font-black text-gray-800 flex items-center gap-2"><BookOpen size={16} className="text-osmak-green" /> {session.moduleIds.length}</p>
                            </div>
                        </div>

                        <div className="space-y-2">
                            <div className="flex justify-between items-center text-xs font-bold">
                                <span className="text-gray-500">Session Progress</span>
                                <span className="text-osmak-green">{stats.completion}%</span>
                            </div>
                            <div className="w-full h-2 bg-gray-100 rounded-full overflow-hidden">
                                <div className="bg-osmak-green h-full transition-all duration-700" style={{ width: `${stats.completion}%` }}></div>
                            </div>
                        </div>
                    </div>

                    <div className="bg-gray-50 px-5 py-3 border-t border-gray-100 flex justify-between items-center">
                        <div className="flex gap-2">
                            <button onClick={() => handleOpenEdit(session)} className="p-2 text-gray-400 hover:text-blue-600 hover:bg-blue-50 rounded-lg transition-all" title="Edit Session"><Edit2 size={16} /></button>
                            <button 
                                onClick={(e) => { 
                                    e.stopPropagation();
                                    const nextStatus = isClosed ? 'open' : 'closed';
                                    onUpdateSession({ ...session, status: nextStatus });
                                }} 
                                className={`p-2 rounded-lg transition-all ${isClosed ? 'text-red-500 bg-red-50' : 'text-green-500 bg-green-50'}`}
                                title={isClosed ? "Open Session" : "Close Session"}
                            >
                                {isClosed ? <Lock size={16} /> : <Unlock size={16} />}
                            </button>
                            <button onClick={() => { if(confirm('Delete this session?')) onDeleteSession(session.id); }} className="p-2 text-gray-400 hover:text-red-600 hover:bg-red-50 rounded-lg transition-all" title="Delete Session"><Trash2 size={16} /></button>
                        </div>
                        <button onClick={() => { setSelectedSession(session); setActiveDetailTab('PROGRESS'); }} className="text-xs font-bold text-gray-600 hover:text-osmak-green flex items-center gap-1 group/btn">Review Details <ChevronRight size={14} className="group-hover/btn:translate-x-1 transition-transform" /></button>
                    </div>
                </div>
            );
        })}
      </div>

      {/* Detail View Modal */}
      {selectedSession && (
        <div className="fixed inset-0 z-[250] bg-black/60 flex items-center justify-center p-4 backdrop-blur-sm animate-fadeIn">
            <div className="bg-white rounded-[2rem] shadow-2xl max-w-7xl w-full h-full max-h-[90vh] flex flex-col overflow-hidden">
                <div className="bg-gray-800 text-white p-8 flex justify-between items-start shrink-0">
                    <div className="flex items-center gap-6">
                        <div className="w-16 h-16 bg-osmak-green rounded-2xl flex items-center justify-center shadow-lg">
                            <Calendar size={32} />
                        </div>
                        <div>
                            <h2 className="text-3xl font-black uppercase tracking-tight leading-none">{selectedSession.name}</h2>
                            <div className="flex gap-4 text-xs font-bold opacity-60 mt-3">
                                <span className="flex items-center gap-1.5"><Clock size={14}/> {formatSessionDateTime(selectedSession.startDateTime)} — {formatSessionDateTime(selectedSession.endDateTime)}</span>
                                <span className="bg-white/10 px-2 py-0.5 rounded tracking-widest">{selectedSession.status.toUpperCase()}</span>
                            </div>
                        </div>
                    </div>
                    <button onClick={() => setSelectedSession(null)} className="hover:text-red-400 p-2 rounded-full hover:bg-white/10 transition-all"><X size={32} /></button>
                </div>

                <div className="bg-white border-b border-gray-100 flex gap-10 px-8 shrink-0">
                    <button 
                        onClick={() => setActiveDetailTab('PROGRESS')}
                        className={`py-4 text-xs font-black uppercase tracking-widest border-b-4 transition-all ${activeDetailTab === 'PROGRESS' ? 'border-osmak-green text-osmak-green' : 'border-transparent text-gray-400 hover:text-gray-600'}`}
                    >
                        Attendee Progress
                    </button>
                    <button 
                        onClick={() => setActiveDetailTab('EVALUATIONS')}
                        className={`py-4 text-xs font-black uppercase tracking-widest border-b-4 transition-all relative ${activeDetailTab === 'EVALUATIONS' ? 'border-osmak-green text-osmak-green' : 'border-transparent text-gray-400 hover:text-gray-600'}`}
                    >
                        Evaluations Summary
                        {Object.keys(selectedSession.evaluations || {}).length > 0 && (
                            <span className="absolute -top-1 -right-4 bg-blue-600 text-white text-[8px] font-black px-1.5 py-0.5 rounded-full ring-2 ring-white">
                                {Object.keys(selectedSession.evaluations || {}).length}
                            </span>
                        )}
                    </button>
                </div>
                
                <div className="flex-1 overflow-y-auto custom-scrollbar bg-gray-50 p-8">
                    {activeDetailTab === 'PROGRESS' ? (
                        <div className="space-y-6">
                            <div className="flex items-center justify-between">
                                <h4 className="font-black text-gray-400 uppercase tracking-widest text-[10px] flex items-center gap-2">
                                    <Users size={14}/> Employee Participation Matrix
                                </h4>
                            </div>
                            <div className="bg-white rounded-3xl border border-gray-200 shadow-sm overflow-hidden">
                                <div className="overflow-x-auto custom-scrollbar">
                                    <table className="w-full text-left text-sm border-collapse">
                                        <thead className="bg-gray-50 border-b text-gray-500 font-bold uppercase text-[9px]">
                                            <tr>
                                                <th className="px-6 py-5 sticky left-0 bg-gray-50 z-20 shadow-[2px_0_5px_-2px_rgba(0,0,0,0.1)] min-w-[200px]">Member</th>
                                                <th className="px-6 py-5 text-center bg-blue-50 text-blue-700 min-w-[100px] sticky left-[200px] z-20 shadow-[2px_0_5px_-2px_rgba(0,0,0,0.1)]">Progress</th>
                                                {modules.filter(m => selectedSession.moduleIds.includes(m.id)).map(m => (
                                                    <th key={m.id} className="px-4 py-5 text-center min-w-[180px] font-black leading-tight border-l border-gray-100">{m.title}</th>
                                                ))}
                                            </tr>
                                        </thead>
                                        <tbody className="divide-y divide-gray-100">
                                            {users.filter(u => selectedSession.employeeHospitalNumbers.includes(u.hospitalNumber)).map(user => {
                                                const sModules = modules.filter(m => selectedSession.moduleIds.includes(m.id));
                                                const completed = sModules.filter(m => user.progress?.[m.id]?.isCompleted).length;
                                                const percent = sModules.length > 0 ? Math.round((completed / sModules.length) * 100) : 0;
                                                
                                                return (
                                                    <tr key={user.hospitalNumber} className="hover:bg-gray-50 transition-colors group">
                                                        <td className="px-6 py-5 sticky left-0 bg-white z-10 group-hover:bg-gray-50 shadow-[2px_0_5px_-2px_rgba(0,0,0,0.1)]">
                                                            <div className="font-bold text-gray-900">{user.lastName}, {user.firstName}</div>
                                                            <div className="text-[10px] text-gray-400 font-bold uppercase tracking-tight">{user.role}</div>
                                                        </td>
                                                        <td className="px-6 py-5 text-center bg-blue-50/30 sticky left-[200px] z-10 shadow-[2px_0_5px_-2px_rgba(0,0,0,0.1)] group-hover:bg-blue-50">
                                                            <span className={`font-black text-lg ${percent === 100 ? 'text-osmak-green' : 'text-blue-700'}`}>{percent}%</span>
                                                        </td>
                                                        {sModules.map(m => {
                                                            const isDone = user.progress?.[m.id]?.isCompleted;
                                                            const score = user.progress?.[m.id]?.highScore || 0;
                                                            const attemptsCount = user.progress?.[m.id]?.attempts?.length || 0;
                                                            return (
                                                                <td key={m.id} className="px-4 py-5 text-center border-l border-gray-50">
                                                                    {isDone ? (
                                                                        <div className="flex flex-col items-center">
                                                                            <CheckCircle size={20} className="text-green-500" />
                                                                            <span className="text-[11px] font-black text-gray-700 mt-1">{score}%</span>
                                                                        </div>
                                                                    ) : attemptsCount > 0 ? (
                                                                        <div className="flex flex-col items-center opacity-40">
                                                                            <XCircle size={20} className="text-red-400" />
                                                                            <span className="text-[11px] font-black text-gray-500 mt-1">{score}%</span>
                                                                        </div>
                                                                    ) : (
                                                                        <div className="w-2 h-2 rounded-full bg-gray-100 mx-auto"></div>
                                                                    )}
                                                                </td>
                                                            );
                                                        })}
                                                    </tr>
                                                );
                                            })}
                                        </tbody>
                                    </table>
                                </div>
                            </div>
                        </div>
                    ) : (
                        <div className="space-y-10 max-w-5xl mx-auto">
                            {/* Fix: Computed evaluation stats once to avoid repeated calls and fix the missing sums reference */}
                            {(() => {
                                const evalStats = getEvaluationStats(selectedSession);
                                if (!evalStats) return (
                                    <div className="py-24 text-center space-y-4">
                                        <ClipboardCheck size={64} className="mx-auto text-gray-200" />
                                        <div className="space-y-1">
                                            <h3 className="text-xl font-black text-gray-300 uppercase">Waiting for Feedback</h3>
                                            <p className="text-gray-400 text-sm font-medium">Evaluation summaries will appear here once attendees complete the session.</p>
                                        </div>
                                    </div>
                                );

                                return (
                                    <>
                                        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                                            <div className="md:col-span-1 bg-white p-8 rounded-3xl border border-gray-200 shadow-sm flex flex-col items-center justify-center text-center space-y-2">
                                                <div className="p-4 bg-green-50 text-osmak-green rounded-2xl mb-2">
                                                    <Star size={32} />
                                                </div>
                                                <div className="text-5xl font-black text-gray-900">{evalStats.overall}</div>
                                                <div className="text-[10px] font-black uppercase text-gray-400 tracking-widest">Overall Training Rating</div>
                                                <div className="text-xs text-gray-400 font-bold">{evalStats.totalEvals} Submissions</div>
                                            </div>
                                            
                                            <div className="md:col-span-2 bg-white p-8 rounded-3xl border border-gray-200 shadow-sm space-y-6">
                                                <h5 className="font-black text-gray-400 uppercase tracking-widest text-[10px] flex items-center gap-2">
                                                    <BarChart3 size={14}/> Question Performance
                                                </h5>
                                                <div className="space-y-4">
                                                    {[
                                                        { q: "q1", text: "Clarity of Concepts" },
                                                        { q: "q2", text: "Quality of AV Materials" },
                                                        { q: "q3", text: "Return Demo Guidance" },
                                                        { q: "q4", text: "Venue Suitability" },
                                                        { q: "q5", text: "Confidence Boost" }
                                                    ].map(item => {
                                                        const score = parseFloat((evalStats.avg as any)[item.q] || '0');
                                                        return (
                                                            <div key={item.q} className="space-y-1.5">
                                                                <div className="flex justify-between items-center text-xs font-bold">
                                                                    <span className="text-gray-700">{item.text}</span>
                                                                    <span className="text-osmak-green">{score} / 5.0</span>
                                                                </div>
                                                                <div className="w-full h-1.5 bg-gray-100 rounded-full overflow-hidden">
                                                                    <div className="h-full bg-osmak-green" style={{ width: `${(score/5)*100}%` }}></div>
                                                                </div>
                                                            </div>
                                                        )
                                                    })}
                                                </div>
                                            </div>
                                        </div>

                                        <div className="space-y-6">
                                            <h4 className="font-black text-gray-400 uppercase tracking-widest text-[10px] flex items-center gap-2">
                                                <MessageSquare size={14}/> qualitative Feedback entries
                                            </h4>
                                            <div className="grid grid-cols-1 gap-4">
                                                {Object.values(selectedSession.evaluations || {}).map((ev, idx) => (
                                                    <div key={idx} className="bg-white p-6 rounded-2xl border border-gray-200 shadow-sm space-y-3 hover:border-blue-100 transition-all">
                                                        <div className="flex justify-between items-start">
                                                            <div className="flex items-center gap-3">
                                                                <div className="w-8 h-8 bg-gray-100 text-gray-500 rounded-lg flex items-center justify-center text-xs font-black">
                                                                    {ev.userId.slice(-2)}
                                                                </div>
                                                                <div>
                                                                    <div className="text-xs font-bold text-gray-800">{ev.userName}</div>
                                                                    <div className="text-[10px] text-gray-400 font-bold uppercase tracking-tight">{new Date(ev.date).toLocaleDateString()}</div>
                                                                </div>
                                                            </div>
                                                            <div className="flex items-center gap-1 bg-green-50 text-osmak-green px-2 py-0.5 rounded text-[10px] font-black">
                                                                <Star size={10} fill="currentColor" /> {((ev.scores.q1 + ev.scores.q2 + ev.scores.q3 + ev.scores.q4 + ev.scores.q5)/5).toFixed(1)}
                                                            </div>
                                                        </div>
                                                        <p className="text-sm text-gray-600 leading-relaxed font-medium italic">"{ev.feedback}"</p>
                                                    </div>
                                                ))}
                                            </div>
                                        </div>
                                    </>
                                );
                            })()}
                        </div>
                    )}
                </div>
                <div className="p-6 bg-white border-t border-gray-100 text-right shrink-0">
                    <button onClick={() => setSelectedSession(null)} className="px-10 py-3 bg-gray-100 hover:bg-gray-200 text-gray-800 rounded-2xl font-black text-xs uppercase tracking-widest transition-all">Close Review</button>
                </div>
            </div>
        </div>
      )}

      {isModalOpen && (
        <div className="fixed inset-0 z-[300] bg-black/60 flex items-center justify-center p-4 backdrop-blur-sm animate-fadeIn">
          <div className="bg-white rounded-[2rem] shadow-2xl max-w-6xl w-full h-full max-h-[90vh] flex flex-col overflow-hidden">
            <div className="bg-gray-800 text-white p-8 flex items-center justify-between shrink-0">
              <div className="flex items-center gap-4">
                <div className="w-12 h-12 bg-osmak-green rounded-xl flex items-center justify-center shadow-lg">
                  <Calendar size={24} />
                </div>
                <div>
                  <h3 className="font-black text-2xl uppercase tracking-tight">{editingSession ? 'Edit Training Session' : 'Create New Session'}</h3>
                  <p className="text-xs opacity-60 font-bold">Configure schedules, cohort members, and required curriculum</p>
                </div>
              </div>
              <button onClick={() => setIsModalOpen(false)} className="hover:text-red-400 p-2 rounded-full hover:bg-white/10 transition-all">
                <X size={32} />
              </button>
            </div>

            <div className="flex-1 overflow-y-auto custom-scrollbar p-8 bg-gray-50">
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                {/* Basic Details */}
                <div className="space-y-6">
                  <h4 className="font-black text-gray-400 uppercase tracking-widest text-[10px] flex items-center gap-2">
                    <Info size={14} /> Session Core Settings
                  </h4>
                  <div className="bg-white p-8 rounded-3xl border border-gray-100 shadow-sm space-y-6">
                    <div>
                      <label className="block text-xs font-black text-gray-400 uppercase tracking-widest mb-2">Session Name</label>
                      <input 
                        type="text" 
                        value={formData.name} 
                        onChange={e => setFormData(p => ({...p, name: e.target.value}))}
                        className="w-full px-5 py-3.5 border-2 border-gray-100 rounded-2xl bg-gray-50 text-black font-bold focus:border-osmak-green focus:bg-white outline-none transition-all" 
                        placeholder="e.g. Q4 Nursing Onboarding"
                      />
                    </div>
                    <div className="grid grid-cols-2 gap-4">
                        <div>
                          <label className="block text-xs font-black text-gray-400 uppercase tracking-widest mb-2">Start Time</label>
                          <input 
                            type="datetime-local" 
                            value={toDatetimeLocal(formData.startDateTime || '')} 
                            onChange={e => setFormData(p => ({...p, startDateTime: new Date(e.target.value).toISOString()}))}
                            className="w-full px-5 py-3.5 border-2 border-gray-100 rounded-2xl bg-gray-50 text-black text-sm font-bold focus:border-osmak-green focus:bg-white"
                          />
                        </div>
                        <div>
                          <label className="block text-xs font-black text-gray-400 uppercase tracking-widest mb-2">End Time</label>
                          <input 
                            type="datetime-local" 
                            value={toDatetimeLocal(formData.endDateTime || '')} 
                            onChange={e => setFormData(p => ({...p, endDateTime: new Date(e.target.value).toISOString()}))}
                            className="w-full px-5 py-3.5 border-2 border-gray-100 rounded-2xl bg-gray-50 text-black text-sm font-bold focus:border-osmak-green focus:bg-white"
                          />
                        </div>
                    </div>
                    <div>
                      <label className="block text-xs font-black text-gray-400 uppercase tracking-widest mb-2">Session Accessibility</label>
                      <select 
                        value={formData.status}
                        onChange={e => setFormData(p => ({...p, status: e.target.value as 'open' | 'closed'}))}
                        className="w-full px-5 py-3.5 border-2 border-gray-100 rounded-2xl bg-gray-50 text-black font-bold focus:border-osmak-green focus:bg-white outline-none appearance-none"
                      >
                        <option value="open">Active (Open for attendees)</option>
                        <option value="closed">Inactive (Locked / Archives)</option>
                      </select>
                    </div>
                  </div>

                  <h4 className="font-black text-gray-400 uppercase tracking-widest text-[10px] flex items-center gap-2">
                    <BookOpen size={14} /> Course Curriculum
                  </h4>
                  <div className="bg-white p-8 rounded-3xl border border-gray-100 shadow-sm space-y-4">
                    <div className="relative">
                      <Search size={16} className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400" />
                      <input 
                        type="text" 
                        placeholder="Search for modules..."
                        value={moduleSearch}
                        onChange={e => setModuleSearch(e.target.value)}
                        className="w-full pl-12 pr-4 py-3 border-2 border-gray-100 rounded-xl text-sm bg-gray-50 focus:bg-white focus:border-osmak-green outline-none transition-all font-bold"
                      />
                    </div>
                    <div className="max-h-[250px] overflow-y-auto custom-scrollbar space-y-1.5 p-1">
                      {filteredModulesForSelection.map(m => {
                        const isSelected = formData.moduleIds?.includes(m.id);
                        return (
                          <label key={m.id} className={`flex items-center gap-4 p-4 rounded-xl border-2 transition-all cursor-pointer ${isSelected ? 'border-osmak-green bg-green-50' : 'border-transparent bg-gray-50 hover:bg-gray-100'}`}>
                            <input 
                              type="checkbox" 
                              checked={isSelected}
                              onChange={() => toggleModule(m.id)}
                              className="w-5 h-5 accent-osmak-green"
                            />
                            <div className="flex-1 min-w-0">
                                <p className={`text-sm font-bold truncate ${isSelected ? 'text-osmak-green' : 'text-gray-700'}`}>{m.title}</p>
                                <p className="text-[10px] text-gray-400 font-black uppercase tracking-tight">{m.section}</p>
                            </div>
                          </label>
                        );
                      })}
                    </div>
                  </div>
                </div>

                {/* Member Selection */}
                <div className="space-y-6">
                  <div className="flex items-center justify-between">
                    <h4 className="font-black text-gray-400 uppercase tracking-widest text-[10px] flex items-center gap-2">
                        <Users size={14} /> Assigned Attendees
                    </h4>
                    <span className="text-[10px] font-black bg-blue-100 text-blue-700 px-3 py-1 rounded-full uppercase tracking-tighter shadow-sm">{formData.employeeHospitalNumbers?.length} Members Selected</span>
                  </div>
                  <div className="bg-white p-8 rounded-3xl border border-gray-100 shadow-sm space-y-4">
                    <div className="relative">
                      <Search size={16} className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400" />
                      <input 
                        type="text" 
                        placeholder="Search by name, ID or role..."
                        value={userSearch}
                        onChange={e => setUserSearch(e.target.value)}
                        className="w-full pl-12 pr-4 py-3 border-2 border-gray-100 rounded-xl text-sm bg-gray-50 focus:bg-white focus:border-osmak-green outline-none transition-all font-bold"
                      />
                    </div>
                    <div className="max-h-[500px] overflow-y-auto custom-scrollbar space-y-1.5 p-1">
                      {filteredUsersForSelection.map(user => {
                        const isSelected = formData.employeeHospitalNumbers?.includes(user.hospitalNumber);
                        return (
                          <label key={user.hospitalNumber} className={`flex items-center gap-4 p-4 rounded-xl border-2 transition-all cursor-pointer ${isSelected ? 'border-blue-500 bg-blue-50' : 'border-transparent bg-gray-50 hover:bg-gray-100'}`}>
                            <input 
                              type="checkbox" 
                              checked={isSelected}
                              onChange={() => toggleUser(user.hospitalNumber)}
                              className="w-5 h-5 accent-blue-600"
                            />
                            <div className="flex-1 min-w-0">
                                <p className={`text-sm font-bold truncate ${isSelected ? 'text-blue-700' : 'text-gray-800'}`}>{user.lastName}, {user.firstName}</p>
                                <div className="flex gap-2 text-[9px] font-black text-gray-400 uppercase mt-0.5 tracking-tight">
                                    <span>ID: {user.hospitalNumber}</span>
                                    <span>•</span>
                                    <span>{user.role}</span>
                                </div>
                            </div>
                          </label>
                        );
                      })}
                    </div>
                  </div>
                </div>
              </div>
            </div>

            <div className="bg-white border-t p-8 flex justify-end gap-4 shrink-0">
               <button onClick={() => setIsModalOpen(false)} className="px-8 py-3.5 text-gray-500 font-black uppercase text-xs tracking-widest hover:bg-gray-50 rounded-2xl transition-all">Cancel</button>
               <button 
                  onClick={handleSave} 
                  disabled={isProcessing}
                  className="px-12 py-3.5 bg-osmak-green hover:bg-osmak-green-dark text-white rounded-2xl font-black uppercase text-xs tracking-widest shadow-xl shadow-green-100 flex items-center gap-2 disabled:opacity-50 transition-all active:scale-95"
                >
                    {isProcessing ? <Loader2 size={18} className="animate-spin" /> : <Save size={18} />}
                    {editingSession ? 'Update Session' : 'Publish Session'}
               </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default SessionManager;
