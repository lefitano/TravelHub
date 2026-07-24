package com.travelhub.travelhub.service;

import java.math.BigDecimal;
import java.math.RoundingMode;
import java.util.List;
import java.util.Optional;

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

    public BigDecimal calcularDivisao(Long eventoId) {
        List<Despesa> despesas = despesaRepository.findByEventoId(eventoId);

        BigDecimal total = BigDecimal.ZERO;
        for (Despesa d : despesas) {
            total = total.add(d.getValor());
        }

        int participantes = participanteRepository.findByEventoId(eventoId).size();
        if (participantes == 0) {
            throw new RuntimeException("Evento sem participantes");
        }

        return total.divide(new BigDecimal(participantes), 2, RoundingMode.HALF_UP);
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
        return despesaRepository.save(despesa);
    }

}
