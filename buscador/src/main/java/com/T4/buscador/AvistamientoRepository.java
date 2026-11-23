package com.T4.buscador;

import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import java.util.List;

public interface AvistamientoRepository extends JpaRepository<Avistamiento, Integer> {

    @Query("""
        SELECT new com.T4.buscador.AvistamientoDto(a.id, v.nombre, a.fechaHora, e.nombre, c.nombre)
        FROM Avistamiento a
        JOIN a.voluntario v
        JOIN a.ave e
        JOIN v.comuna c
        WHERE LOWER(e.nombre) LIKE LOWER(CONCAT('%', :q, '%'))
           OR LOWER(v.nombre) LIKE LOWER(CONCAT('%', :q, '%'))
           OR LOWER(c.nombre) LIKE LOWER(CONCAT('%', :q, '%'))
        ORDER BY a.fechaHora DESC, a.id DESC
        """)
    List<AvistamientoDto> buscar(@Param("q") String q, Pageable pageable);
}
