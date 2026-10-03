const RegForm = document.getElementById("new_account");
const RegionSelect = document.getElementById("region");
const ComunaSelect = document.getElementById("comuna");


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
// Al elegir una región, cargar sus comunas
RegionSelect.addEventListener("change", async () => {
    ComunaSelect.innerHTML = '<option value="">Selecciona una comuna</option>';
    if (RegionSelect.value === "") return;

    const resp = await fetch(`/comunas/${RegionSelect.value}`);
    const comunas = await resp.json();
    for (const c of comunas) {
        const opt = document.createElement("option");
        opt.value = c.id;
        opt.textContent = c.nombre;
        ComunaSelect.appendChild(opt);
    }
});

function validReg(){
    
    let isValid = true;
    const Nombre = document.getElementById("full_name")
    const Email = document.getElementById("email")
    const Phone = document.getElementById("telefono")
    //Error nombre
    if (Nombre.value.trim().length < 3) { 
        setError(Nombre); 
        isValid = false; 
    } else setSuccess(Nombre);      
    //Error Correo
    const re = /^(([^<>()[\]\.,;:\s@\"]+(\.[^<>()[\]\.,;:\s@\"]+)*)|(\".+\"))@(([^<>()[\]\.,;:\s@\"]+\.)+[^<>()[\]\.,;:\s@\"]{2,})$/i;
    if (!re.test(Email.value)) { 
        setError(Email); 
        isValid = false; }
    else {
        setSuccess(Email);
    }
    //Error Region
    if (RegionSelect.value === "") { setError(RegionSelect); isValid = false; }
    else setSuccess(RegionSelect);
    //Error Comuna
    if (ComunaSelect.value === "") { setError(ComunaSelect); isValid = false; }
    else setSuccess(ComunaSelect);
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

document.getElementById("submit_btn").addEventListener("click", (event) => {
    event.preventDefault();
    if (!validReg()) return;
    RegForm.submit();   
});