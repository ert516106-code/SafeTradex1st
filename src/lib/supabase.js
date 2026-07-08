import { createClient } from "@supabase/supabase-js";

const supabaseUrl = "https://qxbrfeudlvklislgyxbe.supabase.co";

const supabaseAnonKey =
  "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InF4YnJmZXVkbHZrbGlzbGd5eGJlIiwicm9sZSI6ImFub24iLCJpYXQiOjE3ODM0NzAxMzcsImV4cCI6MjA5OTA0NjEzN30.iIaV36QZxti10-kfp08ymKDtqlIbgUVsdjx13UpXnKc";

export const supabase = createClient(
  supabaseUrl,
  supabaseAnonKey
);
