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

import com.travelhub.travelhub.model.OpcaoVoto;
import com.travelhub.travelhub.model.Votacao;
import com.travelhub.travelhub.service.EventoService;
import com.travelhub.travelhub.service.OpcaoVotoService;
import com.travelhub.travelhub.service.VotacaoService;

@RestController
@RequestMapping("/opcoesvotos")
public class OpcaoVotoController {
    @Autowired
    private OpcaoVotoService opcaoVotoService;
    @Autowired
    private VotacaoService votacaoService;
    @Autowired
    private EventoService eventoService;

    @PostMapping
    public ResponseEntity<OpcaoVoto> salvar(@RequestBody OpcaoVoto opcaoVoto) {
        String email = SecurityContextHolder.getContext().getAuthentication().getName();
        if (opcaoVoto.getVotacao() == null) {
            return ResponseEntity.badRequest().build();
        }
        // o JSON só manda o id da votação, então buscamos a votação completa (com o evento) no banco
        Optional<Votacao> votacaoOpt = votacaoService.buscarPorId(opcaoVoto.getVotacao().getId());
        if (votacaoOpt.isEmpty()) {
            return ResponseEntity.badRequest().build();
        }
        if (!eventoService.usuarioParticipa(votacaoOpt.get().getEvento().getId(), email)) {
            return ResponseEntity.status(403).build();
        }
        OpcaoVoto salvo = opcaoVotoService.salvar(opcaoVoto);
        return ResponseEntity.status(201).body(salvo);
    }

    @GetMapping("/{id}")
    public ResponseEntity<OpcaoVoto> buscarPorId(@PathVariable Long id) {
        String email = SecurityContextHolder.getContext().getAuthentication().getName();
        Optional<OpcaoVoto> opcaoVotoOpt = opcaoVotoService.buscarPorId(id);
        if (opcaoVotoOpt.isEmpty()) {
            return ResponseEntity.notFound().build();
        }
        if (!eventoService.usuarioParticipa(opcaoVotoOpt.get().getVotacao().getEvento().getId(), email)) {
            return ResponseEntity.status(403).build();
        }
        return ResponseEntity.ok(opcaoVotoOpt.get());
    }

    @GetMapping("/votacao/{votacaoId}")
    public ResponseEntity<List<OpcaoVoto>> buscarPorVotacao(@PathVariable Long votacaoId) {
        String email = SecurityContextHolder.getContext().getAuthentication().getName();
        Optional<Votacao> votacaoOpt = votacaoService.buscarPorId(votacaoId);
        if (votacaoOpt.isEmpty()) {
            return ResponseEntity.notFound().build();
        }
        if (!eventoService.usuarioParticipa(votacaoOpt.get().getEvento().getId(), email)) {
            return ResponseEntity.status(403).build();
        }
        return ResponseEntity.ok(opcaoVotoService.buscarPorVotacao(votacaoId));
    }

    @PutMapping("/{id}")
    public ResponseEntity<OpcaoVoto> atualizar(@PathVariable Long id, @RequestBody OpcaoVoto opcaoVoto) {
        String email = SecurityContextHolder.getContext().getAuthentication().getName();
        Optional<OpcaoVoto> opcaoVotoAtualOpt = opcaoVotoService.buscarPorId(id);
        if (opcaoVotoAtualOpt.isEmpty()) {
            return ResponseEntity.notFound().build();
        }
        if (!eventoService.usuarioParticipa(opcaoVotoAtualOpt.get().getVotacao().getEvento().getId(), email)) {
            return ResponseEntity.status(403).build();
        }
        try {
            OpcaoVoto votoAtualizado = opcaoVotoService.atualizar(id, opcaoVoto);
            return ResponseEntity.ok(votoAtualizado);
        } catch (RuntimeException e) {
            return ResponseEntity.notFound().build();
        }
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<Void> deletar(@PathVariable Long id) {
        String email = SecurityContextHolder.getContext().getAuthentication().getName();
        Optional<OpcaoVoto> opcaoVotoOpt = opcaoVotoService.buscarPorId(id);
        if (opcaoVotoOpt.isEmpty()) {
            return ResponseEntity.notFound().build();
        }
        if (!eventoService.usuarioParticipa(opcaoVotoOpt.get().getVotacao().getEvento().getId(), email)) {
            return ResponseEntity.status(403).build();
        }
        try {
            opcaoVotoService.deletar(id);
            return ResponseEntity.noContent().build();
        } catch (RuntimeException e) {
            return ResponseEntity.notFound().build();
        }
    }
}
