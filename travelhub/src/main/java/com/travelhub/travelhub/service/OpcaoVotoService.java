package com.travelhub.travelhub.service;

import java.util.List;
import java.util.Optional;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import com.travelhub.travelhub.model.OpcaoVoto;
import com.travelhub.travelhub.repository.OpcaoVotoRepository;

@Service
public class OpcaoVotoService {
    @Autowired
    private OpcaoVotoRepository opcaoVotoRepository;

    public OpcaoVoto salvar(OpcaoVoto opcaoVoto) {
        return opcaoVotoRepository.save(opcaoVoto);
    }

    public List<OpcaoVoto> listarTodos() {
        return opcaoVotoRepository.findAll();
    }

    public Optional<OpcaoVoto> buscarPorId(Long id) {
        return opcaoVotoRepository.findById(id);
    }

    public OpcaoVoto atualizar(Long id, OpcaoVoto opcaoVotoAtualizado) {
        return opcaoVotoRepository.findById(id)
                .map(opcaoVoto -> {
                    opcaoVoto.setDescricao(opcaoVotoAtualizado.getDescricao());
                    return opcaoVotoRepository.save(opcaoVoto);
                })
                .orElseThrow(() -> new RuntimeException("Opção de voto não encontrada!"));
    }

    public void deletar(Long id) {
        opcaoVotoRepository.deleteById(id);
    }

    public List<OpcaoVoto> buscarPorVotacao(Long votacaoId) {
        return opcaoVotoRepository.findByVotacaoId(votacaoId);
    }
}
