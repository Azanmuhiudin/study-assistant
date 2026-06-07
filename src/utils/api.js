import axios from 'axios'

const BASE_URL = import.meta.env.PROD ? '/api' : '/api'

export const api = {
  summarize: (data) => axios.post(`${BASE_URL}/summarize`, data),
  chat: (data) => axios.post(`${BASE_URL}/chat`, data),
  quiz: (data) => axios.post(`${BASE_URL}/quiz`, data),
  flashcards: (data) => axios.post(`${BASE_URL}/flashcards`, data),
}