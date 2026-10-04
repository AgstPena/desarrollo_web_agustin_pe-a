document.querySelectorAll("tr.fila-click").forEach(fila => {
    fila.addEventListener("click", () => {
        window.location.href = fila.dataset.href;
    });
});