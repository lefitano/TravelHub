import { useState } from "react"
import { useNavigate, useSearchParams } from "react-router-dom"
import AuthNavBar from "../components/AuthNavBar"
import Card from "react-bootstrap/Card"
import Container from "react-bootstrap/Container"
import Form from "react-bootstrap/Form"
import Button from "react-bootstrap/Button"
import api from "../services/api"

export default function RedefinirSenhaPage(){
    const navigate = useNavigate()
    const [searchParams] = useSearchParams()
    const token = searchParams.get('token')

    const [novaSenha, setNovaSenha] = useState('')
    const [confirmarSenha, setConfirmarSenha] = useState('')
    const [erro, setErro] = useState('')
    const [sucesso, setSucesso] = useState(false)

    async function handleSubmit(e){
        e.preventDefault()
        setErro('')

        if(novaSenha.length < 6){
            setErro('A senha deve ter pelo menos 6 caracteres')
            return
        }
        if(novaSenha !== confirmarSenha){
            setErro('As senhas não coincidem')
            return
        }

        try{
            await api.post('/auth/redefinir-senha', { token, novaSenha })
            setSucesso(true)
        }catch{
            setErro('Link inválido ou expirado. Peça um novo link de redefinição.')
        }
    }

    return (
        <>
            <AuthNavBar onCadastrar={() => navigate('/auth', { state: { modo: 'cadastro' } })} />
            <section className="auth-page">
                <Container>
                    <h2 className="auth-titulo">Veyra</h2>
                    <Card className="card-auth">
                        <Card.Body>
                            {!token ? (
                                <p style={{ color: 'red', fontSize: '0.9rem', textAlign: 'center' }}>
                                    Link inválido — falta o token de redefinição.
                                </p>
                            ) : sucesso ? (
                                <>
                                    <p style={{ color: 'green', fontSize: '0.9rem', textAlign: 'center' }}>
                                        Senha redefinida com sucesso!
                                    </p>
                                    <Button className="btn-laranja w-100" onClick={() => navigate('/auth')}>
                                        Ir para o login
                                    </Button>
                                </>
                            ) : (
                                <Form onSubmit={handleSubmit}>
                                    <Form.Group className="mb-3" controlId="form-nova-senha">
                                        <Form.Label>Nova senha:</Form.Label>
                                        <Form.Control
                                            type="password"
                                            placeholder="Nova senha"
                                            value={novaSenha}
                                            onChange={e => setNovaSenha(e.target.value)}
                                        />
                                    </Form.Group>
                                    <Form.Group className="mb-3" controlId="form-confirmar-nova-senha">
                                        <Form.Label>Confirme a nova senha:</Form.Label>
                                        <Form.Control
                                            type="password"
                                            placeholder="Confirme a nova senha"
                                            value={confirmarSenha}
                                            onChange={e => setConfirmarSenha(e.target.value)}
                                        />
                                    </Form.Group>
                                    <Button className="btn-laranja w-100" type="submit">
                                        Redefinir senha
                                    </Button>
                                    {erro && <p style={{ color: 'red', fontSize: '0.85rem', textAlign: 'center', marginTop: '0.75rem' }}>{erro}</p>}
                                </Form>
                            )}
                        </Card.Body>
                    </Card>
                </Container>
            </section>
        </>
    )
}
