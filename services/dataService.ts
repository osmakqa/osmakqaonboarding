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
import { UserProfile, RegistrationData, ModuleProgress } from '../types';

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
  },
  {
    firstName: 'Juan',
    lastName: 'Dela Cruz',
    middleInitial: 'A',
    birthday: '1990-01-01',
    hospitalNumber: '123456',
    plantillaPosition: 'Nurse I',
    role: 'Nurse',
    division: 'Nursing Division',
    departmentOrSection: 'General Ward',
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
      // If no users exist yet in DB, return fallbacks
      return users.length > 0 ? users : FALLBACK_USERS;
    } catch (e: any) {
      if (e?.code === 'permission-denied') {
        console.error("Firebase Permission Denied: Ensure Firestore Rules allow read access.");
      } else {
        console.error(`Firebase Error: ${e?.message || 'Unknown error'}`);
      }
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
      return { ...data, progress: {} } as UserProfile;
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
  }
};