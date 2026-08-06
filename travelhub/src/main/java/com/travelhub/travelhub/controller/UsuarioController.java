package com.travelhub.travelhub.controller;




import java.util.Optional;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.dao.DataIntegrityViolationException;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.DeleteMapping;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.PutMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import com.travelhub.travelhub.dto.UsuarioResponseDTO;
import com.travelhub.travelhub.model.Usuario;
import com.travelhub.travelhub.service.UsuarioService;

import jakarta.validation.Valid;

import org.springframework.security.core.context.SecurityContextHolder;


@RestController
@RequestMapping("/usuarios")
public class UsuarioController {
    @Autowired
    private UsuarioService usuarioService;

    @PostMapping
    public ResponseEntity<UsuarioResponseDTO> criar( @Valid @RequestBody Usuario usuario){
        try{
        Usuario salvo = usuarioService.salvar(usuario);
        UsuarioResponseDTO dto = new UsuarioResponseDTO(salvo.getId(), salvo.getNome(), salvo.getEmail(), salvo.getDataCadastro());
        return ResponseEntity.status(201).body(dto);
        } catch (DataIntegrityViolationException e){
            return ResponseEntity.status(409).build();
        }
    }
    @GetMapping("/{id}")
    public ResponseEntity<UsuarioResponseDTO> buscarPorId(@PathVariable Long id){
        String email = SecurityContextHolder.getContext().getAuthentication().getName();
        Optional<Usuario> usuarioOpt = usuarioService.buscarPorId(id);
        if (usuarioOpt.isEmpty()) {
            return ResponseEntity.notFound().build();
        }
        if (!usuarioOpt.get().getEmail().equals(email)) {
            return ResponseEntity.status(403).build();
        }
        Usuario u = usuarioOpt.get();
        return ResponseEntity.ok(new UsuarioResponseDTO(u.getId(), u.getNome(), u.getEmail(), u.getDataCadastro()));
    }

    @GetMapping("/me")
    public ResponseEntity<UsuarioResponseDTO> buscarPorEmail(){
        String email = SecurityContextHolder.getContext().getAuthentication().getName();
        return usuarioService.buscarPorEmail(email)
        .map(e -> ResponseEntity.ok(
            new UsuarioResponseDTO(e.getId(), e.getNome(), e.getEmail(), e.getDataCadastro())
        ))
        .orElse(ResponseEntity.notFound().build());
    }

    @PutMapping("/{id}")
    public ResponseEntity<UsuarioResponseDTO> atualizar(@PathVariable Long id, @Valid @RequestBody Usuario usuario){
        String email = SecurityContextHolder.getContext().getAuthentication().getName();
        Optional<Usuario> usuarioOpt = usuarioService.buscarPorId(id);
        if (usuarioOpt.isEmpty()) {
            return ResponseEntity.notFound().build();
        }
        if (!usuarioOpt.get().getEmail().equals(email)) {
            return ResponseEntity.status(403).build();
        }
        try{
            Usuario atualizado = usuarioService.atualizar(id, usuario);
            UsuarioResponseDTO dto = new UsuarioResponseDTO(atualizado.getId(), atualizado.getNome(), atualizado.getEmail(), atualizado.getDataCadastro());
            return ResponseEntity.ok(dto);

        } catch (RuntimeException e){
            return ResponseEntity.notFound().build();
        }
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<Void> deletar(@PathVariable Long id){
        String email = SecurityContextHolder.getContext().getAuthentication().getName();
        Optional<Usuario> usuarioOpt = usuarioService.buscarPorId(id);
        if (usuarioOpt.isEmpty()) {
            return ResponseEntity.notFound().build();
        }
        if (!usuarioOpt.get().getEmail().equals(email)) {
            return ResponseEntity.status(403).build();
        }
        try{
            usuarioService.deletar(id);
            return ResponseEntity.noContent().build();
        } catch (RuntimeException e){
            return ResponseEntity.notFound().build();
        }
    }
}
