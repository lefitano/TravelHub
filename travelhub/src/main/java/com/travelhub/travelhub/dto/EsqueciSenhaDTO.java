package com.travelhub.travelhub.dto;

import jakarta.validation.constraints.Email;
import jakarta.validation.constraints.NotBlank;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@AllArgsConstructor
@NoArgsConstructor
public class EsqueciSenhaDTO {
    @Email
    @NotBlank(message = "O email é obrigatório")
    private String email;
}
