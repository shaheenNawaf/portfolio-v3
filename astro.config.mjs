import { defineConfig } from 'astro/config';
import tailwindcss from '@tailwindcss/vite';
import react from '@astrojs/react';
import sitemap from '@astrojs/sitemap';

export default defineConfig({
  site: 'https://shaheen.works',
  integrations: [react(), sitemap()],
  vite: {
    plugins: [tailwindcss()],
  },
  server: {
    headers: {
      "Content-Security-Policy": "frame-src 'self' https://www.facebook.com;",
    }
  }
});