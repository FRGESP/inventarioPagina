API = "http://localhost:3100/";
const input = document.getElementById("inputBuscar");


async function SacarPDF() {
    const res = await fetch(API + "factura/" + input.value);
    if (res.ok) {
        const blob = await res.blob();
        const url = window.URL.createObjectURL(blob);
        const a = document.createElement('a');
        a.href = url;
        a.download = 'factura.pdf';
        document.body.appendChild(a);
        a.click();
        window.URL.revokeObjectURL(url);
    } else {
        console.log("Hubo un error al obtener el PDF");
    }
};

async function determinarID() {

    const res = await fetch(API+"ventasIDVista/"+input.value);
    if(res.ok)
    {
        SacarPDF();

        crearAlerta("success","Factura Descargada");
    }else
    {  
        crearAlerta("danger","El Ticket no se ha encontrado. Vuelva a intentarlo");
    }
};

function crearAlerta(tipo,texto){
    const divAlerta = document.createElement("div");
    divAlerta.classList.add("alert","alert-dismissible","fade","show");
    divAlerta.classList.add("alert-"+tipo);
    divAlerta.setAttribute("role","alert");
    alertas.appendChild(divAlerta);
    
    divAlerta.textContent = texto;

    const botonCerrar = document.createElement("button");
    botonCerrar.type = "button";
    botonCerrar.classList.add("btn-close");
    botonCerrar.setAttribute("data-bs-dismiss","alert");
    botonCerrar.setAttribute("aria-label","Close");

    divAlerta.appendChild(botonCerrar);
    
    setTimeout(function() {
        divAlerta.remove();
    }, 4000);
}