// supabaseClient.ts
import { createClient } from '@supabase/supabase-js'

const supabaseUrl = 'https://nzdezkupphqcjqprqhww.supabase.co';
const supabaseAnonKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Im56ZGV6a3VwcGhxY2pxcHJxaHd3Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3NTgyMDUyMzQsImV4cCI6MjA3Mzc4MTIzNH0.suLKsd_jjXk3SwknZkIfKIbhzsU9nV2d1B2C6GKYYWQ';

export const supabase = createClient(supabaseUrl, supabaseAnonKey);
