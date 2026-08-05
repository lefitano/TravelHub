package com.travelhub.travelhub.controller;

import com.travelhub.travelhub.service.EventoService;
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

import com.travelhub.travelhub.dto.AddParticipanteDTO;
import com.travelhub.travelhub.model.Participante;


@RestController
@RequestMapping("/participantes")
public class ParticipanteController {
    @Autowired
    private ParticipanteService participanteService;
    @Autowired
    private EventoService eventoService;

    @PostMapping
    public ResponseEntity<Participante> criar(@RequestBody AddParticipanteDTO dto) {
        String email = SecurityContextHolder.getContext().getAuthentication().getName();
        if (!eventoService.usuarioParticipa(dto.getEventoId(), email)) {
            return ResponseEntity.status(403).build();
        }
        try {
            Participante salvo = participanteService.adicionarPorEmail(dto);
            return ResponseEntity.status(201).body(salvo);
        } catch (RuntimeException e) {
            return ResponseEntity.status(404).build();
        }
    }

    @GetMapping("/{id}")
    public ResponseEntity<Participante> buscarPorId(@PathVariable Long id) {
        String email = SecurityContextHolder.getContext().getAuthentication().getName();
        Optional<Participante> participanteOpt = participanteService.buscarPorId(id);
        if (participanteOpt.isEmpty()) {
            return ResponseEntity.notFound().build();
        }
        if (!eventoService.usuarioParticipa(participanteOpt.get().getEvento().getId(), email)) {
            return ResponseEntity.status(403).build();
        }
        return ResponseEntity.ok(participanteOpt.get());
    }

    @PutMapping("/{id}")
    public ResponseEntity<Participante> atualizar(@PathVariable Long id, @RequestBody Participante participante) {
        String email = SecurityContextHolder.getContext().getAuthentication().getName();
        Optional<Participante> participanteAtualOpt = participanteService.buscarPorId(id);
        if (participanteAtualOpt.isEmpty()) {
            return ResponseEntity.notFound().build();
        }
        if (!eventoService.usuarioParticipa(participanteAtualOpt.get().getEvento().getId(), email)) {
            return ResponseEntity.status(403).build();
        }
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
        Optional<Participante> participanteOpt = participanteService.buscarPorId(id);
        if(participanteOpt.isEmpty()){
            return ResponseEntity.notFound().build();
        }
        Participante participante = participanteOpt.get();
        boolean ehOProprio = participante.getUsuario().getEmail().equals(email);
        boolean ehCriadorDoEvento = participante.getEvento().getCriador() != null
                && participante.getEvento().getCriador().getEmail().equals(email);
       
        if(!ehOProprio && !ehCriadorDoEvento){
            return ResponseEntity.status(403).build();
        }
        participanteService.deletar(id);
        return ResponseEntity.noContent().build();
    }

    @GetMapping("/evento/{eventoId}")
    public ResponseEntity<List<Participante>> listarPorEvento(@PathVariable Long eventoId){
        String email = SecurityContextHolder.getContext().getAuthentication().getName();
        if (!eventoService.usuarioParticipa(eventoId, email)) {
            return ResponseEntity.status(403).build();
        }
        List <Participante> participantes = participanteService.listarPorEvento(eventoId);
        return ResponseEntity.ok(participantes);
    }

}
