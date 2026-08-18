package com.travelhub.travelhub.dto;

import java.math.BigDecimal;
import java.util.List;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@AllArgsConstructor
@NoArgsConstructor
public class DespesaDetalheDTO {
    private Long despesaId;
    private String descricao;
    private BigDecimal valorTotal;
    private String responsavelNome;
    private BigDecimal minhaParte;
    private List<String> participantesNomes;
}
