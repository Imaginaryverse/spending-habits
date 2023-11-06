//// <reference types="vite/client" />

interface ImportMetaEnv {
  readonly SUPABASE_API_URL: string;
  readonly SUPABASE_ANON_KEY: string;
}

interface ImportMeta {
  readonly env: ImportMetaEnv;
}
