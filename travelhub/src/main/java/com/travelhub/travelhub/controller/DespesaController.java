package com.travelhub.travelhub.controller;

import java.math.BigDecimal;
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

import com.travelhub.travelhub.model.Despesa;
import com.travelhub.travelhub.service.DespesaService;

@RestController
@RequestMapping("/despesas")
public class DespesaController {
    @Autowired
    private DespesaService despesaService;

    @PostMapping
    public ResponseEntity<Despesa> salvar(@RequestBody Despesa despesa) {
        Despesa despesaSalva = despesaService.salvar(despesa);
        return ResponseEntity.status(201).body(despesaSalva);
    }

    @GetMapping
    public ResponseEntity<List<Despesa>> listar() {
        List<Despesa> despesas = despesaService.listarTodos();
        return ResponseEntity.ok(despesas);
    }

    @GetMapping("/{id}")
    public ResponseEntity<Despesa> buscarPorId(@PathVariable Long id) {
        return despesaService.buscarPorId(id)
                .map(ResponseEntity::ok)
                .orElse(ResponseEntity.notFound().build());
    }

    @PutMapping("/{id}")
    public ResponseEntity<Despesa> atualizar(@PathVariable Long id, @RequestBody Despesa despesa) {
        try {
            Despesa despesaAtualizada = despesaService.atualizar(id, despesa);
            return ResponseEntity.ok(despesaAtualizada);
        } catch (RuntimeException e) {
            return ResponseEntity.notFound().build();
        }
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<Void> deletar(@PathVariable Long id) {
        try {
            despesaService.deletar(id);
            return ResponseEntity.noContent().build();
        } catch (RuntimeException e) {
            return ResponseEntity.notFound().build();
        }
    }

    @GetMapping("/divisao/{eventoId}")

    public ResponseEntity<BigDecimal> calcularDivisao(@PathVariable Long eventoId) {
        try {
            BigDecimal valorPorPessoa = despesaService.calcularDivisao(eventoId);
            return ResponseEntity.ok(valorPorPessoa);
        } catch (RuntimeException e) {
            return ResponseEntity.badRequest().build();
        }
    }

}
