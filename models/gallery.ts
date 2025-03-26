import { createClient } from '@supabase/supabase-js';

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!;
const supabaseKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!;

const supabase = createClient(supabaseUrl, supabaseKey);

export interface Photo {
  id: number;
  title: string;
  description: string;
  url: string;
  created_at: string;
  updated_at: string;
}

export async function getPhotos(): Promise<Photo[]> {
  try {
    const { data, error } = await supabase
      .from('photos')
      .select('*')
      .order('created_at', { ascending: false });

    if (error) throw error;
    return data || [];
  } catch (error) {
    console.error('Error fetching photos:', error);
    return [];
  }
}

export async function uploadPhoto(file: File): Promise<string | null> {
  try {
    const fileExt = file.name.split('.').pop();
    const fileName = `${Math.random()}.${fileExt}`;
    const filePath = `photos/${fileName}`;

    const { error: uploadError } = await supabase.storage
      .from('images')
      .upload(filePath, file);

    if (uploadError) throw uploadError;

    const { data: { publicUrl } } = supabase.storage
      .from('images')
      .getPublicUrl(filePath);

    return publicUrl;
  } catch (error) {
    console.error('Error uploading photo:', error);
    return null;
  }
}

export async function createPhoto(photo: Omit<Photo, 'id' | 'created_at' | 'updated_at'>): Promise<Photo | null> {
  try {
    const { data, error } = await supabase
      .from('photos')
      .insert([photo])
      .select()
      .single();

    if (error) throw error;
    return data;
  } catch (error) {
    console.error('Error creating photo:', error);
    return null;
  }
}

export async function updatePhoto(id: number, photo: Partial<Photo>): Promise<Photo | null> {
  try {
    const { data, error } = await supabase
      .from('photos')
      .update(photo)
      .eq('id', id)
      .select()
      .single();

    if (error) throw error;
    return data;
  } catch (error) {
    console.error('Error updating photo:', error);
    return null;
  }
}

export async function deletePhoto(id: number): Promise<boolean> {
  try {
    const { error } = await supabase
      .from('photos')
      .delete()
      .eq('id', id);

    if (error) throw error;
    return true;
  } catch (error) {
    console.error('Error deleting photo:', error);
    return false;
  }
} 