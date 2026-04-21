import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import tailwindcss from '@tailwindcss/vite'
import { VitePWA } from 'vite-plugin-pwa'

export default defineConfig({
  plugins: [
    react(),
    tailwindcss(),
    VitePWA({
      registerType: 'autoUpdate',
      // campo.jpg e icon.png se precachean para uso offline
      includeAssets: ['campo.jpg', 'icon.png', 'favicon.svg'],
      manifest: {
        name: 'Tactics Board — XI Inicial',
        short_name: 'XI Inicial',
        description: 'Pizarra táctica de fútbol interactiva',
        theme_color: '#000000',
        background_color: '#000000',
        display: 'standalone',
        orientation: 'portrait',
        start_url: '/',
        scope: '/',
        icons: [
          {
            src: 'icon.png',
            sizes: '192x192',
            type: 'image/png',
            purpose: 'any',
          },
          {
            src: 'icon.png',
            sizes: '512x512',
            type: 'image/png',
            purpose: 'maskable',
          },
        ],
      },
      workbox: {
        // precachea todo JS, CSS, HTML, imágenes
        globPatterns: ['**/*.{js,css,html,ico,png,jpg,jpeg,svg,webp,woff2}'],
        // assets grandes (campo) → cache-first sin expirar
        runtimeCaching: [
          {
            urlPattern: ({ url }) => url.pathname.startsWith('/campo'),
            handler: 'CacheFirst',
            options: {
              cacheName: 'field-image',
              expiration: { maxEntries: 2 },
            },
          },
          {
            urlPattern: /^https:\/\/fonts\.(googleapis|gstatic)\.com\/.*/i,
            handler: 'CacheFirst',
            options: {
              cacheName: 'google-fonts',
              expiration: { maxEntries: 10, maxAgeSeconds: 60 * 60 * 24 * 365 },
            },
          },
        ],
      },
    }),
  ],
})
