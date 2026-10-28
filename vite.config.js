import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import { interviewMiddleware } from './server/interviewServer.js'

export default defineConfig({
  plugins: [react(), interviewMiddleware()],
})
