
import { db } from './firebaseClient';
import { 
  collection, 
  getDocs, 
  setDoc, 
  doc, 
  updateDoc, 
  deleteDoc, 
  getDoc 
} from 'firebase/firestore';
import { UserProfile, RegistrationData, ModuleProgress, Module, TrainingSession } from '../types';

// Fallback data for offline mode or network errors
const FALLBACK_USERS: UserProfile[] = [
  {
    firstName: 'QA',
    lastName: 'Admin',
    middleInitial: '',
    birthday: '1980-01-01',
    hospitalNumber: '999999',
    plantillaPosition: 'Administrator',
    role: 'QA Admin',
    division: 'Quality Assurance Division',
    departmentOrSection: 'Process and Performance Improvement Section',
    progress: {},
    registrationDate: '2024-01-01'
  }
];

const handleFirebaseError = (error: any, context: string) => {
  if (error?.code === 'permission-denied') {
    console.error(`Security Rule Violation in ${context}: You do not have permission to perform this action.`);
    alert("Access Denied: You do not have the required administrative permissions for this action.");
  } else {
    console.error(`Firebase Error in ${context}:`, error?.message || error);
  }
};

export const dataService = {
  /**
   * Fetch all users from Firebase
   */
  async fetchUsers(): Promise<UserProfile[]> {
    try {
      const querySnapshot = await getDocs(collection(db, 'users'));
      const users: UserProfile[] = [];
      querySnapshot.forEach((doc) => {
        users.push(doc.data() as UserProfile);
      });
      return users.length > 0 ? users : FALLBACK_USERS;
    } catch (e: any) {
      handleFirebaseError(e, 'fetchUsers');
      return FALLBACK_USERS;
    }
  },

  /**
   * Register a new user in Firebase
   */
  async registerUser(data: RegistrationData): Promise<UserProfile | null> {
    try {
      const userRef = doc(db, 'users', data.hospitalNumber);
      const newUser: UserProfile = { 
        ...data, 
        progress: {},
        registrationDate: new Date().toISOString().split('T')[0] // Automatically set registration date
      };
      await setDoc(userRef, newUser);
      return newUser;
    } catch (e: any) {
      handleFirebaseError(e, 'registerUser');
      return { ...data, progress: {}, registrationDate: new Date().toISOString().split('T')[0] } as UserProfile;
    }
  },

  /**
   * Update an existing user's profile
   */
  async updateUser(
    hospitalNumber: string, 
    data: RegistrationData
  ): Promise<UserProfile | null> {
    try {
      const userRef = doc(db, 'users', hospitalNumber);
      const updateData = { ...data };
      // Sanitize undefined
      Object.keys(updateData).forEach(key => (updateData as any)[key] === undefined && delete (updateData as any)[key]);
      
      await updateDoc(userRef, updateData as any);
      const updatedDoc = await getDoc(userRef);
      return updatedDoc.data() as UserProfile;
    } catch (e: any) {
      handleFirebaseError(e, 'updateUser');
      return null;
    }
  },

  /**
   * Delete a user by their hospital number
   */
  async deleteUser(hospitalNumber: string): Promise<boolean> {
    try {
      const userRef = doc(db, 'users', hospitalNumber);
      await deleteDoc(userRef);
      return true;
    } catch (e: any) {
      handleFirebaseError(e, 'deleteUser');
      return false;
    }
  },

  /**
   * Update a user's progress for a specific module
   */
  async updateUserProgress(
    hospitalNumber: string, 
    moduleId: string, 
    newModuleProgress: ModuleProgress
  ): Promise<boolean> {
    try {
      const userRef = doc(db, 'users', hospitalNumber);
      await updateDoc(userRef, {
        [`progress.${moduleId}`]: newModuleProgress
      });
      return true;
    } catch (e: any) {
      handleFirebaseError(e, 'updateUserProgress');
      return false;
    }
  },

  /**
   * MODULE PERSISTENCE
   */
  async fetchModules(): Promise<Module[]> {
    try {
      const querySnapshot = await getDocs(collection(db, 'modules'));
      const modules: Module[] = [];
      querySnapshot.forEach((doc) => {
        modules.push(doc.data() as Module);
      });
      return modules;
    } catch (e: any) {
      handleFirebaseError(e, 'fetchModules');
      return [];
    }
  },

  async saveModule(module: Module): Promise<boolean> {
    try {
      const moduleRef = doc(db, 'modules', module.id);
      await setDoc(moduleRef, module);
      return true;
    } catch (e: any) {
      handleFirebaseError(e, 'saveModule');
      return false;
    }
  },

  async deleteModule(moduleId: string): Promise<boolean> {
    try {
      await deleteDoc(doc(db, 'modules', moduleId));
      return true;
    } catch (e: any) {
      handleFirebaseError(e, 'deleteModule');
      return false;
    }
  },

  /**
   * SESSION PERSISTENCE
   */
  async fetchSessions(): Promise<TrainingSession[]> {
    try {
      const querySnapshot = await getDocs(collection(db, 'sessions'));
      const sessions: TrainingSession[] = [];
      querySnapshot.forEach((doc) => {
        sessions.push(doc.data() as TrainingSession);
      });
      return sessions;
    } catch (e: any) {
      handleFirebaseError(e, 'fetchSessions');
      return [];
    }
  },

  async saveSession(session: TrainingSession): Promise<boolean> {
    try {
      const sessionRef = doc(db, 'sessions', session.id);
      await setDoc(sessionRef, session);
      return true;
    } catch (e: any) {
      handleFirebaseError(e, 'saveSession');
      return false;
    }
  },

  async deleteSession(sessionId: string): Promise<boolean> {
    try {
      await deleteDoc(doc(db, 'sessions', sessionId));
      return true;
    } catch (e: any) {
      handleFirebaseError(e, 'deleteSession');
      return false;
    }
  }
};
