package com.travelhub.travelhub.controller;

import java.util.List;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.DeleteMapping;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.PutMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import com.travelhub.travelhub.model.Votacao;
import com.travelhub.travelhub.service.VotacaoService;



@RestController
@RequestMapping("/votacoes")

public class VotacaoController {
    @Autowired
    private VotacaoService votacaoService;
    
    @PostMapping
    public ResponseEntity<Votacao> criar(@RequestBody Votacao votacao){
        Votacao salva = votacaoService.salvar(votacao);
        return ResponseEntity.status(201).body(salva);
    }

    @GetMapping
    public ResponseEntity <List<Votacao>> listarTodos(){
      List<Votacao> votacoes = votacaoService.listarTodos();
      return ResponseEntity.ok(votacoes);
    }

    @GetMapping("/{id}")
    public ResponseEntity <Votacao> buscarPorId(@PathVariable Long id){
        return votacaoService.buscarPorId(id)
        .map(ResponseEntity::ok)
        .orElse(ResponseEntity.notFound().build());
    }
    @GetMapping("/evento/{eventoId}")
    public ResponseEntity<List<Votacao>> buscarPorEvento(@PathVariable Long eventoId){
        return ResponseEntity.ok(votacaoService.buscarPorEvento(eventoId));
    }

    @PutMapping("/{id}")
    public ResponseEntity <Votacao> atualizar(@PathVariable Long id, @RequestBody Votacao votacao){
        try{
            Votacao votacaoAtualizada = votacaoService.atualizar(id, votacao);
            return ResponseEntity.ok(votacaoAtualizada);
        }catch(RuntimeException e){
            return ResponseEntity.notFound().build();
        }
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<Void> deletar(@PathVariable Long id){
        try{
            votacaoService.deletar(id);
            return ResponseEntity.noContent().build();
        }catch (RuntimeException e){
            return ResponseEntity.notFound().build();
        }
    }
}
