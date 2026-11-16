import { createClient } from '@supabase/supabase-js'

// Klien dengan kunci pulbik. Aman dibaca orang lain
// dan hanya bisa melakukan apa yang diizinkan oleh aturan di dalam database

export const supabase = createClient(
    process.env.SUPABASE_URL!,
    process.env.SUPABASE_PUBLISHABLE_KEY!,
);