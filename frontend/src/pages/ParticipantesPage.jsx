import { useEffect, useState } from "react"
import { useParams, useNavigate } from "react-router-dom"
import api from "../services/api"
import NavBar from "../components/NavBar"
import Container from "react-bootstrap/esm/Container"
import Button from "react-bootstrap/Button"
import Modal from "react-bootstrap/Modal"
import { BsArrowLeft, BsPeople, BsPersonCircle, BsPlusLg } from "react-icons/bs"

export default function ParticipantesPage(){
    const { id } = useParams()
    const navigate = useNavigate()
    const [participantes, setParticipantes] = useState([])
    const [evento, setEvento] = useState(null)
    const [usuarioLogado, setUsuarioLogado] = useState(null)
    const [erro, setErro] = useState('')

    const [mostrarModal, setMostrarModal] = useState(false)
    const [emailConvidar, setEmailConvidar] = useState('')
    const [erroParticipante, setErroParticipante] = useState('')

    useEffect(() => {
        async function carregarDados(){
            try{
                const [resParticipantes, resEvento, resUsuario] = await Promise.all([
                    api.get(`/participantes/evento/${id}`),
                    api.get(`/eventos/${id}`),
                    api.get(`/usuarios/me`)
                ])
                setParticipantes(resParticipantes.data)
                setEvento(resEvento.data)
                setUsuarioLogado(resUsuario.data)
            }catch{
                setErro("Não foi possível carregar os participantes")
            }
        }
        carregarDados()
    }, [id])

    function handleAbrirModal(){
        setEmailConvidar('')
        setErroParticipante('')
        setMostrarModal(true)
    }

    async function handleAdicionarParticipante(e){
        e.preventDefault()
        setErroParticipante('')
        try{
            await api.post('/participantes', {email: emailConvidar, eventoId: Number(id)})
            setMostrarModal(false)
            const res = await api.get(`/participantes/evento/${id}`)
            setParticipantes(res.data)
        }catch{
            setErroParticipante("Usuário não encontrado ou já participando")
        }
    }

    async function handleRemoverParticipante(participanteId){
        try{
            await api.delete(`/participantes/${participanteId}`)
            setParticipantes(prev => prev.filter(p => p.id !== participanteId))
        }catch{
            setErro("Não foi possível remover o participante")
        }
    }

    return (
        <>
        <NavBar />
        <hr style={{ border: "none", borderTop: "1px solid #ff6b35", margin: "0" }} />
        <div style={{ backgroundColor: "#111111", padding: "2rem 0" }}>
            <Container>
                <button onClick={() => navigate(`/eventos/${id}`)}
                    style={{ background: "none", border: "none", color: "#6b7280",
                        cursor: "pointer", padding: 0, marginBottom: "1rem",
                        display: "flex", alignItems: "center", gap: "0.4rem" }}>
                    <BsArrowLeft /> Voltar ao evento
                </button>
                <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
                    <h2 style={{ color: "#ffffff", fontFamily: "Raleway, sans-serif",
                        fontWeight: 700, margin: 0, display: "flex", alignItems: "center" }}>
                        <BsPeople size={22} style={{ marginRight: "0.5rem", color: "#ff6b35" }} />
                        Participantes
                    </h2>
                    <Button className="btn-laranja" onClick={handleAbrirModal}>
                        <BsPlusLg style={{ marginRight: "0.4rem", marginTop: "-2px" }} />
                        Convidar
                    </Button>
                </div>
            </Container>
        </div>
        <hr style={{ border: "none", borderTop: "1px solid #ff6b35", margin: "0" }} />
        <Container className="mt-4">
            {erro && <p style={{ color: "red", fontSize: "0.85rem" }}>{erro}</p>}

            {participantes.map(p => (
                <div key={p.id} style={{ display: "flex", justifyContent: "space-between",
                    alignItems: "center", padding: "0.75rem 1rem", marginBottom: "0.5rem",
                    backgroundColor: "#ffffff", border: "1px solid #e5e7eb",
                    borderRadius: "8px", boxShadow: "0 1px 4px rgba(0,0,0,0.04)" }}>
                    <div style={{ display: "flex", alignItems: "center", gap: "0.6rem" }}>
                        {p.usuario.fotoUrl ? (
                            <img
                                src={`${api.defaults.baseURL}${p.usuario.fotoUrl}`}
                                alt={p.usuario.nome}
                                style={{ width: "36px", height: "36px", borderRadius: "50%",
                                    objectFit: "cover", flexShrink: 0 }}
                            />
                        ) : (
                            <div style={{ width: "36px", height: "36px", borderRadius: "50%",
                                backgroundColor: "#f5f5f5", display: "flex", alignItems: "center",
                                justifyContent: "center", flexShrink: 0 }}>
                                <BsPersonCircle size={22} style={{ color: "#ff6b35" }} />
                            </div>
                        )}
                        <div>
                            <p style={{ margin: 0, fontWeight: 600, fontSize: "0.95rem" }}>{p.usuario.nome}</p>
                            <p style={{ margin: 0, color: "#6b7280", fontSize: "0.8rem" }}>{p.usuario.email}</p>
                        </div>
                    </div>
                    {(p.usuario.email === usuarioLogado?.email || evento?.criador?.email === usuarioLogado?.email) && (
                        <button onClick={() => handleRemoverParticipante(p.id)}
                            style={{ background: "none", border: "none", color: "#6b7280",
                                cursor: "pointer", fontSize: "1.1rem", lineHeight: 1 }}>
                            ×
                        </button>
                    )}
                </div>
            ))}
        </Container>

        <Modal show={mostrarModal} onHide={() => setMostrarModal(false)} centered>
            <Modal.Header closeButton>
                <Modal.Title style={{ fontFamily: "Raleway, sans-serif", fontWeight: 700, fontSize: "1.1rem" }}>
                    Convidar participante
                </Modal.Title>
            </Modal.Header>
            <form onSubmit={handleAdicionarParticipante}>
                <Modal.Body>
                    <input
                        type="email"
                        placeholder="Email do participante"
                        value={emailConvidar}
                        onChange={e => setEmailConvidar(e.target.value)}
                        required
                        style={{ width: "100%", padding: "0.5rem 0.75rem", border: "1px solid #e5e7eb",
                            borderRadius: "8px", fontSize: "0.9rem", outline: "none" }}
                    />
                    {erroParticipante && (
                        <p style={{ color: "red", fontSize: "0.85rem", marginTop: "0.75rem" }}>{erroParticipante}</p>
                    )}
                </Modal.Body>
                <Modal.Footer>
                    <Button variant="link" style={{ color: "#6b7280", textDecoration: "none" }}
                        onClick={() => setMostrarModal(false)}>
                        Cancelar
                    </Button>
                    <Button className="btn-laranja" type="submit">Convidar</Button>
                </Modal.Footer>
            </form>
        </Modal>
        </>
    )
}
