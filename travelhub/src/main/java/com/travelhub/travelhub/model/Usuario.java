package com.travelhub.travelhub.model;

import java.time.LocalDateTime;

import com.fasterxml.jackson.annotation.JsonProperty;

import jakarta.persistence.Entity;
import jakarta.persistence.GeneratedValue;
import jakarta.persistence.Id;
import jakarta.persistence.Table;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;
import jakarta.persistence.GenerationType;
import jakarta.persistence.Column;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.Email;
import jakarta.validation.constraints.Size;

@Entity
@Table(name = "usuarios")
@Data
@NoArgsConstructor
@AllArgsConstructor
@Builder


public class Usuario {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;
    @Column(nullable = false)
    @NotBlank(message = "O nome é obrigatório")
    @Size(min = 3, message = "O nome deve ter pelo menos 3 caracteres")
    private String nome;
    @Column(nullable = false, unique = true)
    @Email
    @NotBlank(message = "O email é obrigatório")
    private String email;
    @Column(nullable = false)
    @JsonProperty(access = JsonProperty.Access.WRITE_ONLY)
    @NotBlank(message = "A senha é obrigatória")
    @Size(min = 6, message = "A senha deve ter pelo menos 6 caracteres")
    private String senha;
    private LocalDateTime dataCadastro;
    private String fotoUrl;
}
