import axios from 'axios'

const AUTH_URL = "http://localhost:8000/auth"

export function login(email, senha){
    return axios.post(`${AUTH_URL}/login`, {email, senha})
}