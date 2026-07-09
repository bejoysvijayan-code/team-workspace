import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

// NOTE: update `base` to match your GitHub repo name before deploying to
// GitHub Pages, e.g. base: '/your-repo-name/'. Leave as '/' for local dev.
export default defineConfig({
  base: '/team-workspace/',
  plugins: [react()],
})
