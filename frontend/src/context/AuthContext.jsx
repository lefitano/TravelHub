import { createContext, useContext, useState } from "react";

const AuthContext = createContext();

export default function AuthProvider({children}){
    const [token, setToken] = useState(localStorage);

    function login(novoToken){
        setToken(novoToken);
        localStorage.setItem('token' , novoToken)
    }

    function logout(){
        setToken(null);
        localStorage.removeItem('token');
    }

    return(
        <AuthContext.Provider value = {{token, login, logout}}>
        {children}
        </AuthContext.Provider>
    )
}

export function useAuth(){
    return useContext(AuthContext);
}