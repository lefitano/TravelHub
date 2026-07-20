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

        const hoje = new Date().toLocaleDateString('pt-BR',{
            weekday:'long',
            day:'numeric',
            month:'long',
            year: 'numeric'
          })

    return(
        <>
        <NavBar/>
        <hr style={{border:'none', borderTop:'1px solid rgb(255, 162, 0)', margin: '0' }}></hr>
        <div style={{ backgroundColor: '#111111', padding: '2.5rem 2rem' }}>
    <Container>
        <p style={{ color: '#6b7280', margin: 0, fontSize: '0.9rem', textTransform: 'capitalize' }}>
            {hoje}
        </p>
        <h2 style={{ color: '#ffffff', fontFamily: 'Raleway, sans-serif', fontWeight: 700, margin: '0.25rem 0 0' }}>
            Olá, <span style={{ color: '#ff6b35' }}>{nome}</span>!
        </h2>
        <p style={{ color: '#6b7280', margin: '0.25rem 0 0', fontSize: '0.95rem' }}>
            Bem-vindo de volta ao TravelHub.
        </p>
    </Container>
</div>
        <hr style={{border:'none', borderTop:'1px solid rgb(255, 162, 0)', margin: '0' }}></hr>
        <Container className="mt-4">
            {proximoEvento && (
            <Card className="mb-3" style={{backgroundColor:'#f5f5f5', border: '2px solid #ff6b35'}}>
                <Card.Body>
                    <Card.Subtitle className='mb-1' style={{color:'#ff6b35', fontWeight:'600'}}>
                        Seu próximo evento
                    </Card.Subtitle>
                    <Card.Title style={{fontWeight:'700'}}>{proximoEvento.nome}</Card.Title>
                    <Card.Text style={{color: '#6b7280', fontSize: '0.9rem'}}>
                        {proximoEvento.destino} · {proximoEvento.dataInicio} → {proximoEvento.dataFim}
                    </Card.Text>
                </Card.Body>
            </Card>
            )}
            {/* card de total de eventos */}
            <h2 style={{ fontFamily: 'Raleway, sans-serif', fontWeight: 900, fontSize: '2rem' }}>
    Meus Eventos
</h2>

            <div style={{display:'flex', gap:'1rem'}}>
                <div style={{backgroundColor: "#f5f5f5", borderRadius:'8px', padding:'1rem 1.5rem', flex:1, border:'2px solid rgb(255, 185, 127)'}}>
                    <p style={{margin : 0, color: "#6b7280", fontSize: '0.8rem'}}>Total de eventos</p>
                    <p style={{margin: 0, color: "#ff6b35", fontSize:'2.0rem', fontWeight:700}}>
                        {eventos.length}
                    </p>
                </div>
            </div>
        </Container>  
        <hr style={{ border: 'none', borderTop: '1px solid #e5e7eb', margin: '1.5rem 0 0' }} />

        <Container className='mt-5'>

{eventos.length === 0 ? (
    <p style={{ color: '#6b7280', marginTop: '1rem' }}>
        Você ainda não participa de nenhum evento.
    </p>
) : (
    <Row className="mt-3 g-3">
        {eventos.map(evento => (
            <Col md={4} key={evento.id}>
                <Card
                    className="card-evento"
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

<div className="mt-4 p-3" style={{backgroundColor:'#f5f5f5', borderRadius:'8px', border:'2px solid rgb(255, 185, 127)', maxWidth:'400px'}}>
                
                <p style={{margin : 0, color: '#111111'}}>
                    Já tem um novo planejamento em mente? {''}
                </p>
                <Button className="btn-laranja mt-2" onClick={() => navigate('/eventos')}>
                    Criar Planejamento
                </Button>
            </div>
        </Container>
        </>
    )
}