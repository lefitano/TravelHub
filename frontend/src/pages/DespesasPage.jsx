import { useEffect, useState } from "react"
import { useParams, useNavigate } from "react-router-dom"
import api from "../services/api"
import NavBar from "../components/NavBar"
import Container from "react-bootstrap/esm/Container"
import Button from "react-bootstrap/Button"
import Modal from "react-bootstrap/Modal"
import { BsArrowLeft, BsWallet2, BsPlusLg } from "react-icons/bs"

export default function DespesasPage(){
    const { id } = useParams()
    const navigate = useNavigate()
    const [despesas, setDespesas] = useState([])
    const [divisaoPorPessoa, setDivisaoPorPessoa] = useState(null)
    const [participantes, setParticipantes] = useState([])
    const [resumo, setResumo] = useState(null)
    const [usuarioLogado, setUsuarioLogado] = useState(null)
    const [erro, setErro] = useState('')

    const [mostrarModal, setMostrarModal] = useState(false)
    const [descricaoDespesa, setDescricaoDespesa] = useState('')
    const [valorDespesa, setValorDespesa] = useState('')
    const [participantesSelecionados, setParticipantesSelecionados] = useState([])
    const [erroDespesa, setErroDespesa] = useState('')

    const totalDespesas = despesas.reduce((acc, d) => acc + Number(d.valor), 0)

    useEffect(() => {
        async function carregarDados(){
            try{
                const [resDespesas, resDivisao, resParticipantes, resResumo, resUsuario] = await Promise.all([
                    api.get(`/despesas/evento/${id}`),
                    api.get(`/despesas/divisao/${id}`),
                    api.get(`/participantes/evento/${id}`),
                    api.get(`/despesas/resumo/${id}`),
                    api.get(`/usuarios/me`)
                ])
                setDespesas(resDespesas.data)
                setDivisaoPorPessoa(resDivisao.data)
                setParticipantes(resParticipantes.data)
                setParticipantesSelecionados(resParticipantes.data.map(p => p.id))
                setResumo(resResumo.data)
                setUsuarioLogado(resUsuario.data)
            }catch{
                setErro("Não foi possível carregar as despesas")
            }
        }
        carregarDados()
    }, [id])

    function handleAbrirModal(){
        setDescricaoDespesa('')
        setValorDespesa('')
        setParticipantesSelecionados(participantes.map(p => p.id))
        setErroDespesa('')
        setMostrarModal(true)
    }

    function handleToggleParticipante(participanteId){
        setParticipantesSelecionados(prev =>
            prev.includes(participanteId)
                ? prev.filter(pid => pid !== participanteId)
                : [...prev, participanteId]
        )
    }

    async function handleAdicionarDespesa(e){
        e.preventDefault()
        setErroDespesa('')
        try{
            await api.post('/despesas', {
                descricao: descricaoDespesa,
                valor: Number(valorDespesa),
                eventoId: Number(id),
                participantesIds: participantesSelecionados
            })
            setMostrarModal(false)
            const [resDespesas, resDivisao, resResumo] = await Promise.all([
                api.get(`/despesas/evento/${id}`),
                api.get(`/despesas/divisao/${id}`),
                api.get(`/despesas/resumo/${id}`)
            ])
            setDespesas(resDespesas.data)
            setDivisaoPorPessoa(resDivisao.data)
            setResumo(resResumo.data)
        }catch{
            setErroDespesa('Não foi possível adicionar despesa')
        }
    }

    async function handleRemoverDespesa(despesaId){
        try{
            await api.delete(`/despesas/${despesaId}`)
            setDespesas(prev => prev.filter(p => p.id !== despesaId))
            const [resDivisao, resResumo] = await Promise.all([
                api.get(`/despesas/divisao/${id}`),
                api.get(`/despesas/resumo/${id}`)
            ])
            setDivisaoPorPessoa(resDivisao.data)
            setResumo(resResumo.data)
        }catch{
            setErro("Não foi possível remover a despesa")
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
                        <BsWallet2 size={22} style={{ marginRight: "0.5rem", color: "#ff6b35" }} />
                        Despesas
                    </h2>
                    <Button className="btn-laranja" onClick={handleAbrirModal}>
                        <BsPlusLg style={{ marginRight: "0.4rem", marginTop: "-2px" }} />
                        Adicionar despesa
                    </Button>
                </div>
            </Container>
        </div>
        <hr style={{ border: "none", borderTop: "1px solid #ff6b35", margin: "0" }} />
        <Container className="mt-4">
            {erro && <p style={{ color: "red", fontSize: "0.85rem" }}>{erro}</p>}

            {resumo && (
                <div style={{ backgroundColor: "#ffffff", borderRadius: "12px",
                    padding: "1.25rem 1.5rem", border: "1px solid #e5e7eb",
                    borderTop: "3px solid #ff6b35", boxShadow: "0 2px 8px rgba(0,0,0,0.06)",
                    marginBottom: "2rem", maxWidth: "320px" }}>
                    <p style={{ margin: 0, fontSize: "2rem", fontWeight: 800, lineHeight: 1,
                        fontFamily: "Raleway, sans-serif",
                        background: "linear-gradient(135deg, #ff6b35, #ffab6b)",
                        WebkitBackgroundClip: "text", WebkitTextFillColor: "transparent",
                        backgroundClip: "text" }}>
                        R$ {Number(resumo.totalQueDevo).toFixed(2)}
                    </p>
                    <p style={{ margin: "0.4rem 0 0", color: "#6b7280", fontSize: "0.72rem",
                        textTransform: "uppercase", letterSpacing: "0.08em" }}>Você deve no total</p>
                </div>
            )}

            {despesas.length === 0 ? (
                <p style={{ color: "#6b7280" }}>Nenhuma despesa registrada ainda.</p>
            ) : (
                despesas.map(d => (
                    <div key={d.id} style={{ display: "flex", justifyContent: "space-between",
                        alignItems: "center", padding: "0.75rem 1rem", marginBottom: "0.5rem",
                        backgroundColor: "#ffffff", border: "1px solid #e5e7eb",
                        borderRadius: "8px", boxShadow: "0 1px 4px rgba(0,0,0,0.04)" }}>
                        <div>
                            <p style={{ margin: 0, fontWeight: 600, fontSize: "0.95rem" }}>{d.descricao}</p>
                            <p style={{ margin: 0, color: "#6b7280", fontSize: "0.8rem" }}>
                                {d.responsavel.nome} · R$ {Number(d.valor).toFixed(2)}
                            </p>
                        </div>
                        {d.responsavel.email === usuarioLogado?.email && (
                            <button onClick={() => handleRemoverDespesa(d.id)}
                                style={{ background: "none", border: "none", color: "#6b7280",
                                    cursor: "pointer", fontSize: "1.1rem", lineHeight: 1 }}>
                                ×
                            </button>
                        )}
                    </div>
                ))
            )}

            <p style={{ color: "#6b7280", fontSize: "0.85rem", marginTop: "1rem" }}>
                Total do evento: R$ {totalDespesas.toFixed(2)}
            </p>

            {divisaoPorPessoa && divisaoPorPessoa.length > 0 && (
                <>
                    <h5 style={{ fontFamily: "Raleway, sans-serif", fontWeight: 700, margin: "1.5rem 0 0.75rem" }}>
                        Saldo por pessoa
                    </h5>
                    <ul style={{ margin: 0, paddingLeft: "1.1rem", color: "#6b7280", fontSize: "0.85rem" }}>
                        {divisaoPorPessoa.map(saldo => (
                            <li key={saldo.participanteId}>
                                {saldo.nome} deve R$ {Number(saldo.valor).toFixed(2)}
                            </li>
                        ))}
                    </ul>
                </>
            )}
        </Container>

        <Modal show={mostrarModal} onHide={() => setMostrarModal(false)} centered>
            <Modal.Header closeButton>
                <Modal.Title style={{ fontFamily: "Raleway, sans-serif", fontWeight: 700, fontSize: "1.1rem" }}>
                    Nova despesa
                </Modal.Title>
            </Modal.Header>
            <form onSubmit={handleAdicionarDespesa}>
                <Modal.Body>
                    <input
                        type="text"
                        placeholder="Descrição"
                        value={descricaoDespesa}
                        onChange={e => setDescricaoDespesa(e.target.value)}
                        required
                        style={{ width: "100%", padding: "0.5rem 0.75rem", border: "1px solid #e5e7eb",
                            borderRadius: "8px", fontSize: "0.9rem", outline: "none", marginBottom: "0.75rem" }}
                    />
                    <input
                        type="number"
                        step="0.01"
                        placeholder="Valor"
                        value={valorDespesa}
                        onChange={e => setValorDespesa(e.target.value)}
                        required
                        style={{ width: "100%", padding: "0.5rem 0.75rem", border: "1px solid #e5e7eb",
                            borderRadius: "8px", fontSize: "0.9rem", outline: "none", marginBottom: "0.75rem" }}
                    />
                    <p style={{ fontSize: "0.8rem", color: "#6b7280", marginBottom: "0.5rem" }}>
                        Dividir entre:
                    </p>
                    <div style={{ display: "flex", flexWrap: "wrap", gap: "0.75rem" }}>
                        {participantes.map(p => (
                            <label key={p.id} style={{ display: "flex", alignItems: "center", gap: "0.35rem",
                                fontSize: "0.85rem", color: "#6b7280", cursor: "pointer" }}>
                                <input
                                    type="checkbox"
                                    checked={participantesSelecionados.includes(p.id)}
                                    onChange={() => handleToggleParticipante(p.id)}
                                />
                                {p.usuario.nome}
                            </label>
                        ))}
                    </div>
                    {erroDespesa && (
                        <p style={{ color: "red", fontSize: "0.85rem", marginTop: "0.75rem" }}>{erroDespesa}</p>
                    )}
                </Modal.Body>
                <Modal.Footer>
                    <Button variant="link" style={{ color: "#6b7280", textDecoration: "none" }}
                        onClick={() => setMostrarModal(false)}>
                        Cancelar
                    </Button>
                    <Button className="btn-laranja" type="submit">Adicionar</Button>
                </Modal.Footer>
            </form>
        </Modal>
        </>
    )
}
