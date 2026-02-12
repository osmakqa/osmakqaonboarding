
import React, { useState, useMemo, useEffect } from 'react';
import { UserProfile, RegistrationData, UserRole, OrganizationalStructure, Module, Question } from '../types';
import { ORGANIZATIONAL_STRUCTURE, PASSING_SCORE } from '../constants';
import { Search, UserPlus, CheckCircle, XCircle, FileText, User, Filter, RefreshCw, BarChart3, Users, Loader2, Pencil, Save, Trash2, ShieldCheck, HelpCircle, History, Trophy, ChevronDown, ChevronUp, Calendar, Clock, Info, AlertCircle, ArrowRight, X } from 'lucide-react';

interface AdminDashboardProps {
  users: UserProfile[];
  modules: Module[];
  onRegisterUser: (data: RegistrationData) => void;
  onUpdateUser: (hospitalNumber: string, data: RegistrationData) => void;
  onDeleteUser: (hospitalNumber: string) => void;
  isLoading?: boolean;
}

const REGISTRATION_ROLES: UserRole[] = [
    'QA Admin',
    'Head / Assistant Head',
    'Doctor',
    'Nurse',
    'Nurse (High-risk Area)',
    'Other Clinical (Med Tech, Rad Tech, etc)',
    'Medical Intern',
    'Non-clinical',
  ];

