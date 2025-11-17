import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import tailwindcss from '@tailwindcss/vite'

// https://vite.dev/config/
export default defineConfig({
  base: '/AiTool/', // ⚠️ Ye jaruri hai — yahi tera repo name hai
  plugins: [react(), tailwindcss()],
})
