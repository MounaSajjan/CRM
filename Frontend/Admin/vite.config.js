import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";

export default defineConfig({
  plugins: [react()],
  base: process.env.VITE_API_BASE || 'CRM/tree/main/Frontend/Admin',
  build: {
    outDir: 'dist', // Vercel auto-detects this
  },
});
