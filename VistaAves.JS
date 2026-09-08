const form = document.getElementById("form-ave");
const Tipo_ave = document.getElementById("tipo-ave");
const List_Tipo = document.getElementById("list-tipo")

const List_aveValidas = new Set(Array.from(List_Tipo.options).map(opt=>opt.value))
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

function validForm(){
    
    let isValid = true;
    const Tipo_ave= document.getElementById("tipo-ave");
    const Nombre_ave= document.getElementById("nombre-ave");
    const Region_ave=document.getElementById("lugar");
    const Date_ave = document.getElementById("fecha-avist");
    const Imagen_ave = document.getElementById("imagen-avist")
    //error Tipo del ave
    if(Tipo_ave.value.trim() === ''|| !List_aveValidas.has(Tipo_ave.value)){
        setError(Tipo_ave);
        isValid=false;
    } else {
        setSuccess(Tipo_ave);
    }
    //error Nombre del ave
    if (Nombre_ave.value.trim() === ''){
        setError(Nombre_ave);
        isValid=false;
    } else {
        setSuccess(Nombre_ave);
    }
    //error Region del ave
    if (Region_ave.value.trim()===''){
        setError(Region_ave);
        isValid=false;
    } else {
        setSuccess(Region_ave);
    }
    //error Date
    const hoy = new Date();
    if (Date_ave.valueAsDate>hoy||!Date_ave.valueAsDate){
        setError(Date_ave);
        isValid=false;
    } else {
        setSuccess(Date_ave);
    }
    //errror Imagen
    if (!Imagen_ave.value){
        setError(Imagen_ave);
        isValid=false;
    } else {
        setSuccess(Imagen_ave);
    }

    return isValid;
}

//imagen a base64 para guardar
function leerImagenes(fileList) {
    const promesas = [...fileList].map(file => {
        return new Promise((resolve, reject) => {
            const reader = new FileReader();
            reader.onload = () => resolve({ nombre: file.name, data: reader.result });
            reader.onerror = reject;
            reader.readAsDataURL(file);
        });
    });
    return Promise.all(promesas);
}

//guardar resultados en local storage
function guardarRegistro(registro) {
    const registros = JSON.parse(localStorage.getItem("avistamientos")) || [];
    registros.push(registro);
    localStorage.setItem("avistamientos", JSON.stringify(registros));
}

form.addEventListener("submit", async (event) => {
    event.preventDefault();

    if (!validForm()) return; //si form invalido no continuar

    //saco la info
    const Tipo_ave = document.getElementById("tipo-ave");
    const Nombre_ave = document.getElementById("nombre-ave");
    const Region_ave = document.getElementById("lugar");
    const Date_ave = document.getElementById("fecha-avist");
    const Hora_ave = document.getElementById("hora-avist");
    const Imagen_ave = document.getElementById("imagen-avist");
    
    const imagenes = await leerImagenes(Imagen_ave.files);
    //guardo la info en un registro
    const registro = {
        tipo: Tipo_ave.value.trim(),
        nombre: Nombre_ave.value.trim(),
        region: Region_ave.value.trim(),
        fecha: Date_ave.value,
        hora: Hora_ave.value,
        imagenes: imagenes,
        creadoEn: new Date().toISOString()
    };
    //la subo al local storage
    guardarRegistro(registro);
    //aviso que esta subido y reseteo los datos
    alert("🕊️ Tu avistamiento ha sido registrado con exito 🕊️")
    form.reset();
});