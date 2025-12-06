
import { createClient } from '@supabase/supabase-js';

// Hardcode the Supabase credentials for robust connection
const supabaseUrl = 'https://mrhqjzblspjhdlisnyno.supabase.co';
const supabaseAnonKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Im1yaHFqemJsc3BqaGRsaXNueW5vIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NjQzMTEwODAsImV4cCI6MjA3OTg4NzA4MH0.CMCn73brLmS4JQwZ5kAFTXfWLu5-4qMxg-4KZYWSIUY';

// The client is always configured with these credentials
export const isSupabaseConfigured = true;

// Initialize and export the Supabase client
export const supabase = createClient(supabaseUrl, supabaseAnonKey);
