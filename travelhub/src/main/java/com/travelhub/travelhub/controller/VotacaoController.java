package com.travelhub.travelhub.controller;

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

import com.travelhub.travelhub.model.Evento;
import com.travelhub.travelhub.model.Votacao;
import com.travelhub.travelhub.service.EventoService;
import com.travelhub.travelhub.service.VotacaoService;

@RestController
@RequestMapping("/votacoes")

public class VotacaoController {
    @Autowired
    private VotacaoService votacaoService;
    @Autowired
    private EventoService eventoService;

    @PostMapping
    public ResponseEntity<Votacao> criar(@RequestBody Votacao votacao) {
        String email = SecurityContextHolder.getContext().getAuthentication().getName();
        if (votacao.getEvento() == null) {
            return ResponseEntity.badRequest().build();
        }
        Optional<Evento> eventoOpt = eventoService.buscarPorId(votacao.getEvento().getId());
        if (eventoOpt.isEmpty()) {
            return ResponseEntity.notFound().build();
        }
        boolean ehCriador = eventoOpt.get().getCriador() != null
                && eventoOpt.get().getCriador().getEmail().equals(email);
        if (!ehCriador) {
            return ResponseEntity.status(403).build();
        }
        Votacao salva = votacaoService.salvar(votacao);
        return ResponseEntity.status(201).body(salva);
    }

    @GetMapping("/{id}")
    public ResponseEntity<Votacao> buscarPorId(@PathVariable Long id) {
        String email = SecurityContextHolder.getContext().getAuthentication().getName();
        Optional<Votacao> votacaoOpt = votacaoService.buscarPorId(id);
        if (votacaoOpt.isEmpty()) {
            return ResponseEntity.notFound().build();
        }
        if (!eventoService.usuarioParticipa(votacaoOpt.get().getEvento().getId(), email)) {
            return ResponseEntity.status(403).build();
        }
        return ResponseEntity.ok(votacaoOpt.get());
    }

    @GetMapping("/evento/{eventoId}")
    public ResponseEntity<List<Votacao>> buscarPorEvento(@PathVariable Long eventoId) {
        String email = SecurityContextHolder.getContext().getAuthentication().getName();
        if (!eventoService.usuarioParticipa(eventoId, email)) {
            return ResponseEntity.status(403).build();
        }
        return ResponseEntity.ok(votacaoService.buscarPorEvento(eventoId));
    }

    @PutMapping("/{id}")
    public ResponseEntity<Votacao> atualizar(@PathVariable Long id, @RequestBody Votacao votacao) {
        String email = SecurityContextHolder.getContext().getAuthentication().getName();
        Optional<Votacao> votacaoAtualOpt = votacaoService.buscarPorId(id);
        if (votacaoAtualOpt.isEmpty()) {
            return ResponseEntity.notFound().build();
        }
        boolean ehCriador = votacaoAtualOpt.get().getEvento().getCriador() != null
                && votacaoAtualOpt.get().getEvento().getCriador().getEmail().equals(email);
        if (!ehCriador) {
            return ResponseEntity.status(403).build();
        }
        try {
            Votacao votacaoAtualizada = votacaoService.atualizar(id, votacao);
            return ResponseEntity.ok(votacaoAtualizada);
        } catch (RuntimeException e) {
            return ResponseEntity.notFound().build();
        }
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<Void> deletar(@PathVariable Long id) {
        String email = SecurityContextHolder.getContext().getAuthentication().getName();
        Optional<Votacao> votacaoOpt = votacaoService.buscarPorId(id);
        if (votacaoOpt.isEmpty()) {
            return ResponseEntity.notFound().build();
        }
        boolean ehCriador = votacaoOpt.get().getEvento().getCriador() != null
                && votacaoOpt.get().getEvento().getCriador().getEmail().equals(email);
        if (!ehCriador) {
            return ResponseEntity.status(403).build();
        }
        try {
            votacaoService.deletar(id);
            return ResponseEntity.noContent().build();
        } catch (RuntimeException e) {
            return ResponseEntity.notFound().build();
        }
    }
}
