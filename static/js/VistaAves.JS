const form = document.getElementById("form-ave");
const List_Tipo = document.getElementById("list-tipo");
const List_aveValidas = new Set(Array.from(List_Tipo.options).map(opt => opt.value));

const TIPOS_IMAGEN = ["image/jpeg", "image/png", "image/gif", "image/webp"];
const MAX_ARCHIVOS = 5;
const MAX_BYTES = 5 * 1024 * 1024;
// Success, borde verde (en styles)
const setSuccess = element => {
    const inputControl = element.parentElement;

    inputControl.classList.add('success');
    inputControl.classList.remove('error');
};
// Error, borde rojo (en styles)
const setError = (element) => {
    const inputControl = element.parentElement;

    inputControl.classList.add('error');
    inputControl.classList.remove('success');
};
//mostrar mensaje, lo que dice
const mostrarMensaje = texto => {
    document.getElementById("form-msg").textContent = texto;
};
function validForm(){
    let isValid = true;
    const mensajes = [];

    const Tipo_ave= document.getElementById("tipo-ave");
    const Nombre_ave= document.getElementById("nombre-ave");
    const Lugar = document.getElementById("lugar");
    const Date_ave = document.getElementById("fecha-avist");
    const Hora_ave = document.getElementById("hora-avist");
    const Imagen_ave = document.getElementById("imagen-avist");
    //funcion que facilita asignar set success/error
    const check = (el, ok, msg) => {
        if (ok) { setSuccess(el); }
        else { setError(el); isValid = false; if (msg) mensajes.push(msg); }
    };
    //error TipoAve
    check(Tipo_ave, List_aveValidas.has(Tipo_ave.value), "Elige un tipo de ave de la lista.\r\n");
    //error Nombre del ave
    check(Nombre_ave, Nombre_ave.value !== "", "Elige un ave de la lista.");
    //error Region del ave
    check(Lugar, Lugar.value.trim() !== "", "Indica la zona del avistamiento.");

    //error Date y hora
    const ahora = new Date();
    const fechaOk = Date_ave.value !== "" && new Date(`${Date_ave.value}T00:00`) <= ahora;
    const horaOk = Hora_ave.value !== "" &&
        (!fechaOk || new Date(`${Date_ave.value}T${Hora_ave.value}`) <= ahora);
    check(Date_ave, fechaOk, "Indica una fecha válida (no futura).");
    check(Hora_ave, horaOk, "Indica una hora válida (no futura).");

    //errror Imagen

    const files = [...Imagen_ave.files];
    let msgImg = "";
    if (files.length === 0) msgImg = "Debes subir al menos una imagen.";
    else if (files.length > MAX_ARCHIVOS) msgImg = `Máximo ${MAX_ARCHIVOS} imágenes.`;
    else if (files.some(f => !TIPOS_IMAGEN.includes(f.type)))
        msgImg = "Solo se permiten imágenes JPG, PNG, GIF o WEBP.";
    else if (files.some(f => f.size > MAX_BYTES))
        msgImg = "Cada imagen debe pesar menos de 5 MB.";
    check(Imagen_ave, msgImg === "", msgImg);

    mostrarMensaje(mensajes.join(" "));
    return isValid;
}

form.addEventListener("submit", async (event) => {
    event.preventDefault();
    if (!validForm()) return; //si form invalido no continuar

    const btn = document.getElementById("submit_btn");
    btn.disabled = true;

    try {
        const resp = await fetch(form.action, { method: "POST", body: new FormData(form) });
        const data = await resp.json();

        if (resp.status === 401) {     //error 401, no se presento credenciales
            alert(data.error);
            window.location.href = form.dataset.registroUrl;
            return;
        }
        if (!data.ok) {
            mostrarMensaje(data.error);
            return;
        }
        alert("🕊️ Tu avistamiento ha sido registrado con exito 🕊️");
        form.reset();
        mostrarMensaje("");
        form.querySelectorAll(".input-control").forEach(c => c.classList.remove("success", "error"));
    } catch (e) {
        mostrarMensaje("No se pudo conectar con el servidor.");
    } finally {
        btn.disabled = false;
    }
});