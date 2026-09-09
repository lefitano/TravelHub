import { useEffect, useState } from "react"
import { useNavigate, useSearchParams } from "react-router-dom"
import AuthNavBar from "../components/AuthNavBar"
import Card from "react-bootstrap/Card"
import Container from "react-bootstrap/Container"
import Button from "react-bootstrap/Button"
import api from "../services/api"

export default function ConfirmarEmailPage(){
    const navigate = useNavigate()
    const [searchParams] = useSearchParams()
    const token = searchParams.get('token')

    const [status, setStatus] = useState('carregando') // carregando | sucesso | erro

    useEffect(() => {
        async function confirmar(){
            if(!token){
                setStatus('erro')
                return
            }
            try{
                await api.post('/auth/confirmar-email', { token })
                setStatus('sucesso')
            }catch{
                setStatus('erro')
            }
        }
        confirmar()
    }, [token])

    return (
        <>
            <AuthNavBar onCadastrar={() => navigate('/auth', { state: { modo: 'cadastro' } })} />
            <section className="auth-page">
                <Container>
                    <h2 className="auth-titulo">TravelHub</h2>
                    <Card className="card-auth">
                        <Card.Body style={{ textAlign: 'center' }}>
                            {status === 'carregando' && (
                                <p style={{ color: 'var(--cor-textos-suaves)', fontSize: '0.9rem' }}>
                                    Confirmando seu email...
                                </p>
                            )}
                            {status === 'sucesso' && (
                                <>
                                    <p style={{ color: 'green', fontSize: '0.9rem' }}>
                                        Email confirmado com sucesso! Sua conta já está ativa.
                                    </p>
                                    <Button className="btn-laranja w-100" onClick={() => navigate('/auth')}>
                                        Ir para o login
                                    </Button>
                                </>
                            )}
                            {status === 'erro' && (
                                <>
                                    <p style={{ color: 'red', fontSize: '0.9rem' }}>
                                        Link inválido ou expirado. Peça um novo na tela de login.
                                    </p>
                                    <Button className="btn-laranja w-100" onClick={() => navigate('/auth')}>
                                        Ir para o login
                                    </Button>
                                </>
                            )}
                        </Card.Body>
                    </Card>
                </Container>
            </section>
        </>
    )
}
