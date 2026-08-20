package com.travelhub.travelhub.dto;
import jakarta.validation.constraints.*;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.Size;

@Data
@AllArgsConstructor
@NoArgsConstructor
public class TrocarSenhaDTO {
    @NotBlank(message="A senha atual é obrigatória.")
    private String senhaAtual;
    @NotBlank(message="A nova senha é obrigatória.")
    @Size(min = 6, message="A senha precisa de pelo menos 6 caracteres.")
    private String novaSenha;
}
