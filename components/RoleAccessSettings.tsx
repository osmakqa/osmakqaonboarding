
import React, { useState, useEffect } from 'react';
import { Module, UserRole } from '../types';
import { USER_ROLES } from '../constants';
import { ShieldCheck, Save, CheckSquare, Square, Info, Loader2, Search } from 'lucide-react';

interface RoleAccessSettingsProps {
  modules: Module[];
  onUpdateModules: (updatedModules: Module[]) => Promise<void>;
}

const RoleAccessSettings: React.FC<RoleAccessSettingsProps> = ({ modules, onUpdateModules }) => {
  const [localModules, setLocalModules] = useState<Module[]>([]);
  const [isSaving, setIsSaving] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');

  useEffect(() => {
    setLocalModules([...modules]);
  }, [modules]);

  const toggleAccess = (moduleId: string, role: UserRole) => {
    setLocalModules(prev => prev.map(m => {
      if (m.id !== moduleId) return m;
      const currentRoles = m.allowedRoles || [];
      const newRoles = currentRoles.includes(role)
        ? currentRoles.filter(r => r !== role)
        : [...currentRoles, role];
      return { ...m, allowedRoles: newRoles };
    }));
  };

  const toggleAllInRow = (moduleId: string, value: boolean) => {
    setLocalModules(prev => prev.map(m => {
      if (m.id !== moduleId) return m;
      return { ...m, allowedRoles: value ? [...USER_ROLES] : [] };
    }));
  };

  const toggleAllInColumn = (role: UserRole, value: boolean) => {
    setLocalModules(prev => prev.map(m => {
      const currentRoles = m.allowedRoles || [];
      const newRoles = value 
        ? (currentRoles.includes(role) ? currentRoles : [...currentRoles, role])
        : currentRoles.filter(r => r !== role);
      return { ...m, allowedRoles: newRoles };
    }));
  };

  const handleSave = async () => {
    setIsSaving(true);
    await onUpdateModules(localModules);
    setIsSaving(false);
    alert('Role access settings saved successfully!');
  };

  const filteredModules = localModules.filter(m => 
    m.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
    m.section.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="space-y-6 animate-fadeIn">
      <div className="bg-white p-6 rounded-xl border border-gray-200 shadow-sm flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h2 className="text-xl font-bold text-gray-900 flex items-center gap-2">
            <ShieldCheck className="text-osmak-green" size={24} />
            Role Access Matrix
          </h2>
          <p className="text-sm text-gray-500 mt-1">
            Define which hospital roles have access to specific training modules.
          </p>
        </div>
        
        <div className="flex items-center gap-3">
            <div className="relative">
                <Search size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
                <input 
                    type="text" 
                    placeholder="Search modules..."
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    className="pl-9 pr-4 py-2 border rounded-lg text-sm bg-white text-black focus:ring-2 focus:ring-osmak-green focus:border-osmak-green outline-none w-64"
                />
            </div>
            <button 
                onClick={handleSave}
                disabled={isSaving}
                className="bg-osmak-green hover:bg-osmak-green-dark text-white px-6 py-2 rounded-lg font-bold shadow-md transition-all flex items-center gap-2 disabled:opacity-50"
            >
                {isSaving ? <Loader2 size={18} className="animate-spin" /> : <Save size={18} />}
                {isSaving ? 'Saving...' : 'Save All Changes'}
            </button>
        </div>
      </div>

      <div className="bg-white rounded-xl border border-gray-200 shadow-sm overflow-hidden">
        <div className="overflow-x-auto custom-scrollbar">
          <table className="w-full text-left border-collapse">
            <thead className="bg-gray-50 text-gray-600 uppercase font-black text-[10px] tracking-widest border-b">
              <tr>
                <th className="px-6 py-4 min-w-[300px] sticky left-0 bg-gray-50 z-20">Module Name</th>
                {USER_ROLES.map(role => (
                  <th key={role} className="px-4 py-4 min-w-[140px] text-center group relative">
                    <div className="mb-2 truncate" title={role}>{role}</div>
                    <div className="flex justify-center gap-2">
                        <button 
                            onClick={() => toggleAllInColumn(role, true)}
                            className="text-[9px] text-blue-600 hover:underline font-bold"
                        >
                            All
                        </button>
                        <button 
                            onClick={() => toggleAllInColumn(role, false)}
                            className="text-[9px] text-red-600 hover:underline font-bold"
                        >
                            None
                        </button>
                    </div>
                  </th>
                ))}
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-100">
              {filteredModules.map(module => (
                <tr key={module.id} className="hover:bg-gray-50 transition-colors">
                  <td className="px-6 py-4 sticky left-0 bg-white z-10 group-hover:bg-gray-50 shadow-[4px_0_8px_-4px_rgba(0,0,0,0.1)]">
                    <div className="flex flex-col">
                        <span className="font-bold text-gray-900 text-sm">{module.title}</span>
                        <span className="text-[10px] text-gray-400 font-bold uppercase mt-0.5">{module.section}</span>
                    </div>
                    <div className="flex gap-2 mt-2">
                        <button 
                            onClick={() => toggleAllInRow(module.id, true)}
                            className="text-[9px] text-blue-600 hover:underline font-bold"
                        >
                            Select All Roles
                        </button>
                        <button 
                            onClick={() => toggleAllInRow(module.id, false)}
                            className="text-[9px] text-red-600 hover:underline font-bold"
                        >
                            Clear Roles
                        </button>
                    </div>
                  </td>
                  {USER_ROLES.map(role => {
                    const hasAccess = module.allowedRoles?.includes(role);
                    return (
                      <td key={role} className="px-4 py-4 text-center">
                        <button 
                            onClick={() => toggleAccess(module.id, role)}
                            className={`p-2 rounded-lg transition-all ${hasAccess ? 'text-osmak-green bg-green-50' : 'text-gray-300 hover:text-gray-400'}`}
                        >
                            {hasAccess ? <CheckSquare size={24} /> : <Square size={24} />}
                        </button>
                      </td>
                    );
                  })}
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      <div className="bg-blue-50 border border-blue-100 p-4 rounded-xl flex gap-3 text-blue-700">
          <Info size={20} className="shrink-0" />
          <div className="text-xs font-medium leading-relaxed">
              <strong>Tip:</strong> Changes made here will only take effect after clicking the "Save All Changes" button. 
              QA Admins and Department Heads always have access to all modules regardless of these settings.
          </div>
      </div>
    </div>
  );
};

export default RoleAccessSettings;
