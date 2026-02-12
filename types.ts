
export interface Question {
  id: string;
  text: string;
  options: string[];
  correctAnswerIndex: number;
}

export interface Module {
  id: string;
  section: string;
  title: string;
  description: string;
  thumbnailUrl: string;
  duration?: string;
  topics: string[];
  videoUrl?: string;
  questions?: Question[];
  allowedRoles?: UserRole[];
}

export interface Attempt {
  date: string;
  score: number;
  answers: Record<string, number>;
}

export interface ModuleProgress {
  isUnlocked: boolean;
  isCompleted: boolean;
  highScore: number;
  lastAttemptAnswers?: Record<string, number>;
  attempts?: Attempt[]; // Store history of completions
}

export type UserRole = 
  | 'QA Admin' 
  | 'Head / Assistant Head'
  | 'Doctor' 
  | 'Nurse' 
  | 'Nurse (High-risk Area)' 
  | 'Other Clinical (Med Tech, Rad Tech, etc)' 
  | 'Non-clinical' 
  | 'Medical Intern';

export enum AppView {
  DASHBOARD = 'DASHBOARD',
  PLAYER = 'PLAYER',
  QUIZ = 'QUIZ',
  ADMIN_DASHBOARD = 'ADMIN_DASHBOARD',
  COURSE_MANAGER = 'COURSE_MANAGER',
  ROLE_ACCESS = 'ROLE_ACCESS',
  SESSIONS = 'SESSIONS',
  SESSION_CHOICE = 'SESSION_CHOICE',
  EVALUATION = 'EVALUATION',
  COMPLETION_SUCCESS = 'COMPLETION_SUCCESS'
}

export interface RegistrationData {
  firstName: string;
  lastName: string;
  middleInitial: string;
  birthday: string;
  hospitalNumber: string;
  plantillaPosition: string;
  role: UserRole | '';
  division: string;
  departmentOrSection: string;
}

export interface UserProfile extends RegistrationData {
  progress: Record<string, ModuleProgress>;
  registrationDate?: string;
}

export interface SessionEvaluation {
  userId: string;
  userName: string;
  date: string;
  scores: {
    q1: number;
    q2: number;
    q3: number;
    q4: number;
    q5: number;
  };
  feedback: string;
}

export interface TrainingSession {
  id: string;
  name: string;
  startDateTime: string; 
  endDateTime: string;   
  moduleIds: string[];
  employeeHospitalNumbers: string[];
  status: 'open' | 'closed';
  evaluations?: Record<string, SessionEvaluation>; // userId -> evaluation
}

export interface OrganizationalStructure {
  [division: string]: string[];
}
