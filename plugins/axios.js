import axios from 'axios'

export default defineNuxtPlugin((nuxtApp) => {
  axios.defaults.baseURL = nuxtApp?.$config.public.baseUrl

 return { 
  provide: {
    axios: axios
  }
 }
})