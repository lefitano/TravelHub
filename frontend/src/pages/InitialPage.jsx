import LandingNavBar from "../components/LandingNavBar";
import Container from "react-bootstrap/Container";
import Button from "react-bootstrap/Button";
import Row from "react-bootstrap/Row";
import Col from "react-bootstrap/Col";
import Card from "react-bootstrap/Card";
import { useNavigate } from "react-router-dom";
import { MdEvent, MdAttachMoney, MdHowToVote } from "react-icons/md";
import { BsGeoAlt, BsSuitcaseLg, BsCheck2Square, BsWallet2 } from "react-icons/bs";
import Footer from "../components/Footer";
export default function InitialPage() {
  const navigate = useNavigate();
  return (
    <>
      <LandingNavBar />
      <section id="hero">
        <div className="hero-aurora" aria-hidden="true">
          <span className="hero-aurora-blob hero-aurora-blob--1"></span>
          <span className="hero-aurora-blob hero-aurora-blob--2"></span>
        </div>
        <Container>
          <Row className="align-items-center">
            <Col lg={6} className="hero-text">
              <h1>
                <span className="logo-gradiente">TravelHub</span>
              </h1>
              <p>Seu organizador de Viagens e Saídas</p>
              <Button className="btn-laranja" onClick={() => navigate("/auth", { state: { modo: "cadastro" } })}>
                Comece já
              </Button>
            </Col>
            <Col lg={6} className="hero-visual">
              <div className="mockup-window">
                <div className="mockup-topbar">
                  <span className="mockup-dot"></span>
                  <span className="mockup-dot"></span>
                  <span className="mockup-dot"></span>
                </div>
                <div className="mockup-body">
                  <div className="mockup-titlebar">
                    <div>
                      <p className="mockup-evento-nome">Praia de Flecheiras</p>
                      <p className="mockup-evento-destino">
                        <BsGeoAlt /> Trairi, CE
                      </p>
                    </div>
                    <span className="mockup-badge">
                      <BsSuitcaseLg /> Viagem
                    </span>
                  </div>
                  <div className="mockup-stats">
                    <div className="mockup-stat">
                      <span>12</span>
                      <small>Dias restantes</small>
                    </div>
                    <div className="mockup-stat">
                      <span>6</span>
                      <small>Participantes</small>
                    </div>
                    <div className="mockup-stat">
                      <span>R$ 1.240</span>
                      <small>Despesas</small>
                    </div>
                  </div>
                  <div className="mockup-participantes">
                    <span className="mockup-avatar"></span>
                    <span className="mockup-avatar"></span>
                    <span className="mockup-avatar"></span>
                    <span className="mockup-avatar-mais">+3</span>
                  </div>
                </div>
              </div>
              <div className="mockup-float mockup-float--voto">
                <BsCheck2Square /> Voto registrado
              </div>
              <div className="mockup-float mockup-float--despesa">
                <BsWallet2 /> R$ 320,00 dividido
              </div>
            </Col>
          </Row>
        </Container>
      </section>

      <section id="sobre">
        <Container className="mb-5">
          <p className="intro">
            Da viagem em grupo ao happy hour de sábado. Todo evento
            compartilhado tem os mesmos desafios: combinar datas, dividir
            contas e decidir democraticamente. O TravelHub centraliza tudo isso, no
            lugar do WhatsApp disperso e das planilhas soltas.
          </p>
          <h2>Funcionalidades</h2>
          <Row>
            <Col>
              <Card className="cards-funcionalidades">
                <Card.Body>
                  <MdEvent size={40} color="#ff6b35" className="mb-2" />
                  <Card.Title>Gestão de Viagens e Saídas</Card.Title>
                  <Card.Text>
                    Crie e organize suas viagens e saídas em grupo, tudo em
                    um só lugar.
                  </Card.Text>
                </Card.Body>
              </Card>
            </Col>
            <Col>
              <Card className="cards-funcionalidades">
                <Card.Body>
                  <MdAttachMoney size={40} color="#ff6b35" className="mb-2" />
                  <Card.Title>Controle Financeiro</Card.Title>
                  <Card.Text>
                    Registre despesas e divida seus custos automaticamente.
                  </Card.Text>
                </Card.Body>
              </Card>
            </Col>
            <Col>
              <Card className="cards-funcionalidades">
                <Card.Body>
                  <MdHowToVote
                    size={40}
                    color="#ff6b35"
                    className="mb-2"
                  ></MdHowToVote>
                  <Card.Title>Votações em grupo</Card.Title>
                  <Card.Text>
                    Tome decisões coletivas com enquetes em tempo real.
                  </Card.Text>
                </Card.Body>
              </Card>
            </Col>
          </Row>
        </Container>
      </section>
      <section>
        <Footer />
      </section>
    </>
  );
}
