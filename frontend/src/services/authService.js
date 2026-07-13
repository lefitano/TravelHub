
import api from './api'



export function login(email, senha){
    return api.post('/auth/login', {email,senha});
}