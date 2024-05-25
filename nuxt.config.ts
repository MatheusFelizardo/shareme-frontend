// https://nuxt.com/docs/api/configuration/nuxt-config
export default defineNuxtConfig({
  app: {
    head: {
      title: 'App Title',
    }
  },
  modules: [
    '@pinia/nuxt',
    '@pinia-plugin-persistedstate/nuxt'
  ],
  css: ['~/assets/css/main.css'],
  postcss: {
    plugins: {
      tailwindcss: {},
      autoprefixer: {},
    },
  },
  // plugins: ['~/plugins/history.js'],
  runtimeConfig: {
    public: {
      baseUrl: process.env.NODE_ENV === "development" ? 'http://127.0.0.1:8000' : process.env.API_BASE_URL,
    }
  },
  
})
