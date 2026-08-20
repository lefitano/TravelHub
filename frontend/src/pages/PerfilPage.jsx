import { useEffect, useRef, useState } from "react"
import NavBar from "../components/NavBar"
import Container from "react-bootstrap/Container"
import Button from "react-bootstrap/Button"
import api from "../services/api"
import { useAuth } from "../context/AuthContext"
import { BsPersonCircle, BsCameraFill, BsPencilFill } from "react-icons/bs"

export default function PerfilPage(){
    const { token, login } = useAuth()
    const [usuario, setUsuario] = useState(null)
    const [erro, setErro] = useState('')
    const [modoEdicao, setModoEdicao] = useState(false)
    const fotoInputRef = useRef(null)
    const [fotoVersao, setFotoVersao] = useState(0)
    const [erroFoto, setErroFoto] = useState('')

    const [nome, setNome] = useState('')
    const [email, setEmail] = useState('')
    const [erroPerfil, setErroPerfil] = useState('')
    const [sucessoPerfil, setSucessoPerfil] = useState('')

    const [senhaAtual, setSenhaAtual] = useState('')
    const [novaSenha, setNovaSenha] = useState('')
    const [confirmarNovaSenha, setConfirmarNovaSenha] = useState('')
    const [erroSenha, setErroSenha] = useState('')
    const [sucessoSenha, setSucessoSenha] = useState('')

    useEffect(() => {
        async function carregarUsuario(){
            try{
                const res = await api.get('/usuarios/me')
                setUsuario(res.data)
                setNome(res.data.nome)
                setEmail(res.data.email)
            }catch{
                setErro("Não foi possível carregar seus dados")
            }
        }
        carregarUsuario()
    }, [])

    function handleAbrirEdicao(){
        setNome(usuario.nome)
        setEmail(usuario.email)
        setErroPerfil('')
        setSucessoPerfil('')
        setSenhaAtual('')
        setNovaSenha('')
        setConfirmarNovaSenha('')
        setErroSenha('')
        setSucessoSenha('')
        setModoEdicao(true)
    }

    async function handleSalvarPerfil(e){
        e.preventDefault()
        setErroPerfil('')
        setSucessoPerfil('')
        try{
            const res = await api.put(`/usuarios/${usuario.id}`, { nome, email })
            setUsuario(res.data)
            login(token, res.data.nome)
            setSucessoPerfil("Dados atualizados com sucesso!")
        }catch{
            setErroPerfil("Não foi possível atualizar seus dados")
        }
    }

    async function handleTrocarSenha(e){
        e.preventDefault()
        setErroSenha('')
        setSucessoSenha('')
        if(novaSenha !== confirmarNovaSenha){
            setErroSenha("As senhas não coincidem")
            return
        }
        try{
            await api.put(`/usuarios/${usuario.id}/senha`, { senhaAtual, novaSenha })
            setSenhaAtual('')
            setNovaSenha('')
            setConfirmarNovaSenha('')
            setSucessoSenha("Senha alterada com sucesso!")
        }catch{
            setErroSenha("Senha atual incorreta")
        }
    }

    async function handleFotoSelecionada(e){
        const arquivo = e.target.files[0]
        if(!arquivo) return
        setErroFoto('')
        const formData = new FormData()
        formData.append('foto', arquivo)
        try{
            const res = await api.post(`/usuarios/${usuario.id}/foto`, formData)
            setUsuario(res.data)
            setFotoVersao(v => v + 1)
        }catch{
            setErroFoto("Não foi possível enviar a foto")
        }
        e.target.value = ''
    }

    async function handleRemoverFoto(){
        setErroFoto('')
        try{
            const res = await api.delete(`/usuarios/${usuario.id}/foto`)
            setUsuario(res.data)
            setFotoVersao(v => v + 1)
        }catch{
            setErroFoto("Não foi possível remover a foto")
        }
    }

    const urlFoto = usuario?.fotoUrl
        ? `${api.defaults.baseURL}${usuario.fotoUrl}?v=${fotoVersao}`
        : null

    return (
        <>
        <NavBar />
        <hr style={{ border: "none", borderTop: "1px solid #ff6b35", margin: "0" }} />
        <div style={{
            minHeight: "calc(100vh - 72px)",
            backgroundImage: "radial-gradient(circle, #d1d5db 1px, transparent 1px)",
            backgroundSize: "24px 24px",
            backgroundColor: "#ffffff",
            paddingBottom: "3rem"
        }}>
            <Container style={{ maxWidth: "480px" }} className="pt-5">
                {erro && <p style={{ color: "red", fontSize: "0.85rem" }}>{erro}</p>}

                {usuario && (
                    <div style={{ backgroundColor: "#ffffff", borderRadius: "16px",
                        padding: "2rem", border: "1px solid #e5e7eb", borderTop: "3px solid #ff6b35",
                        boxShadow: "0 4px 24px rgba(0,0,0,0.08)", textAlign: "center" }}>

                        <div style={{ position: "relative", width: "104px", margin: "0 auto 1rem" }}>
                            {urlFoto ? (
                                <img
                                    src={urlFoto}
                                    alt="Foto de perfil"
                                    style={{ width: "104px", height: "104px", borderRadius: "50%",
                                        objectFit: "cover", border: "3px solid #ff6b35", display: "block" }}
                                />
                            ) : (
                                <div style={{ width: "104px", height: "104px", borderRadius: "50%",
                                    border: "3px solid #ff6b35", display: "flex", alignItems: "center",
                                    justifyContent: "center", backgroundColor: "#f5f5f5" }}>
                                    <BsPersonCircle size={64} style={{ color: "#ff6b35" }} />
                                </div>
                            )}
                            <button
                                onClick={() => fotoInputRef.current.click()}
                                title="Trocar foto"
                                style={{ position: "absolute", bottom: 0, right: 0, width: "32px", height: "32px",
                                    borderRadius: "50%", backgroundColor: "#ff6b35", border: "2px solid #ffffff",
                                    color: "#ffffff", display: "flex", alignItems: "center", justifyContent: "center",
                                    cursor: "pointer" }}>
                                <BsCameraFill size={14} />
                            </button>
                            <input
                                type="file"
                                accept="image/*"
                                ref={fotoInputRef}
                                onChange={handleFotoSelecionada}
                                style={{ display: "none" }}
                            />
                        </div>
                        {usuario.fotoUrl && (
                            <button onClick={handleRemoverFoto}
                                style={{ background: "none", border: "none", color: "#6b7280",
                                    fontSize: "0.78rem", cursor: "pointer", padding: 0, marginBottom: "0.5rem",
                                    textDecoration: "underline" }}>
                                Remover foto
                            </button>
                        )}
                        {erroFoto && (
                            <p style={{ color: "red", fontSize: "0.8rem", marginBottom: "0.5rem" }}>{erroFoto}</p>
                        )}

                        <h3 style={{ fontFamily: "Raleway, sans-serif", fontWeight: 700, margin: 0 }}>
                            {usuario.nome}
                        </h3>
                        <p style={{ color: "#6b7280", margin: "0.2rem 0 0", fontSize: "0.9rem" }}>
                            {usuario.email}
                        </p>
                        <p style={{ color: "#6b7280", margin: "0.4rem 0 0", fontSize: "0.78rem",
                            textTransform: "uppercase", letterSpacing: "0.06em" }}>
                            Membro desde {new Date(usuario.dataCadastro).toLocaleDateString('pt-BR')}
                        </p>

                        {!modoEdicao && (
                            <Button className="btn-laranja mt-3" onClick={handleAbrirEdicao}>
                                <BsPencilFill style={{ marginRight: "0.4rem", marginTop: "-2px" }} />
                                Editar perfil
                            </Button>
                        )}
                    </div>
                )}

                {modoEdicao && (
                    <>
                        <div style={{ backgroundColor: "#ffffff", borderRadius: "12px", padding: "1.5rem",
                            border: "1px solid #e5e7eb", boxShadow: "0 2px 8px rgba(0,0,0,0.06)", marginTop: "1.5rem" }}>
                            <h5 style={{ fontFamily: "Raleway, sans-serif", fontWeight: 700, marginBottom: "1rem" }}>
                                Dados pessoais
                            </h5>
                            <form onSubmit={handleSalvarPerfil}>
                                <input
                                    type="text"
                                    placeholder="Nome"
                                    value={nome}
                                    onChange={e => setNome(e.target.value)}
                                    required
                                    style={{ width: "100%", padding: "0.5rem 0.75rem", border: "1px solid #e5e7eb",
                                        borderRadius: "8px", fontSize: "0.9rem", outline: "none", marginBottom: "0.5rem" }}
                                />
                                <input
                                    type="email"
                                    placeholder="Email"
                                    value={email}
                                    onChange={e => setEmail(e.target.value)}
                                    required
                                    style={{ width: "100%", padding: "0.5rem 0.75rem", border: "1px solid #e5e7eb",
                                        borderRadius: "8px", fontSize: "0.9rem", outline: "none", marginBottom: "0.75rem" }}
                                />
                                <Button className="btn-laranja" type="submit">Salvar</Button>
                                {erroPerfil && (
                                    <p style={{ color: "red", fontSize: "0.85rem", marginTop: "0.5rem" }}>{erroPerfil}</p>
                                )}
                                {sucessoPerfil && (
                                    <p style={{ color: "green", fontSize: "0.85rem", marginTop: "0.5rem" }}>{sucessoPerfil}</p>
                                )}
                            </form>
                        </div>

                        <div style={{ backgroundColor: "#ffffff", borderRadius: "12px", padding: "1.5rem",
                            border: "1px solid #e5e7eb", boxShadow: "0 2px 8px rgba(0,0,0,0.06)", marginTop: "1rem" }}>
                            <h5 style={{ fontFamily: "Raleway, sans-serif", fontWeight: 700, marginBottom: "1rem" }}>
                                Trocar senha
                            </h5>
                            <form onSubmit={handleTrocarSenha}>
                                <input
                                    type="password"
                                    placeholder="Senha atual"
                                    value={senhaAtual}
                                    onChange={e => setSenhaAtual(e.target.value)}
                                    required
                                    style={{ width: "100%", padding: "0.5rem 0.75rem", border: "1px solid #e5e7eb",
                                        borderRadius: "8px", fontSize: "0.9rem", outline: "none", marginBottom: "0.5rem" }}
                                />
                                <input
                                    type="password"
                                    placeholder="Nova senha"
                                    value={novaSenha}
                                    onChange={e => setNovaSenha(e.target.value)}
                                    required
                                    minLength={6}
                                    style={{ width: "100%", padding: "0.5rem 0.75rem", border: "1px solid #e5e7eb",
                                        borderRadius: "8px", fontSize: "0.9rem", outline: "none", marginBottom: "0.5rem" }}
                                />
                                <input
                                    type="password"
                                    placeholder="Confirmar nova senha"
                                    value={confirmarNovaSenha}
                                    onChange={e => setConfirmarNovaSenha(e.target.value)}
                                    required
                                    minLength={6}
                                    style={{ width: "100%", padding: "0.5rem 0.75rem", border: "1px solid #e5e7eb",
                                        borderRadius: "8px", fontSize: "0.9rem", outline: "none", marginBottom: "0.75rem" }}
                                />
                                <Button className="btn-laranja" type="submit">Trocar senha</Button>
                                {erroSenha && (
                                    <p style={{ color: "red", fontSize: "0.85rem", marginTop: "0.5rem" }}>{erroSenha}</p>
                                )}
                                {sucessoSenha && (
                                    <p style={{ color: "green", fontSize: "0.85rem", marginTop: "0.5rem" }}>{sucessoSenha}</p>
                                )}
                            </form>
                        </div>

                        <div style={{ textAlign: "center", marginTop: "1rem" }}>
                            <Button variant="link" style={{ color: "#6b7280", textDecoration: "none" }}
                                onClick={() => setModoEdicao(false)}>
                                Fechar edição
                            </Button>
                        </div>
                    </>
                )}
            </Container>
        </div>
        </>
    )
}
