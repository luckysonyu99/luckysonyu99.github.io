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
  photo_url?: string;
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

export async function getMilestone(id: number): Promise<Milestone | null> {
  try {
    const { data, error } = await supabase
      .from('milestones')
      .select('*')
      .eq('id', id)
      .single();

    if (error) throw error;
    return data;
  } catch (error) {
    console.error('Error fetching milestone:', error);
    return null;
  }
}

export async function uploadMilestonePhoto(file: File): Promise<string | null> {
  try {
    const fileExt = file.name.split('.').pop();
    const fileName = `${Math.random()}.${fileExt}`;
    const filePath = `milestone-photos/${fileName}`;

    const { error: uploadError } = await supabase.storage
      .from('photos')
      .upload(filePath, file);

    if (uploadError) throw uploadError;

    const { data: { publicUrl } } = supabase.storage
      .from('photos')
      .getPublicUrl(filePath);

    return publicUrl;
  } catch (error) {
    console.error('Error uploading photo:', error);
    return null;
  }
}

export async function deleteMilestonePhoto(photoUrl: string): Promise<boolean> {
  try {
    // 从 URL 中提取文件路径
    const filePath = photoUrl.split('/').pop();
    if (!filePath) return false;

    const { error } = await supabase.storage
      .from('photos')
      .remove([`milestone-photos/${filePath}`]);

    if (error) throw error;
    return true;
  } catch (error) {
    console.error('Error deleting photo:', error);
    return false;
  }
} 