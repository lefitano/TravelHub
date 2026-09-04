package com.travelhub.travelhub.dto;

import java.time.LocalDate;

import com.travelhub.travelhub.model.TipoEvento;

import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

// DTO dedicado pra criação de evento (POST /eventos), sem campo "id" — mesmo
// motivo do CadastroUsuarioDTO: evita que um client sobrescreva um evento
// existente de outra pessoa passando o id dele no corpo da requisição.
@Data
@AllArgsConstructor
@NoArgsConstructor
public class CriarEventoDTO {
    @NotBlank(message = "O nome do evento é obrigatório")
    private String nome;
    @NotBlank(message = "A descrição do evento é obrigatória")
    private String descricao;
    @NotBlank(message = "O destino do evento é obrigatório")
    private String destino;
    @NotNull(message = "A data de início do evento é obrigatória")
    private LocalDate dataInicio;
    @NotNull(message = "A data final do evento é obrigatória")
    private LocalDate dataFim;
    @NotNull(message = "O tipo do evento é obrigatório")
    private TipoEvento tipo;
}
