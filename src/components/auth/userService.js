// userService.js
import { supabase } from '../../supabaseClient';

export const getUsersForApproval = async () => {
  const { data, error } = await supabase
    .from('pending_users')
    .select('*');

  if (error) throw error;
  return data;
};

export const approveUser = async (userId) => {
  // Fetch the user from pending_users
  const { data: userData, error: fetchError } = await supabase
    .from('pending_users')
    .select('*')
    .eq('userId', userId)
    .single();

  if (fetchError) throw fetchError;

  // Insert into users table
  const { data, error } = await supabase
    .from('users')
    .insert([userData]);

  if (error) throw error;

  // Remove from pending_users
  await supabase
    .from('pending_users')
    .delete()
    .eq('userId', userId);
};

export const declineUser = async (userId) => {
  await supabase
    .from('pending_users')
    .delete()
    .eq('userId', userId);
};
