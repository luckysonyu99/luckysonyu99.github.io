import { createClient } from '@supabase/supabase-js';

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!;
const supabaseKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!;

const supabase = createClient(supabaseUrl, supabaseKey);

export interface Settings {
  id: number;
  site_title: string;
  site_description: string;
  baby_name: string | null;
  baby_birthday: string | null;
  theme_color: string;
  email_notifications: boolean;
  browser_notifications: boolean;
  public_milestones: boolean;
  public_photos: boolean;
  created_at: string;
  updated_at: string;
}

export async function getSettings(): Promise<Settings | null> {
  try {
    const { data, error } = await supabase
      .from('settings')
      .select('*')
      .single();

    if (error) throw error;
    return data;
  } catch (error) {
    console.error('Error fetching settings:', error);
    return null;
  }
}

export async function updateSettings(settings: Partial<Settings>): Promise<Settings | null> {
  try {
    const { data, error } = await supabase
      .from('settings')
      .update(settings)
      .eq('id', 1)
      .select()
      .single();

    if (error) throw error;
    return data;
  } catch (error) {
    console.error('Error updating settings:', error);
    return null;
  }
} 