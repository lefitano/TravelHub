package com.travelhub.travelhub.dto;

import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

// DTO dedicado pra criação de votação (POST /votacoes), sem campo "id" — mesmo
// motivo do CadastroUsuarioDTO/CriarEventoDTO.
@Data
@AllArgsConstructor
@NoArgsConstructor
public class CriarVotacaoDTO {
    @NotBlank(message = "O título da votação é obrigatório")
    private String titulo;
    @NotNull(message = "É obrigatório informar o evento")
    private Long eventoId;
}
