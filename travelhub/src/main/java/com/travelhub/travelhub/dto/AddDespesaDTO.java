package com.travelhub.travelhub.dto;

import java.math.BigDecimal;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@AllArgsConstructor
@NoArgsConstructor
public class AddDespesaDTO {
    private String descricao;
    private BigDecimal valor;
    private Long eventoId;
}
