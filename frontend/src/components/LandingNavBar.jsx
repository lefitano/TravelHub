import Container from "react-bootstrap/Container";
import Nav from "react-bootstrap/Nav";
import Navbar from "react-bootstrap/Navbar";
import Button from "react-bootstrap/Button";
import { useNavigate } from "react-router-dom";

function LandingNavBar() {
  const navigate = useNavigate();
  return (
    <Navbar
      expand="lg"
      className="navbar-dark"
      style={{ backgroundColor: "var(--cor-navbar-footer)" }}
    >
      <Container>
        <Navbar.Brand href="#home" className="logo-gradiente">TravelHub</Navbar.Brand>
        <Navbar.Toggle aria-controls="opcoes-basicas" />
        <Navbar.Collapse id="opcoes-basicas">
          <Nav className="ms-auto">
            <Nav.Link href="#sobre">Sobre</Nav.Link>
            <Button className="btn-laranja" onClick={() => navigate("/auth")}>Comece já</Button>
          </Nav>
        </Navbar.Collapse>
      </Container>
    </Navbar>
  );
}

export default LandingNavBar;
