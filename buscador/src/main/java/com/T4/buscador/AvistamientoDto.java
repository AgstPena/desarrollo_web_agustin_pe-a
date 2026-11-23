package com.T4.buscador;

import com.fasterxml.jackson.annotation.JsonFormat;
import java.time.LocalDateTime;

public record AvistamientoDto(
        Integer id,
        String voluntario,
        @JsonFormat(pattern = "dd-MM-yyyy HH:mm") LocalDateTime fecha,
        String ave,
        String comuna) {
}