import axios from 'axios'

export default defineNuxtPlugin((nuxtApp) => {
  axios.defaults.baseURL = 'http://127.0.0.1:8000'

 return { 
  provide: {
    axios: axios
  }
 }
})