import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

// https://vite.dev/config/
export default defineConfig({
  plugins: [react()],
  
  // Path resolution
  resolve: {
    alias: {
      '@': '/src',
      '@/components': '/src/components',
      '@/pages': '/src/pages',
      '@/hooks': '/src/hooks',
      '@/services': '/src/services',
      '@/store': '/src/store',
      '@/utils': '/src/utils',
      '@/constants': '/src/constants',
      '@/types': '/src/types',
      '@/styles': '/src/styles',
      '@/assets': '/src/assets',
    },
  },

  // Development server configuration
  server: {
    port: 3000,
    host: true,
    proxy: {
      '/api': {
        target: 'http://localhost:8000',
        changeOrigin: true,
        secure: false,
        rewrite: (path) => path.replace(/^\/api/, ''),
      },
    },
  },

  // Build configuration
  build: {
    outDir: 'dist',
    sourcemap: true,
    rollupOptions: {
      output: {
        manualChunks: {
          // Vendor chunks for better caching
          react: ['react', 'react-dom'],
          router: ['react-router-dom'],
          redux: ['@reduxjs/toolkit', 'react-redux'],
          mui: ['@mui/material', '@mui/icons-material'],
          forms: ['react-hook-form', '@hookform/resolvers', 'yup'],
          utils: ['axios', 'date-fns'],
        },
      },
    },
    // Chunk size warning limit
    chunkSizeWarningLimit: 1000,
  },

  // Environment variables
  envPrefix: 'VITE_',

  // CSS configuration
  css: {
    devSourcemap: true,
  },

  // Performance optimizations
  optimizeDeps: {
    include: [
      'react',
      'react-dom',
      'react-router-dom',
      '@reduxjs/toolkit',
      'react-redux',
      '@mui/material',
      '@emotion/react',
      '@emotion/styled',
    ],
  },
})
