package com.travelhub.travelhub.dto;

import java.math.BigDecimal;
import java.util.List;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
import jakarta.validation.constraints.Positive;

@Data
@AllArgsConstructor
@NoArgsConstructor
public class AddDespesaDTO {
    @NotBlank(message = "Descrição obrigatória")
    private String descricao;
    @Positive
    @NotNull(message = "Valor obrigatório")
    private BigDecimal valor;
    @NotNull(message = "Evento necessário")
    private Long eventoId;
    private List<Long> participantesIds;
}
