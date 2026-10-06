document.querySelectorAll("tr.fila-click").forEach(fila => {
    fila.addEventListener("click", () => {
        window.location.href = fila.dataset.href;
    });
}); //esto nos permite hacer clik en cualquier parte de la fila