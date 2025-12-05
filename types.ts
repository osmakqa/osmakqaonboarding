
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

export interface UserState {
  progress: Record<string, ModuleProgress>;
  activeModuleId: string | null;
}

export enum AppView {
  DASHBOARD = 'DASHBOARD',
  PLAYER = 'PLAYER',
  QUIZ = 'QUIZ' // Sub-state of player, but can be handled within Player component
}
