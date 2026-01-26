
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
import { UserProfile, RegistrationData, ModuleProgress, Module } from '../types';

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
    progress: {}
  }
];

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
      console.error(`Firebase User Fetch Error: ${e?.message || 'Unknown error'}`);
      return FALLBACK_USERS;
    }
  },

  /**
   * Register a new user in Firebase
   */
  async registerUser(data: RegistrationData): Promise<UserProfile | null> {
    try {
      const userRef = doc(db, 'users', data.hospitalNumber);
      const newUser: UserProfile = { ...data, progress: {} };
      await setDoc(userRef, newUser);
      return newUser;
    } catch (e: any) {
      console.error(`Registration failed: ${e?.message || 'Network/Auth error'}`);
      return { ...data, progress: {} } as UserProfile;
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
      console.error(`Update failed: ${e?.message || 'Network/Auth error'}`);
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
      console.error(`Delete failed: ${e?.message || 'Network/Auth error'}`);
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
      console.error(`Progress update failed: ${e?.message || 'Network/Auth error'}`);
      return false;
    }
  },

  /**
   * MODULE PERSISTENCE (Hybrid)
   * This allows saving hardcoded modules into the database.
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
      console.error(`Firebase Module Fetch Error: ${e?.message}`);
      return [];
    }
  },

  async saveModule(module: Module): Promise<boolean> {
    try {
      const moduleRef = doc(db, 'modules', module.id);
      await setDoc(moduleRef, module);
      return true;
    } catch (e: any) {
      console.error(`Save module failed: ${e?.message}`);
      return false;
    }
  },

  async deleteModule(moduleId: string): Promise<boolean> {
    try {
      await deleteDoc(doc(db, 'modules', moduleId));
      return true;
    } catch (e) {
      return false;
    }
  }
};
