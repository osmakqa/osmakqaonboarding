
import React, { useState, useMemo, useEffect } from 'react';
import { UserProfile, RegistrationData, UserRole, OrganizationalStructure, Module } from '../types';
import { ORGANIZATIONAL_STRUCTURE, PASSING_SCORE } from '../constants';
import { Search, UserPlus, CheckCircle, XCircle, FileText, User, Filter, RefreshCw, BarChart3, Users, Loader2, Pencil, Save, Trash2, ShieldCheck, HelpCircle } from 'lucide-react';

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
  const [selectedUser, setSelectedUser] = useState<UserProfile | null>(null);
  const [editingUser, setEditingUser] = useState<UserProfile | null>(null);
  const [editFormData, setEditFormData] = useState<RegistrationData | null>(null);
  
  // Deletion State
  const [userToDelete, setUserToDelete] = useState<UserProfile | null>(null);
  const [deletePassword, setDeletePassword] = useState('');
  const [deleteError, setDeleteError] = useState('');

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

  // Logic to determine which modules are accessible to a specific user role
  const getAccessibleModulesForUser = (user: UserProfile) => {
    const effectiveRole = user.role;
    
    // RBAC logic mirrored from App.tsx
    if (effectiveRole === 'QA Admin' || effectiveRole === 'Head / Assistant Head') {
      return modules;
    }

    return modules.filter(m => {
      if (m.allowedRoles && m.allowedRoles.length > 0) {
        return m.allowedRoles.includes(effectiveRole as UserRole);
      }
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

  // Grouping logic for the detailed view
  const getModulesBySectionForUser = (user: UserProfile) => {
    const accessible = getAccessibleModulesForUser(user);
    const groups: Record<string, Module[]> = {};
    accessible.forEach(m => {
      if (!groups[m.section]) groups[m.section] = [];
      groups[m.section].push(m);
    });
    return groups;
  };

  return (
    <div className="space-y-6">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 animate-fadeIn">
         <div className="bg-white p-5 rounded-lg shadow-sm border border-gray-200 flex items-center justify-between">
            <div className="flex items-center gap-4">
               <div className="p-3 bg-blue-100 text-blue-600 rounded-full"><Users size={24} /></div>
               <div>
                  <p className="text-xs font-bold text-gray-500 uppercase tracking-wider">Filtered Employees</p>
                  <p className="text-2xl font-bold text-gray-900">{filteredUsers.length}</p>
               </div>
            </div>
            {users.length > 0 && <div className="text-right text-xs text-gray-400">of {users.length} total</div>}
         </div>
         <div className="bg-white p-5 rounded-lg shadow-sm border border-gray-200 flex items-center gap-4 relative overflow-hidden">
            <div className="absolute right-0 top-0 bottom-0 w-2 bg-gray-100">
                <div className="bg-osmak-green w-full transition-all duration-500" style={{ height: `${aggregateStats.average}%`, marginTop: `${100 - aggregateStats.average}%` }}></div>
            </div>
            <div className="p-3 bg-green-100 text-green-600 rounded-full z-10"><BarChart3 size={24} /></div>
            <div className="z-10">
               <p className="text-xs font-bold text-gray-500 uppercase tracking-wider">Group Completion Avg.</p>
               <div className="flex items-baseline gap-2">
                   <p className="text-2xl font-bold text-gray-900">{aggregateStats.average}%</p>
                   <span className="text-xs text-gray-400 font-medium">overall progress</span>
               </div>
            </div>
         </div>
      </div>

      <div className="bg-white p-4 rounded-lg shadow-sm border border-gray-200">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-6 gap-3 items-center">
            <div className="relative w-full lg:col-span-2">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-500" size={16} />
                <input type="text" placeholder="Search name or ID..." className="pl-9 pr-4 py-2 bg-white text-black border border-gray-300 rounded-md text-sm w-full focus:ring-2 focus:ring-osmak-green focus:border-osmak-green placeholder-gray-400" value={searchTerm} onChange={(e) => setSearchTerm(e.target.value)} />
            </div>
            <select className="w-full py-2 px-3 bg-white text-black border border-gray-300 rounded-md text-sm focus:ring-2 focus:ring-osmak-green focus:border-osmak-green" value={filterDivision} onChange={(e) => { setFilterDivision(e.target.value); setFilterDept(''); }}>
                <option value="">All Divisions</option>
                {Object.keys(ORGANIZATIONAL_STRUCTURE).map(d => <option key={d} value={d}>{d}</option>)}
            </select>
            <select className="w-full py-2 px-3 bg-white text-black border border-gray-300 rounded-md text-sm focus:ring-2 focus:ring-osmak-green focus:border-osmak-green disabled:opacity-50 disabled:bg-gray-100" value={filterDept} onChange={(e) => setFilterDept(e.target.value)} disabled={!filterDivision}>
                <option value="">All Departments</option>
                {availableDepts.map(d => <option key={d} value={d}>{d}</option>)}
            </select>
            <select className="w-full py-2 px-3 bg-white text-black border border-gray-300 rounded-md text-sm focus:ring-2 focus:ring-osmak-green focus:border-osmak-green" value={filterRole} onChange={(e) => setFilterRole(e.target.value)}>
                <option value="">All Roles</option>
                {REGISTRATION_ROLES.map(r => <option key={r} value={r}>{r}</option>)}
            </select>
            <div className="flex gap-2">
                 <button onClick={clearFilters} title="Clear Filters" className="flex items-center justify-center p-2 bg-white text-black rounded-md hover:bg-gray-50 transition-colors border border-gray-300"><RefreshCw size={18} /></button>
                 <button onClick={() => setShowRegisterModal(true)} className="flex-1 flex items-center justify-center gap-2 px-3 py-2 bg-osmak-green text-white rounded-md hover:bg-osmak-green-dark transition-colors font-medium shadow-sm whitespace-nowrap"><UserPlus size={18} /> Register</button>
            </div>
        </div>
      </div>

      <div className="bg-white rounded-lg shadow-sm border border-gray-200 overflow-hidden">
         <div className="overflow-x-auto">
             <table className="w-full text-sm text-left">
                 <thead className="bg-gray-50 text-gray-700 uppercase font-bold text-xs">
                     <tr>
                         <th className="px-6 py-4">Employee</th>
                         <th className="px-6 py-4">Hospital ID</th>
                         <th className="px-6 py-4">Role & Position</th>
                         <th className="px-6 py-4">Division / Dept</th>
                         <th className="px-6 py-4 text-center">Modules Completed</th>
                         <th className="px-6 py-4 text-center">Status</th>
                         <th className="px-6 py-4 text-center">Actions</th>
                     </tr>
                 </thead>
                 <tbody className="divide-y divide-gray-100">
                     {filteredUsers.length > 0 ? filteredUsers.map((user) => {
                         const stats = getUserProgress(user);
                         return (
                             <tr key={user.hospitalNumber} className="hover:bg-blue-50 transition-colors cursor-pointer group" onClick={() => setSelectedUser(user)}>
                                 <td className="px-6 py-4 font-medium text-gray-900 group-hover:text-blue-700">{user.lastName}, {user.firstName} {user.middleInitial}.</td>
                                 <td className="px-6 py-4 text-gray-500 font-mono">{user.hospitalNumber}</td>
                                 <td className="px-6 py-4">
                                     <div className="font-semibold text-gray-800">{user.role}</div>
                                     <div className="text-xs text-gray-500">{user.plantillaPosition}</div>
                                 </td>
                                 <td className="px-6 py-4">
                                     <div className="text-gray-800">{user.division}</div>
                                     <div className="text-xs text-gray-500">{user.departmentOrSection}</div>
                                 </td>
                                 <td className="px-6 py-4 text-center">
                                     <div className="flex flex-col items-center">
                                         <span className="font-bold text-lg text-osmak-green">{stats.completed}/{stats.total}</span>
                                         <div className="w-24 bg-gray-200 h-1.5 rounded-full mt-1"><div className="bg-osmak-green h-1.5 rounded-full" style={{ width: `${stats.percentage}%` }}></div></div>
                                     </div>
                                 </td>
                                 <td className="px-6 py-4 text-center">
                                     {stats.percentage >= 100 && stats.total > 0 ? <span className="inline-flex items-center gap-1 px-2 py-1 bg-green-100 text-green-700 rounded-full text-xs font-bold"><CheckCircle size={12} /> Completed</span> : <span className="inline-flex items-center gap-1 px-2 py-1 bg-yellow-100 text-yellow-700 rounded-full text-xs font-bold">In Progress</span>}
                                 </td>
                                 <td className="px-6 py-4 text-center whitespace-nowrap">
                                     <button onClick={(e) => { e.stopPropagation(); setEditingUser(user); }} className="p-2 text-gray-500 hover:text-blue-600 hover:bg-blue-100 rounded-full transition-colors" title="Edit Employee"><Pencil size={16} /></button>
                                     <button onClick={(e) => { e.stopPropagation(); setUserToDelete(user); }} className="p-2 text-gray-500 hover:text-red-600 hover:bg-red-100 rounded-full transition-colors" title="Delete Employee"><Trash2 size={16} /></button>
                                 </td>
                             </tr>
                         );
                     }) : (
                         <tr><td colSpan={7} className="px-6 py-8 text-center text-gray-500">No employees found matching your filters.</td></tr>
                     )}
                 </tbody>
             </table>
         </div>
         <div className="bg-gray-50 px-6 py-3 border-t border-gray-200 text-xs text-gray-500 text-center">Click on a row to view detailed progress and scores.</div>
      </div>

      {selectedUser && (
        <div className="fixed inset-0 z-[250] bg-black/50 flex items-center justify-center p-4 backdrop-blur-sm animate-fadeIn">
            <div className="bg-white rounded-xl shadow-xl max-w-4xl w-full overflow-hidden flex flex-col max-h-[90vh]">
                 <div className="bg-gray-800 text-white p-6 flex justify-between items-start shrink-0">
                      <div>
                        <h2 className="text-2xl font-bold flex items-center gap-2"><User size={24} className="text-osmak-green" />{selectedUser.lastName}, {selectedUser.firstName} {selectedUser.middleInitial}</h2>
                        <div className="flex flex-wrap gap-x-6 gap-y-1 mt-2 text-sm opacity-90">
                           <span className="bg-white/20 px-2 py-0.5 rounded text-xs uppercase font-bold tracking-wider">{selectedUser.role}</span>
                           <span>ID: <span className="font-mono">{selectedUser.hospitalNumber}</span></span>
                           <span>{selectedUser.plantillaPosition}</span>
                        </div>
                         <div className="mt-1 text-xs opacity-75">{selectedUser.division} &bull; {selectedUser.departmentOrSection}</div>
                      </div>
                      <button onClick={() => setSelectedUser(null)} className="hover:text-red-400 transition-colors"><XCircle size={32} /></button>
                  </div>
                  <div className="p-6 overflow-y-auto custom-scrollbar flex-1 bg-gray-50">
                    <div className="space-y-6">
                        {Object.entries(getModulesBySectionForUser(selectedUser)).sort((a,b) => a[0].localeCompare(b[0])).map(([section, userModules]) => (
                            <div key={section} className="bg-white rounded-lg border border-gray-200 shadow-sm overflow-hidden">
                                <div className="bg-gray-100 px-4 py-3 border-b border-gray-200 font-bold text-black text-sm">{section}</div>
                                <div className="divide-y divide-gray-100">
                                    {userModules.map(module => {
                                        const progress = selectedUser.progress?.[module.id];
                                        const isCompleted = progress?.isCompleted;
                                        const score = progress?.highScore || 0;
                                        const passed = score >= PASSING_SCORE;
                                        const userAnswers = progress?.lastAttemptAnswers || {};
                                        
                                        return (
                                            <div key={module.id} className="p-4 hover:bg-gray-50 transition-colors">
                                                <div className="flex items-center justify-between mb-3">
                                                    <div className="flex items-center gap-4">
                                                        <div className={`w-10 h-10 rounded-full flex items-center justify-center shrink-0 ${isCompleted ? 'bg-green-100 text-green-600' : 'bg-gray-100 text-gray-400'}`}>{isCompleted ? <CheckCircle size={20}/> : <FileText size={20} />}</div>
                                                        <div>
                                                            <div className="font-bold text-gray-900 text-sm md:text-base">{module.title}</div>
                                                            <div className="text-xs text-gray-500">{module.topics.slice(0, 2).join(', ')}</div>
                                                        </div>
                                                    </div>
                                                    <div className="flex items-center gap-6 shrink-0 ml-4">
                                                         {isCompleted ? <div className="text-right"><div className="text-[10px] text-gray-500 uppercase font-bold tracking-wider">Score</div><div className={`text-lg font-bold ${passed ? 'text-green-600' : 'text-red-600'}`}>{score}%</div></div> : <div className="px-3 py-1 bg-gray-100 text-gray-500 rounded text-xs font-medium">Not Started</div>}
                                                    </div>
                                                </div>

                                                {isCompleted && module.questions && module.questions.length > 0 && (
                                                    <div className="ml-14 mt-4 bg-white/50 border rounded-lg p-4 text-xs space-y-3">
                                                        <h5 className="font-bold text-gray-400 uppercase tracking-widest flex items-center gap-1.5 mb-2">
                                                            <HelpCircle size={12} /> Detailed Responses
                                                        </h5>
                                                        {module.questions.map((q, idx) => {
                                                            const selectedIdx = userAnswers[q.id];
                                                            const isCorrect = selectedIdx === q.correctAnswerIndex;
                                                            return (
                                                                <div key={q.id} className="border-l-2 pl-3 py-1 border-gray-100">
                                                                    <div className="font-medium text-gray-800 mb-1">{idx + 1}. {q.text}</div>
                                                                    <div className="flex flex-wrap gap-x-4 gap-y-1">
                                                                        <div className="flex items-center gap-1">
                                                                            <span className="text-gray-400">User:</span>
                                                                            <span className={`font-bold ${isCorrect ? 'text-green-600' : 'text-red-600'}`}>
                                                                                {selectedIdx !== undefined ? q.options[selectedIdx] : 'No Answer'}
                                                                            </span>
                                                                        </div>
                                                                        {!isCorrect && (
                                                                            <div className="flex items-center gap-1">
                                                                                <span className="text-gray-400">Correct:</span>
                                                                                <span className="text-green-600 font-medium">{q.options[q.correctAnswerIndex]}</span>
                                                                            </div>
                                                                        )}
                                                                    </div>
                                                                </div>
                                                            );
                                                        })}
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
                  <div className="p-4 bg-white border-t border-gray-200 text-right"><button onClick={() => setSelectedUser(null)} className="px-6 py-2 bg-gray-100 hover:bg-gray-200 text-gray-800 rounded font-medium transition-colors">Close Details</button></div>
            </div>
        </div>
      )}

      {editingUser && editFormData && (
          <div className="fixed inset-0 z-[250] bg-black/50 flex items-center justify-center p-4 backdrop-blur-sm animate-fadeIn">
              <div className="bg-white rounded-xl shadow-xl max-w-lg w-full overflow-hidden flex flex-col max-h-[90vh]">
                  <div className="bg-gray-800 text-white p-4 flex justify-between items-center shrink-0">
                      <h3 className="font-bold text-lg flex items-center gap-2"><Pencil size={20} /> Edit Employee Profile</h3>
                      <button onClick={() => setEditingUser(null)} className="hover:text-gray-300"><XCircle size={24} /></button>
                  </div>
                  <div className="p-6 overflow-y-auto custom-scrollbar">
                      <form onSubmit={handleUpdateSubmit} className="space-y-4">
                           <fieldset disabled={isLoading} className="contents">
                               <div className="grid grid-cols-2 gap-3">
                                   <div><label className="text-xs font-bold block mb-1 text-gray-700">First Name</label><input type="text" required className="w-full p-2 border border-gray-300 rounded text-sm bg-white text-black focus:ring-2 focus:ring-osmak-green focus:border-osmak-green disabled:bg-gray-100" value={editFormData.firstName} onChange={e => handleEditFormChange('firstName', e.target.value)} /></div>
                                   <div><label className="text-xs font-bold block mb-1 text-gray-700">Last Name</label><input type="text" required className="w-full p-2 border border-gray-300 rounded text-sm bg-white text-black focus:ring-2 focus:ring-osmak-green focus:border-osmak-green disabled:bg-gray-100" value={editFormData.lastName} onChange={e => handleEditFormChange('lastName', e.target.value)} /></div>
                               </div>
                               <div className="grid grid-cols-2 gap-3">
                                   <div><label className="text-xs font-bold block mb-1 text-gray-700">Middle Initial</label><input type="text" maxLength={2} className="w-full p-2 border border-gray-300 rounded text-sm bg-white text-black focus:ring-2 focus:ring-osmak-green focus:border-osmak-green disabled:bg-gray-100" value={editFormData.middleInitial} onChange={e => handleEditFormChange('middleInitial', e.target.value)} /></div>
                                   <div><label className="text-xs font-bold block mb-1 text-gray-700">Birthday</label><input type="date" required className="w-full p-2 border border-gray-300 rounded text-sm bg-white text-black focus:ring-2 focus:ring-osmak-green focus:border-osmak-green disabled:bg-gray-100" value={editFormData.birthday} onChange={e => handleEditFormChange('birthday', e.target.value)} /></div>
                               </div>
                               <div className="grid grid-cols-2 gap-3">
                                   <div><label className="text-xs font-bold block mb-1 text-gray-500">Hospital Number (Read-only)</label><input type="text" readOnly disabled className="w-full p-2 border border-gray-300 rounded text-sm bg-gray-200 text-gray-600" value={editFormData.hospitalNumber} /></div>
                                   <div><label className="text-xs font-bold block mb-1 text-gray-700">Plantilla Position</label><input type="text" required className="w-full p-2 border border-gray-300 rounded text-sm bg-white text-black focus:ring-2 focus:ring-osmak-green focus:border-osmak-green disabled:bg-gray-100" value={editFormData.plantillaPosition} onChange={e => handleEditFormChange('plantillaPosition', e.target.value)} /></div>
                               </div>
                               <div><label className="text-xs font-bold block mb-1 text-gray-700">Role</label><select required className="w-full p-2 border border-gray-300 rounded text-sm bg-white text-black focus:ring-2 focus:ring-osmak-green focus:border-osmak-green disabled:bg-gray-100" value={editFormData.role} onChange={e => handleEditFormChange('role', e.target.value)}><option value="" disabled>Select Role</option>{REGISTRATION_ROLES.map(r => <option key={r} value={r}>{r}</option>)}</select></div>
                               <div><label className="text-xs font-bold block mb-1 text-gray-700">Division</label><select required className="w-full p-2 border border-gray-300 rounded text-sm bg-white text-black focus:ring-2 focus:ring-osmak-green focus:border-osmak-green disabled:bg-gray-100" value={editFormData.division} onChange={e => handleEditFormChange('division', e.target.value)}><option value="" disabled>Select Division</option>{Object.keys(ORGANIZATIONAL_STRUCTURE).map(d => <option key={d} value={d}>{d}</option>)}</select></div>
                               {editFormData.division && (ORGANIZATIONAL_STRUCTURE[editFormData.division]||[]).length > 0 && (
                                   <div className="animate-fadeIn"><label className="text-xs font-bold block mb-1 text-gray-700">Department/Section</label><select required className="w-full p-2 border border-gray-300 rounded text-sm bg-white text-black focus:ring-2 focus:ring-osmak-green focus:border-osmak-green disabled:bg-gray-100" value={editFormData.departmentOrSection} onChange={e => handleEditFormChange('departmentOrSection', e.target.value)}><option value="" disabled>Select Dept</option>{(ORGANIZATIONAL_STRUCTURE[editFormData.division] || []).map(d => <option key={d} value={d}>{d}</option>)}</select></div>
                               )}
                           </fieldset>
                           <div className="flex justify-end gap-3 pt-4">
                                <button type="button" onClick={() => setEditingUser(null)} disabled={isLoading} className="px-6 py-2 bg-gray-100 hover:bg-gray-200 text-gray-800 rounded font-medium transition-colors">Cancel</button>
                                <button type="submit" disabled={isLoading} className="px-6 py-2 bg-osmak-green text-white rounded font-bold hover:bg-osmak-green-dark shadow-md transition-colors disabled:opacity-70 flex items-center justify-center gap-2">
                                    {isLoading ? <Loader2 className="animate-spin" size={18} /> : <Save size={16} />}
                                    {isLoading ? 'Saving...' : 'Save Changes'}
                                </button>
                           </div>
                      </form>
                  </div>
              </div>
          </div>
      )}

      {userToDelete && (
        <div className="fixed inset-0 z-[300] bg-black/60 flex items-center justify-center p-4 backdrop-blur-sm animate-fadeIn">
            <div className="bg-white rounded-xl shadow-xl max-md w-full overflow-hidden">
                <div className="bg-red-600 text-white p-4">
                    <h3 className="font-bold text-lg">Confirm Deletion</h3>
                </div>
                <div className="p-6 space-y-4">
                    <p className="text-gray-700">
                        Are you sure you want to permanently delete the profile for <span className="font-bold">{userToDelete.firstName} {userToDelete.lastName}</span>?
                        <br/>
                        <span className="text-red-700 font-semibold">This action cannot be undone.</span>
                    </p>
                    <div>
                        <label className="block text-sm font-bold text-gray-700 mb-1 flex items-center gap-2">
                            <ShieldCheck size={16} className="text-gray-400" />
                            Admin Password
                        </label>
                        <input
                          type="password"
                          value={deletePassword}
                          onChange={(e) => { setDeletePassword(e.target.value); setDeleteError(''); }}
                          placeholder="Enter 'osmak123' to confirm"
                          className={`block w-full px-3 py-2 text-sm rounded-lg border bg-white text-black ${deleteError ? 'border-red-500 ring-red-500' : 'border-gray-300 focus:ring-red-500 focus:border-red-500'}`}
                          autoFocus
                        />
                        {deleteError && <p className="text-xs text-red-600 mt-1">{deleteError}</p>}
                    </div>
                </div>
                <div className="bg-gray-50 p-4 flex justify-end gap-3">
                    <button onClick={() => { setUserToDelete(null); setDeletePassword(''); setDeleteError(''); }} className="px-4 py-2 bg-gray-200 text-gray-800 rounded font-medium hover:bg-gray-300 transition-colors">Cancel</button>
                    <button 
                        onClick={handleDeleteConfirm}
                        disabled={deletePassword !== 'osmak123'}
                        className="px-4 py-2 bg-red-600 text-white rounded font-bold hover:bg-red-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed flex items-center gap-2"
                    >
                        <Trash2 size={16} />
                        Delete Profile
                    </button>
                </div>
            </div>
        </div>
      )}

      {showRegisterModal && (
          <div className="fixed inset-0 z-[250] bg-black/50 flex items-center justify-center p-4 backdrop-blur-sm animate-fadeIn">
              <div className="bg-white rounded-xl shadow-xl max-w-lg w-full overflow-hidden flex flex-col max-h-[90vh]">
                  <div className="bg-gray-800 text-white p-4 flex justify-between items-center shrink-0">
                      <h3 className="font-bold text-lg flex items-center gap-2"><UserPlus size={20} /> Register New Employee</h3>
                      <button onClick={() => setShowRegisterModal(false)} className="hover:text-gray-300"><XCircle size={24} /></button>
                  </div>
                  <div className="p-6 overflow-y-auto custom-scrollbar">
                      <form onSubmit={handleRegisterSubmit} className="space-y-4">
                           <fieldset disabled={isLoading} className="contents">
                               <div className="grid grid-cols-2 gap-3">
                                   <div><label className="text-xs font-bold block mb-1 text-gray-700">First Name</label><input type="text" required className="w-full p-2 border border-gray-300 rounded text-sm bg-white text-black focus:ring-2 focus:ring-osmak-green focus:border-osmak-green disabled:bg-gray-100" value={regData.firstName} onChange={e => handleRegChange('firstName', e.target.value)} /></div>
                                   <div><label className="text-xs font-bold block mb-1 text-gray-700">Last Name</label><input type="text" required className="w-full p-2 border border-gray-300 rounded text-sm bg-white text-black focus:ring-2 focus:ring-osmak-green focus:border-osmak-green disabled:bg-gray-100" value={regData.lastName} onChange={e => handleRegChange('lastName', e.target.value)} /></div>
                               </div>
                               <div className="grid grid-cols-2 gap-3">
                                   <div><label className="text-xs font-bold block mb-1 text-gray-700">Middle Initial</label><input type="text" maxLength={2} className="w-full p-2 border border-gray-300 rounded text-sm bg-white text-black focus:ring-2 focus:ring-osmak-green focus:border-osmak-green disabled:bg-gray-100" value={regData.middleInitial} onChange={e => handleRegChange('middleInitial', e.target.value)} /></div>
                                   <div><label className="text-xs font-bold block mb-1 text-gray-700">Birthday</label><input type="date" required className="w-full p-2 border border-gray-300 rounded text-sm bg-white text-black focus:ring-2 focus:ring-osmak-green focus:border-osmak-green disabled:bg-gray-100" value={regData.birthday} onChange={e => handleRegChange('birthday', e.target.value)} /></div>
                               </div>
                               <div className="grid grid-cols-2 gap-3">
                                   <div><label className="text-xs font-bold block mb-1 text-gray-700">Hospital Number</label><input type="text" required className="w-full p-2 border border-gray-300 rounded text-sm bg-white text-black focus:ring-2 focus:ring-osmak-green focus:border-osmak-green disabled:bg-gray-100" value={regData.hospitalNumber} onChange={e => handleRegChange('hospitalNumber', e.target.value)} /></div>
                                   <div><label className="text-xs font-bold block mb-1 text-gray-700">Plantilla Position</label><input type="text" required className="w-full p-2 border border-gray-300 rounded text-sm bg-white text-black focus:ring-2 focus:ring-osmak-green focus:border-osmak-green disabled:bg-gray-100" value={regData.plantillaPosition} onChange={e => handleRegChange('plantillaPosition', e.target.value)} /></div>
                               </div>
                               <div><label className="text-xs font-bold block mb-1 text-gray-700">Role</label><select required className="w-full p-2 border border-gray-300 rounded text-sm bg-white text-black focus:ring-2 focus:ring-osmak-green focus:border-osmak-green disabled:bg-gray-100" value={regData.role} onChange={e => handleRegChange('role', e.target.value)}><option value="" disabled>Select Role</option>{REGISTRATION_ROLES.map(r => <option key={r} value={r}>{r}</option>)}</select></div>
                               <div><label className="text-xs font-bold block mb-1 text-gray-700">Division</label><select required className="w-full p-2 border border-gray-300 rounded text-sm bg-white text-black focus:ring-2 focus:ring-osmak-green focus:border-osmak-green disabled:bg-gray-100" value={regData.division} onChange={e => handleRegChange('division', e.target.value)}><option value="" disabled>Select Division</option>{Object.keys(ORGANIZATIONAL_STRUCTURE).map(d => <option key={d} value={d}>{d}</option>)}</select></div>
                               {regData.division && (ORGANIZATIONAL_STRUCTURE[regData.division]||[]).length > 0 && (
                                   <div className="animate-fadeIn"><label className="text-xs font-bold block mb-1 text-gray-700">Department/Section</label><select required className="w-full p-2 border border-gray-300 rounded text-sm bg-white text-black focus:ring-2 focus:ring-osmak-green focus:border-osmak-green disabled:bg-gray-100" value={regData.departmentOrSection} onChange={e => handleRegChange('departmentOrSection', e.target.value)}><option value="" disabled>Select Dept</option>{(ORGANIZATIONAL_STRUCTURE[regData.division] || []).map(d => <option key={d} value={d}>{d}</option>)}</select></div>
                               )}
                           </fieldset>
                           <button type="submit" disabled={isLoading} className="w-full py-3 bg-osmak-green text-white rounded-lg font-bold hover:bg-osmak-green-dark mt-4 shadow-md transition-colors disabled:opacity-70 flex items-center justify-center gap-2">
                               {isLoading && <Loader2 className="animate-spin" size={18} />}
                               {isLoading ? 'Registering...' : 'Register Employee'}
                           </button>
                      </form>
                  </div>
              </div>
          </div>
      )}
    </div>
  );
};

export default AdminDashboard;
