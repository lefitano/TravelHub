import { useAuth } from "../context/AuthContext";
import { Navigate } from "react-router-dom";


export default function ProtectedRoute({children}){
    const {token} = useAuth()

    if(!token){
        return <Navigate to="/auth" />
    }
    const payload = JSON.parse(atob(token.split('.')[1]))
    const expirado = payload.exp * 1000 < Date.now()
    if(expirado){
        return <Navigate to="/auth"/>
    }

    return children;
}