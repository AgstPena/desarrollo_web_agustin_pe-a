const opcionesBase = {
    title: { text: null },
    credits: { enabled: false }
};

const cargar = (id, fn) => {
    const el = document.getElementById(id);
    fetch(el.dataset.url)
        .then(resp => resp.json())
        .then(data => Highcharts.chart(el, { ...opcionesBase, ...fn(data) }));
};

// grafico de lineas, DIAS/AVISTAMIENTOS
cargar("grafico-dias", data => ({
    chart: { type: "line" },
    xAxis: { categories: data.labels, title: { text: "Día" } },
    yAxis: { min: 0, allowDecimals: false, title: { text: "Cantidad de avistamientos" } },
    legend: { enabled: false },
    series: [{ name: "Avistamientos", data: data.values }]
}));

// grafico de pie, TIPO DE AVES
cargar("grafico-aves", data => ({
    chart: { type: "pie" },
    series: [{
        name: "Avistamientos",
        data: data.labels.map((nombre, i) => ({ name: nombre, y: data.values[i] })),
    }]
}));

// grafico de barras, VOLUNTARIOS/COMUNA
cargar("grafico-comunas", data => ({
    chart: { type: "column" },
    xAxis: { categories: data.labels, title: { text: "Comuna" } },
    yAxis: { min: 0, allowDecimals: false, title: { text: "Total de voluntarios" } },
    legend: { enabled: false },
    series: [{ name: "Voluntarios", data: data.values }]
}));