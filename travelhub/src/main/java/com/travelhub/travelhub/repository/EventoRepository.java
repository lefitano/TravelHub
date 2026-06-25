package com.travelhub.travelhub.repository;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;
import com.travelhub.travelhub.model.Evento;

@Repository

public interface EventoRepository extends JpaRepository<Evento, Long> {
    
}
