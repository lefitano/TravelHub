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
      <Container>
        <h2 className="logo-gradiente">TravelHub</h2>
        <Card>
            <Card.Body>
          <Form>
            <Form.Group className="mb-3" controlId="form-email">
              <Form.Label>Digite seu email de cadastro</Form.Label>
              <Form.Control type="email" placeholder="Seu email"/>
              <Form.Text className="text-muted">
                Não compartilhe seus dados de cadastro com ninguém.
              </Form.Text>
            </Form.Group>

            <Form.Group className="mb-3" controlId="form-senha">
              <Form.Label>Digite sua senha</Form.Label>
              <Form.Control type="password" placeholder="Senha" />
            </Form.Group>
            <Button className="btn-laranja" type="submit">
              Entrar
            </Button>
          </Form>
          </Card.Body>
        </Card>
      </Container>
    </>
  );
}
