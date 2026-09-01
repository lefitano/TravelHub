package com.travelhub.travelhub.service;

import java.util.List;
import java.util.Optional;

import org.springframework.beans.factory.annotation.Autowired;

import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import com.travelhub.travelhub.model.Despesa;
import com.travelhub.travelhub.repository.DespesaRepository;
import com.travelhub.travelhub.repository.ParticipanteRepository;
import com.travelhub.travelhub.repository.UsuarioRepository;
import com.travelhub.travelhub.repository.VotoRepository;
import com.travelhub.travelhub.dto.AddParticipanteDTO;
import com.travelhub.travelhub.model.Participante;
import com.travelhub.travelhub.model.StatusPagamento;
import com.travelhub.travelhub.repository.EventoRepository;
import com.travelhub.travelhub.model.Usuario;
import com.travelhub.travelhub.model.Evento;

@Service

public class ParticipanteService {
    @Autowired
    private ParticipanteRepository participanteRepository;
    @Autowired
    private EventoRepository eventoRepository;
    @Autowired
    private UsuarioRepository usuarioRepository;
    @Autowired
    private VotoRepository votoRepository;
    @Autowired
    private DespesaRepository despesaRepository;


    public Participante salvar(Participante participante) {
        return participanteRepository.save(participante);
    }

    public List<Participante> listarTodos() {
        return participanteRepository.findAll();
    }

    public Optional<Participante> buscarPorId(Long id) {
        return participanteRepository.findById(id);
    }

    public Participante atualizar(Long id, Participante participanteAtualizado) {
        return participanteRepository.findById(id)
                .map(participante -> {
                    participante.setStatusPagamento(participanteAtualizado.getStatusPagamento());
                    return participanteRepository.save(participante);
                })
                .orElseThrow(() -> new RuntimeException("Participante não encontrado"));
    }

    @Transactional
    public void deletar(Long id) {
        // sem isso, remover um participante que já votou em alguma votação do
        // evento ou já está vinculado a alguma despesa quebrava com violação de FK
        votoRepository.deleteAll(votoRepository.findByParticipante_Id(id));

        List<Despesa> despesasVinculadas = despesaRepository.findByParticipantes_Id(id);
        for (Despesa despesa : despesasVinculadas) {
            despesa.getParticipantes().removeIf(p -> p.getId().equals(id));
            despesaRepository.save(despesa);
        }

        participanteRepository.deleteById(id);
    }
    public List <Participante> listarPorEvento(Long eventoId){
        return participanteRepository.findByEventoId(eventoId);
    }

    public Participante adicionarPorEmail(AddParticipanteDTO dto){
        Usuario usuario = usuarioRepository.findByEmail(dto.getEmail())
        .orElseThrow(() -> new RuntimeException("Usuário não encontrado"));
        Evento evento = eventoRepository.findById(dto.getEventoId())
        .orElseThrow(() -> new RuntimeException("Evento não encontrado!"));

        boolean jaParticipa = participanteRepository.findByEventoId(dto.getEventoId()).stream()
            .anyMatch(p -> p.getUsuario().getId().equals(usuario.getId()));
        if (jaParticipa) {
            throw new IllegalStateException("Usuário já é participante desse evento");
        }

        Participante p = new Participante();
        p.setUsuario(usuario);
        p.setEvento(evento);
        p.setStatusPagamento(StatusPagamento.PENDENTE);
        return participanteRepository.save(p);
        

    }

}
