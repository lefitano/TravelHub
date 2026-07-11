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

import com.travelhub.travelhub.dto.UsuarioResponseDTO;
import com.travelhub.travelhub.model.Usuario;
import com.travelhub.travelhub.service.UsuarioService;

@RestController
@RequestMapping("/usuarios")
public class UsuarioController {
    @Autowired
    private UsuarioService usuarioService;

    @PostMapping
    public ResponseEntity<UsuarioResponseDTO> criar(@RequestBody Usuario usuario){
        Usuario salvo = usuarioService.salvar(usuario);
        UsuarioResponseDTO dto = new UsuarioResponseDTO(salvo.getId(), salvo.getNome(), salvo.getEmail(), salvo.getDataCadastro());
        return ResponseEntity.status(201).body(dto);
    }
    @GetMapping
    public ResponseEntity<List<UsuarioResponseDTO>> listarTodos(){
        List<Usuario> usuarios = usuarioService.listarTodos();
        List<UsuarioResponseDTO> dtos = usuarios.stream()
        .map(u -> new UsuarioResponseDTO(u.getId(), u.getNome(), u.getEmail(), u.getDataCadastro()))
        .toList();
        return ResponseEntity.ok(dtos);
    }

    @GetMapping("/{id}")
    public ResponseEntity<UsuarioResponseDTO> buscarPorId(@PathVariable Long id){
        return usuarioService.buscarPorId(id)
        .map(u -> ResponseEntity.ok(
            new UsuarioResponseDTO(u.getId(), u.getNome(), u.getEmail(), u.getDataCadastro())
        ))
        .orElse(ResponseEntity.notFound().build());
    }

    @PutMapping("/{id}")
    public ResponseEntity<UsuarioResponseDTO> atualizar(@PathVariable Long id, @RequestBody Usuario usuario){
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
        try{
            usuarioService.deletar(id);
            return ResponseEntity.noContent().build();
        } catch (RuntimeException e){
            return ResponseEntity.notFound().build();
        }
    }
}
