package com.travelhub.travelhub.service;

import java.util.List;
import java.util.Optional;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import com.travelhub.travelhub.repository.EventoRepository;
import com.travelhub.travelhub.model.Evento;

@Service

public class EventoService {
    @Autowired
    private EventoRepository eventoRepository;

    public Evento salvar(Evento evento) {
        return eventoRepository.save(evento);
    }

    public List<Evento> listarTodos() {
        return eventoRepository.findAll();
    }

    public Optional<Evento> buscarPorId(Long id) {
        return eventoRepository.findById(id);
    }

    public Evento atualizar(Long id, Evento eventoAtualizado) {

        return eventoRepository.findById(id)
                .map(evento -> {
                    evento.setDataInicio(eventoAtualizado.getDataInicio());
                    evento.setDataFim(eventoAtualizado.getDataFim());
                    evento.setDescricao(eventoAtualizado.getDescricao());
                    evento.setDestino(eventoAtualizado.getDestino());
                    evento.setNome(eventoAtualizado.getNome());
                    return eventoRepository.save(evento);
                })
                .orElseThrow(() -> new RuntimeException("Evento não encontrado"));
    }

    public void deletar(Long id) {
        eventoRepository.deleteById(id);
    }
}