import { useEffect } from "react"
import { useState } from "react"
import { useParams, useNavigate } from "react-router-dom"
import api from "../services/api"
import NavBar from "../components/NavBar";
import Button from "react-bootstrap/Button";
import {BsArrowLeft, BsGeoAlt, BsCalendar3} from "react-icons/bs"
import Container from "react-bootstrap/esm/Container";

export default function EventosDetailsPage(){

    const {id} = useParams();
    const[evento, setEvento] = useState(null)
    const[participantes, setParticipantes] = useState([])
    const[despesas, setDespesas] = useState([])
    const[divisaoPorPessoa, setDivisaoPorPessoa] = useState(null)
    const[erro, setErro] = useState('')


    useEffect(() => {
        async function carregarDados(){
            try{
                const[resEvento, resParticipantes, resDespesas] = await Promise.all([
                    api.get(`/eventos/${id}`),
                    api.get(`/participantes/evento/${id}`),
                    api.get(`/despesas/evento/${id}`)
                ])
              setEvento(resEvento.data)
              setParticipantes(resParticipantes.data)
              setDespesas(resDespesas.data)
            } catch(e){
                setErro("Não foi possível carregar os dados do evento")
            }
        }
        carregarDados()
    }, [id])

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
        </Container>
        </>
    )
}