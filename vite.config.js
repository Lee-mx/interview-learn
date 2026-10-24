import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import { codexInterviewMiddleware } from './server/codexInterview.js'

export default defineConfig({
  plugins: [react(), codexInterviewMiddleware()],
})
