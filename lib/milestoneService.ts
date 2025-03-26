import { supabase } from './supabase';

export interface Milestone {
  id: string;
  date: string;
  title: string;
  description: string;
  category: '成长' | '学习' | '生活' | '有趣' | '其他';
  emoji: string;
  created_at?: string;
}

export const milestoneService = {
  async getMilestones() {
    const { data, error } = await supabase
      .from('milestones')
      .select('*')
      .order('date', { ascending: false });

    if (error) {
      console.error('Error fetching milestones:', error);
      return [];
    }

    return data as Milestone[];
  },

  async addMilestone(milestone: Omit<Milestone, 'id' | 'created_at'>) {
    const { data, error } = await supabase
      .from('milestones')
      .insert([milestone])
      .select()
      .single();

    if (error) {
      console.error('Error adding milestone:', error);
      throw error;
    }

    return data as Milestone;
  },

  async deleteMilestone(id: string) {
    const { error } = await supabase
      .from('milestones')
      .delete()
      .eq('id', id);

    if (error) {
      console.error('Error deleting milestone:', error);
      throw error;
    }
  },
}; 