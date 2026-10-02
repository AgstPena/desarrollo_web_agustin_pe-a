const RegForm = document.getElementById("new_account");
const Regiones = document.getElementById("Regiones");

const RegionesValidas = new Set(Array.from(Regiones.options).map(opt=>opt.value))

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

function validReg(){
    
    let isValid = true;
    const Nombre = document.getElementById("full_name")
    const Email = document.getElementById("email")
    const Pasword=document.getElementById("psw")
    const Region = document.getElementById("region")
    const Comuna = document.getElementById("comuna")
    const Phone = document.getElementById("telefono")
    //Error nombre
    if(Nombre.value.trim() === '' || Nombre.value.length<3){
        setError(Nombre);
        isValid=false;
    } else {
        setSuccess(Nombre);
    }        
    //Error Correo
    const re = /^(([^<>()[\]\.,;:\s@\"]+(\.[^<>()[\]\.,;:\s@\"]+)*)|(\".+\"))@(([^<>()[\]\.,;:\s@\"]+\.)+[^<>()[\]\.,;:\s@\"]{2,})$/i;
    if(!Email.value.match(re)){
        setError(Email);
        isValid=false;
    }   else {
        setSuccess(Email);
    }
    //Error contraseña
    if(Pasword.value.trim() === ''|| Pasword.value.length<5){
        setError(Pasword)
        isValid=false;
    }else{
        setSuccess(Pasword)
    }
    //Error Region
    if(Region.value.trim()===''|| !RegionesValidas.has(Region.value)){
        setError(Region)
        isValid=false;
    }else{
        setSuccess(Region)
    }
    //Error Comuna
    if(Comuna.value.trim()===''){
        setError(Comuna)
        isValid=false;
    }else{
        setSuccess(Comuna)
    }
    //Error telefono
    const regex = /^\+\d{3}\s?\d{4}\s?\d{4}$/;
    if(!regex.test(Phone.value)){
        setError(Phone)
        isValid=false;
    }else{
        setSuccess(Phone)
    }
    return isValid;
}

const RegButton = document.getElementById("submit_btn");
RegButton.addEventListener("click", async (event) => {
    event.preventDefault();

    if (!validReg()) return;
    alert("Datos publicados")
    RegForm.reset();
});