package com.travelhub.travelhub.repository;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import com.travelhub.travelhub.model.Usuario;

@Repository
public interface UsuarioRepository extends JpaRepository<Usuario, Long> {
    
}
