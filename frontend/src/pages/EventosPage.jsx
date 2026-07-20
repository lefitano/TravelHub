import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import api from "../services/api";
import NavBar from "../components/NavBar";
import Container from "react-bootstrap/Container";
import Button from "react-bootstrap/Button";
import Col from "react-bootstrap/Col";
import Row from "react-bootstrap/Row";
import Card from "react-bootstrap/Card";
import Form from "react-bootstrap/Form";
import { BsCalendar3 } from "react-icons/bs";

export default function EventosPage() {
  const [eventos, setEventos] = useState([]);
  const [mostrarForm, setMostrarForm] = useState(false);
  const [nome, setNome] = useState("");
  const [descricao, setDescricao] = useState("");
  const [destino, setDestino] = useState("");
  const [dataInicio, setDataInicio] = useState("");
  const [dataFim, setDataFim] = useState("");
  const [erroForm, setErroForm] = useState("");

  const navigate = useNavigate();

  useEffect(() => {
    async function carregarEventos() {
      const resposta = await api.get("/eventos/meus");
      setEventos(resposta.data);
    }
    carregarEventos();
  }, []);

  async function handleCriarEvento(e) {
    e.preventDefault();
    setErroForm("");
    try {
      await api.post("/eventos", {
        nome,
        descricao,
        destino,
        dataInicio,
        dataFim,
      });
      setMostrarForm(false);
      setNome("");
      setDescricao("");
      setDestino("");
      setDataInicio("");
      setDataFim("");
      const resposta = await api.get("/eventos/meus");
      setEventos(resposta.data);
    } catch (error) {
      setErroForm("Erro ao criar evento. Verifique os dados");
    }
  }

  return (
    <>
      <NavBar />
      <Container>
        {!mostrarForm && (
          <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginTop: "3rem" }}>
            <h2 style={{ fontFamily: "Raleway, sans-serif", fontWeight: 700, margin: 0 }}>
              <BsCalendar3 size={28} style={{ marginRight: "0.5rem" }} />
              Meus Eventos
            </h2>
            <Button className="btn-laranja" onClick={() => setMostrarForm(true)}>
              Criar evento
            </Button>
          </div>
        )}

        {mostrarForm && (
          <div style={{
            maxWidth: "500px",
            margin: "2rem auto",
            padding: "2rem",
            border: "1px solid #e5e7eb",
            borderRadius: "16px",
            boxShadow: "0 4px 24px rgba(0,0,0,0.1)",
            backgroundColor: "#f5f5f5"
          }}>
            <h2 style={{ fontFamily: "Raleway, sans-serif", fontWeight: 700, marginBottom: "1.5rem" }}>
              Novo Plano
            </h2>
            <Form onSubmit={handleCriarEvento}>
              <Form.Group className="mb-3">
                <Form.Label>Nome do evento:</Form.Label>
                <Form.Control
                  type="text"
                  value={nome}
                  onChange={(e) => setNome(e.target.value)}
                  required
                />
              </Form.Group>
              <Form.Group className="mb-3">
                <Form.Label>Descrição:</Form.Label>
                <Form.Control
                  type="text"
                  value={descricao}
                  onChange={(e) => setDescricao(e.target.value)}
                  required
                />
              </Form.Group>
              <Form.Group className="mb-3">
                <Form.Label>Destino:</Form.Label>
                <Form.Control
                  type="text"
                  value={destino}
                  onChange={(e) => setDestino(e.target.value)}
                  required
                />
              </Form.Group>
              <Form.Group className="mb-3">
                <Form.Label>Data de início:</Form.Label>
                <Form.Control
                  type="date"
                  value={dataInicio}
                  onChange={(e) => setDataInicio(e.target.value)}
                  required
                />
              </Form.Group>
              <Form.Group className="mb-3">
                <Form.Label>Data final:</Form.Label>
                <Form.Control
                  type="date"
                  value={dataFim}
                  onChange={(e) => setDataFim(e.target.value)}
                  required
                />
              </Form.Group>
              {erroForm && (
                <p style={{ color: "red", fontSize: "0.85rem" }}>{erroForm}</p>
              )}
              <div style={{ display: "flex", alignItems: "center", gap: "1rem", marginTop: "0.5rem" }}>
                <Button className="btn-laranja" type="submit">
                  Salvar Evento
                </Button>
                <Button
                  variant="link"
                  style={{ color: "#6b7280", textDecoration: "none" }}
                  onClick={() => setMostrarForm(false)}
                >
                  Cancelar
                </Button>
              </div>
            </Form>
          </div>
        )}

        {!mostrarForm && (
          <div className="mt-4">
            {eventos.length === 0 ? (
              <p style={{ color: "#6b7280" }}>
                Você ainda não tem eventos. Crie o primeiro!
              </p>
            ) : (
              <Row className="g-3">
                {eventos.map((evento) => (
                  <Col md={4} key={evento.id}>
                    <Card
                      className="card-evento"
                      onClick={() => navigate(`/eventos/${evento.id}`)}
                    >
                      <Card.Body>
                        <Card.Title style={{ fontWeight: 700 }}>
                          {evento.nome}
                        </Card.Title>
                        <Card.Text style={{ color: "#6b7280", fontSize: "0.9rem" }}>
                          {evento.destino}
                        </Card.Text>
                        <Card.Text style={{ color: "#ff6b35", fontSize: "0.85rem" }}>
                          {evento.dataInicio} → {evento.dataFim}
                        </Card.Text>
                      </Card.Body>
                    </Card>
                  </Col>
                ))}
              </Row>
            )}
          </div>
        )}
      </Container>
    </>
  );
}