const AdminDashboard: React.FC<AdminDashboardProps> = ({ users, modules, onRegisterUser, onUpdateUser, onDeleteUser, isLoading = false }) => {
  const [searchTerm, setSearchTerm] = useState('');
  const [filterDivision, setFilterDivision] = useState('');
  const [filterDept, setFilterDept] = useState('');
  const [filterRole, setFilterRole] = useState('');
  
  const [showRegisterModal, setShowRegisterModal] = useState(false);
  
  // Use hospital number to track selection to ensure the UI always uses the latest data from props
  const [selectedHospitalNumber, setSelectedHospitalNumber] = useState<string | null>(null);
  
  const [editingUser, setEditingUser] = useState<UserProfile | null>(null);
  const [editFormData, setEditFormData] = useState<RegistrationData | null>(null);
  
  // State for expanded module view in the modal
  const [expandedModuleId, setExpandedModuleId] = useState<string | null>(null);
  const [expandedHistoryIdx, setExpandedHistoryIdx] = useState<number | null>(null);

  // Deletion State
  const [userToDelete, setUserToDelete] = useState<UserProfile | null>(null);
  const [deletePassword, setDeletePassword] = useState('');
  const [deleteError, setDeleteError] = useState('');

  // Memoize active user to ensure reactivity when 'users' prop updates
  const activeUser = useMemo(() => {
    if (!selectedHospitalNumber) return null;
    return users.find(u => u.hospitalNumber === selectedHospitalNumber) || null;
  }, [users, selectedHospitalNumber]);

  // --- Registration Form State ---
  const [regData, setRegData] = useState<RegistrationData>({
      firstName: '', lastName: '', middleInitial: '', birthday: '',
      hospitalNumber: '', plantillaPosition: '', role: '', division: '', departmentOrSection: ''
  });
  
  // --- Form Handlers ---
  const handleRegChange = (field: keyof RegistrationData, value: string) => {
    setRegData(prev => ({
      ...prev, [field]: value,
      ...(field === 'division' ? { departmentOrSection: '' } : {})
    }));
  };

  const handleRegisterSubmit = (e: React.FormEvent) => {
      e.preventDefault();
      if (users.some(u => u.hospitalNumber === regData.hospitalNumber)) {
          alert("Hospital Number already exists."); return;
      }
      onRegisterUser(regData);
      setShowRegisterModal(false);
      setRegData({ firstName: '', lastName: '', middleInitial: '', birthday: '', hospitalNumber: '', plantillaPosition: '', role: '', division: '', departmentOrSection: '' });
  };

  useEffect(() => {
    if (editingUser) {
      setEditFormData(editingUser);
    } else {
      setEditFormData(null);
    }
  }, [editingUser]);

  const handleEditFormChange = (field: keyof RegistrationData, value: string) => {
    if (editFormData) {
        setEditFormData(prev => ({ ...prev!, [field]: value, ...(field === 'division' ? { departmentOrSection: '' } : {})}));
    }
  };

  const handleUpdateSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (editingUser && editFormData) {
        onUpdateUser(editingUser.hospitalNumber, editFormData);
        setEditingUser(null);
    }
  };

  const handleDeleteConfirm = () => {
    if (deletePassword !== 'osmak123') {
        setDeleteError('Incorrect password.');
        return;
    }
    if (userToDelete) {
        onDeleteUser(userToDelete.hospitalNumber);
        setUserToDelete(null);
        setDeletePassword('');
        setDeleteError('');
    }
  };
  
  const clearFilters = () => {
    setSearchTerm(''); setFilterDivision(''); setFilterDept(''); setFilterRole('');
  };

  const filteredUsers = useMemo(() => {
    return users.filter(user => {
      const matchesSearch = user.lastName.toLowerCase().includes(searchTerm.toLowerCase()) || user.firstName.toLowerCase().includes(searchTerm.toLowerCase()) || user.hospitalNumber.includes(searchTerm);
      const matchesDivision = filterDivision ? user.division === filterDivision : true;
      const matchesDept = filterDept ? user.departmentOrSection === filterDept : true;
      const matchesRole = filterRole ? user.role === filterRole : true;
      return matchesSearch && matchesDivision && matchesDept && matchesRole;
    });
  }, [users, searchTerm, filterDivision, filterDept, filterRole]);

  const availableDepts = filterDivision ? ORGANIZATIONAL_STRUCTURE[filterDivision] || [] : [];

  const getAccessibleModulesForUser = (user: UserProfile) => {
    const effectiveRole = user.role;
    if (effectiveRole === 'QA Admin' || effectiveRole === 'Head / Assistant Head') return modules;
    return modules.filter(m => {
      if (m.allowedRoles && m.allowedRoles.length > 0) return m.allowedRoles.includes(effectiveRole as UserRole);
      const clinicalRoles: UserRole[] = ['Doctor', 'Nurse', 'Nurse (High-risk Area)', 'Other Clinical (Med Tech, Rad Tech, etc)'];
      return clinicalRoles.includes(effectiveRole as UserRole);
    });
  };

  const getUserProgress = (user: UserProfile) => {
    const accessibleModules = getAccessibleModulesForUser(user);
    const total = accessibleModules.length;
    const completed = accessibleModules.filter(m => user.progress?.[m.id]?.isCompleted).length;
    const percentage = total > 0 ? Math.round((completed / total) * 100) : 0;
    return { completed, total, percentage };
  };

  const aggregateStats = useMemo(() => {
    if (filteredUsers.length === 0) return { average: 0 };
    const totalPercentage = filteredUsers.reduce((sum, user) => sum + getUserProgress(user).percentage, 0);
    return { average: Math.round(totalPercentage / filteredUsers.length) };
  }, [filteredUsers, modules]);

  const getModulesBySectionForUser = (user: UserProfile) => {
    const accessible = getAccessibleModulesForUser(user);
    const groups: Record<string, Module[]> = {};
    accessible.forEach(m => {
      if (!groups[m.section]) groups[m.section] = [];
      groups[m.section].push(m);
    });
    return groups;
  };

  const handleModuleClick = (moduleId: string) => {
    setExpandedModuleId(expandedModuleId === moduleId ? null : moduleId);
    setExpandedHistoryIdx(null); // Reset history expansion when switching modules
  };

  return (
    <div className="space-y-6">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 animate-fadeIn">
         <div className="bg-white p-5 rounded-lg shadow-sm border border-gray-200 flex items-center justify-between transition-all hover:border-osmak-green/30">
            <div className="flex items-center gap-4">
               <div className="p-3 bg-blue-100 text-blue-600 rounded-full"><Users size={24} /></div>
               <div>
                  <p className="text-xs font-bold text-gray-500 uppercase tracking-wider">Filtered Employees</p>
                  <p className="text-2xl font-bold text-gray-900">{filteredUsers.length}</p>
               </div>
            </div>
            {users.length > 0 && <div className="text-right text-xs text-gray-400">of {users.length} total</div>}
         </div>
         <div className="bg-white p-5 rounded-lg shadow-sm border border-gray-200 flex items-center gap-4 relative overflow-hidden transition-all hover:border-osmak-green/30">
            <div className="absolute right-0 top-0 bottom-0 w-2 bg-gray-100"><div className="bg-osmak-green w-full transition-all duration-700" style={{ height: `${aggregateStats.average}%`, marginTop: `${100 - aggregateStats.average}%` }}></div></div>
            <div className="p-3 bg-green-100 text-green-600 rounded-full z-10"><BarChart3 size={24} /></div>
            <div className="z-10">
               <p className="text-xs font-bold text-gray-500 uppercase tracking-wider">Group Completion Avg.</p>
               <div className="flex items-baseline gap-2"><p className="text-2xl font-bold text-gray-900">{aggregateStats.average}%</p><span className="text-xs text-gray-400 font-medium">overall progress</span></div>
            </div>
         </div>
      </div>

      <div className="bg-white p-4 rounded-xl shadow-sm border border-gray-200">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-6 gap-3 items-center">
            <div className="relative w-full lg:col-span-2"><Search className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" size={16} /><input type="text" placeholder="Search name or ID..." className="pl-9 pr-4 py-2 bg-white text-black border border-gray-300 rounded-lg text-sm w-full focus:ring-2 focus:ring-osmak-green focus:border-osmak-green placeholder-gray-400" value={searchTerm} onChange={(e) => setSearchTerm(e.target.value)} /></div>
            <select className="w-full py-2 px-3 bg-white text-black border border-gray-300 rounded-lg text-sm focus:ring-2 focus:ring-osmak-green focus:border-osmak-green" value={filterDivision} onChange={(e) => { setFilterDivision(e.target.value); setFilterDept(''); }}><option value="">All Divisions</option>{Object.keys(ORGANIZATIONAL_STRUCTURE).map(d => <option key={d} value={d}>{d}</option>)}</select>
            <select className="w-full py-2 px-3 bg-white text-black border border-gray-300 rounded-lg text-sm focus:ring-2 focus:ring-osmak-green focus:border-osmak-green disabled:opacity-50 disabled:bg-gray-100" value={filterDept} onChange={(e) => setFilterDept(e.target.value)} disabled={!filterDivision}><option value="">All Departments</option>{availableDepts.map(d => <option key={d} value={d}>{d}</option>)}</select>
            <select className="w-full py-2 px-3 bg-white text-black border border-gray-300 rounded-lg text-sm focus:ring-2 focus:ring-osmak-green focus:border-osmak-green" value={filterRole} onChange={(e) => setFilterRole(e.target.value)}><option value="">All Roles</option>{REGISTRATION_ROLES.map(r => <option key={r} value={r}>{r}</option>)}</select>
            <div className="flex gap-2"><button onClick={clearFilters} title="Clear Filters" className="flex items-center justify-center p-2 bg-white text-black rounded-lg hover:bg-gray-50 transition-colors border border-gray-300"><RefreshCw size={18} /></button><button onClick={() => setShowRegisterModal(true)} className="flex-1 flex items-center justify-center gap-2 px-3 py-2 bg-osmak-green text-white rounded-lg hover:bg-osmak-green-dark transition-colors font-bold shadow-sm whitespace-nowrap"><UserPlus size={18} /> Register</button></div>
        </div>
      </div>

      <div className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden">
         <div className="overflow-x-auto">
             <table className="w-full text-sm text-left">
                 <thead className="bg-gray-50 text-gray-700 uppercase font-black text-[10px] tracking-widest border-b">
                     <tr><th className="px-6 py-5">Employee</th><th className="px-6 py-5">Hospital ID</th><th className="px-6 py-5">Role & Position</th><th className="px-6 py-5">Division / Dept</th><th className="px-6 py-5 text-center">Completion</th><th className="px-6 py-5 text-center">Status</th><th className="px-6 py-5 text-center">Actions</th></tr>
                 </thead>
                 <tbody className="divide-y divide-gray-100">
                     {filteredUsers.length > 0 ? filteredUsers.map((user) => {
                         const stats = getUserProgress(user);
                         return (
                             <tr key={user.hospitalNumber} className="hover:bg-blue-50/50 transition-colors cursor-pointer group" onClick={() => setSelectedHospitalNumber(user.hospitalNumber)}>
                                 <td className="px-6 py-5">
                                    <div className="font-bold text-gray-900 group-hover:text-osmak-green transition-colors">{user.lastName}, {user.firstName} {user.middleInitial}.</div>
                                    <div className="text-[10px] text-gray-400 font-bold uppercase mt-0.5">{user.division}</div>
                                 </td>
                                 <td className="px-6 py-5 text-gray-500 font-mono text-xs">{user.hospitalNumber}</td>
                                 <td className="px-6 py-5"><div className="font-bold text-gray-700 text-xs">{user.role}</div><div className="text-[10px] text-gray-400 mt-0.5">{user.plantillaPosition}</div></td>
                                 <td className="px-6 py-5"><div className="text-gray-700 text-xs">{user.departmentOrSection}</div></td>
                                 <td className="px-6 py-5 text-center"><div className="flex flex-col items-center"><span className="font-black text-sm text-osmak-green">{stats.completed}/{stats.total}</span><div className="w-20 bg-gray-100 h-1 rounded-full mt-1.5 overflow-hidden"><div className="bg-osmak-green h-full transition-all duration-700" style={{ width: `${stats.percentage}%` }}></div></div></div></td>
                                 <td className="px-6 py-5 text-center">{stats.percentage >= 100 && stats.total > 0 ? <span className="inline-flex items-center gap-1 px-2.5 py-1 bg-green-100 text-green-700 rounded-full text-[10px] font-black uppercase"><CheckCircle size={10} /> Finished</span> : <span className="inline-flex items-center gap-1 px-2.5 py-1 bg-yellow-100 text-yellow-700 rounded-full text-[10px] font-black uppercase">In Progress</span>}</td>
                                 <td className="px-6 py-5 text-center whitespace-nowrap"><button onClick={(e) => { e.stopPropagation(); setEditingUser(user); }} className="p-2 text-gray-400 hover:text-osmak-green hover:bg-green-50 rounded-full transition-all" title="Edit Employee"><Pencil size={16} /></button><button onClick={(e) => { e.stopPropagation(); setUserToDelete(user); }} className="p-2 text-gray-400 hover:text-red-600 hover:bg-red-50 rounded-full transition-all" title="Delete Employee"><Trash2 size={16} /></button></td>
                             </tr>
                         );
                     }) : (<tr><td colSpan={7} className="px-6 py-12 text-center text-gray-400 italic">No employees found matching the current search criteria.</td></tr>)}
                 </tbody>
             </table>
         </div>
      </div>

      {activeUser && (
        <div className="fixed inset-0 z-[250] bg-black/60 flex items-center justify-center p-4 backdrop-blur-sm animate-fadeIn">
            <div className="bg-white rounded-2xl shadow-2xl max-w-5xl w-full overflow-hidden flex flex-col max-h-[90vh]">
                 <div className="bg-gray-800 text-white p-6 flex justify-between items-start shrink-0">
                      <div><h2 className="text-2xl font-black flex items-center gap-3"><User size={28} className="text-osmak-green" />{activeUser.lastName}, {activeUser.firstName} {activeUser.middleInitial}</h2><div className="flex flex-wrap gap-x-6 gap-y-1 mt-2 text-sm opacity-90 font-bold"><span className="bg-osmak-green px-2 py-0.5 rounded text-[10px] uppercase font-black tracking-widest">{activeUser.role}</span><span>ID: <span className="font-mono">{activeUser.hospitalNumber}</span></span><span>{activeUser.plantillaPosition}</span></div><div className="mt-1 text-xs opacity-60 font-medium">{activeUser.division} &bull; {activeUser.departmentOrSection}</div></div>
                      <button onClick={() => setSelectedHospitalNumber(null)} className="hover:text-red-400 transition-colors p-2 rounded-full hover:bg-white/10"><X size={28} /></button>
                  </div>
                  <div className="p-6 overflow-y-auto custom-scrollbar flex-1 bg-gray-50 space-y-6">
                    <div className="grid grid-cols-1 gap-6">
                        {Object.entries(getModulesBySectionForUser(activeUser)).sort((a,b) => a[0].localeCompare(b[0])).map(([section, userModules]) => (
                            <div key={section} className="bg-white rounded-xl border border-gray-200 shadow-sm overflow-hidden">
                                <div className="bg-gray-100/50 px-5 py-3 border-b border-gray-200 font-black text-gray-500 text-[10px] uppercase tracking-widest">{section}</div>
                                <div className="divide-y divide-gray-100">
                                    {userModules.map(module => {
                                        const progress = activeUser.progress?.[module.id];
                                        const isCompleted = progress?.isCompleted;
                                        const score = progress?.highScore || 0;
                                        const attempts = progress?.attempts || [];
                                        const isExpanded = expandedModuleId === module.id;
                                        
                                        // "the assessment history should read from lastAttemptAnswers from the database"
                                        const lastAnswers = progress?.lastAttemptAnswers;
                                        const lastAttemptFromHistory = attempts.length > 0 ? attempts[attempts.length - 1] : null;

                                        return (
                                            <div key={module.id} className="flex flex-col transition-colors">
                                                <button 
                                                    onClick={() => handleModuleClick(module.id)}
                                                    className={`p-5 flex items-center justify-between text-left transition-all ${isExpanded ? 'bg-blue-50/50' : 'hover:bg-gray-50'}`}
                                                >
                                                    <div className="flex items-center gap-5">
                                                        <div className={`w-12 h-12 rounded-xl flex items-center justify-center shrink-0 shadow-sm transition-all ${isCompleted ? 'bg-green-100 text-green-600' : 'bg-gray-100 text-gray-400'}`}>{isCompleted ? <CheckCircle size={24}/> : <FileText size={24} />}</div>
                                                        <div>
                                                            <div className="font-bold text-gray-900 text-base">{module.title}</div>
                                                            <div className="text-[10px] text-gray-500 flex items-center gap-3 mt-1 font-bold">
                                                                <span className="flex items-center gap-1"><Trophy size={12}/> Best: {score}%</span>
                                                                <span className="flex items-center gap-1"><History size={12}/> Attempts: {attempts.length}</span>
                                                            </div>
                                                        </div>
                                                    </div>
                                                    <div className="flex items-center gap-4">
                                                         {isCompleted ? <span className="bg-green-100 text-green-700 px-3 py-1 rounded-full text-[10px] font-black uppercase">Success</span> : <span className="bg-gray-100 text-gray-400 px-3 py-1 rounded-full text-[10px] font-black uppercase">Incomplete</span>}
                                                         <div className={`transition-transform duration-300 ${isExpanded ? 'rotate-180' : ''}`}><ChevronDown size={20} className="text-gray-400" /></div>
                                                    </div>
                                                </button>

                                                {isExpanded && (
                                                    <div className="bg-white border-t border-gray-100 p-6 animate-fadeIn space-y-6">
                                                        {lastAnswers ? (
                                                            <div className="space-y-6">
                                                                {/* Summary Header for Latest Answers */}
                                                                <div className="bg-blue-50/50 rounded-xl p-5 border border-blue-100/50">
                                                                    <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                                                                        <div className="flex items-center gap-4">
                                                                            <div className="p-3 rounded-full bg-blue-100 text-blue-600">
                                                                                <FileText size={24}/>
                                                                            </div>
                                                                            <div>
                                                                                <h5 className="text-sm font-black text-gray-800 uppercase tracking-tight flex items-center gap-2">Latest Assessment Breakdown</h5>
                                                                                <p className="text-xs text-gray-500 font-bold flex items-center gap-1.5 mt-0.5">
                                                                                    <Clock size={12}/> Showing data from: <span className="text-blue-700">lastAttemptAnswers</span>
                                                                                </p>
                                                                            </div>
                                                                        </div>
                                                                        <div className="text-right">
                                                                            <div className="text-[10px] font-black uppercase text-gray-400 tracking-tighter mb-1">Module High Score</div>
                                                                            <div className={`text-2xl font-black ${score >= PASSING_SCORE ? 'text-green-700' : 'text-red-700'}`}>{score}%</div>
                                                                        </div>
                                                                    </div>
                                                                </div>

                                                                {/* Question Breakdown using lastAttemptAnswers */}
                                                                <div className="space-y-4">
                                                                    <h6 className="text-[10px] font-black text-gray-400 uppercase tracking-widest flex items-center gap-2 px-1"><Info size={12}/> Last Recorded Responses</h6>
                                                                    <div className="grid grid-cols-1 gap-4">
                                                                        {module.questions && module.questions.length > 0 ? (
                                                                            module.questions.map((q, qIdx) => {
                                                                                const userAnswerIndex = lastAnswers[q.id];
                                                                                const isCorrect = userAnswerIndex === q.correctAnswerIndex;
                                                                                
                                                                                return (
                                                                                    <div key={q.id} className="bg-gray-50/30 p-4 rounded-xl border border-gray-100 shadow-sm space-y-3">
                                                                                        <div className="flex justify-between items-start gap-4">
                                                                                            <p className="text-sm font-bold text-gray-800 leading-snug">
                                                                                                <span className="text-gray-400 mr-2 font-mono">Q{qIdx+1}.</span> {q.text}
                                                                                            </p>
                                                                                            {userAnswerIndex !== undefined ? (
                                                                                                <span className={`text-[10px] font-black uppercase px-2.5 py-1 rounded-full whitespace-nowrap shadow-sm ${isCorrect ? 'bg-green-100 text-green-700 border border-green-200' : 'bg-red-100 text-red-700 border border-red-200'}`}>
                                                                                                    {isCorrect ? 'Correct' : 'Incorrect'}
                                                                                                </span>
                                                                                            ) : (
                                                                                                <span className="text-[10px] font-black uppercase px-2.5 py-1 rounded-full whitespace-nowrap shadow-sm bg-gray-100 text-gray-400 border border-gray-200">
                                                                                                    Unanswered
                                                                                                </span>
                                                                                            )}
                                                                                        </div>
                                                                                        <div className="grid grid-cols-1 md:grid-cols-2 gap-2">
                                                                                            {q.options.map((opt, oIdx) => {
                                                                                                const isSelected = userAnswerIndex === oIdx;
                                                                                                const isRight = q.correctAnswerIndex === oIdx;
                                                                                                
                                                                                                let stateStyles = "border-gray-200 text-gray-500 opacity-60";
                                                                                                let Icon = null;
                                                                                                
                                                                                                if (isSelected && isRight) {
                                                                                                    stateStyles = "bg-green-50 border-green-200 text-green-800 font-bold opacity-100 ring-1 ring-green-200 shadow-sm";
                                                                                                    Icon = <CheckCircle size={14} className="text-green-600 shrink-0" />;
                                                                                                } else if (isSelected && !isRight) {
                                                                                                    stateStyles = "bg-red-50 border-red-200 text-red-800 font-bold opacity-100 ring-1 ring-red-200 shadow-sm";
                                                                                                    Icon = <XCircle size={14} className="text-red-600 shrink-0" />;
                                                                                                } else if (isRight) {
                                                                                                    stateStyles = "bg-blue-50/40 border-blue-100 text-blue-700 font-medium opacity-100";
                                                                                                    Icon = <Info size={14} className="text-blue-400 shrink-0" />;
                                                                                                }

                                                                                                return (
                                                                                                    <div key={oIdx} className={`text-[11px] p-3 rounded-lg border flex items-center gap-3 transition-all ${stateStyles}`}>
                                                                                                        {Icon}
                                                                                                        <span className="flex-1">{opt}</span>
                                                                                                        {isSelected && <span className="text-[8px] font-black uppercase tracking-widest opacity-40 px-1.5 py-0.5 bg-black/5 rounded">Chosen</span>}
                                                                                                    </div>
                                                                                                );
                                                                                            })}
                                                                                        </div>
                                                                                    </div>
                                                                                );
                                                                            })
                                                                        ) : (
                                                                            <div className="p-8 text-center bg-gray-50 rounded-xl border-2 border-dashed border-gray-100">
                                                                                <AlertCircle size={32} className="mx-auto text-gray-300 mb-2" />
                                                                                <p className="text-xs text-gray-400 italic">This module does not have question-level records available.</p>
                                                                            </div>
                                                                        )}
                                                                    </div>
                                                                </div>

                                                                {/* Comprehensive History List */}
                                                                {attempts.length > 0 && (
                                                                    <div className="pt-6 border-t border-gray-100">
                                                                        <div className="flex items-center gap-3 mb-4">
                                                                            <History size={16} className="text-gray-400" />
                                                                            <h6 className="text-[10px] font-black text-gray-400 uppercase tracking-widest">Historical Attempts ({attempts.length})</h6>
                                                                        </div>
                                                                        <div className="space-y-2">
                                                                            {attempts.slice().reverse().map((att, rIdx) => {
                                                                                const originalIdx = (attempts.length - 1) - rIdx;
                                                                                const isHistoryExpanded = expandedHistoryIdx === originalIdx;
                                                                                return (
                                                                                    <div key={originalIdx} className="border rounded-xl overflow-hidden transition-all shadow-sm">
                                                                                        <button 
                                                                                            onClick={() => setExpandedHistoryIdx(isHistoryExpanded ? null : originalIdx)}
                                                                                            className={`w-full p-4 flex justify-between items-center text-left hover:bg-gray-50 transition-colors ${isHistoryExpanded ? 'bg-gray-50' : ''}`}
                                                                                        >
                                                                                            <div className="flex items-center gap-3">
                                                                                                <div className={`p-1.5 rounded-full ${att.score >= PASSING_SCORE ? 'bg-green-100 text-green-600' : 'bg-red-100 text-red-600'}`}>
                                                                                                    {att.score >= PASSING_SCORE ? <CheckCircle size={14}/> : <XCircle size={14}/>}
                                                                                                </div>
                                                                                                <div>
                                                                                                    <div className="text-xs font-bold text-gray-800">Assessment on {new Date(att.date).toLocaleDateString()}</div>
                                                                                                    <div className="text-[10px] text-gray-400 font-bold uppercase tracking-tight">{new Date(att.date).toLocaleTimeString([], {hour: '2-digit', minute:'2-digit'})}</div>
                                                                                                </div>
                                                                                            </div>
                                                                                            <div className="flex items-center gap-4">
                                                                                                <span className={`text-sm font-black ${att.score >= PASSING_SCORE ? 'text-green-700' : 'text-red-700'}`}>{att.score}%</span>
                                                                                                {isHistoryExpanded ? <ChevronUp size={16} className="text-gray-400"/> : <ChevronDown size={16} className="text-gray-400"/>}
                                                                                            </div>
                                                                                        </button>
                                                                                        {isHistoryExpanded && (
                                                                                            <div className="p-4 bg-gray-50/50 border-t space-y-4">
                                                                                                {module.questions?.map((q, qIdx) => {
                                                                                                    const hAnswer = att.answers?.[q.id];
                                                                                                    const hCorrect = hAnswer === q.correctAnswerIndex;
                                                                                                    return (
                                                                                                        <div key={q.id} className="text-[11px] p-3 bg-white rounded-lg border border-gray-100">
                                                                                                            <div className="flex justify-between items-center mb-2">
                                                                                                                <p className="font-bold text-gray-700">Q{qIdx+1}. {q.text}</p>
                                                                                                                <span className={`text-[9px] font-black uppercase ${hCorrect ? 'text-green-600' : 'text-red-600'}`}>
                                                                                                                    {hCorrect ? 'Correct' : 'Incorrect'}
                                                                                                                </span>
                                                                                                            </div>
                                                                                                            <div className="text-[10px] text-gray-400 italic">
                                                                                                                Answered: {hAnswer !== undefined ? q.options[hAnswer] : 'No recorded answer'}
                                                                                                            </div>
                                                                                                        </div>
                                                                                                    );
                                                                                                })}
                                                                                            </div>
                                                                                        )}
                                                                                    </div>
                                                                                );
                                                                            })}
                                                                        </div>
                                                                    </div>
                                                                )}
                                                            </div>
                                                        ) : (
                                                            <div className="py-12 flex flex-col items-center justify-center text-gray-400 border-2 border-dashed border-gray-100 rounded-2xl">
                                                                <AlertCircle size={40} className="mb-3 opacity-20" />
                                                                <p className="text-sm font-bold opacity-70">No Assessment Records Found</p>
                                                                <p className="text-[10px] font-medium uppercase tracking-widest mt-1 opacity-50">lastAttemptAnswers is empty for this module</p>
                                                            </div>
                                                        )}
                                                    </div>
                                                )}
                                            </div>
                                        )
                                    })}
                                </div>
                            </div>
                        ))}
                    </div>
                  </div>
                  <div className="p-5 bg-white border-t border-gray-200 text-right shrink-0"><button onClick={() => setSelectedHospitalNumber(null)} className="px-8 py-2.5 bg-gray-100 hover:bg-gray-200 text-gray-800 rounded-xl font-black text-xs uppercase tracking-widest transition-all">Close Profile</button></div>
            </div>
        </div>
      )}

      {/* Delete Confirmation Modal */}
      {userToDelete && (
          <div className="fixed inset-0 z-[350] bg-black/70 flex items-center justify-center p-4 backdrop-blur-md">
              <div className="bg-white rounded-2xl shadow-2xl max-w-md w-full p-8 space-y-6">
                  <div className="flex flex-col items-center text-center space-y-4">
                      <div className="p-5 bg-red-100 text-red-600 rounded-full ring-8 ring-red-50">
                          <Trash2 size={40} />
                      </div>
                      <div>
                          <h3 className="text-xl font-black text-gray-900 uppercase tracking-tight">Security Confirmation</h3>
                          <p className="text-gray-500 mt-2 font-medium">You are about to delete <b>{userToDelete.firstName} {userToDelete.lastName}</b>'s profile. All progress and history will be lost.</p>
                      </div>
                  </div>
                  
                  <div className="space-y-4">
                      <div>
                          <label className="block text-[10px] font-black text-gray-400 uppercase tracking-widest mb-1.5 px-1">Master Password</label>
                          <input 
                              type="password" 
                              value={deletePassword}
                              onChange={e => setDeletePassword(e.target.value)}
                              className="w-full px-4 py-3 border rounded-xl bg-gray-50 focus:ring-2 focus:ring-red-500 outline-none text-center font-bold"
                              placeholder="Enter security key"
                          />
                          {deleteError && <p className="text-red-500 text-[10px] mt-2 font-black text-center uppercase tracking-widest animate-pulse">{deleteError}</p>}
                      </div>
                      
                      <div className="flex gap-3">
                          <button onClick={() => setUserToDelete(null)} className="flex-1 py-3 bg-gray-100 hover:bg-gray-200 text-gray-700 font-bold rounded-xl transition-all">Go Back</button>
                          <button onClick={handleDeleteConfirm} className="flex-1 py-3 bg-red-600 hover:bg-red-700 text-white font-bold rounded-xl shadow-lg shadow-red-200 transition-all">Confirm Delete</button>
                      </div>
                  </div>
              </div>
          </div>
      )}
    </div>
  );
};

export default AdminDashboard;
