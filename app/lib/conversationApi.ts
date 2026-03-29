import { createClient } from './supabase/client'

type Mode = 'symptom' | 'treatment' | 'business'
type Message = { role: 'user' | 'assistant'; content: string }

const supabase = createClient()

export async function loadConversations(): Promise<Record<Mode, Message[]>> {
  const result: Record<Mode, Message[]> = { symptom: [], treatment: [], business: [] }
  const { data } = await supabase
    .from('ai_master_conversations')
    .select('mode, messages')
  if (data) {
    for (const row of data) {
      if (row.mode in result) {
        result[row.mode as Mode] = row.messages as Message[]
      }
    }
  }
  return result
}

export async function saveConversation(mode: Mode, messages: Message[]) {
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) return

  await supabase
    .from('ai_master_conversations')
    .upsert(
      { user_id: user.id, mode, messages, updated_at: new Date().toISOString() },
      { onConflict: 'user_id,mode' }
    )
}

export async function clearConversation(mode: Mode) {
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) return

  await supabase
    .from('ai_master_conversations')
    .delete()
    .eq('user_id', user.id)
    .eq('mode', mode)
}
