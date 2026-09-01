package com.travelhub.travelhub.service;

import java.util.List;
import java.util.Map;
import java.util.Optional;
import java.util.stream.Collectors;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import com.travelhub.travelhub.dto.ResultadoOpcaoDTO;
import com.travelhub.travelhub.dto.ResultadoVotacaoDTO;
import com.travelhub.travelhub.model.OpcaoVoto;
import com.travelhub.travelhub.model.Participante;
import com.travelhub.travelhub.model.Voto;
import com.travelhub.travelhub.repository.OpcaoVotoRepository;
import com.travelhub.travelhub.repository.ParticipanteRepository;
import com.travelhub.travelhub.repository.VotoRepository;

@Service
public class VotoService {
    @Autowired
    private VotoRepository votoRepository;
    @Autowired
    private OpcaoVotoRepository opcaoVotoRepository;
    @Autowired
    private ParticipanteRepository participanteRepository;

    public void votar(Long opcaoVotoId, String email) {
        OpcaoVoto opcaoVoto = opcaoVotoRepository.findById(opcaoVotoId)
            .orElseThrow(() -> new RuntimeException("Opção de voto não encontrada"));

        Long eventoId = opcaoVoto.getVotacao().getEvento().getId();
        Participante participante = participanteRepository.findByEventoId(eventoId).stream()
            .filter(p -> p.getUsuario().getEmail().equals(email))
            .findFirst()
            .orElseThrow(() -> new RuntimeException("Usuário não participa desse evento"));

        // toggle: cada participante pode votar em quantas opções quiser dentro da mesma votação
        Optional<Voto> votoExistente = votoRepository
            .findByParticipante_IdAndOpcaoVoto_Id(participante.getId(), opcaoVotoId);

        if (votoExistente.isPresent()) {
            votoRepository.delete(votoExistente.get());
            return;
        }

        Voto novoVoto = new Voto();
        novoVoto.setParticipante(participante);
        novoVoto.setOpcaoVoto(opcaoVoto);
        votoRepository.save(novoVoto);
    }

    public ResultadoVotacaoDTO calcularResultado(Long votacaoId, String email) {
        List<OpcaoVoto> opcoes = opcaoVotoRepository.findByVotacaoId(votacaoId);
        List<Voto> votos = votoRepository.findByOpcaoVoto_Votacao_Id(votacaoId);

        Map<Long, Long> contagemPorOpcao = votos.stream()
            .collect(Collectors.groupingBy(v -> v.getOpcaoVoto().getId(), Collectors.counting()));

        List<ResultadoOpcaoDTO> resultadoOpcoes = opcoes.stream()
            .map(o -> new ResultadoOpcaoDTO(
                o.getId(),
                o.getDescricao(),
                contagemPorOpcao.getOrDefault(o.getId(), 0L)
            ))
            .collect(Collectors.toList());

        List<Long> minhasOpcoesIds = votos.stream()
            .filter(v -> v.getParticipante().getUsuario().getEmail().equals(email))
            .map(v -> v.getOpcaoVoto().getId())
            .collect(Collectors.toList());

        return new ResultadoVotacaoDTO(minhasOpcoesIds, resultadoOpcoes);
    }
}
