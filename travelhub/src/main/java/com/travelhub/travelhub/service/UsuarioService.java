package com.travelhub.travelhub.service;

import java.io.IOException;
import java.nio.file.Files;
import java.nio.file.Path;
import java.nio.file.Paths;
import java.nio.file.StandardCopyOption;
import java.time.LocalDateTime;

import java.util.Optional;



import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;
import org.springframework.web.multipart.MultipartFile;

import com.travelhub.travelhub.repository.EventoRepository;
import com.travelhub.travelhub.repository.ParticipanteRepository;
import com.travelhub.travelhub.repository.UsuarioRepository;
import com.travelhub.travelhub.dto.AtualizarPerfilDTO;
import com.travelhub.travelhub.dto.CadastroUsuarioDTO;
import com.travelhub.travelhub.dto.TrocarSenhaDTO;
import com.travelhub.travelhub.model.Usuario;

@Service

public class UsuarioService {
    private static final Path DIRETORIO_FOTOS = Paths.get("uploads", "fotos-perfil");
    @Autowired // anotação para injeção de dependencia
    private UsuarioRepository usuarioRepository; // chamei o repository para acessar o banco
    @Autowired
    private PasswordEncoder passwordEncoder;
    @Autowired
    private EventoRepository eventoRepository;
    @Autowired
    private ParticipanteRepository participanteRepository;

    // recebe um DTO sem "id" (em vez da entidade Usuario direto) — se aceitássemos
    // a entidade, um client poderia mandar um id de usuário existente e o Spring
    // faria merge() nele, sobrescrevendo a conta de outra pessoa (mass assignment)
    public Usuario salvar(CadastroUsuarioDTO dto) {
        Usuario usuario = new Usuario();
        usuario.setNome(dto.getNome());
        usuario.setEmail(dto.getEmail());
        usuario.setSenha(passwordEncoder.encode(dto.getSenha()));
        usuario.setDataCadastro(LocalDateTime.now());
        return usuarioRepository.save(usuario);
    }

    public Optional<Usuario> buscarPorId(Long id) {
        return usuarioRepository.findById(id);
    }

    public Usuario atualizar(Long id, AtualizarPerfilDTO dto) {
        return usuarioRepository.findById(id)
                .map(usuario -> {
                    usuario.setNome(dto.getNome());
                    usuario.setEmail(dto.getEmail());
                    return usuarioRepository.save(usuario);
                })
                .orElseThrow(() -> new RuntimeException("Usuario não encontrado"));
    }

    public void deletar(Long id) {
        Usuario usuario = usuarioRepository.findById(id)
            .orElseThrow(() -> new RuntimeException("Usuário não encontrado"));

        // sem cascade automático aqui de propósito: apagar a conta não pode arrastar
        // eventos/despesas que também pertencem a OUTRAS pessoas (ex: outros
        // participantes de um evento criado por esse usuário). Por ora, bloqueia
        // a exclusão até o usuário sair de todos os eventos primeiro.
        boolean criouAlgumEvento = !eventoRepository.findByCriadorId(id).isEmpty();
        boolean participaDeAlgumEvento = !participanteRepository.findByUsuarioEmail(usuario.getEmail()).isEmpty();
        if (criouAlgumEvento || participaDeAlgumEvento) {
            throw new IllegalStateException("Não é possível excluir a conta enquanto você participa de eventos");
        }

        usuarioRepository.deleteById(id);
    }
    public Optional<Usuario> buscarPorEmail(String email){
        return usuarioRepository.findByEmail(email);
    }

    public void trocarSenha(Long id, TrocarSenhaDTO dto){
        Usuario usuario = usuarioRepository.findById(id)
            .orElseThrow(() -> new RuntimeException("Usuário não encontrado"));

            if(!passwordEncoder.matches(dto.getSenhaAtual(), usuario.getSenha())){
                throw new RuntimeException("Senha atual incorreta");
            }

            usuario.setSenha(passwordEncoder.encode(dto.getNovaSenha()));
            usuarioRepository.save(usuario);

    }

    public Usuario salvarFoto(Long id, MultipartFile foto) throws IOException {
        Usuario usuario = usuarioRepository.findById(id)
            .orElseThrow(() -> new RuntimeException("Usuário não encontrado"));

        Files.createDirectories(DIRETORIO_FOTOS);

     
        try (var arquivosAntigos = Files.list(DIRETORIO_FOTOS)) {
            arquivosAntigos
                .filter(p -> p.getFileName().toString().startsWith(id + "."))
                .forEach(p -> {
                    try {
                        Files.deleteIfExists(p);
                    } catch (IOException ignored) {
                       
                    }
                });
        }

        Path destino = DIRETORIO_FOTOS.resolve(id + "." + extensaoPorContentType(foto.getContentType()));
        Files.copy(foto.getInputStream(), destino, StandardCopyOption.REPLACE_EXISTING);

        usuario.setFotoUrl("/usuarios/" + id + "/foto");
        return usuarioRepository.save(usuario);
    }

    public Path localizarFoto(Long id) {
        if (!Files.exists(DIRETORIO_FOTOS)) {
            throw new RuntimeException("Foto não encontrada");
        }
        try (var arquivos = Files.list(DIRETORIO_FOTOS)) {
            return arquivos
                .filter(p -> p.getFileName().toString().startsWith(id + "."))
                .findFirst()
                .orElseThrow(() -> new RuntimeException("Foto não encontrada"));
        } catch (IOException e) {
            throw new RuntimeException("Foto não encontrada");
        }
    }

    public Usuario removerFoto(Long id) {
        Usuario usuario = usuarioRepository.findById(id)
            .orElseThrow(() -> new RuntimeException("Usuário não encontrado"));

        try {
            Path arquivo = localizarFoto(id);
            Files.deleteIfExists(arquivo);
        } catch (RuntimeException e) {
            // não havia foto salva - segue o baile, só limpamos a referência abaixo mesmo assim
        } catch (IOException e) {
            // falha ao apagar o arquivo não deveria impedir de limpar a referência no usuário
        }

        usuario.setFotoUrl(null);
        return usuarioRepository.save(usuario);
    }

    private String extensaoPorContentType(String contentType) {
        if (contentType == null) {
            return "jpg";
        }
        return switch (contentType) {
            case "image/png" -> "png";
            case "image/webp" -> "webp";
            case "image/gif" -> "gif";
            default -> "jpg";
        };
    }
}
