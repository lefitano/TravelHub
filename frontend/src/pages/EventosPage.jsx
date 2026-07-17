import { useEffect, useState } from "react";
import {useNavigate} from 'react-router-dom';
import api from '../services/api';
import NavBar from '../components/NavBar';
import Container from "react-bootstrap/Container";
import Button from "react-bootstrap/Button";
import Col from 'react-bootstrap/Col';
import Row from "react-bootstrap/Row";
import  Card  from "react-bootstrap/Card";
import  Form  from "react-bootstrap/Form";



export default function EventosPage(){

    const [eventos, setEventos] = useState([]);
    const [mostrarForm, setMostrarForm] = useState(false);
    const [nome, setNome] = useState('');
    const [descricao, setDescricao] = useState('');
    const [destino, setDestino] = useState('');
    const [dataInicio, setDataInicio] = useState('');
    const [dataFim, setDataFim] = useState('');
    const [erroForm, setErroForm] = useState('');

    const navigate = useNavigate();

    useEffect(() => {
        async function carregarEventos(){
            const resposta = await api.get('/eventos/meus');
                setEventos(resposta.data);
        }
        carregarEventos();
    }, []);

    async function handleCriarEvento(e){
        e.preventDefault();
        setErroForm('');
            try{
                await api.post('/eventos', {nome, descricao, destino, dataInicio, dataFim});
                setMostrarForm(false);
                setNome('');
                setDescricao('');
                setDestino('');
                setDataInicio('');
                setDataFim('');
                const resposta = await api.get('/eventos/meus');
                setEventos(resposta.data);
            }catch (error){
                setErroForm("Erro ao criar evento. Verifique os dados");
            }
        }
    }

    return(
        <>

        </>
    )
}