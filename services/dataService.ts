import { supabase, isSupabaseConfigured } from './supabaseClient';
import { UserProfile, RegistrationData, ModuleProgress, UserRole } from '../types';

// Interface matching the Supabase DB Schema (snake_case)
interface UserDBRow {
  id?: string;
  created_at?: string;
  first_name: string;
  last_name: string;
  middle_initial: string;
  birthday: string;
  hospital_number: string;
  plantilla_position: string;
  role: string;
  division: string;
  department_section: string;
  progress: Record<string, ModuleProgress>;
}

// Map DB Row to Application Type (snake_case -> camelCase)
const mapRowToProfile = (row: UserDBRow): UserProfile => ({
  firstName: row.first_name,
  lastName: row.last_name,
  middleInitial: row.middle_initial,
  birthday: row.birthday,
  hospitalNumber: row.hospital_number,
  plantillaPosition: row.plantilla_position,
  role: row.role as UserRole,
  division: row.division,
  departmentOrSection: row.department_section,
  progress: row.progress || {}
});

// Map Application Type to DB Row (camelCase -> snake_case)
const mapProfileToRow = (data: Partial<RegistrationData>): Partial<UserDBRow> => ({
  first_name: data.firstName,
  last_name: data.lastName,
  middle_initial: data.middleInitial,
  birthday: data.birthday,
  // hospital_number should not be updated as it's the key
  plantilla_position: data.plantillaPosition,
  role: data.role,
  division: data.division,
  department_section: data.departmentOrSection
});


const handleSupabaseError = (error: any, operation: string) => {
  console.error(`Error during ${operation}:`, JSON.stringify(error, null, 2));
  
  if (error?.code === '42501') {
    const msg = `Database Permission Error (RLS Policy Violation).\n\nTo fix this, go to Supabase SQL Editor and run:\n\ncreate policy "Enable all access for public" on public.users for all to anon using (true) with check (true);`;
    alert(msg);
    console.warn("RLS FIX REQUIRED:", "create policy \"Enable all access for public\" on public.users for all to anon using (true) with check (true);");
  } else {
    alert(`${operation} failed: ${error.message || 'Unknown error'}`);
  }
};

export const dataService = {
  /**
   * Fetch all users from Supabase
   */
  async fetchUsers(): Promise<UserProfile[]> {
    if (!isSupabaseConfigured) {
        console.warn('Supabase is not configured. Returning empty user list.');
        return [];
    }

    const { data, error } = await supabase
      .from('users')
      .select('*');

    if (error) {
      console.error('Error fetching users:', JSON.stringify(error, null, 2));
      // For fetch, we don't alert to avoid spamming on load, but we log the RLS hint
      if (error.code === '42501') {
        console.warn('HINT: Table "users" likely has RLS enabled but no select policy for "anon".');
      }
      return [];
    }

    return (data as UserDBRow[]).map(mapRowToProfile);
  },

  /**
   * Register a new user
   */
  async registerUser(data: RegistrationData): Promise<UserProfile | null> {
    if (!isSupabaseConfigured) {
        alert('Cannot register user: Supabase is not configured.');
        return null;
    }

    // Use the generic mapper, ensuring progress is initialized
    const row = { ...mapProfileToRow(data), hospital_number: data.hospitalNumber, progress: {} };
    
    const { data: insertedData, error } = await supabase
      .from('users')
      .insert([row])
      .select()
      .single();

    if (error) {
      handleSupabaseError(error, 'User Registration');
      return null;
    }

    return mapRowToProfile(insertedData as UserDBRow);
  },

  /**
   * Update an existing user's profile
   */
  async updateUser(
    hospitalNumber: string, 
    data: RegistrationData
  ): Promise<UserProfile | null> {
    if (!isSupabaseConfigured) {
      alert('Cannot update user: Supabase is not configured.');
      return null;
    }

    const row = mapProfileToRow(data);
    // Remove undefined keys so they don't overwrite existing data in Supabase
    Object.keys(row).forEach(key => (row as any)[key] === undefined && delete (row as any)[key]);

    const { data: updatedData, error } = await supabase
      .from('users')
      .update(row)
      .eq('hospital_number', hospitalNumber)
      .select()
      .single();

    if (error) {
      handleSupabaseError(error, 'User Profile Update');
      return null;
    }
    
    return mapRowToProfile(updatedData as UserDBRow);
  },

  /**
   * Delete a user by their hospital number
   */
  async deleteUser(hospitalNumber: string): Promise<boolean> {
    if (!isSupabaseConfigured) {
      alert('Cannot delete user: Supabase is not configured.');
      return false;
    }

    const { error } = await supabase
      .from('users')
      .delete()
      .eq('hospital_number', hospitalNumber);

    if (error) {
      handleSupabaseError(error, 'User Deletion');
      return false;
    }

    return true;
  },

  /**
   * Update a user's progress for a specific module using an RPC function for atomicity.
   */
  async updateUserProgress(
    hospitalNumber: string, 
    moduleId: string, 
    newModuleProgress: ModuleProgress
  ): Promise<boolean> {
    if (!isSupabaseConfigured) return false;
    
    // Call the Supabase function to atomically update the JSONB progress field
    const { error } = await supabase.rpc('update_user_progress', {
      p_hospital_number: hospitalNumber,
      p_module_id: moduleId,
      p_new_progress: newModuleProgress,
    });

    if (error) {
      handleSupabaseError(error, 'Progress Update');
      return false;
    }

    return true;
  }
};