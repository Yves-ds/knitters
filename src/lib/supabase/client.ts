import { createClient as createSupabaseClient } from '@supabase/supabase-js'

const SUPABASE_URL = 'https://ekywapjdayffiqmgiept.supabase.co'
const SUPABASE_ANON_KEY = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImVreXdhcGpkYXlmZmlxbWdpZXB0Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3ODMzNDMzOTcsImV4cCI6MjA5ODkxOTM5N30.IIpAtgzxVSXmufIOdNcaNgd0lDNeTVmGT06gWDHXjTQ'

let client: ReturnType<typeof createSupabaseClient> | null = null

export function createClient() {
  if (!client) {
    client = createSupabaseClient(SUPABASE_URL, SUPABASE_ANON_KEY)
  }
  return client
}
