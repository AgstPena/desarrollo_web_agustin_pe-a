const input = document.getElementById("buscar");
const form = document.getElementById("form-buscar");
const mensaje = document.getElementById("mensaje");
const tabla = document.getElementById("tabla");
const resultados = document.getElementById("resultados");

const URL_DETALLE = "http://localhost:5000/avistamiento/";

let timer = null;
let controller = null;
let terminoActual = "";

form.addEventListener("submit", e => e.preventDefault());
//muestra los resultados una vez uno termine de escribir (300ms despues)
input.addEventListener("input", () => {
    clearTimeout(timer);
    timer = setTimeout(buscar, 300);
});
//funcion asincronica para buscar datos
async function buscar() {
    const q = input.value.trim();

    if (controller) controller.abort();
    if (q === "") {
        mensaje.textContent = "";
        tabla.hidden = true;
        return;
    }

    controller = new AbortController();
    try {
        const resp = await fetch(`/api/buscar?q=${encodeURIComponent(q)}`,{ signal: controller.signal });
        if (!resp.ok) throw new Error("HTTP " + resp.status);
        terminoActual=q;
        mostrar(await resp.json());
    } catch (e) {
        if (e.name === "AbortError") return;
        mensaje.textContent = "No se pudo realizar la búsqueda.";
        tabla.hidden = true;
    }
}

const normalizar = s => s.split("")
    .map(ch => ch.normalize("NFD").replace(/[\u0300-\u036f]/g, "").toLowerCase() || ch)
    .join("");
//dado lo escrito le da mark a lo que coincide, (mark esta en el css y resalta en amarillo el texto)
function resaltar(elemento, texto, termino) {
    const t = normalizar(texto);
    const q = normalizar(termino);
    let pos = 0;

    while (true) {
        const i = t.indexOf(q, pos);
        if (i === -1) break;
        elemento.appendChild(document.createTextNode(texto.slice(pos, i)));
        const mark = document.createElement("mark");
        mark.textContent = texto.slice(i, i + q.length);
        elemento.appendChild(mark);
        pos = i + q.length;
    }
    elemento.appendChild(document.createTextNode(texto.slice(pos)));
}
//agrega los resultados a una tabla para mandarlo al html, usa resaltar para los textos que coinciden
function mostrar(datos) {
    resultados.innerHTML = "";

    if (datos.length === 0) {
        mensaje.textContent = "No se han encontrado avistamientos que coinciden con lo dado";
        tabla.hidden = true;
        return;
    }

    mensaje.textContent = "";
    for (const a of datos) {
        const url = URL_DETALLE + a.id;
        const fila = document.createElement("tr");
        fila.classList.add("fila-click");
        fila.addEventListener("click", () => { window.location.href = url; });

        const columnas = [
            { texto: a.voluntario, resaltar: true },
            { texto: a.fecha,      resaltar: false },
            { texto: a.ave,        resaltar: true, enlace: true },
            { texto: a.comuna,     resaltar: true }
        ];

        for (const col of columnas) {
            const td = document.createElement("td");
            let destino = td;
            if (col.enlace) {
                destino = document.createElement("a");
                destino.href = url;
                td.appendChild(destino);
            }
            if (col.resaltar) resaltar(destino, col.texto, terminoActual);
            else destino.textContent = col.texto;
            fila.appendChild(td);
        }
        resultados.appendChild(fila);
    }
    tabla.hidden = false;
}