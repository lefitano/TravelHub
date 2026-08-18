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

import com.travelhub.travelhub.dto.AddDespesaDTO;
import com.travelhub.travelhub.model.Despesa;
import com.travelhub.travelhub.service.DespesaService;
import com.travelhub.travelhub.service.EventoService;
import com.travelhub.travelhub.dto.SaldoParticipanteDTO;
import com.travelhub.travelhub.dto.ResumoDespesasDTO;

import jakarta.validation.Valid;


@RestController
@RequestMapping("/despesas")
public class DespesaController {
    @Autowired
    private DespesaService despesaService;
    @Autowired
    private EventoService eventoService;

    @PostMapping
    public ResponseEntity<Despesa> salvar(@Valid @RequestBody AddDespesaDTO dto) {
        try {
            String email = SecurityContextHolder.getContext().getAuthentication().getName();
            if (!eventoService.usuarioParticipa(dto.getEventoId(), email)) {
                return ResponseEntity.status(403).build();
            }
            Despesa salva = despesaService.criarDespesa(dto, email);
            return ResponseEntity.status(201).body(salva);

        }catch(RuntimeException e){
            return ResponseEntity.status(404).build();
        }
    }

    @GetMapping("/{id}")
    public ResponseEntity<Despesa> buscarPorId(@PathVariable Long id) {
        String email = SecurityContextHolder.getContext().getAuthentication().getName();
        Optional<Despesa> despesaOpt = despesaService.buscarPorId(id);
        if (despesaOpt.isEmpty()) {
            return ResponseEntity.notFound().build();
        }
        if (!eventoService.usuarioParticipa(despesaOpt.get().getEvento().getId(), email)) {
            return ResponseEntity.status(403).build();
        }
        return ResponseEntity.ok(despesaOpt.get());
    }

    @PutMapping("/{id}")
    public ResponseEntity<Despesa> atualizar(@PathVariable Long id, @RequestBody Despesa despesa) {
        String email = SecurityContextHolder.getContext().getAuthentication().getName();
        Optional<Despesa> despesaAtualOpt = despesaService.buscarPorId(id);
        if (despesaAtualOpt.isEmpty()) {
            return ResponseEntity.notFound().build();
        }
        if (!eventoService.usuarioParticipa(despesaAtualOpt.get().getEvento().getId(), email)) {
            return ResponseEntity.status(403).build();
        }
        try {
            Despesa despesaAtualizada = despesaService.atualizar(id, despesa);
            return ResponseEntity.ok(despesaAtualizada);
        } catch (RuntimeException e) {
            return ResponseEntity.notFound().build();
        }
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<Void> deletar(@PathVariable Long id) {
        String email = SecurityContextHolder.getContext().getAuthentication().getName();
        Optional<Despesa> despesaOpt = despesaService.buscarPorId(id);
        if (despesaOpt.isEmpty()) {
            return ResponseEntity.notFound().build();
        }
        Despesa despesa = despesaOpt.get();
        boolean ehResponsavel = despesa.getResponsavel().getEmail().equals(email); 
        boolean ehCriadorDoEvento = despesa.getEvento().getCriador() != null 
                && despesa.getEvento().getCriador().getEmail().equals(email);
        if(!ehResponsavel && !ehCriadorDoEvento){
            return ResponseEntity.status(403).build();
        }
        try {
            despesaService.deletar(id);
            return ResponseEntity.noContent().build();
        } catch (RuntimeException e) {
            return ResponseEntity.notFound().build();
        }
        
    }

    @GetMapping("/divisao/{eventoId}")
    public ResponseEntity<List<SaldoParticipanteDTO>> calcularDivisao(@PathVariable Long eventoId) {
        String email = SecurityContextHolder.getContext().getAuthentication().getName();
        if (!eventoService.usuarioParticipa(eventoId, email)) {
            return ResponseEntity.status(403).build();
        }
        try {
            List<SaldoParticipanteDTO> saldos = despesaService.calcularDivisao(eventoId);
            return ResponseEntity.ok(saldos);
        } catch (RuntimeException e) {
            return ResponseEntity.badRequest().build();
        }
    }

    @GetMapping("/resumo/{eventoId}")
    public ResponseEntity<ResumoDespesasDTO> resumo(@PathVariable Long eventoId) {
        String email = SecurityContextHolder.getContext().getAuthentication().getName();
        if (!eventoService.usuarioParticipa(eventoId, email)) {
            return ResponseEntity.status(403).build();
        }
        try {
            ResumoDespesasDTO resumo = despesaService.gerarResumo(eventoId, email);
            return ResponseEntity.ok(resumo);
        } catch (RuntimeException e) {
            return ResponseEntity.badRequest().build();
        }
    }

    @GetMapping("/evento/{eventoId}")
    public ResponseEntity<List<Despesa>> listarPorEvento(@PathVariable Long eventoId){
        String email = SecurityContextHolder.getContext().getAuthentication().getName();
        if (!eventoService.usuarioParticipa(eventoId, email)) {
            return ResponseEntity.status(403).build();
        }
        List<Despesa> despesas = despesaService.listarPorEvento(eventoId);
        return ResponseEntity.ok(despesas);
    }

}
