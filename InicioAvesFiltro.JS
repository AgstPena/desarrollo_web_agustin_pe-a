let registrosOriginales = [];

document.addEventListener("DOMContentLoaded", () => {
    //Guardo los datos del local storage en mi registro
    registrosOriginales = JSON.parse(localStorage.getItem("avistamientos")) || [];
    //cuando cambio filtro vuelvo a renderizar
    const filtroTipo = document.getElementById("filtro-tipo");
    filtroTipo.addEventListener("change", renderizarLista);

    renderizarLista(); // primer renderizado
});

//Funcion de renderizado
function renderizarLista() {
    //obtengo mi lista de avistamientos y filtros
    const contenedor = document.getElementById("lista-avistamientos");
    const filtroTipo = document.getElementById("filtro-tipo").value;

    contenedor.innerHTML = ""; // limpo

    //Filtrar por tipo
    let registros = registrosOriginales.filter(reg => {
        return filtroTipo === "todos" || reg.tipo === filtroTipo;
    });

    //Si no hay nada no renderizo
    if (registros.length === 0) {
        contenedor.textContent = "No hay avistamientos de este tipo";
        return;
    }

    //Obtengo el registro mas reciente para destacarlo
    const masReciente = [...registrosOriginales].sort((a, b) => {
        const fechaA = new Date(`${a.fecha}T${a.hora || "00:00"}`);
        const fechaB = new Date(`${b.fecha}T${b.hora || "00:00"}`);
        return fechaB - fechaA;
    })[0];

    //Renderizo
    registros.forEach(reg => {
        const card = document.createElement("div");
        card.classList.add("avistamiento-card");
        if (reg === masReciente) card.classList.add("ultimo-registro");
        //Tipo+Nombre en <h3></h3>
        const titulo = document.createElement("h3");
        titulo.textContent = `${reg.tipo} - ${reg.nombre}`;
        card.appendChild(titulo);
        //Region
        const region = document.createElement("p");
        const etiquetaRegion = document.createElement("span");
        etiquetaRegion.classList.add("etiqueta");
        etiquetaRegion.textContent = "Región: ";
        region.appendChild(etiquetaRegion);
        region.appendChild(document.createTextNode(reg.region));
        card.appendChild(region);
        //Fecha+Hora
        const fechaHora = document.createElement("p");
        const etiquetaFecha = document.createElement("span");
        etiquetaFecha.classList.add("etiqueta");
        etiquetaFecha.textContent = "Fecha: ";
        fechaHora.appendChild(etiquetaFecha);
        fechaHora.appendChild(document.createTextNode(`${reg.fecha}${reg.hora ? " - " + reg.hora : ""}`)); //el ? es para que si no hay hora no aparezca el -
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
        //appendChild de mi registro al contenedor que contiene los registros de HMTL en InicioAves
        contenedor.appendChild(card);
    });
}