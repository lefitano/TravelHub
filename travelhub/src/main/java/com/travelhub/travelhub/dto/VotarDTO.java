package com.travelhub.travelhub.dto;

import jakarta.validation.constraints.NotNull;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@AllArgsConstructor
@NoArgsConstructor
public class VotarDTO {
    @NotNull(message = "A opção de voto é obrigatória")
    private Long opcaoVotoId;
}
