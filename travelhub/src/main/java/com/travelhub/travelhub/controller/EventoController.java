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

import com.travelhub.travelhub.service.EventoService;
import com.travelhub.travelhub.model.Evento;


@RestController
@RequestMapping("/eventos")
public class EventoController {
    @Autowired
    private EventoService eventoService;

    @PostMapping
    public ResponseEntity<Evento> salvar(@RequestBody Evento evento){
        Evento eventoSalvo = eventoService.salvar(evento);
        return ResponseEntity.status(201).body(eventoSalvo);
    }

    @GetMapping
    public ResponseEntity<List<Evento>> listar(){
        List <Evento> eventos = eventoService.listarTodos();
        return ResponseEntity.ok(eventos);
    }
    @GetMapping("/{id}")
    public ResponseEntity <Evento> buscarPorId(@PathVariable Long id){
        return eventoService.buscarPorId(id)
        .map(ResponseEntity::ok)
        .orElse(ResponseEntity.notFound().build());
    }
    @PutMapping("/{id}")
    public ResponseEntity<Evento> atualizar(@PathVariable Long id, @RequestBody Evento evento){
        try{
            Evento atualizado = eventoService.atualizar(id, evento);
            return ResponseEntity.ok(atualizado);
        } catch (RuntimeException e){
            return ResponseEntity.notFound().build();
        }
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<Void> deletar(@PathVariable Long id){
        try{
            eventoService.deletar(id);
            return ResponseEntity.noContent().build();
        }catch (RuntimeException e){
            return ResponseEntity.notFound().build();
        }
    }



}




