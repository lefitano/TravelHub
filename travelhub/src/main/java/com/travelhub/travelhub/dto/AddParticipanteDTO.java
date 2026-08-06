package com.travelhub.travelhub.dto;

import lombok.Data;
import lombok.NoArgsConstructor;
import jakarta.validation.constraints.Email;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;

@Data
@NoArgsConstructor
public class AddParticipanteDTO {
    @NotBlank(message = "O email é obrigatório")
    @Email
    String email;
    @NotNull(message = "É obrigatório ter um evento")
    Long eventoId;
}
