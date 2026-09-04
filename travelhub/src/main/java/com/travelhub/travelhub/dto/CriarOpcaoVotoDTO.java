package com.travelhub.travelhub.dto;

import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

// DTO dedicado pra criação de opção de voto (POST /opcoesvotos), sem campo "id"
// — mesmo motivo do CadastroUsuarioDTO/CriarEventoDTO/CriarVotacaoDTO.
@Data
@AllArgsConstructor
@NoArgsConstructor
public class CriarOpcaoVotoDTO {
    @NotBlank(message = "A descrição da opção é obrigatória")
    private String descricao;
    @NotNull(message = "É obrigatório informar a votação")
    private Long votacaoId;
}
