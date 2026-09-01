package com.travelhub.travelhub.dto;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@AllArgsConstructor
@NoArgsConstructor
public class ResultadoOpcaoDTO {
    private Long opcaoVotoId;
    private String descricao;
    private long quantidadeVotos;
}
