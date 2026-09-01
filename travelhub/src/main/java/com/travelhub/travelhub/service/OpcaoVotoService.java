package com.travelhub.travelhub.service;

import java.util.List;
import java.util.Optional;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import com.travelhub.travelhub.dto.CriarOpcaoVotoDTO;
import com.travelhub.travelhub.model.OpcaoVoto;
import com.travelhub.travelhub.model.Votacao;
import com.travelhub.travelhub.repository.OpcaoVotoRepository;
import com.travelhub.travelhub.repository.VotoRepository;

@Service
public class OpcaoVotoService {
    @Autowired
    private OpcaoVotoRepository opcaoVotoRepository;
    @Autowired
    private VotoRepository votoRepository;

    // recebe um DTO sem "id" + a Votacao já validada pelo controller (em vez da
    // entidade OpcaoVoto direto) — evita que um client sobrescreva a opção de
    // outra pessoa passando o id dela no corpo da requisição (mass assignment)
    public OpcaoVoto salvar(CriarOpcaoVotoDTO dto, Votacao votacao) {
        OpcaoVoto opcaoVoto = new OpcaoVoto();
        opcaoVoto.setDescricao(dto.getDescricao());
        opcaoVoto.setVotacao(votacao);
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

    @Transactional
    public void deletar(Long id) {
        votoRepository.deleteAll(votoRepository.findByOpcaoVoto_Id(id));
        opcaoVotoRepository.deleteById(id);
    }

    public List<OpcaoVoto> buscarPorVotacao(Long votacaoId) {
        return opcaoVotoRepository.findByVotacaoId(votacaoId);
    }
}
