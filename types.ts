

export interface Question {
  id: string;
  text: string;
  options: string[];
  correctAnswerIndex: number;
}

export interface Module {
  id: string;
  section: string; // Grouping category (e.g. "A. Quality Assurance")
  title: string;
  description: string;
  thumbnailUrl: string;
  duration: string; // e.g., "15 min"
  topics: string[]; // For Gemini context
  videoUrl?: string;
  questions?: Question[];
}

export interface ModuleProgress {
  isUnlocked: boolean;
  isCompleted: boolean;
  highScore: number; // Percentage 0-100
}

export type UserRole = 
  | 'QA Admin' 
  | 'Doctor' 
  | 'Nurse' 
  | 'Specialized Nurse' 
  | 'Non-clinical' 
  | 'Medical Intern' 
  | 'Others';

export interface UserState {
  progress: Record<string, ModuleProgress>;
  activeModuleId: string | null;
  userRole?: UserRole;
}

export enum AppView {
  DASHBOARD = 'DASHBOARD',
  PLAYER = 'PLAYER',
  QUIZ = 'QUIZ',
  ADMIN_DASHBOARD = 'ADMIN_DASHBOARD'
}

export interface RegistrationData {
  firstName: string;
  lastName: string;
  middleInitial: string;
  birthday: string;
  hospitalNumber: string; // Acts as the unique ID / Password
  plantillaPosition: string;
  role: UserRole | '';
  division: string;
  departmentOrSection: string;
}

export interface UserProfile extends RegistrationData {
  progress: Record<string, ModuleProgress>;
}

export interface OrganizationalStructure {
  [division: string]: string[]; // Array of sections/departments. Empty if none.
}