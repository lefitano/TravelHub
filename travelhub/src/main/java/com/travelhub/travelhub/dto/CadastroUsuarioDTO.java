package com.travelhub.travelhub.dto;

import jakarta.validation.constraints.Email;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.Size;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

// DTO dedicado pro cadastro (POST /usuarios), sem campo "id" — evita o bug de
// mass assignment em que um client mandava um id existente e o Spring, ao invés
// de criar um usuário novo, fazia merge() sobrescrevendo a conta de outra pessoa.
@Data
@AllArgsConstructor
@NoArgsConstructor
public class CadastroUsuarioDTO {
    @NotBlank(message = "O nome é obrigatório")
    @Size(min = 3, message = "O nome deve ter pelo menos 3 caracteres")
    private String nome;
    @Email
    @NotBlank(message = "O email é obrigatório")
    private String email;
    @NotBlank(message = "A senha é obrigatória")
    @Size(min = 6, message = "A senha deve ter pelo menos 6 caracteres")
    private String senha;
}
