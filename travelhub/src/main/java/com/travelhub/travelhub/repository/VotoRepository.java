package com.travelhub.travelhub.repository;

import java.util.List;
import java.util.Optional;

import org.springframework.data.jpa.repository.JpaRepository;

import com.travelhub.travelhub.model.Voto;

public interface VotoRepository extends JpaRepository<Voto, Long> {
    Optional<Voto> findByParticipante_IdAndOpcaoVoto_Id(Long participanteId, Long opcaoVotoId);
    List<Voto> findByOpcaoVoto_Votacao_Id(Long votacaoId);
    List<Voto> findByOpcaoVoto_Id(Long opcaoVotoId);
}
