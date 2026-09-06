const form = document.getElementById("form-ave");
const Tipo_ave = document.getElementById("tipo-ave");

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

const validForm = (event) => {
    event.preventDefault();
    let isValid = true;
    const Tipo_ave= document.getElementById("tipo-ave");
    const Nombre_ave= document.getElementById("nombre-ave");
    const Region_ave=document.getElementById("lugar");
    const Date_ave = document.getElementById("fecha-avist");
    const Imagen_ave = document.getElementById("imagen-avist")
    //error Tipo del ave
    if(Tipo_ave.value.trim() === ''){
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

    if (isValid) {
        form.reset();
    }
}

form.addEventListener("submit", validForm);