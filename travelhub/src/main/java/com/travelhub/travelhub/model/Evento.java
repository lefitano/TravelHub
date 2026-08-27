package com.travelhub.travelhub.model;

import java.time.LocalDate;

import jakarta.persistence.Column;
import jakarta.persistence.Entity;
import jakarta.persistence.Enumerated;
import jakarta.persistence.GeneratedValue;
import jakarta.persistence.GenerationType;
import jakarta.persistence.Id;
import jakarta.persistence.JoinColumn;
import jakarta.persistence.ManyToOne;
import jakarta.persistence.Table;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
import jakarta.persistence.EnumType;

@Entity
@Data
@Table(name = "eventos")
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class Evento {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;
    @Column(nullable = false)
    @NotBlank(message = "O nome do evento é obrigatório")
    private String nome;
    @Column(nullable = false)
    @NotBlank(message = "A descrição do evento é obrigatória")
    private String descricao;
    @Column(nullable = false)
    @NotBlank(message = "O destino do evento é obrigatório")
    private String destino;
    @Column(nullable = false)
    @NotNull(message = "A data de início do evento é obrigatária")
    private LocalDate dataInicio;
    @Column(nullable = false)
    @NotNull(message = "A data final do evento é obrigatória")
    private LocalDate dataFim;
    @Column(nullable = true)
    @Enumerated(EnumType.STRING)
    @NotNull(message = "O tipo do evento é obrigatório")
    private TipoEvento tipo;
    @ManyToOne
    @JoinColumn(name = "criador_id")
    private Usuario criador;
  

}
