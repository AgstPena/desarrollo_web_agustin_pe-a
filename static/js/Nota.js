const formNota = document.getElementById("form-nota");
const notaMsg = document.getElementById("nota-msg");

formNota.addEventListener("submit", async (event) => {
    event.preventDefault();

    const select = document.getElementById("nota");
    if (select.value === "") {
        notaMsg.textContent = "Selecciona una nota entre 1 y 7.";
        return;
    }

    const btn = formNota.querySelector("button");
    btn.disabled = true;
    try {
        const resp = await fetch(formNota.dataset.url, {
            method: "POST",
            body: new FormData(formNota)
        });
        const data = await resp.json();

        if (!data.ok) {
            notaMsg.textContent = data.error;
            return;
        }
        document.getElementById("nota-promedio").textContent = data.promedio;
        document.getElementById("nota-cantidad").textContent = data.cantidad;
        notaMsg.textContent = "";
        formNota.reset();
    } catch (e) {
        notaMsg.textContent = "No se pudo conectar con el servidor.";
    } finally {
        btn.disabled = false;
    }
});