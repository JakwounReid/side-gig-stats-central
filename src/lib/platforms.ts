import { supabase } from './supabase';

export interface PlatformData {
  id: string;
  name: string;
  createdAt: string;
}

export const platformsService = {
  // Fetch custom platforms for a user
  async getUserPlatforms(userId: string): Promise<PlatformData[]> {
    const { data, error } = await supabase
      .from('platforms')
      .select('id, name, created_at')
      .eq('user_id', userId)
      .order('created_at', { ascending: true });

    if (error) {
      throw new Error(error.message);
    }

return data?.map((row: any) => ({
            id: row.id,
            name: row.name,
            createdAt: row.created_at,
        })) ?? [];
    
  },

  // Insert a new custom platform for a user
  async addPlatform(userId: string, name: string): Promise<PlatformData | null> {
    const { data, error } = await supabase
      .from('platforms')
      .insert({ user_id: userId, name })
      .select('id, name, created_at')
      .single();

    if (error) {
      throw new Error(error.message);
    }

    return data
      ? { id: data.id, name: data.name, createdAt: data.created_at }
      : null;
  },
};
