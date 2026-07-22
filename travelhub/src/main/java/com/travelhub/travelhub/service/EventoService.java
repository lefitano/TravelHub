package com.travelhub.travelhub.service;

import java.util.List;
import java.util.Optional;
import java.util.stream.Collectors;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import com.travelhub.travelhub.repository.EventoRepository;
import com.travelhub.travelhub.repository.ParticipanteRepository;
import com.travelhub.travelhub.repository.UsuarioRepository;
import com.travelhub.travelhub.model.Evento;
import com.travelhub.travelhub.model.Participante;
import com.travelhub.travelhub.model.StatusPagamento;

@Service

public class EventoService {
    @Autowired
    private EventoRepository eventoRepository;
    @Autowired
    private ParticipanteRepository participanteRepository;
    @Autowired
    private UsuarioRepository usuarioRepository;


    public Evento salvar(Evento evento, String emailCriador) {
      Evento eventoSalvo = eventoRepository.save(evento);

      usuarioRepository.findByEmail(emailCriador).ifPresent(usuario ->{
        Participante participante = new Participante();
        participante.setEvento(eventoSalvo);
        participante.setUsuario(usuario);
        participante.setStatusPagamento(StatusPagamento.PENDENTE);
        participanteRepository.save(participante);
      } );
      return eventoSalvo;

    }

    public Optional<Evento> buscarPorId(Long id) {
        return eventoRepository.findById(id);
    }

    public Evento atualizar(Long id, Evento eventoAtualizado) {

        return eventoRepository.findById(id)
                .map(evento -> {
                    evento.setDataInicio(eventoAtualizado.getDataInicio());
                    evento.setDataFim(eventoAtualizado.getDataFim());
                    evento.setDescricao(eventoAtualizado.getDescricao());
                    evento.setDestino(eventoAtualizado.getDestino());
                    evento.setNome(eventoAtualizado.getNome());
                    return eventoRepository.save(evento);
                })
                .orElseThrow(() -> new RuntimeException("Evento não encontrado"));
    }

    public void deletar(Long id) {
        participanteRepository.deleteAll(
            participanteRepository.findByEventoId(id)
        );
        eventoRepository.deleteById(id);
    }

    public List<Evento> listarPorUsuario(String email){
        return participanteRepository.findByUsuarioEmail( email)
        .stream()
        .map(Participante::getEvento)
        .collect(Collectors.toList());
    }
    public boolean usuarioParticipa(Long eventoId, String email){
        return participanteRepository.findByEventoId(eventoId)
        .stream()
        .anyMatch(p -> p.getUsuario().getEmail().equals(email));
    }
}