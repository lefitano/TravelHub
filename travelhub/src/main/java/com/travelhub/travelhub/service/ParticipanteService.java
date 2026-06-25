package com.travelhub.travelhub.service;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import com.travelhub.travelhub.repository.ParticipanteRepository;

@Service

public class ParticipanteService {
    @Autowired
    private ParticipanteRepository participanteRepository;
    
}
