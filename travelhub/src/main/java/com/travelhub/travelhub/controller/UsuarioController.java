package com.travelhub.travelhub.controller;




import java.io.IOException;
import java.nio.file.Files;
import java.nio.file.Path;
import java.util.Optional;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.dao.DataIntegrityViolationException;
import org.springframework.http.MediaType;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.DeleteMapping;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.PutMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;
import org.springframework.web.multipart.MultipartFile;

import com.travelhub.travelhub.dto.AtualizarPerfilDTO;
import com.travelhub.travelhub.dto.UsuarioResponseDTO;
import com.travelhub.travelhub.model.Usuario;
import com.travelhub.travelhub.service.UsuarioService;
import com.travelhub.travelhub.dto.TrocarSenhaDTO;

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
        UsuarioResponseDTO dto = new UsuarioResponseDTO(salvo.getId(), salvo.getNome(), salvo.getEmail(), salvo.getDataCadastro(), salvo.getFotoUrl());
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
        return ResponseEntity.ok(new UsuarioResponseDTO(u.getId(), u.getNome(), u.getEmail(), u.getDataCadastro(), u.getFotoUrl()));
    }

    @GetMapping("/me")
    public ResponseEntity<UsuarioResponseDTO> buscarPorEmail(){
        String email = SecurityContextHolder.getContext().getAuthentication().getName();
        return usuarioService.buscarPorEmail(email)
        .map(e -> ResponseEntity.ok(
            new UsuarioResponseDTO(e.getId(), e.getNome(), e.getEmail(), e.getDataCadastro(), e.getFotoUrl())
        ))
        .orElse(ResponseEntity.notFound().build());
    }

    @PutMapping("/{id}")
    public ResponseEntity<UsuarioResponseDTO> atualizar(@PathVariable Long id, @Valid @RequestBody AtualizarPerfilDTO perfilDto){
        String email = SecurityContextHolder.getContext().getAuthentication().getName();
        Optional<Usuario> usuarioOpt = usuarioService.buscarPorId(id);
        if (usuarioOpt.isEmpty()) {
            return ResponseEntity.notFound().build();
        }
        if (!usuarioOpt.get().getEmail().equals(email)) {
            return ResponseEntity.status(403).build();
        }
        try{
            Usuario atualizado = usuarioService.atualizar(id, perfilDto);
            UsuarioResponseDTO dto = new UsuarioResponseDTO(atualizado.getId(), atualizado.getNome(), atualizado.getEmail(), atualizado.getDataCadastro(), atualizado.getFotoUrl());
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
    @PutMapping("{id}/senha")
    public ResponseEntity<Void> trocarSenha(@PathVariable Long id, @Valid @RequestBody TrocarSenhaDTO dto){
        String email = SecurityContextHolder.getContext().getAuthentication().getName();
        Optional<Usuario> usuarioOpt = usuarioService.buscarPorId(id);
        if(usuarioOpt.isEmpty()){
            return ResponseEntity.status(404).build();
        }
        if(!usuarioOpt.get().getEmail().equals(email)){
            return ResponseEntity.status(403).build();
        }
        try{
            usuarioService.trocarSenha(id, dto);
            return ResponseEntity.noContent().build();
        }catch(RuntimeException e){
            return ResponseEntity.status(400).build();
        }
    }

    @PostMapping("/{id}/foto")
    public ResponseEntity<UsuarioResponseDTO> uploadFoto(@PathVariable Long id, @RequestParam("foto") MultipartFile foto) {
        String email = SecurityContextHolder.getContext().getAuthentication().getName();
        Optional<Usuario> usuarioOpt = usuarioService.buscarPorId(id);
        if (usuarioOpt.isEmpty()) {
            return ResponseEntity.notFound().build();
        }
        if (!usuarioOpt.get().getEmail().equals(email)) {
            return ResponseEntity.status(403).build();
        }
        String contentType = foto.getContentType();
        if (contentType == null || !contentType.startsWith("image/")) {
            return ResponseEntity.badRequest().build();
        }
        try {
            Usuario atualizado = usuarioService.salvarFoto(id, foto);
            UsuarioResponseDTO dto = new UsuarioResponseDTO(atualizado.getId(), atualizado.getNome(), atualizado.getEmail(), atualizado.getDataCadastro(), atualizado.getFotoUrl());
            return ResponseEntity.ok(dto);
        } catch (IOException e) {
            return ResponseEntity.status(500).build();
        } catch (RuntimeException e) {
            return ResponseEntity.notFound().build();
        }
    }

    @DeleteMapping("/{id}/foto")
    public ResponseEntity<UsuarioResponseDTO> removerFoto(@PathVariable Long id) {
        String email = SecurityContextHolder.getContext().getAuthentication().getName();
        Optional<Usuario> usuarioOpt = usuarioService.buscarPorId(id);
        if (usuarioOpt.isEmpty()) {
            return ResponseEntity.notFound().build();
        }
        if (!usuarioOpt.get().getEmail().equals(email)) {
            return ResponseEntity.status(403).build();
        }
        try {
            Usuario atualizado = usuarioService.removerFoto(id);
            UsuarioResponseDTO dto = new UsuarioResponseDTO(atualizado.getId(), atualizado.getNome(), atualizado.getEmail(), atualizado.getDataCadastro(), atualizado.getFotoUrl());
            return ResponseEntity.ok(dto);
        } catch (RuntimeException e) {
            return ResponseEntity.notFound().build();
        }
    }

    // sem checagem de dono: a foto de perfil precisa ser vista por outros participantes do mesmo evento,
    // não só pelo próprio usuário (diferente dos outros endpoints desse controller)
    @GetMapping("/{id}/foto")
    public ResponseEntity<byte[]> buscarFoto(@PathVariable Long id) {
        try {
            Path arquivo = usuarioService.localizarFoto(id);
            byte[] bytes = Files.readAllBytes(arquivo);
            String contentType = Files.probeContentType(arquivo);
            MediaType mediaType = contentType != null ? MediaType.parseMediaType(contentType) : MediaType.IMAGE_JPEG;
            return ResponseEntity.ok().contentType(mediaType).body(bytes);
        } catch (IOException | RuntimeException e) {
            return ResponseEntity.notFound().build();
        }
    }
}
