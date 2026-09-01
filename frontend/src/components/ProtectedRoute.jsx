import { useAuth } from "../context/AuthContext";
import { Navigate } from "react-router-dom";

// função pura auxiliar, fora do componente: decodificar o JWT e comparar com
// Date.now() são operações "impuras" pra regra de pureza de render do React —
// isolar isso numa função à parte evita o aviso e mantém o corpo do componente limpo.
// Um token corrompido/malformado no localStorage também é tratado como expirado
// aqui, em vez de deixar o JSON.parse quebrar a árvore de componentes inteira.
function tokenInvalidoOuExpirado(token) {
    try {
        const payload = JSON.parse(atob(token.split('.')[1]))
        return payload.exp * 1000 < Date.now()
    } catch {
        return true
    }
}

export default function ProtectedRoute({children}){
    const {token} = useAuth()

    if(!token || tokenInvalidoOuExpirado(token)){
        return <Navigate to="/auth" />
    }

    return children;
}
