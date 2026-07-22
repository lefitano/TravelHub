package com.travelhub.travelhub.controller;

import com.travelhub.travelhub.service.ParticipanteService;

import java.util.List;
import java.util.Optional;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.web.bind.annotation.DeleteMapping;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.PutMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import com.travelhub.travelhub.model.Participante;

@RestController
@RequestMapping("/participantes")
public class ParticipanteController {
    @Autowired
    private ParticipanteService participanteService;

    @PostMapping
    public ResponseEntity<Participante> criar(@RequestBody Participante participante) {
        Participante salvo = participanteService.salvar(participante);
        return ResponseEntity.status(201).body(salvo);
    }

    @GetMapping
    public ResponseEntity<List<Participante>> listarTodos() {
        List<Participante> participantes = participanteService.listarTodos();
        return ResponseEntity.ok(participantes);
    }

    @GetMapping("/{id}")
    public ResponseEntity<Participante> buscarPorId(@PathVariable Long id) {
        return participanteService.buscarPorId(id)
                .map(ResponseEntity::ok)
                .orElse(ResponseEntity.notFound().build());
    }

    @PutMapping("/{id}")
    public ResponseEntity<Participante> atualizar(@PathVariable Long id, @RequestBody Participante participante) {
        try {
            Participante participanteAtualizado = participanteService.atualizar(id, participante);
            return ResponseEntity.ok(participanteAtualizado);
        } catch (RuntimeException e) {
            return ResponseEntity.notFound().build();
        }
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<Void> deletar(@PathVariable Long id) {
        String email = SecurityContextHolder.getContext().getAuthentication().getName();
        Optional<Participante> participante = participanteService.buscarPorId(id);
        if(participante.isEmpty()){
            return ResponseEntity.notFound().build();
        }
        if(!participante.get().getUsuario().getEmail().equals(email)){
            return ResponseEntity.status(403).build();
        }
        participanteService.deletar(id);
        return ResponseEntity.noContent().build();
    }
}
