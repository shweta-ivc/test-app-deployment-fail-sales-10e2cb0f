import { createClient } from '@supabase/supabase-js'

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY
const supabaseServiceRoleKey = process.env.SUPABASE_SERVICE_ROLE_KEY

if (!supabaseUrl || !supabaseAnonKey) {
  throw new Error('Missing Supabase environment variables')
}

// Create Supabase clients
export const supabase = createClient(supabaseUrl, supabaseAnonKey)
export const supabaseAdmin = supabaseServiceRoleKey 
  ? createClient(supabaseUrl, supabaseServiceRoleKey) 
  : null

// Helper function to get authenticated user
export async function getUserFromToken(token) {
  if (!token) return null

  try {
    const { data: { user }, error } = await supabase.auth.getUser(token)
    if (error) throw error
    return user
  } catch (error) {
    console.error('Error getting user from token:', error)
    return null
  }
}

// Database operation helpers
export async function getChatInteractions(userId) {
  const { data, error } = await supabase
    .from('chat_interactions')
    .select('*')
    .eq('user_id', userId)
    .order('created_at', { ascending: false })

  if (error) throw error
  return data
}

export async function getChatInteractionById(id, userId) {
  const { data, error } = await supabase
    .from('chat_interactions')
    .select('*')
    .eq('id', id)
    .eq('user_id', userId)
    .single()

  if (error) throw error
  return data
}

export async function createChatInteraction(interactionData) {
  const { data, error } = await supabase
    .from('chat_interactions')
    .insert(interactionData)
    .select()
    .single()

  if (error) throw error
  return data
}

export async function updateChatInteraction(id, updates, userId) {
  const { data, error } = await supabase
    .from('chat_interactions')
    .update(updates)
    .eq('id', id)
    .eq('user_id', userId)
    .select()
    .single()

  if (error) throw error
  return data
}

export async function deleteChatInteraction(id, userId) {
  const { error } = await supabase
    .from('chat_interactions')
    .delete()
    .eq('id', id)
    .eq('user_id', userId)

  if (error) throw error
  return true
}