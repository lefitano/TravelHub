package com.travelhub.travelhub.service;

import java.math.BigDecimal;
import java.math.RoundingMode;
import java.util.ArrayList;
import java.util.HashMap;
import java.util.List;
import java.util.Map;
import java.util.Optional;
import java.util.stream.Collectors;



import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import com.travelhub.travelhub.repository.DespesaRepository;
import com.travelhub.travelhub.repository.EventoRepository;
import com.travelhub.travelhub.dto.AddDespesaDTO;
import com.travelhub.travelhub.model.Despesa;
import com.travelhub.travelhub.repository.ParticipanteRepository;
import com.travelhub.travelhub.repository.UsuarioRepository;
import com.travelhub.travelhub.model.Usuario;
import com.travelhub.travelhub.model.Evento;
import com.travelhub.travelhub.model.Participante;
import com.travelhub.travelhub.dto.SaldoParticipanteDTO;
import com.travelhub.travelhub.dto.DespesaDetalheDTO;
import com.travelhub.travelhub.dto.ResumoDespesasDTO;
@Service

public class DespesaService {
    @Autowired
    private DespesaRepository despesaRepository;
    @Autowired
    private ParticipanteRepository participanteRepository;
    @Autowired
    private UsuarioRepository usuarioRepository;
    @Autowired
    private EventoRepository eventoRepository;

    public Despesa salvar(Despesa despesa) {
        return despesaRepository.save(despesa);
    }

    public List<Despesa> listarTodos() {
        return despesaRepository.findAll();
    }

    public Optional<Despesa> buscarPorId(Long id) {
        return despesaRepository.findById(id);
    }

    public Despesa atualizar(Long id, Despesa despesaAtualizada) {

        return despesaRepository.findById(id)
                .map(despesa -> {
                    despesa.setDescricao(despesaAtualizada.getDescricao());
                    despesa.setValor(despesaAtualizada.getValor());
                    return despesaRepository.save(despesa);
                })
                .orElseThrow(() -> new RuntimeException("Despesa não encontrada"));
    }

    public void deletar(Long id) {
        despesaRepository.deleteById(id);
    }

    public List<SaldoParticipanteDTO> calcularDivisao(Long eventoId) {
        List<Despesa> despesas = despesaRepository.findByEventoId(eventoId);
        List<Participante> todosParticipantes = participanteRepository.findByEventoId(eventoId);
    
        if (todosParticipantes.isEmpty()) {
            throw new RuntimeException("Evento sem participantes");
        }
    
        Map<Long, BigDecimal> totalPorParticipante = new HashMap<>();
        for (Participante p : todosParticipantes) {
            totalPorParticipante.put(p.getId(), BigDecimal.ZERO);
        }
    
        for (Despesa d : despesas) {
            List<Participante> participantesDaDespesa = d.getParticipantes().isEmpty()
                ? todosParticipantes
                : d.getParticipantes();
    
            BigDecimal valorPorPessoa = d.getValor().divide(
                new BigDecimal(participantesDaDespesa.size()), 2, RoundingMode.HALF_UP
            );
    
            for (Participante p : participantesDaDespesa) {
                totalPorParticipante.merge(p.getId(), valorPorPessoa, BigDecimal::add);
            }
        }
    
        List<SaldoParticipanteDTO> resultado = new ArrayList<>();
        for (Participante p : todosParticipantes) {
            resultado.add(new SaldoParticipanteDTO(
                p.getId(), p.getUsuario().getNome(), totalPorParticipante.get(p.getId())
            ));
        }
        return resultado;
    }
    
    public List<Despesa> listarPorEvento(Long eventoId){
        return despesaRepository.findByEventoId(eventoId);
    }

    public Despesa criarDespesa(AddDespesaDTO dto, String email){
        Usuario responsavel = usuarioRepository.findByEmail(email)
        .orElseThrow(() -> new RuntimeException("Usuário não encontrado"));
        Evento evento = eventoRepository.findById(dto.getEventoId())
        .orElseThrow(() -> new RuntimeException("Evento não encontrado!"));
        Despesa despesa = new Despesa();
        despesa.setDescricao(dto.getDescricao());
        despesa.setValor(dto.getValor());
        despesa.setResponsavel(responsavel);
        despesa.setEvento(evento);
        
        List<Participante> participantes;
        if(dto.getParticipantesIds() == null || dto.getParticipantesIds().isEmpty() ){
            participantes = participanteRepository.findByEventoId(dto.getEventoId());
        }else{
            participantes = participanteRepository.findAllById(dto.getParticipantesIds());
            boolean todosDoEvento = participantes.stream()
                .allMatch(p -> p.getEvento().getId().equals(dto.getEventoId()));
                if(!todosDoEvento){
                    throw new RuntimeException("Participante não pertence a esse evento");
                }if(participantes.size() != dto.getParticipantesIds().size()){
                    throw new RuntimeException("Um ou mais participantes não encontrados");
                }
        }
        despesa.setParticipantes(participantes);
        return despesaRepository.save(despesa);


    }

    public ResumoDespesasDTO gerarResumo(Long eventoId, String email) {
        Evento evento = eventoRepository.findById(eventoId)
            .orElseThrow(() -> new RuntimeException("Evento não encontrado"));

        List<Participante> todosParticipantes = participanteRepository.findByEventoId(eventoId);
        Participante participanteAtual = todosParticipantes.stream()
            .filter(p -> p.getUsuario().getEmail().equals(email))
            .findFirst()
            .orElseThrow(() -> new RuntimeException("Usuário não participa desse evento"));

        boolean ehCriador = evento.getCriador() != null && evento.getCriador().getEmail().equals(email);

        List<Despesa> despesas = despesaRepository.findByEventoId(eventoId);
        List<DespesaDetalheDTO> detalhes = new ArrayList<>();
        BigDecimal totalQueDevo = BigDecimal.ZERO;

        for (Despesa d : despesas) {
            List<Participante> participantesDaDespesa = d.getParticipantes().isEmpty()
                ? todosParticipantes
                : d.getParticipantes();

            boolean euParticipoDessa = participantesDaDespesa.stream()
                .anyMatch(p -> p.getId().equals(participanteAtual.getId()));

            if (!ehCriador && !euParticipoDessa) {
                continue;
            }

            BigDecimal valorPorPessoa = d.getValor().divide(
                new BigDecimal(participantesDaDespesa.size()), 2, RoundingMode.HALF_UP
            );

            BigDecimal minhaParte = euParticipoDessa ? valorPorPessoa : BigDecimal.ZERO;
            if (euParticipoDessa) {
                totalQueDevo = totalQueDevo.add(valorPorPessoa);
            }

            List<String> nomes = participantesDaDespesa.stream()
                .map(p -> p.getUsuario().getNome())
                .collect(Collectors.toList());

            detalhes.add(new DespesaDetalheDTO(
                d.getId(), d.getDescricao(), d.getValor(), d.getResponsavel().getNome(), minhaParte, nomes
            ));
        }

        return new ResumoDespesasDTO(ehCriador, totalQueDevo, detalhes);
    }

}
