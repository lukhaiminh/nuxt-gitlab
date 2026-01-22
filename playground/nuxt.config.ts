export default defineNuxtConfig({
  // modules: ['nuxt-gitlab'],
  modules: ['../src/module'],
  devtools: { enabled: true },
  compatibilityDate: 'latest',
  gitlab: {
    baseUrl: process.env.GITLAB_API_URL,
    token: process.env.GITLAB_TOKEN,
  },
})
