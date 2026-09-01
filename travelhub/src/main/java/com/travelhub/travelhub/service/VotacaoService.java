package com.travelhub.travelhub.service;

import com.travelhub.travelhub.repository.VotacaoRepository;

import java.util.List;
import java.util.Optional;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import com.travelhub.travelhub.model.OpcaoVoto;
import com.travelhub.travelhub.model.Votacao;
import com.travelhub.travelhub.repository.OpcaoVotoRepository;
import com.travelhub.travelhub.repository.VotoRepository;

@Service

public class VotacaoService {
    @Autowired
    private VotacaoRepository votacaoRepository;
    @Autowired
    private OpcaoVotoRepository opcaoVotoRepository;
    @Autowired
    private VotoRepository votoRepository;

    public Votacao salvar(Votacao votacao) {
        return votacaoRepository.save(votacao);
    }

    public List<Votacao> listarTodos() {
        return votacaoRepository.findAll();
    }

    public Optional<Votacao> buscarPorId(Long id) {
        return votacaoRepository.findById(id);
    }

    public Votacao atualizar(Long id, Votacao votacaoAtualizada) {
        return votacaoRepository.findById(id)
                .map(votacao -> {
                    votacao.setTitulo(votacaoAtualizada.getTitulo());
                    return votacaoRepository.save(votacao);
                })
                .orElseThrow(() -> new RuntimeException("Votação não encontrada"));
    }

    @Transactional
    public void deletar(Long id) {
        List<OpcaoVoto> opcoes = opcaoVotoRepository.findByVotacaoId(id);
        votoRepository.deleteAll(votoRepository.findByOpcaoVoto_Votacao_Id(id));
        opcaoVotoRepository.deleteAll(opcoes);
        votacaoRepository.deleteById(id);
    }

    public List<Votacao> buscarPorEvento(Long eventoId) {
        return votacaoRepository.findByEventoId(eventoId);
    }

}
