package com.travelhub.travelhub.service;

import com.travelhub.travelhub.repository.DespesaRepository;
import java.time.LocalDate;
import java.util.List;
import java.util.Optional;
import java.util.stream.Collectors;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import com.travelhub.travelhub.repository.EventoRepository;
import com.travelhub.travelhub.repository.ParticipanteRepository;
import com.travelhub.travelhub.repository.UsuarioRepository;
import com.travelhub.travelhub.repository.VotacaoRepository;

import org.springframework.transaction.annotation.Transactional;

import com.travelhub.travelhub.dto.CriarEventoDTO;
import com.travelhub.travelhub.model.Evento;
import com.travelhub.travelhub.model.Participante;
import com.travelhub.travelhub.model.StatusPagamento;
import com.travelhub.travelhub.model.Usuario;
import com.travelhub.travelhub.model.Votacao;

@Service

public class EventoService {
    private final DespesaRepository despesaRepository;
    @Autowired
    private EventoRepository eventoRepository;
    @Autowired
    private ParticipanteRepository participanteRepository;
    @Autowired
    private UsuarioRepository usuarioRepository;
    @Autowired
    private VotacaoRepository votacaoRepository;
    @Autowired
    private VotacaoService votacaoService;


    EventoService(DespesaRepository despesaRepository) {
        this.despesaRepository = despesaRepository;
    }


    // recebe um DTO sem "id" (em vez da entidade Evento direto) — mesmo motivo do
    // UsuarioService.salvar: evita que um client sobrescreva um evento existente
    // de outra pessoa passando o id dele no corpo da requisição (mass assignment)
    public Evento salvar(CriarEventoDTO dto, String emailCriador) {
      validarDatas(dto.getDataInicio(), dto.getDataFim());

      Usuario criador = usuarioRepository.findByEmail(emailCriador)
        .orElseThrow(() -> new RuntimeException("Usuário não encontrado"));

      Evento evento = new Evento();
      evento.setNome(dto.getNome());
      evento.setDescricao(dto.getDescricao());
      evento.setDestino(dto.getDestino());
      evento.setDataInicio(dto.getDataInicio());
      evento.setDataFim(dto.getDataFim());
      evento.setTipo(dto.getTipo());
      evento.setCriador(criador);
      Evento eventoSalvo = eventoRepository.save(evento);

      Participante participante = new Participante();
      participante.setEvento(eventoSalvo);
      participante.setUsuario(criador);
      participante.setStatusPagamento(StatusPagamento.PENDENTE);
      participanteRepository.save(participante);

      return eventoSalvo;
    }

    public Optional<Evento> buscarPorId(Long id) {
        return eventoRepository.findById(id);
    }

    public Evento atualizar(Long id, Evento eventoAtualizado) {
        validarDatas(eventoAtualizado.getDataInicio(), eventoAtualizado.getDataFim());

        return eventoRepository.findById(id)
                .map(evento -> {
                    evento.setDataInicio(eventoAtualizado.getDataInicio());
                    evento.setDataFim(eventoAtualizado.getDataFim());
                    evento.setDescricao(eventoAtualizado.getDescricao());
                    evento.setDestino(eventoAtualizado.getDestino());
                    evento.setNome(eventoAtualizado.getNome());
                    evento.setTipo(eventoAtualizado.getTipo());
                    return eventoRepository.save(evento);
                })
                .orElseThrow(() -> new RuntimeException("Evento não encontrado"));
    }

    private void validarDatas(LocalDate dataInicio, LocalDate dataFim) {
        if (dataInicio != null && dataFim != null && dataFim.isBefore(dataInicio)) {
            throw new IllegalArgumentException("A data final não pode ser anterior à data de início");
        }
    }
@Transactional
    public void deletar(Long id) {
        List<Votacao> votacoes = votacaoRepository.findByEventoId(id);
        for (Votacao votacao : votacoes) {
            votacaoService.deletar(votacao.getId());
        }
        despesaRepository.deleteAll(despesaRepository.findByEventoId(id));
        participanteRepository.deleteAll(participanteRepository.findByEventoId(id));
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