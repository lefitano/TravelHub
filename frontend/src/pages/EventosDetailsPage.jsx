import { useEffect } from "react"
import { useState } from "react"
import { useParams, useNavigate } from "react-router-dom"
import api from "../services/api"
import NavBar from "../components/NavBar";
import Button from "react-bootstrap/Button";
import Container from "react-bootstrap/esm/Container";
import { BsArrowLeft, BsGeoAlt, BsHourglassSplit, BsPeople, BsWallet2, BsPersonCircle, BsSuitcaseLg, BsGeoAltFill, BsCheck2Square, BsChevronRight } from "react-icons/bs"
import DestinoAutocomplete from "../components/DestinoAutocomplete"

export default function EventosDetailsPage(){

    const {id} = useParams();
    const navigate = useNavigate()
    const[evento, setEvento] = useState(null)
    const[participantes, setParticipantes] = useState([])
    const[despesas, setDespesas] = useState([])
    const[votacoes, setVotacoes] = useState([])
    const[erro, setErro] = useState('')
    const [usuarioLogado, setUsuarioLogado] = useState(null)
    const [mostrarEditarEvento, setMostrarEditarEvento] = useState(false)
    const [nomeEdit, setNomeEdit] = useState('')
    const [descricaoEdit, setDescricaoEdit] = useState('')
    const [destinoEdit, setDestinoEdit] = useState('')
    const [dataInicioEdit, setDataInicioEdit] = useState('')
    const [dataFimEdit, setDataFimEdit] = useState('')
    const [tipoEdit, setTipoEdit] = useState('VIAGEM')
    const [erroEditarEvento, setErroEditarEvento] = useState('')

    const diasRestantes = evento
        ? Math.ceil((new Date(evento.dataInicio) - new Date()) / (1000 * 60 * 60 * 24))
        : 0
    const totalDespesas = despesas.reduce((acc, d) => acc + Number(d.valor), 0)

    useEffect(() => {
        async function carregarDados(){
            try{
                const[resEvento, resParticipantes, resDespesas, resUsuario, resVotacoes] = await Promise.all([
                    api.get(`/eventos/${id}`),
                    api.get(`/participantes/evento/${id}`),
                    api.get(`/despesas/evento/${id}`),
                    api.get(`/usuarios/me`),
                    api.get(`/votacoes/evento/${id}`)
                ])
              setEvento(resEvento.data)
              setParticipantes(resParticipantes.data)
              setDespesas(resDespesas.data)
              setUsuarioLogado(resUsuario.data)
              setVotacoes(resVotacoes.data)
            } catch{
                setErro("Não foi possível carregar os dados do evento")
            }
        }
        carregarDados()
    }, [id])

    function handleAbrirEdicao(){
        setNomeEdit(evento.nome)
        setDescricaoEdit(evento.descricao)
        setDestinoEdit(evento.destino)
        setDataInicioEdit(evento.dataInicio)
        setDataFimEdit(evento.dataFim)
        setTipoEdit(evento.tipo ?? 'VIAGEM')
        setErroEditarEvento('')
        setMostrarEditarEvento(true)
    }

    async function handleSalvarEdicao(e){
        e.preventDefault()
        setErroEditarEvento('')
        try{
            const res = await api.put(`/eventos/${id}`, {
                nome: nomeEdit,
                descricao: descricaoEdit,
                destino: destinoEdit,
                dataInicio: dataInicioEdit,
                dataFim: dataFimEdit,
                tipo: tipoEdit
            })
            setEvento(res.data)
            setMostrarEditarEvento(false)
        }catch{
            setErroEditarEvento("Não foi possível salvar as alterações")
        }
    }

    async function handleExcluirEvento(){
        if(!window.confirm("Tem certeza que deseja excluir esse evento? Essa ação não pode ser desfeita.")){
            return
        }
        try{
            await api.delete(`/eventos/${id}`)
            navigate('/eventos')
        }catch{
            setErro("Não foi possível excluir o evento")
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
                {evento && !mostrarEditarEvento && (
                    <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start" }}>
                        <div>
                            <div style={{ display: "flex", alignItems: "center", gap: "0.6rem" }}>
                                <h2 style={{ color: "#ffffff", fontFamily: "Raleway, sans-serif",
                                    fontWeight: 700, margin: 0 }}>
                                    {evento.nome}
                                </h2>
                                {evento.tipo && (
                                    <span style={{ display: "inline-flex", alignItems: "center", gap: "0.35rem",
                                        fontSize: "0.72rem", fontWeight: 700, color: "#ff6b35",
                                        backgroundColor: "#2a2a2a", borderRadius: "999px", padding: "0.2rem 0.7rem",
                                        whiteSpace: "nowrap" }}>
                                        {evento.tipo === "VIAGEM" ? <BsSuitcaseLg /> : <BsGeoAltFill />}
                                        {evento.tipo === "VIAGEM" ? "Viagem" : "Saída"}
                                    </span>
                                )}
                            </div>
                            <p style={{ color: "#6b7280", margin: "0.25rem 0 0", fontSize: "0.8rem" }}>
                                Criado por {evento.criador?.nome ?? "desconhecido"}
                            </p>
                            <p style={{ color: "#6b7280", margin: "0.3rem 0 0", fontSize: "0.9rem" }}>
                                <BsGeoAlt style={{ marginRight: "0.3rem" }} />
                                {evento.destino} · {evento.dataInicio.split('-').reverse().join('/')} → {evento.dataFim.split('-').reverse().join('/')}
                            </p>
                        </div>
                        {evento.criador?.email === usuarioLogado?.email && (
                            <div style={{ display: "flex", gap: "0.5rem" }}>
                                <Button className="btn-laranja" onClick={handleAbrirEdicao}>Editar</Button>
                                <Button variant="outline-light" onClick={handleExcluirEvento}>Excluir</Button>
                            </div>
                        )}
                    </div>
                )}

                {evento && mostrarEditarEvento && (
                    <div style={{ backgroundColor: "#ffffff", borderRadius: "12px",
                        padding: "1.25rem 1.5rem", maxWidth: "480px" }}>
                        <form onSubmit={handleSalvarEdicao}>
                            <div style={{ display: "flex", gap: "0.5rem", marginBottom: "0.5rem" }}>
                                <button
                                    type="button"
                                    onClick={() => setTipoEdit("VIAGEM")}
                                    style={{
                                        flex: 1, padding: "0.5rem", borderRadius: "8px", cursor: "pointer",
                                        border: tipoEdit === "VIAGEM" ? "2px solid #ff6b35" : "1px solid #e5e7eb",
                                        backgroundColor: tipoEdit === "VIAGEM" ? "#fff4ef" : "#ffffff",
                                        color: tipoEdit === "VIAGEM" ? "#ff6b35" : "#6b7280",
                                        fontWeight: tipoEdit === "VIAGEM" ? 700 : 400
                                    }}>
                                    <BsSuitcaseLg style={{ marginRight: "0.4rem", marginTop: "-2px" }} />
                                    Viagem
                                </button>
                                <button
                                    type="button"
                                    onClick={() => setTipoEdit("SAIDA")}
                                    style={{
                                        flex: 1, padding: "0.5rem", borderRadius: "8px", cursor: "pointer",
                                        border: tipoEdit === "SAIDA" ? "2px solid #ff6b35" : "1px solid #e5e7eb",
                                        backgroundColor: tipoEdit === "SAIDA" ? "#fff4ef" : "#ffffff",
                                        color: tipoEdit === "SAIDA" ? "#ff6b35" : "#6b7280",
                                        fontWeight: tipoEdit === "SAIDA" ? 700 : 400
                                    }}>
                                    <BsGeoAltFill style={{ marginRight: "0.4rem", marginTop: "-2px" }} />
                                    Saída
                                </button>
                            </div>
                            <input
                                type="text"
                                placeholder="Nome do evento"
                                value={nomeEdit}
                                onChange={e => setNomeEdit(e.target.value)}
                                required
                                style={{ width: "100%", padding: "0.5rem 0.75rem", border: "1px solid #e5e7eb",
                                    borderRadius: "8px", fontSize: "0.9rem", outline: "none", marginBottom: "0.5rem" }}
                            />
                            <input
                                type="text"
                                placeholder="Descrição"
                                value={descricaoEdit}
                                onChange={e => setDescricaoEdit(e.target.value)}
                                required
                                style={{ width: "100%", padding: "0.5rem 0.75rem", border: "1px solid #e5e7eb",
                                    borderRadius: "8px", fontSize: "0.9rem", outline: "none", marginBottom: "0.5rem" }}
                            />
                            <DestinoAutocomplete
                                placeholder="Destino"
                                value={destinoEdit}
                                onChange={setDestinoEdit}
                                required
                                style={{ width: "100%", padding: "0.5rem 0.75rem", border: "1px solid #e5e7eb",
                                    borderRadius: "8px", fontSize: "0.9rem", outline: "none", marginBottom: "0.5rem" }}
                            />
                            <div style={{ display: "flex", gap: "0.5rem", marginBottom: "0.5rem" }}>
                                <input
                                    type="date"
                                    value={dataInicioEdit}
                                    onChange={e => setDataInicioEdit(e.target.value)}
                                    required
                                    style={{ flex: 1, padding: "0.5rem 0.75rem", border: "1px solid #e5e7eb",
                                        borderRadius: "8px", fontSize: "0.9rem", outline: "none" }}
                                />
                                <input
                                    type="date"
                                    value={dataFimEdit}
                                    onChange={e => setDataFimEdit(e.target.value)}
                                    required
                                    style={{ flex: 1, padding: "0.5rem 0.75rem", border: "1px solid #e5e7eb",
                                        borderRadius: "8px", fontSize: "0.9rem", outline: "none" }}
                                />
                            </div>
                            <div style={{ display: "flex", alignItems: "center", gap: "1rem" }}>
                                <Button className="btn-laranja" type="submit">Salvar</Button>
                                <Button variant="link" style={{ color: "#6b7280", textDecoration: "none" }}
                                    onClick={() => setMostrarEditarEvento(false)}>
                                    Cancelar
                                </Button>
                            </div>
                            {erroEditarEvento && (
                                <p style={{ color: "red", fontSize: "0.85rem", marginTop: "0.5rem" }}>{erroEditarEvento}</p>
                            )}
                        </form>
                    </div>
                )}
            </Container>
        </div>
        <hr style={{ border: "none", borderTop: "1px solid #ff6b35", margin: "0" }} />
        <Container className="mt-4">
            {erro && <p style={{ color: "red", fontSize: "0.85rem" }}>{erro}</p>}
            {evento && (
                <>
                <div style={{ display: "flex", gap: "1rem", marginBottom: "1.25rem", flexWrap: "wrap" }}>
                    <div style={{ flex: "1 1 140px", backgroundColor: "#ffffff", borderRadius: "12px",
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
                    <div onClick={() => navigate(`/eventos/${id}/participantes`)}
                        style={{ flex: "1 1 140px", backgroundColor: "#ffffff", borderRadius: "12px",
                        padding: "1.25rem 1.5rem", border: "1px solid #e5e7eb",
                        borderTop: "3px solid #ff6b35", boxShadow: "0 2px 8px rgba(0,0,0,0.06)",
                        cursor: "pointer" }}>
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
                    <div onClick={() => navigate(`/eventos/${id}/despesas`)}
                        style={{ flex: "1 1 140px", backgroundColor: "#ffffff", borderRadius: "12px",
                        padding: "1.25rem 1.5rem", border: "1px solid #e5e7eb",
                        borderTop: "3px solid #ff6b35", boxShadow: "0 2px 8px rgba(0,0,0,0.06)",
                        cursor: "pointer" }}>
                        <BsWallet2 size={18} style={{ color: "#ff6b35", marginBottom: "0.5rem" }} />
                        <p style={{ margin: 0, fontSize: "2rem", fontWeight: 800, lineHeight: 1,
                            fontFamily: "Raleway, sans-serif",
                            background: "linear-gradient(135deg, #ff6b35, #ffab6b)",
                            WebkitBackgroundClip: "text", WebkitTextFillColor: "transparent",
                            backgroundClip: "text" }}>
                            R$ {totalDespesas.toFixed(2)}
                        </p>
                        <p style={{ margin: "0.4rem 0 0", color: "#6b7280", fontSize: "0.72rem",
                            textTransform: "uppercase", letterSpacing: "0.08em" }}>Despesas</p>
                    </div>
                    <div onClick={() => navigate(`/eventos/${id}/votacoes`)}
                        style={{ flex: "1 1 140px", backgroundColor: "#ffffff", borderRadius: "12px",
                        padding: "1.25rem 1.5rem", border: "1px solid #e5e7eb",
                        borderTop: "3px solid #ff6b35", boxShadow: "0 2px 8px rgba(0,0,0,0.06)",
                        cursor: "pointer" }}>
                        <BsCheck2Square size={18} style={{ color: "#ff6b35", marginBottom: "0.5rem" }} />
                        <p style={{ margin: 0, fontSize: "2rem", fontWeight: 800, lineHeight: 1,
                            fontFamily: "Raleway, sans-serif",
                            background: "linear-gradient(135deg, #ff6b35, #ffab6b)",
                            WebkitBackgroundClip: "text", WebkitTextFillColor: "transparent",
                            backgroundClip: "text" }}>
                            {votacoes.length}
                        </p>
                        <p style={{ margin: "0.4rem 0 0", color: "#6b7280", fontSize: "0.72rem",
                            textTransform: "uppercase", letterSpacing: "0.08em" }}>Votações</p>
                    </div>
                </div>

                {participantes.length > 0 && (
                    <div onClick={() => navigate(`/eventos/${id}/participantes`)}
                        style={{ display: "flex", alignItems: "center", gap: "0.6rem",
                        cursor: "pointer", marginBottom: "0.5rem" }}>
                        <div style={{ display: "flex" }}>
                            {participantes.slice(0, 5).map(p => (
                                p.usuario.fotoUrl ? (
                                    <img key={p.id}
                                        src={`${api.defaults.baseURL}${p.usuario.fotoUrl}`}
                                        alt={p.usuario.nome}
                                        title={p.usuario.nome}
                                        style={{ width: "32px", height: "32px", borderRadius: "50%",
                                            objectFit: "cover", border: "2px solid #ffffff",
                                            marginLeft: "-8px", flexShrink: 0 }}
                                    />
                                ) : (
                                    <div key={p.id} title={p.usuario.nome}
                                        style={{ width: "32px", height: "32px", borderRadius: "50%",
                                        backgroundColor: "#f5f5f5", border: "2px solid #ffffff",
                                        display: "flex", alignItems: "center", justifyContent: "center",
                                        marginLeft: "-8px", flexShrink: 0 }}>
                                        <BsPersonCircle size={18} style={{ color: "#ff6b35" }} />
                                    </div>
                                )
                            ))}
                            {participantes.length > 5 && (
                                <div style={{ width: "32px", height: "32px", borderRadius: "50%",
                                    backgroundColor: "#2a2a2a", border: "2px solid #ffffff",
                                    display: "flex", alignItems: "center", justifyContent: "center",
                                    marginLeft: "-8px", flexShrink: 0, color: "#ffffff",
                                    fontSize: "0.7rem", fontWeight: 700 }}>
                                    +{participantes.length - 5}
                                </div>
                            )}
                        </div>
                        <span style={{ color: "#6b7280", fontSize: "0.85rem", display: "flex", alignItems: "center" }}>
                            Ver participantes <BsChevronRight style={{ marginLeft: "0.25rem" }} />
                        </span>
                    </div>
                )}
                </>
            )}
        </Container>
        </>
    )
}
