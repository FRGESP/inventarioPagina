let idP;

const magia = document.getElementById("magia");
const tabla = document.getElementById("tabla");
const div = document.getElementById("divVentana");
const alertas = document.getElementById("alertas");
const divCrear = document.getElementById("divCrear");
const inputTicket = document.getElementById("inputBuscar");


API = "http://localhost:3100/";


async function mostrarTodo() {
    const res = await fetch(API+"ticketVista/"+inputTicket.value);
    if(res.ok)
    {
        const resJson = await res.json();
        limpiarTabla(tabla);
        resJson.forEach(producto => {
            const fila = agregarTabla(producto);
            tabla.appendChild(fila);
        });
        console.log(resJson);
    }
    else{
        console.log("No hay registro de ventas");
        limpiarTabla(tabla);
        crearAlerta("danger","Factura no encontrada")
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

function agregarTabla(producto)
{
    const tr = document.createElement("tr");
    const divBotones = document.createElement("div"); 
    tabla.appendChild(tr);

    const thID = document.createElement("th");
    thID.textContent = producto.IdVenta;
    thID.setAttribute("scope","row");
    console.log(producto.IdProducto);
    tr.appendChild(thID);

    const thProducto = document.createElement("td");
    thProducto.textContent = producto.Producto;
    tr.appendChild(thProducto);

    const thIdCategoria = document.createElement("td");
    thIdCategoria.textContent = producto.Cantidad;
    tr.appendChild(thIdCategoria);

    const thPrecioCompra = document.createElement("td");
    thPrecioCompra.textContent = producto.Precio;
    tr.appendChild(thPrecioCompra);

    const ththPreciVenta = document.createElement("td");
    ththPreciVenta.textContent = producto.Monto;
    tr.appendChild(ththPreciVenta);

    return tr;
}

function limpiarTabla(tabla) {
    const filas = tabla.querySelectorAll("tr");
    filas.forEach(fila => {
        fila.remove();
    });
}
