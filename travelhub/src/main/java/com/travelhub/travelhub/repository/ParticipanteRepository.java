package com.travelhub.travelhub.repository;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;
import com.travelhub.travelhub.model.Participante;

@Repository

public interface ParticipanteRepository extends JpaRepository<Participante, Long> {

    
} 