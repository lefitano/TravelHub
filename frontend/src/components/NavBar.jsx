import Container from "react-bootstrap/Container";
import Button from "react-bootstrap/Button";
import Nav from 'react-bootstrap/Nav';
import Navbar from "react-bootstrap/Navbar";
import { useNavigate } from "react-router-dom";
import {useAuth} from'../context/AuthContext';

function NavBar(){
    const navigate = useNavigate();
    const {logout} = useAuth();

    function handleSair(){
        logout();
        navigate('/');
    }
    return (
        <Navbar
          expand="lg"
          className="navbar-dark"
          style={{ backgroundColor: "var(--cor-navbar-footer)" }}
        >
          <Container>
            <Navbar.Brand onClick = {() => navigate('/')} style={{cursor: 'pointer'}} className="logo-gradiente"> 
                TravelHub
            </Navbar.Brand>
            <Nav className="ms-auto">
                <Nav.Link onClick={() => navigate('/dashboard')}> Painel</Nav.Link>
                <Nav.Link onClick={() => navigate('/eventos')}>Eventos</Nav.Link>
                <Nav.Link onClick={() => navigate('/perfil')}>Meu perfil</Nav.Link>

                <Button className='btn-laranja' onClick={() => handleSair()}>
                    Sair
                    </Button>
            </Nav>
              
          </Container>
        </Navbar>
      );
} export default NavBar;
    
