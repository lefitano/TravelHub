package com.travelhub.travelhub.service;

import java.util.List;
import java.util.Optional;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import com.travelhub.travelhub.repository.ParticipanteRepository;
import com.travelhub.travelhub.model.Participante;

@Service

public class ParticipanteService {
    @Autowired
    private ParticipanteRepository participanteRepository;

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

}
