package com.travelhub.travelhub.model;

import java.math.BigDecimal;
import java.util.ArrayList;
import java.util.List;

import jakarta.persistence.Column;
import jakarta.persistence.Entity;
import jakarta.persistence.GeneratedValue;
import jakarta.persistence.GenerationType;
import jakarta.persistence.Id;
import jakarta.persistence.JoinColumn;
import jakarta.persistence.JoinTable;
import jakarta.persistence.ManyToMany;
import jakarta.persistence.ManyToOne;
import jakarta.persistence.Table;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

@Entity
@Data
@Table(name = "despesas")
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class Despesa {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;
    @Column(nullable = false)
    private String descricao;
    @Column(nullable = false)
    private BigDecimal valor; // float ou decimal causaria erros de arrendondamento, bigdecimal é para valores
    @ManyToOne
    @JoinColumn(name = "usuario_id", nullable = false)
    private Usuario responsavel;
    @ManyToOne
    @JoinColumn(name = "evento_id", nullable = false)
    private Evento evento;
    @ManyToMany
    @JoinTable(
        name = "despesa_participantes",
        joinColumns = @JoinColumn(name = "despesa_id"),
        inverseJoinColumns  = @JoinColumn(name = "participante_id")
    )
    private List<Participante> participantes = new ArrayList<>();
    

}
