package com.travelhub.travelhub.repository;

import java.util.List;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;
import com.travelhub.travelhub.model.Despesa;

@Repository

public interface DespesaRepository extends JpaRepository<Despesa, Long> {

    List<Despesa> findByEventoId(Long eventoId);
    
}
