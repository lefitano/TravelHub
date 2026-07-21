import axios from 'axios';

const api = axios.create({
    baseURL: 'http://localhost:8000'
})

api.interceptors.request.use((config) => {
    const token = localStorage.getItem('token')
    if(token) {
        config.headers.Authorization = `Bearer ${token}`
    }
    return config
})

api.interceptors.response.use(
    (resposta) => resposta,
    (erro) => {
        if (erro.response?.status === 401) {
            localStorage.removeItem('token')
            localStorage.removeItem('nome')
            window.location.href = '/auth'
        }
        return Promise.reject(erro)
    }
)

export default api