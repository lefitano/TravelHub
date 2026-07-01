package com.travelhub.travelhub.repository;
import java.util.List;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import com.travelhub.travelhub.model.OpcaoVoto;

@Repository
public interface OpcaoVotoRepository extends JpaRepository<OpcaoVoto, Long > {
    List<OpcaoVoto> findByVotacaoId(Long votacaoId);
}
