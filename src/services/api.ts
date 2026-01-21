import axios, { type AxiosInstance } from 'axios'

const API_CONFIG = {
  baseURL: import.meta.env.VITE_API_URL,
  timeout: 10000,
}

export const api: AxiosInstance = axios.create(API_CONFIG)

api.interceptors.request.use((config) => {
  const authHeader = localStorage.getItem('basicAuth')
  if (authHeader) {
    config.headers.Authorization = authHeader
  }
  return config
})

export const setBasicAuth = (username: string, password: string) => {
  const authString = btoa(`${username}:${password}`)
  localStorage.setItem('basicAuth', `Basic ${authString}`)
}

export const clearAuth = () => {
  localStorage.removeItem('basicAuth')
}
