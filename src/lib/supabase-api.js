// import { createClient } from '@supabase/supabase-js';

// const supabaseUrl = process.env.VITE_SUPABASE_URL;
// const supabaseServiceKey = process.env.SUPABASE_SERVICE_ROLE_KEY;

// export const supabase = createClient(supabaseUrl, supabaseServiceKey);


// src/lib/supabase.ts (server‑only)
import { createClient } from '@supabase/supabase-js';
import { SUPABASE_URL, SUPABASE_SERVICE_ROLE_KEY } from '$env/static/private';

export const supabase = createClient(
  SUPABASE_URL,
  SUPABASE_SERVICE_ROLE_KEY
);
