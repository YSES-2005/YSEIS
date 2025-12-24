/// <reference types="vite/client" />

interface ImportMetaEnv {
  readonly VITE_API_URL?: string
  // Optional legacy support
  readonly API_URL?: string
}

interface ImportMeta {
  readonly env: ImportMetaEnv
}
