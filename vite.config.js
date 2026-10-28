import vue from '@vitejs/plugin-vue'
import { defineConfig } from 'vite'

// https://vite.dev/config/
export default defineConfig({
  plugins: [vue()],
  // This must match the GitHub repository name for a project Pages site.
  base: '/after-school-frontend/',
})
