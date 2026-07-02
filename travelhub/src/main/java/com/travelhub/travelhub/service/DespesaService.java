package com.travelhub.travelhub.service;

import java.math.BigDecimal;
import java.math.RoundingMode;
import java.util.List;
import java.util.Optional;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import com.travelhub.travelhub.repository.DespesaRepository;
import com.travelhub.travelhub.model.Despesa;
import com.travelhub.travelhub.repository.ParticipanteRepository;

@Service

public class DespesaService {
    @Autowired
    private DespesaRepository despesaRepository;
    @Autowired
    private ParticipanteRepository participanteRepository;

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

}
