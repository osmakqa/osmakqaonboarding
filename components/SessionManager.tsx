
import React, { useState, useMemo } from 'react';
import { TrainingSession, Module, UserProfile } from '../types';
import { Calendar, Plus, Search, Edit2, Trash2, X, Check, Users, BookOpen, BarChart3, ChevronRight, CheckCircle, Info, Loader2, Save } from 'lucide-react';

interface SessionManagerProps {
  sessions: TrainingSession[];
  modules: Module[];
  users: UserProfile[];
  onAddSession: (session: TrainingSession) => Promise<void>;
  onUpdateSession: (session: TrainingSession) => Promise<void>;
  onDeleteSession: (sessionId: string) => Promise<void>;
}

const SessionManager: React.FC<SessionManagerProps> = ({ sessions, modules, users, onAddSession, onUpdateSession, onDeleteSession }) => {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingSession, setEditingSession] = useState<TrainingSession | null>(null);
  const [selectedSession, setSelectedSession] = useState<TrainingSession | null>(null);
  const [isProcessing, setIsProcessing] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');

  // Form State
  const [formData, setFormData] = useState<Partial<TrainingSession>>({
    name: '',
    date: new Date().toISOString().split('T')[0],
    moduleIds: [],
    employeeHospitalNumbers: []
  });

  const [moduleSearch, setModuleSearch] = useState('');
  const [userSearch, setUserSearch] = useState('');

  const filteredSessions = sessions.filter(s => 
    s.name.toLowerCase().includes(searchTerm.toLowerCase())
  ).sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime());

  const handleOpenAdd = () => {
    setEditingSession(null);
    setFormData({
      name: '',
      date: new Date().toISOString().split('T')[0],
      moduleIds: [],
      employeeHospitalNumbers: []
    });
    setIsModalOpen(true);
  };

  const handleOpenEdit = (session: TrainingSession) => {
    setEditingSession(session);
    setFormData({ ...session });
    setIsModalOpen(true);
  };

  const handleSave = async () => {
    if (!formData.name || !formData.date || (formData.moduleIds || []).length === 0 || (formData.employeeHospitalNumbers || []).length === 0) {
      alert("Please fill in all fields and select at least one module and one employee.");
      return;
    }

    setIsProcessing(true);
    const sessionData: TrainingSession = {
      ...formData,
      id: editingSession ? editingSession.id : `sess_${Date.now()}`,
      name: formData.name!,
      date: formData.date!,
      moduleIds: formData.moduleIds || [],
      employeeHospitalNumbers: formData.employeeHospitalNumbers || []
    } as TrainingSession;

    if (editingSession) {
      await onUpdateSession(sessionData);
    } else {
      await onAddSession(sessionData);
    }
    setIsProcessing(false);
    setIsModalOpen(false);
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

  // Helper for filtering users in the session creation modal
  const filteredUsersForSelection = useMemo(() => {
    const s = userSearch.toLowerCase();
    return users.filter(u => {
        return (
            u.lastName.toLowerCase().includes(s) || 
            u.firstName.toLowerCase().includes(s) || 
            u.hospitalNumber.toLowerCase().includes(s) ||
            u.role.toLowerCase().includes(s) ||
            (u.registrationDate && u.registrationDate.includes(s))
        );
    });
  }, [users, userSearch]);

  return (
    <div className="space-y-6 animate-fadeIn">
      {/* Action Bar */}
      <div className="bg-white p-6 rounded-xl border border-gray-200 shadow-sm flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h2 className="text-xl font-bold text-gray-900 flex items-center gap-2">
            <Calendar className="text-osmak-green" size={24} />
            Training Sessions
          </h2>
          <p className="text-sm text-gray-500 mt-1">Manage group training events and monitor specific cohorts.</p>
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

      {/* Sessions Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {filteredSessions.map(session => {
            const stats = getSessionStats(session);
            return (
                <div key={session.id} className="bg-white rounded-xl border border-gray-200 shadow-sm hover:shadow-md transition-all overflow-hidden flex flex-col group">
                    <div className="p-5 flex-1">
                        <div className="flex justify-between items-start mb-4">
                            <div>
                                <h3 className="font-bold text-gray-900 group-hover:text-osmak-green transition-colors">{session.name}</h3>
                                <p className="text-xs text-gray-500 flex items-center gap-1 mt-1"><Calendar size={12} /> {new Date(session.date).toLocaleDateString('en-US', { month: 'long', day: 'numeric', year: 'numeric' })}</p>
                            </div>
                            <span className={`px-2 py-1 rounded text-[10px] font-black uppercase ${stats.completion === 100 ? 'bg-green-100 text-green-700' : 'bg-blue-100 text-blue-700'}`}>
                                {stats.completion === 100 ? 'Done' : 'Active'}
                            </span>
                        </div>

                        <div className="grid grid-cols-2 gap-4 mb-6">
                            <div className="bg-gray-50 p-3 rounded-lg border border-gray-100">
                                <p className="text-[10px] font-bold text-gray-400 uppercase">Employees</p>
                                <p className="text-lg font-black text-gray-800 flex items-center gap-2"><Users size={16} className="text-blue-500" /> {session.employeeHospitalNumbers.length}</p>
                            </div>
                            <div className="bg-gray-50 p-3 rounded-lg border border-gray-100">
                                <p className="text-[10px] font-bold text-gray-400 uppercase">Modules</p>
                                <p className="text-lg font-black text-gray-800 flex items-center gap-2"><BookOpen size={16} className="text-osmak-green" /> {session.moduleIds.length}</p>
                            </div>
                        </div>

                        <div className="space-y-2">
                            <div className="flex justify-between items-center text-xs font-bold">
                                <span className="text-gray-500">Overall Progress</span>
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
                            <button onClick={() => { if(confirm('Delete this session?')) onDeleteSession(session.id); }} className="p-2 text-gray-400 hover:text-red-600 hover:bg-red-50 rounded-lg transition-all" title="Delete Session"><Trash2 size={16} /></button>
                        </div>
                        <button 
                            onClick={() => setSelectedSession(session)}
                            className="text-xs font-bold text-gray-600 hover:text-osmak-green flex items-center gap-1 group/btn"
                        >
                            Review Details <ChevronRight size={14} className="group-hover/btn:translate-x-1 transition-transform" />
                        </button>
                    </div>
                </div>
            );
        })}

        {filteredSessions.length === 0 && (
            <div className="col-span-full py-20 text-center bg-white rounded-xl border-2 border-dashed border-gray-200">
                <Calendar size={48} className="mx-auto text-gray-300 mb-4" />
                <p className="text-gray-500 font-medium">No training sessions found.</p>
                <button onClick={handleOpenAdd} className="mt-4 text-osmak-green font-bold hover:underline">Create your first session</button>
            </div>
        )}
      </div>

      {/* Session Details Viewer */}
      {selectedSession && (
        <div className="fixed inset-0 z-[250] bg-black/60 flex items-center justify-center p-4 backdrop-blur-sm animate-fadeIn">
            <div className="bg-white rounded-2xl shadow-2xl max-w-5xl w-full h-full max-h-[90vh] flex flex-col overflow-hidden">
                <div className="bg-gray-800 text-white p-6 flex justify-between items-start shrink-0">
                    <div>
                        <h2 className="text-2xl font-bold flex items-center gap-2"><BarChart3 size={24} className="text-osmak-green" /> Session: {selectedSession.name}</h2>
                        <p className="text-sm opacity-80 mt-1">Scheduled Date: {new Date(selectedSession.date).toLocaleDateString()}</p>
                    </div>
                    <button onClick={() => setSelectedSession(null)} className="hover:text-red-400 p-1"><X size={32} /></button>
                </div>
                
                <div className="flex-1 overflow-y-auto custom-scrollbar bg-gray-50 p-6">
                    <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
                        {/* Member Progress List */}
                        <div className="lg:col-span-3 space-y-4">
                            <h4 className="font-bold text-gray-400 uppercase tracking-widest text-xs">Employee Completion Status</h4>
                            <div className="bg-white rounded-xl border border-gray-200 shadow-sm overflow-hidden">
                                <table className="w-full text-left text-sm">
                                    <thead className="bg-gray-50 border-b text-gray-500 font-bold uppercase text-[10px]">
                                        <tr>
                                            <th className="px-6 py-3">Member</th>
                                            {modules.filter(m => selectedSession.moduleIds.includes(m.id)).map(m => (
                                                <th key={m.id} className="px-3 py-3 text-center whitespace-nowrap overflow-hidden text-ellipsis max-w-[100px]" title={m.title}>{m.title}</th>
                                            ))}
                                            <th className="px-6 py-3 text-right">Progress</th>
                                        </tr>
                                    </thead>
                                    <tbody className="divide-y divide-gray-100">
                                        {users.filter(u => selectedSession.employeeHospitalNumbers.includes(u.hospitalNumber)).map(user => {
                                            const sessionModules = modules.filter(m => selectedSession.moduleIds.includes(m.id));
                                            const completed = sessionModules.filter(m => user.progress?.[m.id]?.isCompleted).length;
                                            const percent = Math.round((completed / sessionModules.length) * 100);
                                            
                                            return (
                                                <tr key={user.hospitalNumber} className="hover:bg-gray-50 transition-colors">
                                                    <td className="px-6 py-4">
                                                        <div className="font-bold text-gray-900">{user.lastName}, {user.firstName}</div>
                                                        <div className="text-[10px] text-gray-500 uppercase">{user.role}</div>
                                                    </td>
                                                    {sessionModules.map(m => {
                                                        const isDone = user.progress?.[m.id]?.isCompleted;
                                                        const score = user.progress?.[m.id]?.highScore || 0;
                                                        return (
                                                            <td key={m.id} className="px-3 py-4 text-center">
                                                                {isDone ? (
                                                                    <div className="flex flex-col items-center">
                                                                        <CheckCircle size={16} className="text-green-500" />
                                                                        <span className="text-[9px] font-bold text-gray-400">{score}%</span>
                                                                    </div>
                                                                ) : (
                                                                    <div className="w-3 h-3 rounded-full bg-gray-200 mx-auto"></div>
                                                                )}
                                                            </td>
                                                        );
                                                    })}
                                                    <td className="px-6 py-4 text-right">
                                                        <span className={`font-black ${percent === 100 ? 'text-osmak-green' : 'text-gray-900'}`}>{percent}%</span>
                                                    </td>
                                                </tr>
                                            );
                                        })}
                                    </tbody>
                                </table>
                            </div>
                        </div>

                        {/* Summary Box */}
                        <div className="lg:col-span-1 space-y-6">
                            <h4 className="font-bold text-gray-400 uppercase tracking-widest text-xs">Summary Stats</h4>
                            <div className="bg-osmak-green rounded-xl p-6 text-white shadow-lg shadow-osmak-green/20 relative overflow-hidden">
                                <div className="absolute top-0 right-0 p-4 opacity-10"><BarChart3 size={80} /></div>
                                <div className="relative z-10">
                                    <p className="text-xs font-bold uppercase opacity-80">Group Completion</p>
                                    <p className="text-5xl font-black mt-1">{getSessionStats(selectedSession).completion}%</p>
                                    <div className="mt-4 pt-4 border-t border-white/20 text-xs">
                                        <div className="flex justify-between mb-1">
                                            <span>Completed Units</span>
                                            <span className="font-bold">{getSessionStats(selectedSession).completedCount}</span>
                                        </div>
                                        <div className="flex justify-between">
                                            <span>Total Assigned</span>
                                            <span className="font-bold">{getSessionStats(selectedSession).totalWork}</span>
                                        </div>
                                    </div>
                                </div>
                            </div>

                            <div className="bg-white rounded-xl border border-gray-200 p-5 shadow-sm">
                                <h5 className="text-xs font-bold text-gray-400 uppercase mb-4">Assigned Modules</h5>
                                <div className="space-y-2">
                                    {modules.filter(m => selectedSession.moduleIds.includes(m.id)).map(m => (
                                        <div key={m.id} className="flex items-center gap-2 p-2 bg-gray-50 rounded border border-gray-100">
                                            <BookOpen size={14} className="text-osmak-green shrink-0" />
                                            <span className="text-[11px] font-bold text-gray-700 truncate">{m.title}</span>
                                        </div>
                                    ))}
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
      )}

      {/* Create/Edit Modal */}
      {isModalOpen && (
        <div className="fixed inset-0 z-[300] bg-black/60 flex items-center justify-center p-4 backdrop-blur-sm animate-fadeIn">
          <div className="bg-white rounded-2xl shadow-2xl max-w-5xl w-full h-full max-h-[90vh] flex flex-col overflow-hidden">
            <div className="bg-gray-800 text-white p-5 flex items-center justify-between shrink-0">
              <div className="flex items-center gap-3">
                <div className="p-2 bg-osmak-green rounded-lg">
                  <Calendar size={20} />
                </div>
                <div>
                  <h3 className="font-bold text-lg">{editingSession ? 'Edit Session' : 'Create New Session'}</h3>
                  <p className="text-xs opacity-70">Designate modules and attendees for this session</p>
                </div>
              </div>
              <button onClick={() => setIsModalOpen(false)} className="hover:text-red-400 p-1">
                <X size={24} />
              </button>
            </div>

            <div className="flex-1 overflow-y-auto custom-scrollbar p-8 bg-gray-50">
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                    {/* Left Side: General & Modules */}
                    <div className="space-y-6">
                        <section className="bg-white p-6 rounded-xl border border-gray-200 shadow-sm space-y-4">
                            <h4 className="text-xs font-black uppercase text-gray-400 tracking-widest mb-4">General Information</h4>
                            <div>
                                <label className="block text-sm font-bold text-gray-700 mb-1.5">Session Name</label>
                                <input 
                                    type="text" 
                                    value={formData.name} 
                                    onChange={e => setFormData(p => ({...p, name: e.target.value}))}
                                    className="w-full px-4 py-2 border rounded-lg bg-white text-black focus:ring-2 focus:ring-osmak-green outline-none"
                                    placeholder="e.g. Batch 2025 Nursing Orientation"
                                />
                            </div>
                            <div>
                                <label className="block text-sm font-bold text-gray-700 mb-1.5">Date of Session</label>
                                <input 
                                    type="date" 
                                    value={formData.date} 
                                    onChange={e => setFormData(p => ({...p, date: e.target.value}))}
                                    className="w-full px-4 py-2 border rounded-lg bg-white text-black focus:ring-2 focus:ring-osmak-green outline-none"
                                />
                            </div>
                        </section>

                        <section className="bg-white p-6 rounded-xl border border-gray-200 shadow-sm space-y-4">
                            <div className="flex justify-between items-center mb-2">
                                <h4 className="text-xs font-black uppercase text-gray-400 tracking-widest">Select Modules</h4>
                                <span className="text-[10px] font-bold bg-blue-100 text-blue-700 px-2 py-0.5 rounded">{(formData.moduleIds || []).length} selected</span>
                            </div>
                            <div className="relative mb-3">
                                <Search size={14} className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
                                <input 
                                    type="text" 
                                    placeholder="Filter courses..."
                                    value={moduleSearch}
                                    onChange={(e) => setModuleSearch(e.target.value)}
                                    className="w-full pl-9 pr-4 py-2 border border-gray-100 rounded-lg text-xs bg-gray-50 text-black focus:ring-2 focus:ring-osmak-green outline-none"
                                />
                            </div>
                            <div className="max-h-60 overflow-y-auto custom-scrollbar space-y-2 pr-2">
                                {modules.filter(m => m.title.toLowerCase().includes(moduleSearch.toLowerCase())).map(m => {
                                    const isSelected = formData.moduleIds?.includes(m.id);
                                    return (
                                        <button 
                                            key={m.id} 
                                            onClick={() => toggleModule(m.id)}
                                            className={`w-full flex items-center gap-3 p-3 rounded-lg border transition-all text-left group ${isSelected ? 'border-osmak-green bg-green-50 shadow-sm' : 'border-gray-100 hover:bg-gray-50'}`}
                                        >
                                            <div className={`w-5 h-5 rounded border flex items-center justify-center transition-colors ${isSelected ? 'bg-osmak-green border-osmak-green text-white' : 'bg-white border-gray-300'}`}>
                                                {isSelected && <Check size={12} />}
                                            </div>
                                            <div>
                                                <p className={`text-xs font-bold ${isSelected ? 'text-osmak-green' : 'text-gray-700'}`}>{m.title}</p>
                                                <p className="text-[9px] text-gray-400 uppercase font-bold">{m.section}</p>
                                            </div>
                                        </button>
                                    );
                                })}
                            </div>
                        </section>
                    </div>

                    {/* Right Side: Employees */}
                    <div className="space-y-6">
                        <section className="bg-white p-6 rounded-xl border border-gray-200 shadow-sm space-y-4 h-full flex flex-col">
                            <div className="flex justify-between items-center mb-2 shrink-0">
                                <h4 className="text-xs font-black uppercase text-gray-400 tracking-widest">Select Employees</h4>
                                <span className="text-[10px] font-bold bg-blue-100 text-blue-700 px-2 py-0.5 rounded">{(formData.employeeHospitalNumbers || []).length} selected</span>
                            </div>
                            <div className="relative mb-3 shrink-0">
                                <Search size={14} className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
                                <input 
                                    type="text" 
                                    placeholder="Search by name, ID, role, or reg date..."
                                    value={userSearch}
                                    onChange={(e) => setUserSearch(e.target.value)}
                                    className="w-full pl-9 pr-4 py-2 border border-gray-100 rounded-lg text-xs bg-gray-50 text-black focus:ring-2 focus:ring-osmak-green outline-none"
                                />
                            </div>
                            <div className="flex-1 overflow-y-auto custom-scrollbar space-y-1 pr-2">
                                {filteredUsersForSelection.map(u => {
                                    const isSelected = formData.employeeHospitalNumbers?.includes(u.hospitalNumber);
                                    return (
                                        <button 
                                            key={u.hospitalNumber} 
                                            onClick={() => toggleUser(u.hospitalNumber)}
                                            className={`w-full flex items-center justify-between p-2.5 rounded-lg border transition-all group ${isSelected ? 'border-osmak-green bg-green-50 shadow-sm' : 'border-gray-50 hover:bg-gray-100'}`}
                                        >
                                            <div className="flex items-center gap-3">
                                                <div className={`w-4 h-4 rounded border flex items-center justify-center transition-colors ${isSelected ? 'bg-osmak-green border-osmak-green text-white' : 'bg-white border-gray-200'}`}>
                                                    {isSelected && <Check size={10} />}
                                                </div>
                                                <div className="text-left">
                                                    <p className={`text-xs font-bold ${isSelected ? 'text-osmak-green' : 'text-gray-700'}`}>{u.lastName}, {u.firstName}</p>
                                                    <p className="text-[9px] text-gray-400 font-mono">
                                                        {u.hospitalNumber} • {u.role}
                                                        {u.registrationDate && ` • Joined: ${u.registrationDate}`}
                                                    </p>
                                                </div>
                                            </div>
                                        </button>
                                    );
                                })}
                            </div>
                        </section>
                    </div>
                </div>
            </div>

            <div className="bg-white border-t p-6 flex justify-between items-center shrink-0">
               <div className="flex gap-2 text-blue-600 bg-blue-50 px-4 py-2 rounded-lg text-xs font-medium border border-blue-100">
                  <Info size={16} />
                  <span>These employees will be monitored specifically for the selected modules.</span>
               </div>
               <div className="flex gap-4">
                  <button onClick={() => setIsModalOpen(false)} className="px-6 py-2.5 text-gray-600 font-bold hover:bg-gray-100 rounded-lg">Cancel</button>
                  <button 
                    onClick={handleSave} 
                    disabled={isProcessing}
                    className="px-10 py-2.5 bg-osmak-green hover:bg-osmak-green-dark text-white rounded-lg font-bold shadow-lg flex items-center gap-2 disabled:opacity-50"
                  >
                    {isProcessing ? <Loader2 size={18} className="animate-spin" /> : <Save size={18} />}
                    {isProcessing ? 'Saving Session...' : 'Save Session'}
                  </button>
               </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default SessionManager;
