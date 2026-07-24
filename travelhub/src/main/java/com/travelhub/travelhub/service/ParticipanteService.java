package com.travelhub.travelhub.service;

import java.util.List;
import java.util.Optional;

import org.springframework.beans.factory.annotation.Autowired;

import org.springframework.stereotype.Service;

import com.travelhub.travelhub.repository.ParticipanteRepository;
import com.travelhub.travelhub.repository.UsuarioRepository;
import com.travelhub.travelhub.dto.AddParticipanteDTO;
import com.travelhub.travelhub.model.Participante;
import com.travelhub.travelhub.model.StatusPagamento;
import com.travelhub.travelhub.repository.EventoRepository;
import com.travelhub.travelhub.model.Usuario;
import com.travelhub.travelhub.model.Evento;

@Service

public class ParticipanteService {
    @Autowired
    private ParticipanteRepository participanteRepository;
    @Autowired
    private EventoRepository eventoRepository;
    @Autowired
    private UsuarioRepository usuarioRepository;


    public Participante salvar(Participante participante) {
        return participanteRepository.save(participante);
    }

    public List<Participante> listarTodos() {
        return participanteRepository.findAll();
    }

    public Optional<Participante> buscarPorId(Long id) {
        return participanteRepository.findById(id);
    }

    public Participante atualizar(Long id, Participante participanteAtualizado) {
        return participanteRepository.findById(id)
                .map(participante -> {
                    participante.setStatusPagamento(participanteAtualizado.getStatusPagamento());
                    return participanteRepository.save(participante);
                })
                .orElseThrow(() -> new RuntimeException("Participante não encontrado"));
    }

    public void deletar(Long id) {
        participanteRepository.deleteById(id);
    }
    public List <Participante> listarPorEvento(Long eventoId){
        return participanteRepository.findByEventoId(eventoId);
    }

    public Participante adicionarPorEmail(AddParticipanteDTO dto){
        Usuario usuario = usuarioRepository.findByEmail(dto.getEmail())
        .orElseThrow(() -> new RuntimeException("Usuário não encontrado"));
        Evento evento = eventoRepository.findById(dto.getEventoId())
        .orElseThrow(() -> new RuntimeException("Evento não encontrado!"));
        Participante p = new Participante();
        p.setUsuario(usuario);
        p.setEvento(evento);
        p.setStatusPagamento(StatusPagamento.PENDENTE);
        return participanteRepository.save(p);
        

    }

}
