import { createContext, useContext, useState } from "react";

const AuthContext = createContext();

export function AuthProvider({children}){
    const [token, setToken] = useState(localStorage.getItem('token'));
    const [nome, setNome] = useState(localStorage.getItem('nome'))

    function login(novoToken, novoNome){
        setToken(novoToken);
        setNome(novoNome);
        localStorage.setItem('token' , novoToken)
        localStorage.setItem('nome', novoNome)
    }

    function logout(){
        setToken(null);
        setNome(null);
        localStorage.removeItem('token');
        localStorage.removeItem('nome');
    }

    return(
        <AuthContext.Provider value = {{token, nome, login, logout}}>
        {children}
        </AuthContext.Provider>
    )
}

export function useAuth(){
    return useContext(AuthContext);
}