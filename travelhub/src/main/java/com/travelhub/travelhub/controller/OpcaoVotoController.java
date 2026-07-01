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

import com.travelhub.travelhub.model.OpcaoVoto;
import com.travelhub.travelhub.service.OpcaoVotoService;





@RestController
@RequestMapping("/opcoesvotos")
public class OpcaoVotoController {
    @Autowired
    private OpcaoVotoService opcaoVotoService;

    @PostMapping
    public ResponseEntity <OpcaoVoto> salvar(@RequestBody OpcaoVoto opcaoVoto){
        OpcaoVoto salvo = opcaoVotoService.salvar(opcaoVoto);
        return ResponseEntity.status(201).body(salvo);
    }

    @GetMapping
    public ResponseEntity <List<OpcaoVoto>> listarTodos(){
        List <OpcaoVoto> opcoesvotos = opcaoVotoService.listarTodos();
        return ResponseEntity.ok(opcoesvotos);
    }

    @GetMapping("/{id}")
    public ResponseEntity <OpcaoVoto> buscarPorId(@PathVariable Long id){
        return opcaoVotoService.buscarPorId(id)
        .map(ResponseEntity::ok)
        .orElse(ResponseEntity.notFound().build());
    }
    @GetMapping("/votacao/{votacaoId}")
    public ResponseEntity<List<OpcaoVoto>> buscarPorVotacao(@PathVariable Long votacaoId){
        return ResponseEntity.ok(opcaoVotoService.buscarPorVotacao(votacaoId));
    }

    @PutMapping("/{id}")
    public ResponseEntity<OpcaoVoto> atualizar(@PathVariable Long id, @RequestBody OpcaoVoto opcaoVoto){
        try{
            OpcaoVoto votoAtualizado = opcaoVotoService.atualizar(id, opcaoVoto);
            return ResponseEntity.ok(votoAtualizado);
        }catch(RuntimeException e){
            return ResponseEntity.notFound().build();
        }
    }


    @DeleteMapping("/{id}")
    public ResponseEntity<Void> deletar(@PathVariable Long id){
        try{
            opcaoVotoService.deletar(id);
            return ResponseEntity.noContent().build();
        }catch(RuntimeException e){
            return ResponseEntity.notFound().build();
        }
    }
}
