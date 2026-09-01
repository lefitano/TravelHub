package com.travelhub.travelhub.dto;

import java.util.List;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@AllArgsConstructor
@NoArgsConstructor
public class ResultadoVotacaoDTO {
    private List<Long> minhasOpcoesIds;
    private List<ResultadoOpcaoDTO> opcoes;
}
