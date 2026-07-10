import AuthNavBar from "../components/AuthNavBar";
import { useState } from "react";
import Card from "react-bootstrap/Card";
import Container from "react-bootstrap/Container";
import Form from "react-bootstrap/Form";
import Button from "react-bootstrap/Button";
export default function AuthPage() {
  const [modo, setModo] = useState("login");
  return (
    <>
      <AuthNavBar onCadastrar={() => setModo("cadastro")} />
      <section className="auth-page">
        <Container>
          <h2 className="auth-titulo">TravelHub</h2>
          <Card className="card-auth">
            <Card.Body>
              <Form>
                {modo === 'login' ? (
                  <>
                    <Form.Group className="mb-3" controlId="form-email">
                      <Form.Label>Digite seu email de cadastro:</Form.Label>
                      <Form.Control type="email" placeholder="Seu email" />
                      <Form.Text className="text-muted">
                        Não compartilhe seus dados de cadastro com ninguém.
                      </Form.Text>
                    </Form.Group>

                    <Form.Group className="mb-3" controlId="form-senha">
                      <Form.Label>Digite sua senha:</Form.Label>
                      <Form.Control type="password" placeholder="Senha" />
                    </Form.Group>

                    <Button className="btn-laranja w-100" type="submit">
                      Entrar
                    </Button>

                    <p className="text-center mt-3" style={{fontSize:'0.85rem', color:'var(--cor-textos-suaves)'}}>
                      Não possui cadastro?{' '}
                      <span className="link-cadastro" onClick={() => setModo('cadastro')}>
                        Cadastre-se agora.
                      </span>
                    </p>
                  </>
                ) : (
                  <>
                    <Form.Group className="mb-3" controlId="form-nome-cadastro">
                      <Form.Label>Digite seu nome completo:</Form.Label>
                      <Form.Control type='text' placeholder="Seu nome" />
                    </Form.Group>

                    <Form.Group className="mb-3" controlId="form-email-cadastro">
                      <Form.Label>Digite seu email para cadastro:</Form.Label>
                      <Form.Control type='email' placeholder="Seu email" />
                    </Form.Group>

                    <Form.Group className="mb-3" controlId="form-senha-cadastro">
                      <Form.Label>Digite sua senha para cadastro:</Form.Label>
                      <Form.Control type='password' placeholder="Senha" />
                      <Form.Text className="text-muted">
                        Não compartilhe seus dados de cadastro com ninguém.
                      </Form.Text>
                    </Form.Group>

                    <Button className="btn-laranja w-100" type="submit">Cadastrar</Button>

                    <p className="text-center mt-3" style={{fontSize: '0.85rem', color:'var(--cor-textos-suaves)'}}>
                      Já tem conta?{' '}
                      <span className="link-cadastro" onClick={() => setModo('login')}>
                        Entrar
                      </span>
                    </p>
                  </>
                )}
              </Form>
            </Card.Body>
          </Card>
        </Container>
      </section>
    </>
  )
}
