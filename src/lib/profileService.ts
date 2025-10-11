import { supabase } from './supabase';

export interface ProfileUpdateData {
  name?: string;
  age?: number | null;
  gender?: string | null;
  height?: number | null;
  weight?: number | null;
}

export async function updateProfile(userId: string, data: ProfileUpdateData) {
  const { error } = await supabase
    .from('profiles')
    .update(data)
    .eq('id', userId);

  if (error) throw error;
}

export async function uploadAvatar(userId: string, file: File): Promise<string> {
  const fileExt = file.name.split('.').pop();
  const fileName = `${userId}/avatar.${fileExt}`;

  const { error: uploadError } = await supabase.storage
    .from('avatars')
    .upload(fileName, file, {
      upsert: true,
      contentType: file.type,
    });

  if (uploadError) throw uploadError;

  const { data } = supabase.storage
    .from('avatars')
    .getPublicUrl(fileName);

  const avatarUrl = data.publicUrl;

  const { error: updateError } = await supabase
    .from('profiles')
    .update({ avatar_url: avatarUrl })
    .eq('id', userId);

  if (updateError) throw updateError;

  return avatarUrl;
}

export async function deleteAvatar(userId: string) {
  const { data: profile } = await supabase
    .from('profiles')
    .select('avatar_url')
    .eq('id', userId)
    .single();

  if (profile?.avatar_url) {
    const fileName = `${userId}/avatar.${profile.avatar_url.split('.').pop()}`;

    await supabase.storage
      .from('avatars')
      .remove([fileName]);

    await supabase
      .from('profiles')
      .update({ avatar_url: null })
      .eq('id', userId);
  }
}

export function getAvatarUrl(avatarUrl: string | null | undefined): string | null {
  if (!avatarUrl) return null;
  return avatarUrl;
}
