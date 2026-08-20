package com.travelhub.travelhub.dto;
import jakarta.validation.constraints.Email;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.Size;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@AllArgsConstructor
@NoArgsConstructor
public class AtualizarPerfilDTO {
    @NotBlank(message="O nome é obrigatório")
    @Size(min = 3, message = "O nome precisa ter pelo menos 3 caracteres")
    private String nome;
    @Email
    @NotBlank(message="O email é obrigatório")
    private String email;
}
