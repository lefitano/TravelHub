package com.travelhub.travelhub.dto;

import java.math.BigDecimal;
import java.util.List;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@AllArgsConstructor
@NoArgsConstructor
public class ResumoDespesasDTO {
    private boolean criador;
    private BigDecimal totalQueDevo;
    private List<DespesaDetalheDTO> despesas;
}
