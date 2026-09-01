import { useEffect, useState } from "react"
import { useParams, useNavigate } from "react-router-dom"
import api from "../services/api"
import NavBar from "../components/NavBar"
import Button from "react-bootstrap/Button"
import Container from "react-bootstrap/esm/Container"
import { BsArrowLeft, BsCheck2Square, BsCheckCircleFill, BsCircle, BsX } from "react-icons/bs"

export default function VotacaoDetailsPage(){
    const { id, votacaoId } = useParams()
    const navigate = useNavigate()
    const [votacao, setVotacao] = useState(null)
    const [opcoes, setOpcoes] = useState([])
    const [resultado, setResultado] = useState(null)
    const [usuarioLogado, setUsuarioLogado] = useState(null)
    const [erro, setErro] = useState('')
    const [descricaoOpcao, setDescricaoOpcao] = useState('')
    const [erroOpcao, setErroOpcao] = useState('')
    const [mostrarEditarTitulo, setMostrarEditarTitulo] = useState(false)
    const [tituloEdit, setTituloEdit] = useState('')
    const [erroTitulo, setErroTitulo] = useState('')

    const ehCriador = votacao?.evento?.criador?.email === usuarioLogado?.email

    useEffect(() => {
        async function carregarDados(){
            try{
                const [resVotacao, resOpcoes, resResultado, resUsuario] = await Promise.all([
                    api.get(`/votacoes/${votacaoId}`),
                    api.get(`/opcoesvotos/votacao/${votacaoId}`),
                    api.get(`/votos/resultado/${votacaoId}`),
                    api.get(`/usuarios/me`)
                ])
                setVotacao(resVotacao.data)
                setOpcoes(resOpcoes.data)
                setResultado(resResultado.data)
                setUsuarioLogado(resUsuario.data)
            }catch{
                setErro("Não foi possível carregar a votação")
            }
        }
        carregarDados()
    }, [votacaoId])

    async function atualizarResultado(){
        const res = await api.get(`/votos/resultado/${votacaoId}`)
        setResultado(res.data)
    }

    async function handleVotar(opcaoVotoId){
        try{
            await api.post('/votos', { opcaoVotoId })
            await atualizarResultado()
        }catch{
            setErro("Não foi possível registrar seu voto")
        }
    }

    async function handleAdicionarOpcao(e){
        e.preventDefault()
        setErroOpcao('')
        try{
            await api.post('/opcoesvotos', { descricao: descricaoOpcao, votacao: { id: Number(votacaoId) } })
            setDescricaoOpcao('')
            const res = await api.get(`/opcoesvotos/votacao/${votacaoId}`)
            setOpcoes(res.data)
            await atualizarResultado()
        }catch{
            setErroOpcao("Não foi possível adicionar a opção")
        }
    }

    async function handleRemoverOpcao(opcaoId){
        if(!window.confirm("Remover essa opção de voto?")){
            return
        }
        try{
            await api.delete(`/opcoesvotos/${opcaoId}`)
            setOpcoes(prev => prev.filter(o => o.id !== opcaoId))
            await atualizarResultado()
        }catch{
            setErroOpcao("Não foi possível remover a opção")
        }
    }

    function handleAbrirEdicaoTitulo(){
        setTituloEdit(votacao.titulo)
        setErroTitulo('')
        setMostrarEditarTitulo(true)
    }

    async function handleSalvarTitulo(e){
        e.preventDefault()
        setErroTitulo('')
        try{
            const res = await api.put(`/votacoes/${votacaoId}`, { titulo: tituloEdit })
            setVotacao(prev => ({ ...prev, titulo: res.data.titulo }))
            setMostrarEditarTitulo(false)
        }catch{
            setErroTitulo("Não foi possível salvar o título")
        }
    }

    async function handleExcluirVotacao(){
        if(!window.confirm("Tem certeza que deseja excluir essa votação? Essa ação não pode ser desfeita.")){
            return
        }
        try{
            await api.delete(`/votacoes/${votacaoId}`)
            navigate(`/eventos/${id}`)
        }catch{
            setErro("Não foi possível excluir a votação")
        }
    }

    function contagemDaOpcao(opcaoId){
        const item = resultado?.opcoes?.find(o => o.opcaoVotoId === opcaoId)
        return item ? item.quantidadeVotos : 0
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

                {votacao && !mostrarEditarTitulo && (
                    <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start" }}>
                        <h2 style={{ color: "#ffffff", fontFamily: "Raleway, sans-serif",
                            fontWeight: 700, margin: 0, display: "flex", alignItems: "center" }}>
                            <BsCheck2Square size={22} style={{ marginRight: "0.5rem", color: "#ff6b35" }} />
                            {votacao.titulo}
                        </h2>
                        {ehCriador && (
                            <div style={{ display: "flex", gap: "0.5rem" }}>
                                <Button className="btn-laranja" onClick={handleAbrirEdicaoTitulo}>Editar</Button>
                                <Button variant="outline-light" onClick={handleExcluirVotacao}>Excluir</Button>
                            </div>
                        )}
                    </div>
                )}

                {votacao && mostrarEditarTitulo && (
                    <form onSubmit={handleSalvarTitulo} style={{ display: "flex", gap: "0.5rem", maxWidth: "480px" }}>
                        <input
                            type="text"
                            value={tituloEdit}
                            onChange={e => setTituloEdit(e.target.value)}
                            required
                            style={{ flex: 1, padding: "0.5rem 0.75rem", border: "1px solid #e5e7eb",
                                borderRadius: "8px", fontSize: "0.9rem", outline: "none" }}
                        />
                        <Button className="btn-laranja" type="submit">Salvar</Button>
                        <Button variant="link" style={{ color: "#6b7280", textDecoration: "none" }}
                            onClick={() => setMostrarEditarTitulo(false)}>
                            Cancelar
                        </Button>
                    </form>
                )}
                {erroTitulo && (
                    <p style={{ color: "red", fontSize: "0.85rem", marginTop: "0.5rem" }}>{erroTitulo}</p>
                )}
            </Container>
        </div>
        <hr style={{ border: "none", borderTop: "1px solid #ff6b35", margin: "0" }} />
        <Container className="mt-4">
            {erro && <p style={{ color: "red", fontSize: "0.85rem" }}>{erro}</p>}

            <div style={{ marginBottom: "2rem" }}>
                {opcoes.length === 0 && (
                    <p style={{ color: "#6b7280", fontSize: "0.9rem" }}>Nenhuma opção cadastrada ainda.</p>
                )}

                {opcoes.map(o => {
                    const minhaEscolha = resultado?.minhasOpcoesIds?.includes(o.id)
                    return (
                        <div key={o.id} style={{ display: "flex", justifyContent: "space-between",
                            alignItems: "center", padding: "0.75rem 1rem", marginBottom: "0.5rem",
                            backgroundColor: "#ffffff", border: minhaEscolha ? "2px solid #ff6b35" : "1px solid #e5e7eb",
                            borderRadius: "8px", boxShadow: "0 1px 4px rgba(0,0,0,0.04)" }}>
                            <button onClick={() => handleVotar(o.id)}
                                style={{ background: "none", border: "none", cursor: "pointer",
                                    display: "flex", alignItems: "center", gap: "0.6rem", padding: 0, textAlign: "left", flex: 1 }}>
                                {minhaEscolha
                                    ? <BsCheckCircleFill style={{ color: "#ff6b35", flexShrink: 0 }} size={18} />
                                    : <BsCircle style={{ color: "#6b7280", flexShrink: 0 }} size={18} />}
                                <span style={{ fontWeight: 600, fontSize: "0.95rem" }}>{o.descricao}</span>
                            </button>
                            <div style={{ display: "flex", alignItems: "center", gap: "0.75rem" }}>
                                <span style={{ color: "#6b7280", fontSize: "0.85rem" }}>
                                    {contagemDaOpcao(o.id)} voto{contagemDaOpcao(o.id) === 1 ? "" : "s"}
                                </span>
                                {ehCriador && (
                                    <button onClick={() => handleRemoverOpcao(o.id)}
                                        style={{ background: "none", border: "none", color: "#6b7280",
                                            cursor: "pointer", fontSize: "1.1rem", lineHeight: 1 }}>
                                        <BsX size={20} />
                                    </button>
                                )}
                            </div>
                        </div>
                    )
                })}

                {ehCriador && (
                    <form onSubmit={handleAdicionarOpcao}
                        style={{ display: "flex", gap: "0.5rem", marginTop: "1rem" }}>
                        <input
                            type="text"
                            placeholder="Nova opção (ex: Pizzaria do João)"
                            value={descricaoOpcao}
                            onChange={e => setDescricaoOpcao(e.target.value)}
                            required
                            style={{ flex: 1, padding: "0.5rem 0.75rem", border: "1px solid #e5e7eb",
                                borderRadius: "8px", fontSize: "0.9rem", outline: "none" }}
                        />
                        <Button className="btn-laranja" type="submit">Adicionar</Button>
                    </form>
                )}

                {erroOpcao && (
                    <p style={{ color: "red", fontSize: "0.85rem", marginTop: "0.5rem" }}>{erroOpcao}</p>
                )}
            </div>
        </Container>
        </>
    )
}
