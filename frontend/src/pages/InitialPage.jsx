import LandingNavBar from "../components/LandingNavBar";
import Container from "react-bootstrap/Container";
import Button from "react-bootstrap/Button";
import Row from 'react-bootstrap/Row';
import Col from 'react-bootstrap/Col';
import Card from 'react-bootstrap/Card';
import { useNavigate } from "react-router-dom";
import {MdEvent, MdAttachMoney, MdHowToVote} from 'react-icons/md';
import Footer from "../components/Footer";
export default function InitialPage() {
  const navigate = useNavigate();
  return (
    <>
      <LandingNavBar />
      <section id="hero">
        <Container>
          <h1>
            <span className="logo-gradiente">TravelHub</span>
          </h1>
          <p>Seu organizador de Viagens e Eventos</p>
          <Button className="btn-laranja" onClick={() => navigate("/auth")}>Comece já</Button>
        </Container>
      </section>
    

      <section id='sobre'>
        <Container className="mb-5">
          <p className="intro">
            Organizar viagens e eventos em grupo ficou muito mais fácil, evite confusões.
            O TravelHub centraliza tudo em um único lugar.
          </p>
            <h2>Funcionalidades</h2>
           <Row>
            <Col>
            <Card className="cards-funcionalidades">
                <Card.Body>
                    <MdEvent size={40} color='#ff6b35' className="mb-2"/>
                    <Card.Title>Gestão de Eventos ou viagens</Card.Title>
                    <Card.Text>Crie e organize suas viagens ou eventos para seu grupo.</Card.Text>
                </Card.Body>
            </Card>
            </Col>
            <Col>
            <Card className="cards-funcionalidades">
                <Card.Body>
                    <MdAttachMoney size={40} color='#ff6b35' className="mb-2"/>
                    <Card.Title>Controle Financeiro</Card.Title>
                    <Card.Text>Registre despesas e divida seus custos automaticamente.</Card.Text>
                </Card.Body>
            </Card>
            </Col>
            <Col>
            <Card className="cards-funcionalidades">
                <Card.Body>
                    <MdHowToVote size={40} color='#ff6b35' className="mb-2"></MdHowToVote>
                    <Card.Title>Votações em grupo</Card.Title>
                    <Card.Text>Tome decisões coletivas com enquetes em tempo real.</Card.Text>
                </Card.Body>
            </Card>
            </Col>
           </Row>
        </Container>
      </section>
      <section>
        <Footer/>
      </section>
    </>
  );
}
