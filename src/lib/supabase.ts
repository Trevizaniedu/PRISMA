
import { createClient } from '@supabase/supabase-js'

const supabaseUrl = 'https://cuitouskcxwhadereqte.supabase.co'

const supabasePublishableKey =
  'sb_publishable_pF-h_cEJcCk1Bz-K4Ca-pg_d1FMP4BF'

export const supabase = createClient(
  supabaseUrl,
  supabasePublishableKey
)

