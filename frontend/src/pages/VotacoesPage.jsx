import { useEffect, useState } from "react"
import { useParams, useNavigate } from "react-router-dom"
import api from "../services/api"
import NavBar from "../components/NavBar"
import Container from "react-bootstrap/esm/Container"
import Button from "react-bootstrap/Button"
import Modal from "react-bootstrap/Modal"
import { BsArrowLeft, BsCheck2Square, BsChevronRight, BsPlusLg } from "react-icons/bs"

export default function VotacoesPage(){
    const { id } = useParams()
    const navigate = useNavigate()
    const [votacoes, setVotacoes] = useState([])
    const [evento, setEvento] = useState(null)
    const [usuarioLogado, setUsuarioLogado] = useState(null)
    const [erro, setErro] = useState('')

    const [mostrarModal, setMostrarModal] = useState(false)
    const [tituloVotacao, setTituloVotacao] = useState('')
    const [erroVotacao, setErroVotacao] = useState('')

    const ehCriador = evento?.criador?.email === usuarioLogado?.email

    useEffect(() => {
        async function carregarDados(){
            try{
                const [resVotacoes, resEvento, resUsuario] = await Promise.all([
                    api.get(`/votacoes/evento/${id}`),
                    api.get(`/eventos/${id}`),
                    api.get(`/usuarios/me`)
                ])
                setVotacoes(resVotacoes.data)
                setEvento(resEvento.data)
                setUsuarioLogado(resUsuario.data)
            }catch{
                setErro("Não foi possível carregar as votações")
            }
        }
        carregarDados()
    }, [id])

    function handleAbrirModal(){
        setTituloVotacao('')
        setErroVotacao('')
        setMostrarModal(true)
    }

    async function handleAdicionarVotacao(e){
        e.preventDefault()
        setErroVotacao('')
        try{
            await api.post('/votacoes', { titulo: tituloVotacao, eventoId: Number(id) })
            setMostrarModal(false)
            const res = await api.get(`/votacoes/evento/${id}`)
            setVotacoes(res.data)
        }catch{
            setErroVotacao("Não foi possível criar a votação")
        }
    }

    async function handleRemoverVotacao(votacaoId){
        if(!window.confirm("Tem certeza que deseja excluir essa votação? Essa ação não pode ser desfeita.")){
            return
        }
        try{
            await api.delete(`/votacoes/${votacaoId}`)
            setVotacoes(prev => prev.filter(v => v.id !== votacaoId))
        }catch{
            setErro("Não foi possível excluir a votação")
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
                        <BsCheck2Square size={22} style={{ marginRight: "0.5rem", color: "#ff6b35" }} />
                        Votações
                    </h2>
                    {ehCriador && (
                        <Button className="btn-laranja" onClick={handleAbrirModal}>
                            <BsPlusLg style={{ marginRight: "0.4rem", marginTop: "-2px" }} />
                            Criar votação
                        </Button>
                    )}
                </div>
            </Container>
        </div>
        <hr style={{ border: "none", borderTop: "1px solid #ff6b35", margin: "0" }} />
        <Container className="mt-4">
            {erro && <p style={{ color: "red", fontSize: "0.85rem" }}>{erro}</p>}

            {votacoes.length === 0 && (
                <p style={{ color: "#6b7280", fontSize: "0.9rem" }}>Nenhuma votação criada ainda.</p>
            )}

            {votacoes.map(v => (
                <div key={v.id} onClick={() => navigate(`/eventos/${id}/votacoes/${v.id}`)}
                    style={{ display: "flex", justifyContent: "space-between",
                    alignItems: "center", padding: "0.75rem 1rem", marginBottom: "0.5rem",
                    backgroundColor: "#ffffff", border: "1px solid #e5e7eb",
                    borderRadius: "8px", boxShadow: "0 1px 4px rgba(0,0,0,0.04)", cursor: "pointer" }}>
                    <p style={{ margin: 0, fontWeight: 600, fontSize: "0.95rem" }}>{v.titulo}</p>
                    <div style={{ display: "flex", alignItems: "center", gap: "0.75rem" }}>
                        {ehCriador && (
                            <button onClick={e => { e.stopPropagation(); handleRemoverVotacao(v.id) }}
                                style={{ background: "none", border: "none", color: "#6b7280",
                                    cursor: "pointer", fontSize: "1.1rem", lineHeight: 1 }}>
                                ×
                            </button>
                        )}
                        <BsChevronRight style={{ color: "#6b7280" }} />
                    </div>
                </div>
            ))}
        </Container>

        <Modal show={mostrarModal} onHide={() => setMostrarModal(false)} centered>
            <Modal.Header closeButton>
                <Modal.Title style={{ fontFamily: "Raleway, sans-serif", fontWeight: 700, fontSize: "1.1rem" }}>
                    Nova votação
                </Modal.Title>
            </Modal.Header>
            <form onSubmit={handleAdicionarVotacao}>
                <Modal.Body>
                    <input
                        type="text"
                        placeholder="Título da votação (ex: Onde vamos jantar?)"
                        value={tituloVotacao}
                        onChange={e => setTituloVotacao(e.target.value)}
                        required
                        style={{ width: "100%", padding: "0.5rem 0.75rem", border: "1px solid #e5e7eb",
                            borderRadius: "8px", fontSize: "0.9rem", outline: "none" }}
                    />
                    {erroVotacao && (
                        <p style={{ color: "red", fontSize: "0.85rem", marginTop: "0.75rem" }}>{erroVotacao}</p>
                    )}
                </Modal.Body>
                <Modal.Footer>
                    <Button variant="link" style={{ color: "#6b7280", textDecoration: "none" }}
                        onClick={() => setMostrarModal(false)}>
                        Cancelar
                    </Button>
                    <Button className="btn-laranja" type="submit">Criar</Button>
                </Modal.Footer>
            </form>
        </Modal>
        </>
    )
}
