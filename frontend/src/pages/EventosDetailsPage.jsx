import { useEffect } from "react"
import { useState } from "react"
import { useParams, useNavigate } from "react-router-dom"
import api from "../services/api"
import NavBar from "../components/NavBar";
import Button from "react-bootstrap/Button";
import Container from "react-bootstrap/esm/Container";
import { BsArrowLeft, BsGeoAlt, BsHourglassSplit, BsPeople, BsWallet2 } from "react-icons/bs"

export default function EventosDetailsPage(){

    const {id} = useParams();
    const navigate = useNavigate()
    const[evento, setEvento] = useState(null)
    const[participantes, setParticipantes] = useState([])
    const[despesas, setDespesas] = useState([])
    const[divisaoPorPessoa, setDivisaoPorPessoa] = useState(null)
    const[erro, setErro] = useState('')
    const [emailConvidar, setEmailConvidar] = useState('')
    const [erroParticipante, setErroParticipante] = useState('')
    const [descricaoDespesa, setDescricaoDespesa] = useState('')
    const [valorDespesa, setValorDespesa] = useState('')
    const [erroDespesa, setErroDespesa] = useState('')
    const [usuarioLogado, setUsuarioLogado] = useState(null)

    const diasRestantes = evento
        ? Math.ceil((new Date(evento.dataInicio) - new Date()) / (1000 * 60 * 60 * 24))
        : 0
    const totalDespesas = despesas.reduce((acc, d) => acc + Number(d.valor), 0)

    useEffect(() => {
        async function carregarDados(){
            try{
                const[resEvento, resParticipantes, resDespesas, resDivisao,resUsuario] = await Promise.all([
                    api.get(`/eventos/${id}`),
                    api.get(`/participantes/evento/${id}`),
                    api.get(`/despesas/evento/${id}`),
                    api.get(`/despesas/divisao/${id}`),
                    api.get(`/usuarios/me`)
                ])
              setEvento(resEvento.data)
              setParticipantes(resParticipantes.data)
              setDespesas(resDespesas.data)
              setDivisaoPorPessoa(resDivisao.data)
              setUsuarioLogado(resUsuario.data)
            } catch{
                setErro("Não foi possível carregar os dados do evento")
            }
        }
        carregarDados()
    }, [id])

    async function handleAdicionarParticipante(e){
        e.preventDefault()
        setErroParticipante('')
        try{
            await api.post('/participantes', {email: emailConvidar, eventoId: Number(id)})
            setEmailConvidar('')
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
            setErroParticipante("Não foi possível remover o participante")
        }
    }
    async function handleAdicionarDespesa(e){
        e.preventDefault()
        setErroDespesa('')
        try{
            await api.post('/despesas', {descricao: descricaoDespesa , valor: Number(valorDespesa), eventoId: Number(id)})
            setDescricaoDespesa('')
            setValorDespesa('')
            const res = await api.get(`/despesas/evento/${id}`)
            setDespesas(res.data)
            const resDivisao = await api.get(`/despesas/divisao/${id}`)
            setDivisaoPorPessoa(resDivisao.data)
        }catch{
            setErroDespesa('Não foi possível adicionar despesa')
        }
    }

    async function handleRemoverDespesa(despesaId){
        try{
            await api.delete(`/despesas/${despesaId}`)
            setDespesas(prev => prev.filter(p => p.id !== despesaId))
            const resDivisao = await api.get(`/despesas/divisao/${id}`)
            setDivisaoPorPessoa(resDivisao.data)
        }catch{
            setErroDespesa("Não foi possível remover a despesa")
        }
    }

    return(
        <>
        <NavBar />
        <hr style={{ border: "none", borderTop: "1px solid #ff6b35", margin: "0" }} />
        <div style={{ backgroundColor: "#111111", padding: "2rem 0" }}>
            <Container>
                <button onClick={() => navigate('/eventos')}
                    style={{ background: "none", border: "none", color: "#6b7280",
                        cursor: "pointer", padding: 0, marginBottom: "1rem",
                        display: "flex", alignItems: "center", gap: "0.4rem" }}>
                    <BsArrowLeft /> Meus Eventos
                </button>
                {evento && (
                    <>
                        <h2 style={{ color: "#ffffff", fontFamily: "Raleway, sans-serif",
                            fontWeight: 700, margin: 0 }}>
                            {evento.nome}
                        </h2>
                        <p style={{ color: "#6b7280", margin: "0.3rem 0 0", fontSize: "0.9rem" }}>
                            <BsGeoAlt style={{ marginRight: "0.3rem" }} />
                            {evento.destino} · {evento.dataInicio.split('-').reverse().join('/')} → {evento.dataFim.split('-').reverse().join('/')}
                        </p>
                    </>
                )}
            </Container>
        </div>
        <hr style={{ border: "none", borderTop: "1px solid #ff6b35", margin: "0" }} />
        <Container className="mt-4">
            {erro && <p style={{ color: "red", fontSize: "0.85rem" }}>{erro}</p>}
            {evento && (
                <div style={{ display: "flex", gap: "1rem", marginBottom: "2rem" }}>
                    <div style={{ flex: 1, backgroundColor: "#ffffff", borderRadius: "12px",
                        padding: "1.25rem 1.5rem", border: "1px solid #e5e7eb",
                        borderTop: "3px solid #ff6b35", boxShadow: "0 2px 8px rgba(0,0,0,0.06)" }}>
                        <BsHourglassSplit size={18} style={{ color: "#ff6b35", marginBottom: "0.5rem" }} />
                        <p style={{ margin: 0, fontSize: "2rem", fontWeight: 800, lineHeight: 1,
                            fontFamily: "Raleway, sans-serif",
                            background: "linear-gradient(135deg, #ff6b35, #ffab6b)",
                            WebkitBackgroundClip: "text", WebkitTextFillColor: "transparent",
                            backgroundClip: "text" }}>
                            {diasRestantes > 0 ? diasRestantes : "—"}
                        </p>
                        <p style={{ margin: "0.4rem 0 0", color: "#6b7280", fontSize: "0.72rem",
                            textTransform: "uppercase", letterSpacing: "0.08em" }}>Dias restantes</p>
                    </div>
                    <div style={{ flex: 1, backgroundColor: "#ffffff", borderRadius: "12px",
                        padding: "1.25rem 1.5rem", border: "1px solid #e5e7eb",
                        borderTop: "3px solid #ff6b35", boxShadow: "0 2px 8px rgba(0,0,0,0.06)" }}>
                        <BsPeople size={18} style={{ color: "#ff6b35", marginBottom: "0.5rem" }} />
                        <p style={{ margin: 0, fontSize: "2rem", fontWeight: 800, lineHeight: 1,
                            fontFamily: "Raleway, sans-serif",
                            background: "linear-gradient(135deg, #ff6b35, #ffab6b)",
                            WebkitBackgroundClip: "text", WebkitTextFillColor: "transparent",
                            backgroundClip: "text" }}>
                            {participantes.length}
                        </p>
                        <p style={{ margin: "0.4rem 0 0", color: "#6b7280", fontSize: "0.72rem",
                            textTransform: "uppercase", letterSpacing: "0.08em" }}>Participantes</p>
                    </div>
                    <div style={{ flex: 1, backgroundColor: "#ffffff", borderRadius: "12px",
                        padding: "1.25rem 1.5rem", border: "1px solid #e5e7eb",
                        borderTop: "3px solid #ff6b35", boxShadow: "0 2px 8px rgba(0,0,0,0.06)" }}>
                        <BsWallet2 size={18} style={{ color: "#ff6b35", marginBottom: "0.5rem" }} />
                        <p style={{ margin: 0, fontSize: "2rem", fontWeight: 800, lineHeight: 1,
                            fontFamily: "Raleway, sans-serif",
                            background: "linear-gradient(135deg, #ff6b35, #ffab6b)",
                            WebkitBackgroundClip: "text", WebkitTextFillColor: "transparent",
                            backgroundClip: "text" }}>
                            R$ {totalDespesas.toFixed(2)}
                        </p>
                        <p style={{ margin: "0.4rem 0 0", color: "#6b7280", fontSize: "0.72rem",
                            textTransform: "uppercase", letterSpacing: "0.08em" }}>Total despesas</p>
                    </div>
                </div>
            )}

            
            <div style={{ marginBottom: "2rem" }}>
                <h5 style={{ fontFamily: "Raleway, sans-serif", fontWeight: 700, marginBottom: "1rem" }}>
                    Participantes
                </h5>

                {participantes.map(p => (
                    <div key={p.id} style={{ display: "flex", justifyContent: "space-between",
                        alignItems: "center", padding: "0.75rem 1rem", marginBottom: "0.5rem",
                        backgroundColor: "#ffffff", border: "1px solid #e5e7eb",
                        borderRadius: "8px", boxShadow: "0 1px 4px rgba(0,0,0,0.04)" }}>
                        <div>
                            <p style={{ margin: 0, fontWeight: 600, fontSize: "0.95rem" }}>{p.usuario.nome}</p>
                            <p style={{ margin: 0, color: "#6b7280", fontSize: "0.8rem" }}>{p.usuario.email}</p>
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

                <form onSubmit={handleAdicionarParticipante}
                    style={{ display: "flex", gap: "0.5rem", marginTop: "1rem" }}>
                    <input
                        type="email"
                        placeholder="Email do participante"
                        value={emailConvidar}
                        onChange={e => setEmailConvidar(e.target.value)}
                        required
                        style={{ flex: 1, padding: "0.5rem 0.75rem", border: "1px solid #e5e7eb",
                            borderRadius: "8px", fontSize: "0.9rem", outline: "none" }}
                    />
                    <Button className="btn-laranja" type="submit">Convidar</Button>
                </form>

                {erroParticipante && (
                    <p style={{ color: "red", fontSize: "0.85rem", marginTop: "0.5rem" }}>{erroParticipante}</p>
                )}
            </div>
            <div style={{ marginBottom: "2rem" }}>
                <h5 style={{ fontFamily: "Raleway, sans-serif", fontWeight: 700, marginBottom: "1rem" }}>
                Despesas
                </h5>

                {despesas.map(d => (
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
                        {(d.responsavel.email === usuarioLogado?.email || evento?.criador?.email === usuarioLogado?.email) && (
                            <button onClick={() => handleRemoverDespesa(d.id)}
                                style={{ background: "none", border: "none", color: "#6b7280",
                                    cursor: "pointer", fontSize: "1.1rem", lineHeight: 1 }}>
                                ×
                            </button>
)}
                    </div>
                ))}

                <form onSubmit={handleAdicionarDespesa}
                    style={{ display: "flex", gap: "0.5rem", marginTop: "1rem" }}>
                    <input
                        type="text"
                        placeholder="Descrição"
                        value={descricaoDespesa}
                        onChange={e => setDescricaoDespesa(e.target.value)}
                        required
                        style={{ flex: 1, padding: "0.5rem 0.75rem", border: "1px solid #e5e7eb",
                            borderRadius: "8px", fontSize: "0.9rem", outline: "none" }}
                    />
                    <input
                        type="number"
                        step="0.01"
                        placeholder="Valor"
                        value={valorDespesa}
                        onChange={e => setValorDespesa(e.target.value)}
                        required
                        style={{ width: "120px", padding: "0.5rem 0.75rem", border: "1px solid #e5e7eb",
                            borderRadius: "8px", fontSize: "0.9rem", outline: "none" }}
                    />
                    <Button className="btn-laranja" type="submit">Adicionar</Button>
                </form>

                {erroDespesa && (
                    <p style={{ color: "red", fontSize: "0.85rem", marginTop: "0.5rem" }}>{erroDespesa}</p>
                )}

                <p style={{ color: "#6b7280", fontSize: "0.85rem", marginTop: "0.75rem" }}>
                    Total: R$ {totalDespesas.toFixed(2)} · Por pessoa: R$ {divisaoPorPessoa !== null ? Number(divisaoPorPessoa).toFixed(2) : "—"}
                </p>
            </div>

        </Container>
       
        </>
    )
}