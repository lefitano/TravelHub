package com.travelhub.travelhub.service;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import com.travelhub.travelhub.repository.UsuarioRepository;

@Service




public class UsuarioService {
    @Autowired //anotação para injeção de dependencia
    private UsuarioRepository usuarioRepository; //chamei o repository para acessar o banco
}
