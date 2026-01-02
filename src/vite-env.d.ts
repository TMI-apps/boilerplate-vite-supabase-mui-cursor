/// <reference types="vite/client" />

interface ImportMetaEnv {
  readonly VITE_SUPABASE_URL?: string;
  readonly VITE_SUPABASE_ANON_KEY?: string; // Legacy: still supported for backward compatibility
  readonly VITE_SUPABASE_PUBLISHABLE_KEY?: string; // Preferred: use publishable key from Supabase dashboard
  readonly VITE_AIRTABLE_API_KEY?: string;
  readonly VITE_AIRTABLE_BASE_ID?: string;
  readonly VITE_AIRTABLE_TABLE_ID?: string;
}

interface ImportMeta {
  readonly env: ImportMetaEnv;
}
