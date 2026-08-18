import { useEffect, useState } from "react"
import { useParams, useNavigate } from "react-router-dom"
import api from "../services/api"
import NavBar from "../components/NavBar"
import Container from "react-bootstrap/esm/Container"
import { BsArrowLeft, BsWallet2 } from "react-icons/bs"

export default function DespesasResumoPage(){
    const { id } = useParams()
    const navigate = useNavigate()
    const [resumo, setResumo] = useState(null)
    const [erro, setErro] = useState('')

    useEffect(() => {
        async function carregarResumo(){
            try{
                const res = await api.get(`/despesas/resumo/${id}`)
                setResumo(res.data)
            }catch{
                setErro("Não foi possível carregar o resumo de despesas")
            }
        }
        carregarResumo()
    }, [id])

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
                <h2 style={{ color: "#ffffff", fontFamily: "Raleway, sans-serif",
                    fontWeight: 700, margin: 0, display: "flex", alignItems: "center" }}>
                    <BsWallet2 size={22} style={{ marginRight: "0.5rem", color: "#ff6b35" }} />
                    Resumo de Despesas
                </h2>
            </Container>
        </div>
        <hr style={{ border: "none", borderTop: "1px solid #ff6b35", margin: "0" }} />
        <Container className="mt-4">
            {erro && <p style={{ color: "red", fontSize: "0.85rem" }}>{erro}</p>}

            {resumo && (
                <>
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

                    <h5 style={{ fontFamily: "Raleway, sans-serif", fontWeight: 700, marginBottom: "1rem" }}>
                        {resumo.criador ? "Todas as despesas do evento" : "Suas despesas"}
                    </h5>

                    {resumo.despesas.length === 0 ? (
                        <p style={{ color: "#6b7280" }}>
                            {resumo.criador
                                ? "Nenhuma despesa registrada ainda."
                                : "Você ainda não está vinculado a nenhuma despesa."}
                        </p>
                    ) : (
                        resumo.despesas.map(d => (
                            <div key={d.despesaId} style={{ padding: "0.75rem 1rem", marginBottom: "0.5rem",
                                backgroundColor: "#ffffff", border: "1px solid #e5e7eb",
                                borderRadius: "8px", boxShadow: "0 1px 4px rgba(0,0,0,0.04)" }}>
                                <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
                                    <p style={{ margin: 0, fontWeight: 600, fontSize: "0.95rem" }}>{d.descricao}</p>
                                    <p style={{ margin: 0, color: "#ff6b35", fontWeight: 700, fontSize: "0.9rem" }}>
                                        R$ {Number(d.minhaParte).toFixed(2)}
                                    </p>
                                </div>
                                <p style={{ margin: "0.3rem 0 0", color: "#6b7280", fontSize: "0.8rem" }}>
                                    Total: R$ {Number(d.valorTotal).toFixed(2)} · Pago por {d.responsavelNome}
                                </p>
                                {resumo.criador && (
                                    <p style={{ margin: "0.3rem 0 0", color: "#6b7280", fontSize: "0.78rem" }}>
                                        Dividido entre: {d.participantesNomes.join(", ")}
                                    </p>
                                )}
                            </div>
                        ))
                    )}
                </>
            )}
        </Container>
        </>
    )
}
