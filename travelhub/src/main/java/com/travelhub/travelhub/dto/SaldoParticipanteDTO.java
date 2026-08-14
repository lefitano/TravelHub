package com.travelhub.travelhub.dto;

import java.math.BigDecimal;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@AllArgsConstructor
@NoArgsConstructor
public class SaldoParticipanteDTO {
    private Long participanteId;
    private String nome;
    private BigDecimal valor;
}
