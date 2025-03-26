import { createClient } from '@supabase/supabase-js';

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!;
const supabaseKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!;

const supabase = createClient(supabaseUrl, supabaseKey);

export interface Milestone {
  id: number;
  title: string;
  description: string;
  milestone_date: string;
  category: string;
  created_at: string;
  updated_at: string;
}

export async function getMilestones(): Promise<Milestone[]> {
  try {
    const { data, error } = await supabase
      .from('milestones')
      .select('*')
      .order('milestone_date', { ascending: false });

    if (error) throw error;
    return data || [];
  } catch (error) {
    console.error('Error fetching milestones:', error);
    return [];
  }
}

export async function createMilestone(milestone: Omit<Milestone, 'id' | 'created_at' | 'updated_at'>): Promise<Milestone | null> {
  try {
    const { data, error } = await supabase
      .from('milestones')
      .insert([milestone])
      .select()
      .single();

    if (error) throw error;
    return data;
  } catch (error) {
    console.error('Error creating milestone:', error);
    return null;
  }
}

export async function updateMilestone(id: number, milestone: Partial<Milestone>): Promise<Milestone | null> {
  try {
    const { data, error } = await supabase
      .from('milestones')
      .update(milestone)
      .eq('id', id)
      .select()
      .single();

    if (error) throw error;
    return data;
  } catch (error) {
    console.error('Error updating milestone:', error);
    return null;
  }
}

export async function deleteMilestone(id: number): Promise<boolean> {
  try {
    const { error } = await supabase
      .from('milestones')
      .delete()
      .eq('id', id);

    if (error) throw error;
    return true;
  } catch (error) {
    console.error('Error deleting milestone:', error);
    return false;
  }
} 