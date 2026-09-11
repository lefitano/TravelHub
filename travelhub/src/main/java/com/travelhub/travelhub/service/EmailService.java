package com.travelhub.travelhub.service;

import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.mail.MailException;
import org.springframework.mail.SimpleMailMessage;
import org.springframework.mail.javamail.JavaMailSender;
import org.springframework.stereotype.Service;

@Service
public class EmailService {
    private static final Logger logger = LoggerFactory.getLogger(EmailService.class);

    @Autowired
    private JavaMailSender mailSender;

    @Value("${app.mail.from}")
    private String remetente;

    @Value("${app.frontend-url}")
    private String frontendUrl;

    public void enviarEmailRecuperacaoSenha(String destinatario, String token) {
        String link = frontendUrl + "/redefinir-senha?token=" + token;

        SimpleMailMessage mensagem = new SimpleMailMessage();
        mensagem.setFrom(remetente);
        mensagem.setTo(destinatario);
        mensagem.setSubject("Veyra — Redefinição de senha");
        mensagem.setText(
            "Você pediu para redefinir sua senha no Veyra.\n\n" +
            "Clique no link abaixo para escolher uma nova senha (válido por 1 hora):\n" +
            link + "\n\n" +
            "Se você não pediu isso, pode ignorar este email com segurança."
        );

        enviarSemQuebrarFluxo(mensagem);
    }

    public void enviarEmailVerificacao(String destinatario, String token) {
        String link = frontendUrl + "/confirmar-email?token=" + token;

        SimpleMailMessage mensagem = new SimpleMailMessage();
        mensagem.setFrom(remetente);
        mensagem.setTo(destinatario);
        mensagem.setSubject("Veyra — Confirme seu cadastro");
        mensagem.setText(
            "Bem-vindo ao Veyra!\n\n" +
            "Clique no link abaixo pra confirmar seu email e ativar sua conta (válido por 24 horas):\n" +
            link + "\n\n" +
            "Se você não fez esse cadastro, pode ignorar este email com segurança."
        );

        enviarSemQuebrarFluxo(mensagem);
    }

    // uma falha de envio (provedor fora do ar, remetente não verificado, etc.) não
    // pode derrubar o cadastro/pedido de recuperação — a conta/token já foi salvo
    // no banco antes disso, então só logamos o problema em vez de propagar o erro
    private void enviarSemQuebrarFluxo(SimpleMailMessage mensagem) {
        try {
            mailSender.send(mensagem);
        } catch (MailException e) {
            logger.error("Falha ao enviar email para {}: {}", mensagem.getTo(), e.getMessage());
        }
    }
}
