package com.travelhub.travelhub.controller;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.security.authentication.AuthenticationManager;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.core.Authentication;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import com.travelhub.travelhub.dto.LoginRequest;
import com.travelhub.travelhub.dto.LoginResponse;
import com.travelhub.travelhub.repository.UsuarioRepository;
import com.travelhub.travelhub.security.JwtUtil;

@RestController
@RequestMapping("/auth")

public class AuthController {
    @Autowired
    private AuthenticationManager authenticationManager;

    @Autowired
    private JwtUtil jwtUtil;

    @Autowired
    private UsuarioRepository usuarioRepository;

    @PostMapping("/login")
    public ResponseEntity<LoginResponse> login(@RequestBody LoginRequest loginRequest) {
        try {
            Authentication authentication = authenticationManager.authenticate(
                    new UsernamePasswordAuthenticationToken(
                            loginRequest.getEmail(), loginRequest.getSenha()));

            String email = authentication.getName();
            String token = jwtUtil.gerarToken(email);
            String nome = usuarioRepository.findByEmail(email)
            .map(u -> u.getNome())
            .orElse("");
            return ResponseEntity.ok(new LoginResponse(token, nome));
        } catch (Exception e) {
            return ResponseEntity.status(401).build();
        }
    }

}
