
import { supabase } from './supabase';

export interface Exercise {
  id: string;
  name: string;
  description?: string;
  instructions?: string;
  image_url?: string;
  video_url?: string;
  target_muscles?: string[];
  equipment?: string;
  difficulty?: 'beginner' | 'intermediate' | 'advanced';
  category?: string;
  created_by: string;
  created_at: string;
}

export interface Workout {
  id: string;
  name: string;
  description?: string;
  estimated_duration?: number;
  difficulty?: 'beginner' | 'intermediate' | 'advanced';
  workout_type?: 'strength' | 'cardio' | 'hiit' | 'functional' | 'hybrid';
  created_by: string;
  assigned_to?: string;
  scheduled_date?: string;
  is_active: boolean;
  created_at: string;
}

// Exercises
export const getExercises = async (): Promise<Exercise[]> => {
  const { data, error } = await supabase
    .from('exercises')
    .select('*')
    .eq('is_active', true);
  
  if (error) throw error;
  return data || [];
};

export const getExercise = async (id: string): Promise<Exercise | null> => {
  const { data, error } = await supabase
    .from('exercises')
    .select('*')
    .eq('id', id)
    .single();
  
  if (error) throw error;
  return data;
};

export const createExercise = async (exercise: Omit<Exercise, 'id' | 'created_at'>): Promise<Exercise> => {
  const { data, error } = await supabase
    .from('exercises')
    .insert(exercise)
    .select()
    .single();
  
  if (error) throw error;
  return data;
};

// Workouts
export const getWorkouts = async (userId?: string): Promise<Workout[]> => {
  let query = supabase
    .from('workouts')
    .select('*')
    .eq('is_active', true);
    
  if (userId) {
    query = query.or(`created_by.eq.${userId},assigned_to.eq.${userId}`);
  }
  
  const { data, error } = await query;
  
  if (error) throw error;
  return data || [];
};

export const getWorkout = async (id: string): Promise<Workout | null> => {
  const { data, error } = await supabase
    .from('workouts')
    .select('*')
    .eq('id', id)
    .single();
  
  if (error) throw error;
  return data;
};

export const createWorkout = async (workout: Omit<Workout, 'id' | 'created_at'>): Promise<Workout> => {
  const { data, error } = await supabase
    .from('workouts')
    .insert(workout)
    .select()
    .single();
  
  if (error) throw error;
  return data;
};

// User Profile
export const updateUserProfile = async (userId: string, updates: any) => {
  const { data, error } = await supabase
    .from('profiles')
    .upsert({ id: userId, ...updates })
    .select()
    .single();
  
  if (error) throw error;
  return data;
};

export const getUserProfile = async (userId: string) => {
  const { data, error } = await supabase
    .from('profiles')
    .select('*')
    .eq('id', userId)
    .single();
  
  if (error && error.code !== 'PGRST116') throw error; // PGRST116 = not found
  return data;
};
