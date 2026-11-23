package com.T4.buscador;

import org.springframework.data.domain.PageRequest;
import org.springframework.web.bind.annotation.*;
import java.util.List;

@RestController
@RequestMapping("/api")
public class BuscadorController {

    private final AvistamientoRepository repo;

    public BuscadorController(AvistamientoRepository repo) {
        this.repo = repo;
    }

    @GetMapping("/buscar")
    public List<AvistamientoDto> buscar(@RequestParam(defaultValue = "") String q) {
        q = q.trim();
        if (q.isEmpty()) {
            return List.of();
        }
        if (q.length() > 80) {
            q = q.substring(0, 80);
        }

        String seguro = q.replace("\\", "\\\\").replace("%", "\\%").replace("_", "\\_");

        return repo.buscar(seguro, PageRequest.of(0, 50));
    }
}
