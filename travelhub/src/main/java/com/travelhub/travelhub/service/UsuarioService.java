package com.travelhub.travelhub.service;

import java.util.List;
import java.util.Optional;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import com.travelhub.travelhub.repository.UsuarioRepository;
import com.travelhub.travelhub.model.Usuario;
@Service




public class UsuarioService {
    @Autowired //anotação para injeção de dependencia
    private UsuarioRepository usuarioRepository; //chamei o repository para acessar o banco


    public Usuario salvar(Usuario usuario){ // o método de save já está feito pelo framework Spring JPA
        return usuarioRepository.save(usuario);
    }

    public List <Usuario> listarTodos(){
        return usuarioRepository.findAll();
    }

    public Optional<Usuario> buscarPorId(Long id){
        return usuarioRepository.findById(id);
    }

    public Usuario atualizar(Long id, Usuario usuarioAtualizado){
        return usuarioRepository.findById(id)
            .map(usuario -> {
                usuario.setNome(usuarioAtualizado.getNome());
                usuario.setEmail(usuarioAtualizado.getEmail());
                return usuarioRepository.save(usuario);
            })
            .orElseThrow(() -> new RuntimeException("Usuario não encontrado"));
    }


    public void deletar(Long id){
        usuarioRepository.deleteById(id);
    }
}
