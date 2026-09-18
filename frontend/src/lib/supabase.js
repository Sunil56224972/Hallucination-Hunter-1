import { createClient } from '@supabase/supabase-js';

const supabaseUrl = import.meta.env.VITE_SUPABASE_URL || 'https://ucorkicqplscdvxaooiv.supabase.co';
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY || 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InVjb3JraWNxcGxzY2R2eGFvb2l2Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3ODk3NjMwODcsImV4cCI6MjEwNTMzOTA4N30.Sx2GAyGvRje9v4I1uVnxSR9GiyH0SchlfaGqtU6uq7Y';

export const supabase = createClient(supabaseUrl, supabaseAnonKey);
