import NavBar from '../components/NavBar';
import { useState, useEffect } from 'react';
import api from '../services/api';
import Container from 'react-bootstrap/Container';
import Row from 'react-bootstrap/Row';
import Col from 'react-bootstrap/Col';
import Card from 'react-bootstrap/Card';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import Button from 'react-bootstrap/Button';

export default function DashBoardPage(){

  const [eventos, setEventos] = useState([]);
  const navigate = useNavigate();
  const {nome} = useAuth();

    useEffect(() =>{
        async function carregarDados() {
            const resposta = await api.get('/eventos/meus');
            setEventos(resposta.data);
        }
        carregarDados();
    }, []);
    const proximoEvento = eventos
        .filter(e => new Date(e.dataInicio) >= new Date())
        .sort((a, b) => new Date(a.dataInicio) - new Date(b.dataInicio)) [0];

    return(
        <>
        <NavBar/>
        <Container className="mt-4">
            <h2 style={{fontFamily: 'Raleway, sans-serif', fontWeight: 700}}>Olá {nome} </h2>
            <p style={{color: '#6b7280'}}>Seja bem vindo</p>

            {proximoEvento && (
                <Card className="mt-3" style={{backgroundColor: '#f5f5f5', border:'2px solid #ff6b35'}}>
                    <Card.Body>
                        <Card.Subtitle className='mb-1' style={{color:'#ff6b35', fontWeight:600}}>
                            Seu próximo evento
                        </Card.Subtitle>
                        <Card.Title style={{fontWeight:700}}>
                            {proximoEvento.nome}
                        </Card.Title>
                        <Card.Text style={{color: '#6b7280' , fontSize:'0.9rem' }}>
                            {proximoEvento.destino} · {proximoEvento.dataInicio} → {proximoEvento.dataFim}
                        </Card.Text>
                    </Card.Body>
                </Card>
            )}
            <div className="mt-4 p-3" style={{backgroundColor:'#f5f5f5', borderRadius:'8px'}}>
                <p style={{margin : 0, color: '#111111'}}>
                    Já tem um novo planejamento em mente? {''}
                </p>
                <Button className="btn-laranja mt-2" onClick={() => navigate('/eventos')}>
                    Criar Planejamento
                </Button>
            </div>
        </Container>
        <Container className='mt-5'>
        <h2 style={{ fontFamily: 'Raleway, sans-serif', fontWeight: 900, fontSize: '2rem' }}>
    Meus Eventos
</h2>

{eventos.length === 0 ? (
    <p style={{ color: '#6b7280', marginTop: '1rem' }}>
        Você ainda não participa de nenhum evento.
    </p>
) : (
    <Row className="mt-3 g-3">
        {eventos.map(evento => (
            <Col md={4} key={evento.id}>
                <Card
                    style={{ backgroundColor: '#f5f5f5', border: 'none', cursor: 'pointer' }}
                    onClick={() => navigate(`/eventos/${evento.id}`)}
                >
                    <Card.Body>
                        <Card.Title style={{ color: '#111111', fontWeight: 700 }}>
                            {evento.nome}
                        </Card.Title>
                        <Card.Text style={{ color: '#6b7280', fontSize: '0.9rem' }}>
                            {evento.destino}
                        </Card.Text>
                        <Card.Text style={{ color: '#ff6b35', fontSize: '0.85rem' }}>
                            {evento.dataInicio} → {evento.dataFim}
                        </Card.Text>
                    </Card.Body>
                </Card>
            </Col>
        ))}
    </Row>
)}
        </Container>
        </>
    )
}