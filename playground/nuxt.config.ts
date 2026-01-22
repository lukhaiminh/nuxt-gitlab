export default defineNuxtConfig({
  // modules: ['nuxt-gitlab'],
  modules: ['../src/module'],
  devtools: { enabled: true },
  compatibilityDate: 'latest',
  vite: {
    server: {
      hmr: {
        protocol: 'ws',
        host: 'localhost',
        port: 24679,
      },
    },
  },
  gitlab: {
    baseUrl: process.env.GITLAB_API_URL,
    token: process.env.GITLAB_TOKEN,
  },
})
