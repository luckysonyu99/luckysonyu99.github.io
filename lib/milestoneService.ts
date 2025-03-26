import { supabase } from './supabase';

export interface Milestone {
  id: number;
  title: string;
  description: string;
  date: string;
  category: '成长' | '学习' | '生活' | '有趣' | '其他';
  emoji: string;
  created_at?: string;
}

export const getMilestones = async (): Promise<Milestone[]> => {
  const { data, error } = await supabase
    .from('milestones')
    .select('*')
    .order('date', { ascending: false });

  if (error) {
    console.error('Error fetching milestones:', error);
    throw error;
  }

  return data || [];
};

export const createMilestone = async (milestone: Omit<Milestone, 'id' | 'created_at'>): Promise<Milestone> => {
  const { data, error } = await supabase
    .from('milestones')
    .insert([milestone])
    .select()
    .single();

  if (error) {
    console.error('Error creating milestone:', error);
    throw error;
  }

  return data;
};

export const updateMilestone = async (id: number, milestone: Partial<Milestone>): Promise<Milestone> => {
  const { data, error } = await supabase
    .from('milestones')
    .update(milestone)
    .eq('id', id)
    .select()
    .single();

  if (error) {
    console.error('Error updating milestone:', error);
    throw error;
  }

  return data;
};

export const deleteMilestone = async (id: number): Promise<void> => {
  const { error } = await supabase
    .from('milestones')
    .delete()
    .eq('id', id);

  if (error) {
    console.error('Error deleting milestone:', error);
    throw error;
  }
}; 