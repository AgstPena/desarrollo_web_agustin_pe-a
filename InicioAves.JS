document.addEventListener("DOMContentLoaded", () => {
    const contenedor = document.getElementById("lista-avistamientos");
    const registros = JSON.parse(localStorage.getItem("avistamientos")) || [];
    //caso inicial, no hay pajaros registrados
    if (registros.length === 0) {
        contenedor.textContent = "Aún no hay avistamientos registrados.";
        return;
    }

    // Orderno para tener al mas reciente primero
    const ordenados = [...registros].reverse();

    ordenados.forEach((reg, index) => {
        //creo un div que contenga mi registro
        const card = document.createElement("div");
        card.classList.add("avistamiento-card");
        if (index === 0) card.classList.add("ultimo-registro"); //registro especial para el mas reciente
        //Tipo+Nombre en <h3></h3>
        const titulo = document.createElement("h3");
        titulo.textContent = `${reg.tipo} - ${reg.nombre}`;
        card.appendChild(titulo);
        //Region
        const region = document.createElement("p");
        const etiquetaRegion = document.createElement("span");
        etiquetaRegion.classList.add("etiqueta");
        etiquetaRegion.textContent = "Ubicación: ";
        region.appendChild(etiquetaRegion);
        region.appendChild(document.createTextNode(reg.region));
        card.appendChild(region);
        //Fecha+Hora
        const fechaHora = document.createElement("p");
        const etiquetaFecha = document.createElement("span");
        etiquetaFecha.classList.add("etiqueta");
        etiquetaFecha.textContent = "Fecha: ";
        fechaHora.appendChild(etiquetaFecha);
        fechaHora.appendChild(document.createTextNode(`${reg.fecha}${reg.hora ? " - " + reg.hora : ""}`));
        card.appendChild(fechaHora);
        //Meto la imagen
        if (reg.imagenes && reg.imagenes.length > 0) {
            const galeria = document.createElement("div");
            galeria.classList.add("galeria");
            reg.imagenes.forEach(img => {
                if (img.data.startsWith("data:image")) {
                    const imgEl = document.createElement("img");
                    imgEl.src = img.data;
                    imgEl.alt = reg.nombre;
                    galeria.appendChild(imgEl);
                }
            });
            card.appendChild(galeria);
        }
        //appendChild de mi registro al contenedor que contiene los registros en HTML de InicioAves
        contenedor.appendChild(card);
    });
});