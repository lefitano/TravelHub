package com.travelhub.travelhub.service;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import com.travelhub.travelhub.repository.EventoRepository;

@Service

public class EventoService {
    @Autowired
    private EventoRepository eventoRepository;
    
}
