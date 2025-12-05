
import React, { useState } from 'react';
import { UserRole } from '../types';
import { LogIn } from 'lucide-react';

interface LoginModalProps {
  onLogin: (role: UserRole) => void;
}

const ROLES: UserRole[] = [
  'QA Admin',
  'Doctor',
  'Nurse',
  'Specialized Nurse',
  'Medical Intern',
  'Non-clinical',
  'Others'
];

const LoginModal: React.FC<LoginModalProps> = ({ onLogin }) => {
  const [selectedRole, setSelectedRole] = useState<UserRole | ''>('');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (selectedRole) {
      onLogin(selectedRole);
    }
  };

  return (
    <div className="fixed inset-0 z-[200] bg-gray-900 bg-opacity-90 flex items-center justify-center p-4 backdrop-blur-sm">
      <div className="bg-white rounded-2xl shadow-2xl max-w-md w-full overflow-hidden animate-fadeIn">
        <div className="bg-osmak-green p-6 text-center">
          <img 
            src="https://maxterrenal-hash.github.io/justculture/osmak-logo.png" 
            alt="OsMak Logo" 
            className="h-16 w-auto mx-auto mb-4 bg-white rounded-full p-1 shadow-md"
          />
          <h2 className="text-2xl font-bold text-white uppercase tracking-wide">
            Ospital ng Makati
          </h2>
          <p className="text-green-100 text-sm mt-1">Quality Assurance Division Onboarding</p>
        </div>
        
        <div className="p-8">
          <form onSubmit={handleSubmit} className="space-y-6">
            <div>
              <label htmlFor="role" className="block text-sm font-medium text-gray-700 mb-2">
                Select your Designation / Role
              </label>
              <div className="relative">
                <select
                  id="role"
                  value={selectedRole}
                  onChange={(e) => setSelectedRole(e.target.value as UserRole)}
                  className="block w-full pl-3 pr-10 py-3 text-base border-gray-300 focus:outline-none focus:ring-osmak-green focus:border-osmak-green sm:text-sm rounded-lg border bg-gray-50"
                  required
                >
                  <option value="" disabled>-- Choose Role --</option>
                  {ROLES.map((role) => (
                    <option key={role} value={role}>
                      {role}
                    </option>
                  ))}
                </select>
              </div>
            </div>

            <button
              type="submit"
              disabled={!selectedRole}
              className={`
                w-full flex justify-center items-center gap-2 py-3 px-4 border border-transparent rounded-lg shadow-sm text-sm font-bold text-white transition-all
                ${selectedRole 
                  ? 'bg-osmak-green hover:bg-osmak-green-dark hover:shadow-lg transform hover:-translate-y-0.5' 
                  : 'bg-gray-300 cursor-not-allowed'}
              `}
            >
              <LogIn size={18} />
              Enter Portal
            </button>
          </form>

          <p className="mt-6 text-center text-xs text-gray-400">
            Please select the role that matches your current employment status to view the relevant training modules.
          </p>
        </div>
      </div>
    </div>
  );
};

export default LoginModal;
