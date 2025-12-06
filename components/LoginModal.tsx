
import React, { useState } from 'react';
import { UserRole, RegistrationData, UserProfile } from '../types';
import { LogIn, UserPlus, ArrowLeft, Check, User, Hash, ShieldAlert, Loader2 } from 'lucide-react';
import { ORGANIZATIONAL_STRUCTURE } from '../constants';

interface LoginModalProps {
  users: UserProfile[];
  onLogin: (role: UserRole, userProfile: UserProfile) => void;
  onRegister: (data: RegistrationData) => void;
  isLoading?: boolean;
}

const REGISTRATION_ROLES: UserRole[] = [
  'Doctor', // Changed from Physician
  'Nurse',
  'Specialized Nurse',
  'Medical Intern',
  'Non-clinical',
  'Others'
];

type ViewMode = 'LOGIN' | 'REGISTER';

const LoginModal: React.FC<LoginModalProps> = ({ users, onLogin, onRegister, isLoading = false }) => {
  const [view, setView] = useState<ViewMode>('LOGIN');
  
  // Login State
  const [loginLastName, setLoginLastName] = useState('');
  const [loginHospitalNumber, setLoginHospitalNumber] = useState('');
  const [loginError, setLoginError] = useState('');
  
  // Registration State
  const [regData, setRegData] = useState<RegistrationData>({
    firstName: '',
    lastName: '',
    middleInitial: '',
    birthday: '',
    hospitalNumber: '',
    plantillaPosition: '',
    role: '',
    division: '',
    departmentOrSection: ''
  });

  const handleLoginSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setLoginError('');

    const lastNameInput = loginLastName.trim().toLowerCase();
    const hospitalIdInput = loginHospitalNumber.trim().toLowerCase();

    // 1. Check for QA Admin specific bypass/hardcode
    if (hospitalIdInput === '999999') {
        const adminUser: UserProfile = {
            firstName: 'QA',
            lastName: 'Admin',
            hospitalNumber: '999999',
            role: 'QA Admin',
            middleInitial: '',
            birthday: '',
            plantillaPosition: 'Administrator',
            division: 'Quality Assurance Division',
            departmentOrSection: 'Process and Performance Improvement Section',
            progress: {}
        };
        onLogin('QA Admin', adminUser);
        return;
    }

    // 2. Validate against registered users
    const foundUser = users.find(u => 
        u.hospitalNumber.toLowerCase() === hospitalIdInput && 
        u.lastName.toLowerCase() === lastNameInput
    );

    if (foundUser && foundUser.role) {
        onLogin(foundUser.role as UserRole, foundUser);
        return;
    }

    // 3. Fallback for demo accounts if not in the users list (backward compatibility)
    // We treat the "username" from the prompt as the Hospital Number, and require "Demo" as last name
    // OR just match the ID if it matches the specific keywords
    const demoRoles = ['doctor', 'nurse', 'specialized nurse', 'medical intern', 'non-clinical', 'others'];
    if (demoRoles.includes(hospitalIdInput)) {
         // Create a temporary profile for the demo user
         let roleName: UserRole = 'Others';
         if (hospitalIdInput === 'doctor') roleName = 'Doctor';
         else if (hospitalIdInput === 'nurse') roleName = 'Nurse';
         else if (hospitalIdInput === 'specialized nurse') roleName = 'Specialized Nurse';
         else if (hospitalIdInput === 'medical intern') roleName = 'Medical Intern';
         else if (hospitalIdInput === 'non-clinical') roleName = 'Non-clinical';

         const demoUser: UserProfile = {
            firstName: 'Demo',
            lastName: loginLastName || 'User',
            hospitalNumber: hospitalIdInput,
            role: roleName,
            middleInitial: '',
            birthday: '',
            plantillaPosition: 'Demo Account',
            division: 'Clinical Division',
            departmentOrSection: 'Department of Internal Medicine',
            progress: {}
         };
         onLogin(roleName, demoUser);
         return;
    }

    setLoginError('Invalid credentials. Please check Last Name and Hospital Number.');
  };

  const availableSections = regData.division ? ORGANIZATIONAL_STRUCTURE[regData.division] || [] : [];
  const showSectionDropdown = availableSections.length > 0;

  const handleRegisterSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    // Comprehensive Validation Check with Alerts
    const errors: string[] = [];
    if (!regData.firstName.trim()) errors.push("First Name");
    if (!regData.lastName.trim()) errors.push("Last Name");
    if (!regData.birthday) errors.push("Birthday");
    if (!regData.hospitalNumber.trim()) errors.push("Hospital Number");
    if (!regData.plantillaPosition.trim()) errors.push("Plantilla Position");
    if (!regData.role) errors.push("Role");
    if (!regData.division) errors.push("Division");
    if (showSectionDropdown && !regData.departmentOrSection) errors.push("Department/Section");

    if (errors.length > 0) {
        alert(`Please complete the following required fields:\n\n• ${errors.join('\n• ')}`);
        return;
    }

    // Check if ID already exists
    if (users.some(u => u.hospitalNumber === regData.hospitalNumber)) {
        alert("This Hospital Number is already registered. Please check or contact admin.");
        return;
    }

    onRegister(regData);
  };

  const handleRegChange = (field: keyof RegistrationData, value: string) => {
    setRegData(prev => ({
      ...prev,
      [field]: value,
      // Reset sub-selection if division changes
      ...(field === 'division' ? { departmentOrSection: '' } : {})
    }));
  };

  if (view === 'LOGIN') {
    return (
      <div className="fixed inset-0 z-[200] bg-gray-900 bg-opacity-90 flex items-center justify-center p-4 backdrop-blur-sm">
        <div className="bg-white rounded-2xl shadow-2xl max-w-md w-full overflow-hidden animate-fadeIn">
          <div className="bg-osmak-green px-6 py-5 flex items-center gap-4">
            <img 
              src="https://maxterrenal-hash.github.io/justculture/osmak-logo.png" 
              alt="OsMak Logo" 
              className="h-16 w-16 object-contain bg-white rounded-full p-1"
            />
            <div className="flex flex-col items-start text-white">
              <h2 className="text-xl font-bold uppercase tracking-wide leading-tight">
                OSPITAL NG MAKATI
              </h2>
              <p className="text-sm font-medium opacity-90 leading-tight mt-0.5 text-green-50">
                Quality Assurance Division Onboarding
              </p>
            </div>
          </div>
          
          <div className="p-8">
            <form onSubmit={handleLoginSubmit} className="space-y-5">
              
              {/* Last Name */}
              <div>
                <label className="block text-sm font-bold text-gray-700 mb-1 flex items-center gap-2">
                  <User size={16} className="text-gray-400" />
                  Last Name
                </label>
                <input
                  type="text"
                  value={loginLastName}
                  onChange={(e) => setLoginLastName(e.target.value)}
                  placeholder="Enter Last Name"
                  className="block w-full px-4 py-3 text-sm border-gray-300 focus:ring-osmak-green focus:border-osmak-green rounded-lg border bg-gray-50 text-gray-900"
                  required
                />
              </div>

              {/* Hospital Number / Username */}
              <div>
                <label className="block text-sm font-bold text-gray-700 mb-1 flex items-center gap-2">
                  <Hash size={16} className="text-gray-400" />
                  Hospital Number
                </label>
                <input
                  type="text"
                  value={loginHospitalNumber}
                  onChange={(e) => setLoginHospitalNumber(e.target.value)}
                  placeholder="e.g. 123456"
                  className="block w-full px-4 py-3 text-sm border-gray-300 focus:ring-osmak-green focus:border-osmak-green rounded-lg border bg-gray-50 text-gray-900"
                  required
                />
                <p className="text-xs text-gray-500 mt-1 ml-1">This acts as your password.</p>
              </div>

              {loginError && (
                <div className="p-3 bg-red-50 text-red-600 text-xs rounded border border-red-200">
                  {loginError}
                </div>
              )}

              {/* Demo Hints */}
              <div className="text-xs bg-blue-50 text-blue-800 p-3 rounded border border-blue-100 space-y-1">
                <p className="font-bold">Demo:</p>
                <p>Use Last Name: <b>User</b> and Hospital Number: <b>doctor</b>, <b>nurse</b>, etc.</p>
                <p className="mt-1">For QA Admin: ID <b>999999</b> (Any last name)</p>
              </div>

              <button
                type="submit"
                className="w-full flex justify-center items-center gap-2 py-3 px-4 bg-osmak-green hover:bg-osmak-green-dark text-white rounded-lg shadow-md font-bold transition-all transform active:scale-95"
              >
                <LogIn size={18} />
                Sign In
              </button>

              <button
                type="button"
                onClick={() => {
                    const adminUser: UserProfile = {
                        firstName: 'QA',
                        lastName: 'Admin',
                        hospitalNumber: '999999',
                        role: 'QA Admin',
                        middleInitial: '',
                        birthday: '',
                        plantillaPosition: 'Administrator',
                        division: 'Quality Assurance Division',
                        departmentOrSection: '',
                        progress: {}
                    };
                    onLogin('QA Admin', adminUser);
                }}
                className="w-full flex justify-center items-center gap-2 py-2 px-4 bg-gray-800 hover:bg-gray-700 text-white rounded-lg shadow-md font-bold text-xs transition-colors mt-2"
              >
                <ShieldAlert size={14} />
                Bypass Login (QA Admin)
              </button>
            </form>
            
            <div className="mt-6 flex flex-col gap-3 text-center border-t border-gray-100 pt-4">
               <button
                  type="button"
                  onClick={() => setView('REGISTER')}
                  className="w-full flex justify-center items-center gap-2 py-3 px-4 border border-osmak-green text-osmak-green rounded-lg hover:bg-green-50 font-bold text-sm transition-colors"
               >
                  <UserPlus size={18} />
                  Register Account
               </button>
            </div>
          </div>
        </div>
      </div>
    );
  }

  // REGISTER VIEW
  return (
    <div className="fixed inset-0 z-[200] bg-gray-900 bg-opacity-90 flex items-center justify-center p-4 backdrop-blur-sm">
      <div className="bg-white rounded-2xl shadow-2xl max-w-lg w-full overflow-hidden animate-fadeIn flex flex-col max-h-[90vh]">
        <div className="bg-osmak-green p-4 flex items-center relative shrink-0">
          <button 
             onClick={() => setView('LOGIN')}
             disabled={isLoading}
             className="absolute left-4 text-white hover:bg-white/20 p-1 rounded-full transition-colors disabled:opacity-50"
          >
             <ArrowLeft size={20} />
          </button>
          <h2 className="text-xl font-bold text-white uppercase tracking-wide w-full text-center">
            Registration
          </h2>
        </div>
        
        <div className="p-6 overflow-y-auto custom-scrollbar">
          <form onSubmit={handleRegisterSubmit} className="space-y-4">
            <fieldset disabled={isLoading} className="contents">
            {/* Personal Info */}
            <div className="grid grid-cols-2 gap-3">
              <div>
                <label className="block text-xs font-bold text-gray-700 mb-1">First Name</label>
                <input 
                  type="text" 
                  className="w-full p-2 border rounded text-sm bg-gray-50 focus:bg-white transition-colors border-gray-300 disabled:bg-gray-100"
                  value={regData.firstName}
                  onChange={e => handleRegChange('firstName', e.target.value)}
                />
              </div>
              <div>
                 <label className="block text-xs font-bold text-gray-700 mb-1">Last Name</label>
                 <input 
                    type="text" 
                    className="w-full p-2 border rounded text-sm bg-gray-50 focus:bg-white transition-colors border-gray-300 disabled:bg-gray-100"
                    value={regData.lastName}
                    onChange={e => handleRegChange('lastName', e.target.value)}
                 />
              </div>
            </div>
            <div className="grid grid-cols-2 gap-3">
               <div>
                 <label className="block text-xs font-bold text-gray-700 mb-1">Middle Initial</label>
                 <input 
                    type="text" 
                    maxLength={2} 
                    className="w-full p-2 border rounded text-sm bg-gray-50 focus:bg-white transition-colors border-gray-300 disabled:bg-gray-100"
                    value={regData.middleInitial}
                    onChange={e => handleRegChange('middleInitial', e.target.value)}
                 />
               </div>
               <div>
                 <label className="block text-xs font-bold text-gray-700 mb-1">Birthday</label>
                 <input 
                    type="date" 
                    className="w-full p-2 border rounded text-sm bg-gray-50 focus:bg-white transition-colors border-gray-300 disabled:bg-gray-100"
                    value={regData.birthday}
                    onChange={e => handleRegChange('birthday', e.target.value)}
                 />
               </div>
            </div>

            <div className="grid grid-cols-2 gap-3">
              <div>
                 <label className="block text-xs font-bold text-gray-700 mb-1">Hospital Number</label>
                 <input 
                    type="text" 
                    placeholder="This will be your password"
                    className="w-full p-2 border rounded text-sm bg-gray-50 focus:bg-white transition-colors border-gray-300 disabled:bg-gray-100"
                    value={regData.hospitalNumber}
                    onChange={e => handleRegChange('hospitalNumber', e.target.value)}
                 />
               </div>
              <div>
                 <label className="block text-xs font-bold text-gray-700 mb-1">Plantilla Position</label>
                 <input 
                    type="text" 
                    className="w-full p-2 border rounded text-sm bg-gray-50 focus:bg-white transition-colors border-gray-300 disabled:bg-gray-100"
                    value={regData.plantillaPosition}
                    onChange={e => handleRegChange('plantillaPosition', e.target.value)}
                 />
              </div>
            </div>

            {/* Role Selection */}
            <div>
               <label className="block text-xs font-bold text-gray-700 mb-1">Role</label>
               <select 
                  className="w-full p-2 border rounded text-sm bg-gray-50 focus:bg-white transition-colors border-gray-300 disabled:bg-gray-100"
                  value={regData.role}
                  onChange={e => handleRegChange('role', e.target.value)}
               >
                  <option value="" disabled>Select Role</option>
                  {REGISTRATION_ROLES.map(r => <option key={r} value={r}>{r}</option>)}
               </select>
            </div>

            {/* Division Selection */}
            <div>
               <label className="block text-xs font-bold text-gray-700 mb-1">Division</label>
               <select 
                  className="w-full p-2 border rounded text-sm bg-gray-50 focus:bg-white transition-colors border-gray-300 disabled:bg-gray-100"
                  value={regData.division}
                  onChange={e => handleRegChange('division', e.target.value)}
               >
                  <option value="" disabled>Select Division</option>
                  {Object.keys(ORGANIZATIONAL_STRUCTURE).map(d => (
                     <option key={d} value={d}>{d}</option>
                  ))}
               </select>
            </div>

            {/* Department/Section Selection */}
            {showSectionDropdown && (
               <div className="animate-fadeIn">
                  <label className="block text-xs font-bold text-gray-700 mb-1">Department / Section</label>
                  <select 
                     className="w-full p-2 border rounded text-sm bg-gray-50 focus:bg-white transition-colors border-gray-300 disabled:bg-gray-100"
                     value={regData.departmentOrSection}
                     onChange={e => handleRegChange('departmentOrSection', e.target.value)}
                  >
                     <option value="" disabled>Select Department/Section</option>
                     {availableSections.map(s => <option key={s} value={s}>{s}</option>)}
                  </select>
               </div>
            )}
            </fieldset>

            <button
               type="submit"
               disabled={isLoading}
               className={`
                  w-full py-3 mt-4 rounded-lg font-bold text-white transition-all flex justify-center items-center gap-2
                  bg-osmak-green hover:bg-osmak-green-dark shadow-md active:scale-95 disabled:opacity-70 disabled:cursor-not-allowed
               `}
            >
               {isLoading ? <Loader2 className="animate-spin" size={18} /> : <Check size={18} />}
               {isLoading ? 'Registering...' : 'Complete Registration'}
            </button>
          </form>
        </div>
      </div>
    </div>
  );
};

export default LoginModal;
