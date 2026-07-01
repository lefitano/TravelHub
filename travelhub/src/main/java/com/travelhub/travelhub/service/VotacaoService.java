package com.travelhub.travelhub.service;

import com.travelhub.travelhub.repository.VotacaoRepository;

import java.util.List;
import java.util.Optional;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import com.travelhub.travelhub.model.Votacao;

@Service

public class VotacaoService {
@Autowired
    private VotacaoRepository votacaoRepository;

    public Votacao salvar(Votacao votacao){
        return votacaoRepository.save(votacao);
    }

    public List <Votacao> listarTodos(){
        return votacaoRepository.findAll();
    }

    public Optional <Votacao> buscarPorId(Long id){
        return votacaoRepository.findById(id);
    }

    public Votacao atualizar(Long id, Votacao votacaoAtualizada){
        return votacaoRepository.findById(id)
        .map(votacao -> {
            votacao.setTitulo(votacaoAtualizada.getTitulo());
            return votacaoRepository.save(votacao);
        }) 
        .orElseThrow(() ->  new RuntimeException("Votação não encontrada")); 
    }
    public void deletar(Long id){
         votacaoRepository.deleteById(id);
    }

    public List<Votacao> buscarPorEvento(Long eventoId){
        return votacaoRepository.findByEventoId(eventoId);
    }


}
