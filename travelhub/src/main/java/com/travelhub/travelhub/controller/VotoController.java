package com.travelhub.travelhub.controller;

import java.util.Optional;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import com.travelhub.travelhub.dto.ResultadoVotacaoDTO;
import com.travelhub.travelhub.dto.VotarDTO;
import com.travelhub.travelhub.model.OpcaoVoto;
import com.travelhub.travelhub.model.Votacao;
import com.travelhub.travelhub.service.EventoService;
import com.travelhub.travelhub.service.OpcaoVotoService;
import com.travelhub.travelhub.service.VotacaoService;
import com.travelhub.travelhub.service.VotoService;

import jakarta.validation.Valid;

@RestController
@RequestMapping("/votos")
public class VotoController {
    @Autowired
    private VotoService votoService;
    @Autowired
    private OpcaoVotoService opcaoVotoService;
    @Autowired
    private VotacaoService votacaoService;
    @Autowired
    private EventoService eventoService;

    @PostMapping
    public ResponseEntity<Void> votar(@Valid @RequestBody VotarDTO dto) {
        String email = SecurityContextHolder.getContext().getAuthentication().getName();

        Optional<OpcaoVoto> opcaoOpt = opcaoVotoService.buscarPorId(dto.getOpcaoVotoId());
        if (opcaoOpt.isEmpty()) {
            return ResponseEntity.notFound().build();
        }
        Long eventoId = opcaoOpt.get().getVotacao().getEvento().getId();
        if (!eventoService.usuarioParticipa(eventoId, email)) {
            return ResponseEntity.status(403).build();
        }

        try {
            
            votoService.votar(dto.getOpcaoVotoId(), email);
            return ResponseEntity.noContent().build();
        } catch (RuntimeException e) {
            return ResponseEntity.badRequest().build();
        }
    }

    @GetMapping("/resultado/{votacaoId}")
    public ResponseEntity<ResultadoVotacaoDTO> resultado(@PathVariable Long votacaoId) {
        String email = SecurityContextHolder.getContext().getAuthentication().getName();

        Optional<Votacao> votacaoOpt = votacaoService.buscarPorId(votacaoId);
        if (votacaoOpt.isEmpty()) {
            return ResponseEntity.notFound().build();
        }
        Long eventoId = votacaoOpt.get().getEvento().getId();
        if (!eventoService.usuarioParticipa(eventoId, email)) {
            return ResponseEntity.status(403).build();
        }

        ResultadoVotacaoDTO resultado = votoService.calcularResultado(votacaoId, email);
        return ResponseEntity.ok(resultado);
    }
}
