let idP;

const magia = document.getElementById("magia");
const tabla = document.getElementById("tabla");
const div = document.getElementById("divVentana");
const alertas = document.getElementById("alertas");
const divCrear = document.getElementById("divCrear");


API = "http://localhost:3100/";


async function mostrarTodo() {
    const res = await fetch(API+"ventasVista/");
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
        console.log("No hay ventas");
    }
};

async function mostrarPorIdCliente(id) {
    limpiarTabla(tabla);
    const res = await fetch(API+"clientesIDVista/"+id);
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
        console.log("No hay ventas de ese cliente");
        crearAlerta("danger","No hay ventas de ese cliente.");
    }
};


async function mostrarPorIdVenta(ruta,id) {

    limpiarTabla(tabla);
    const res = await fetch(API+ruta+id);
    if(res.ok)
    {
        const resJson = await res.json();
        const fila = agregarTabla(resJson);
        tabla.appendChild(fila);
    }else
    {  
        crearAlerta("danger","La venta no se ha encontrado. Vuelva a intentarlo");
    }
};

async function borrarProducto() {
    idP = this.getAttribute('borrar-id');
    const res = await fetch(API+"productos/"+idP, {
        method : "DELETE",
        headers : {
            "Content-Type" : "application/json"
        }
    });
    if(res.ok)
    {
        mostrarTodo();
        crearAlerta("success","El producto se ha eliminado exitosamente");
    }
} 

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
    thID.textContent = producto.IdDetalleVenta;
    thID.setAttribute("scope","row");
    console.log(producto.IdDetalleVenta);
    tr.appendChild(thID);

    const thProducto = document.createElement("td");
    thProducto.textContent = producto.Cantidad;
    tr.appendChild(thProducto);

    const thIdCategoria = document.createElement("td");
    thIdCategoria.textContent = producto.Total;
    tr.appendChild(thIdCategoria);

    const thPrecioCompra = document.createElement("td");
    thPrecioCompra.textContent = producto.Fecha.substring(0,10);
    tr.appendChild(thPrecioCompra);

    const ththPreciVenta = document.createElement("td");
    ththPreciVenta.textContent = producto.IdCliente;
    tr.appendChild(ththPreciVenta);

    return tr;

}

function limpiarTabla(tabla) {
    const filas = tabla.querySelectorAll("tr");
    filas.forEach(fila => {
        fila.remove();
    });
}

//Seleccion de buscar por ID

function seleccionID()
{
    const eleccion = document.getElementById("selectBuscar").value;
    const input = document.getElementById("inputBuscar").value;
    if(eleccion == "IDVenta") {
        mostrarPorIdVenta("ventasIDVista/",input);
    }
    if(eleccion == "IDCliente") {
        mostrarPorIdCliente(input);
    }
    
}
