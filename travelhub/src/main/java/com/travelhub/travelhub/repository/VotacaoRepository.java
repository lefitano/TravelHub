package com.travelhub.travelhub.repository;


import java.util.List;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import com.travelhub.travelhub.model.Votacao;


@Repository
public interface VotacaoRepository extends JpaRepository<Votacao, Long> {
    List <Votacao> findByEventoId(Long eventoId);
}
