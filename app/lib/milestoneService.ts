import { supabase } from './supabase';

export interface Milestone {
  id: string;
  title: string;
  description: string;
  milestone_date: string;
  category: '成长' | '学习' | '生活' | '有趣' | '其他';
  image_url?: string;
  created_at?: string;
}

const getMilestones = async (): Promise<Milestone[]> => {
  const { data, error } = await supabase
    .from('milestones')
    .select('*')
    .order('milestone_date', { ascending: false });

  if (error) {
    console.error('Error fetching milestones:', error);
    throw error;
  }

  return data || [];
};

const createMilestone = async (milestone: Omit<Milestone, 'id' | 'created_at'>): Promise<Milestone> => {
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

const updateMilestone = async (id: string, milestone: Partial<Milestone>): Promise<Milestone> => {
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

const deleteMilestone = async (id: string): Promise<void> => {
  const { error } = await supabase
    .from('milestones')
    .delete()
    .eq('id', id);

  if (error) {
    console.error('Error deleting milestone:', error);
    throw error;
  }
};

export const milestoneService = {
  getMilestones,
  createMilestone,
  updateMilestone,
  deleteMilestone
}; 