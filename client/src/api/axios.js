import axios from 'axios'

const API = axios.create({
  baseURL: import.meta.env.VITE_API_URL || 'http://localhost:5000/api',
})

API.interceptors.request.use((config) => {
  const user = JSON.parse(localStorage.getItem('uzy_user') || '{}')
  if (user?.token) {
    config.headers.Authorization = `Bearer ${user.token}`
  }
  return config


})


export const emailAPI = {
  getStatus:             () => API.get('/email/status'),
  connectGoogle:         () => API.get('/email/google/connect'),
  connectMicrosoft:      () => API.get('/email/microsoft/connect'),
  disconnectGoogle:      () => API.delete('/email/google/disconnect'),
  disconnectMicrosoft:   () => API.delete('/email/microsoft/disconnect'),
}

export default API