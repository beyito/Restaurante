import instancia from "./axios"


const API_URL = 'https://restaurante-6.onrender.com'
export const registerRequest = user =>instancia.post(`/auth/register`,user)

export const loginRequest = user => instancia.post(`/auth/login`,user)

export const logoutRequest = () => instancia.get('/auth/logout')

export const verifyTokenRequest = () => {
  return fetch(`${API_URL}/auth/verificar`, {
    method: 'GET',
    credentials: 'include' // 🔥 Esto permite enviar la cookie
  })
}
