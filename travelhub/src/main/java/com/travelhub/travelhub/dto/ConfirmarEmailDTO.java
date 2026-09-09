package com.travelhub.travelhub.dto;

import jakarta.validation.constraints.NotBlank;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@AllArgsConstructor
@NoArgsConstructor
public class ConfirmarEmailDTO {
    @NotBlank(message = "Token inválido")
    private String token;
}
