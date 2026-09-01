package com.travelhub.travelhub.model;

import jakarta.persistence.Entity;
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


@Entity
@Data
@Table(name="votos")
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class Voto {
  @Id
  @GeneratedValue(strategy = GenerationType.IDENTITY)
  private Long id;
  @ManyToOne
  @JoinColumn(name = "participante_id", nullable = false)
  private Participante participante;
  @ManyToOne
  @JoinColumn(name = "opcao_voto_id", nullable = false)
  private OpcaoVoto opcaoVoto;

}
