package com.travelhub.travelhub.dto;

import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@NoArgsConstructor
public class AddParticipanteDTO {
    String email;
    Long eventoId;
}
