package com.travelhub.travelhub.controller;

import java.util.Map;
import java.util.Optional;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.http.ResponseEntity;
import org.springframework.security.authentication.AuthenticationManager;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.core.Authentication;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import com.travelhub.travelhub.dto.ConfirmarEmailDTO;
import com.travelhub.travelhub.dto.EsqueciSenhaDTO;
import com.travelhub.travelhub.dto.LoginRequest;
import com.travelhub.travelhub.dto.LoginResponse;
import com.travelhub.travelhub.dto.RedefinirSenhaDTO;
import com.travelhub.travelhub.dto.ReenviarVerificacaoDTO;
import com.travelhub.travelhub.model.Usuario;
import com.travelhub.travelhub.repository.UsuarioRepository;
import com.travelhub.travelhub.security.JwtUtil;
import com.travelhub.travelhub.security.RateLimiterService;
import com.travelhub.travelhub.service.UsuarioService;

import jakarta.servlet.http.HttpServletRequest;
import jakarta.validation.Valid;

@RestController
@RequestMapping("/auth")

public class AuthController {
    @Autowired
    private AuthenticationManager authenticationManager;

    @Autowired
    private JwtUtil jwtUtil;

    @Autowired
    private UsuarioRepository usuarioRepository;

    @Autowired
    private UsuarioService usuarioService;

    @Autowired
    private RateLimiterService rateLimiterService;

    // liga/desliga o bloqueio de login por email não confirmado — pensado pro caso
    // de uso "grupo pequeno de conhecidos", onde esse risco (alguém se cadastrar
    // com o email de outra pessoa) praticamente não existe. Em produção pública de
    // verdade, com domínio de email configurado, vale voltar pra "true".
    @Value("${app.auth.exigir-verificacao-email:true}")
    private boolean exigirVerificacaoEmail;

    private static final long QUINZE_MINUTOS_MS = 15 * 60 * 1000L;
    private static final long UMA_HORA_MS = 60 * 60 * 1000L;

    // atrás de proxy (Render, etc.) o IP real do cliente vem no X-Forwarded-For —
    // getRemoteAddr() sozinho devolveria sempre o IP do proxy, o que juntaria todo
    // mundo no mesmo "balde" do rate limiter
    private String ipDoCliente(HttpServletRequest request) {
        String forwarded = request.getHeader("X-Forwarded-For");
        if (forwarded != null && !forwarded.isBlank()) {
            return forwarded.split(",")[0].trim();
        }
        return request.getRemoteAddr();
    }

    @PostMapping("/login")
    public ResponseEntity<?> login(@RequestBody LoginRequest loginRequest, HttpServletRequest request) {
        if (!rateLimiterService.permitir("login:" + ipDoCliente(request), 10, QUINZE_MINUTOS_MS)) {
            return ResponseEntity.status(429).build();
        }
        try {
            Authentication authentication = authenticationManager.authenticate(
                    new UsernamePasswordAuthenticationToken(
                            loginRequest.getEmail(), loginRequest.getSenha()));

            String email = authentication.getName();
            Optional<Usuario> usuarioOpt = usuarioRepository.findByEmail(email);

            // Boolean.FALSE.equals cobre só o caso explícito "false" — contas
            // antigas (campo null, de antes dessa feature existir) passam direto
            if (exigirVerificacaoEmail && usuarioOpt.isPresent()
                    && Boolean.FALSE.equals(usuarioOpt.get().getEmailVerificado())) {
                return ResponseEntity.status(403).body(Map.of("erro", "email_nao_verificado"));
            }

            String token = jwtUtil.gerarToken(email);
            String nome = usuarioOpt.map(Usuario::getNome).orElse("");
            return ResponseEntity.ok(new LoginResponse(token, nome));
        } catch (Exception e) {
            return ResponseEntity.status(401).build();
        }
    }

    @PostMapping("/esqueci-senha")
    public ResponseEntity<Void> esqueciSenha(@Valid @RequestBody EsqueciSenhaDTO dto, HttpServletRequest request) {
        // limite mais apertado que o login: esse endpoint dispara email, então também
        // protege contra usarem o TravelHub pra spammar a caixa de entrada de alguém
        if (!rateLimiterService.permitir("esqueci-senha:" + ipDoCliente(request), 5, UMA_HORA_MS)) {
            return ResponseEntity.status(429).build();
        }
        // sempre 204, exista o email ou não — não dá pra deixar esse endpoint
        // virar um jeito de descobrir quais emails estão cadastrados
        usuarioService.solicitarRecuperacaoSenha(dto.getEmail());
        return ResponseEntity.noContent().build();
    }

    @PostMapping("/redefinir-senha")
    public ResponseEntity<Void> redefinirSenha(@Valid @RequestBody RedefinirSenhaDTO dto, HttpServletRequest request) {
        if (!rateLimiterService.permitir("redefinir-senha:" + ipDoCliente(request), 10, UMA_HORA_MS)) {
            return ResponseEntity.status(429).build();
        }
        try {
            usuarioService.redefinirSenha(dto.getToken(), dto.getNovaSenha());
            return ResponseEntity.noContent().build();
        } catch (IllegalArgumentException e) {
            return ResponseEntity.badRequest().build();
        }
    }

    @PostMapping("/confirmar-email")
    public ResponseEntity<Void> confirmarEmail(@Valid @RequestBody ConfirmarEmailDTO dto, HttpServletRequest request) {
        if (!rateLimiterService.permitir("confirmar-email:" + ipDoCliente(request), 10, UMA_HORA_MS)) {
            return ResponseEntity.status(429).build();
        }
        try {
            usuarioService.confirmarEmail(dto.getToken());
            return ResponseEntity.noContent().build();
        } catch (IllegalArgumentException e) {
            return ResponseEntity.badRequest().build();
        }
    }

    @PostMapping("/reenviar-verificacao")
    public ResponseEntity<Void> reenviarVerificacao(@Valid @RequestBody ReenviarVerificacaoDTO dto, HttpServletRequest request) {
        if (!rateLimiterService.permitir("reenviar-verificacao:" + ipDoCliente(request), 5, UMA_HORA_MS)) {
            return ResponseEntity.status(429).build();
        }
        // mesmo padrão do esqueci-senha: sempre 204, não revela se o email existe
        // nem se já estava verificado
        usuarioService.reenviarVerificacao(dto.getEmail());
        return ResponseEntity.noContent().build();
    }

}
