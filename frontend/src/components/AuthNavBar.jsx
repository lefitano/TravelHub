import Container from "react-bootstrap/Container";
import Nav from "react-bootstrap/Nav";
import Navbar from "react-bootstrap/Navbar";
import Button from "react-bootstrap/Button";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";


function AuthNavBar({onCadastrar}) {
  const navigate = useNavigate();
  const { token } = useAuth();

  function handleLogoClick(){
    navigate(token ? '/dashboard' : '/');
  }

  return (
    <Navbar
      expand="lg"
      className="navbar-dark"
      style={{ backgroundColor: "var(--cor-navbar-footer)" }}
    >
      <Container>
        <Navbar.Brand onClick={handleLogoClick} style={{cursor: 'pointer'}} className="logo-gradiente">
          TravelHub
        </Navbar.Brand>
        <Navbar.Toggle aria-controls="opcoes-basicas" />
        <Navbar.Collapse id="opcoes-basicas">
          <Nav className="ms-auto">
            <Button className="btn-laranja" onClick={onCadastrar}>
              Cadastre-se agora
            </Button>
          </Nav>
        </Navbar.Collapse>
      </Container>
    </Navbar>
  );
}

export default AuthNavBar;
