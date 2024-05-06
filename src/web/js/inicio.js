let idP;

const tabla = document.getElementById("tabla");
const alertas = document.getElementById("alertas");
const inputID = document.getElementById("inputID");
const inputCantidad = document.getElementById("inputCantidad");
const inputCliente = document.getElementById("inputCliente");

API = "http://localhost:3100/";


async function mostrarTodo() {
    const res = await fetch(API+"ticket/");
    if(res.ok)
    {
        const resJson = await res.json();
        limpiarTabla(tabla);
        resJson.forEach(producto => {
            const fila = agregarTabla(producto);
            tabla.appendChild(fila);
        });
        console.log(resJson);
        obtenerTotal();
    }
    else{
        console.log("No hay productos");
    }
};

async function subirVenta() {
    const resV = await fetch(API+"subirVenta/");
    if(resV.ok)
    {
        inputCliente.value = '';
        inputCantidad.value = 1;
        inputID.value = '';
        document.getElementById("Total").textContent = 0;
        crearAlerta("success","Venta Exitosa");
        mostrarTodo();
    }
    else{
        crearAlerta("danger","No se pudo realizar la venta");
    }
    
};

async function obtenerTotal() {
    const res = await fetch(API+"Total/");
    if(res.ok)
    {
        const resJson = await res.json();
        if(resJson[0].Total == null){
                document.getElementById("Total").textContent = 0;
        }
        else {
            document.getElementById("Total").textContent = resJson[0].Total;
        }
    }
    else{
        console.log("No hay productos");
    }
};



async function borrarProducto() {
    idP = this.getAttribute('borrar-id');
    const res = await fetch(API+"productoTicket/"+idP, {
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


    const thProducto = document.createElement("td");
    thProducto.textContent = producto.Producto;
    tr.appendChild(thProducto);

    const thCantidad = document.createElement("td");
    thCantidad.textContent = producto.Cantidad;
    tr.appendChild(thCantidad);

    const thPrecio = document.createElement("td");
    thPrecio.textContent = producto.Precio;
    tr.appendChild(thPrecio);

    const thMonto = document.createElement("td");
    thMonto.textContent = producto.Monto;
    tr.appendChild(thMonto);

    const iconoEliminar = document.createElement("i");
    iconoEliminar.classList.add("fa-solid", "fa-trash");
    const botonEliminar = document.createElement("button");
    botonEliminar.classList.add("boton-icono");
    botonEliminar.setAttribute("borrar-id",producto.IdVenta);
    botonEliminar.onclick = borrarProducto;
    botonEliminar.appendChild(iconoEliminar);
    divBotones.appendChild(botonEliminar);
    tr.appendChild(divBotones);

    return tr;

}

function limpiarTabla(tabla) {
    const filas = tabla.querySelectorAll("tr");
    filas.forEach(fila => {
        fila.remove();
    });
}

async function agregarAVenta(){
    limpiarTabla(tabla);
    const res = await fetch(API+"ventaTicket/",{
        method : "POST",
        headers : {
            "Content-Type" : "application/json"
        },
        body : JSON.stringify({
            Producto : inputID.value,
            Cantidad : inputCantidad.value,
        })
    });
    if(res.ok)
    {
        const resJson = await res.json();
        console.log(resJson);
        crearAlerta("success","Producto agregado");
        inputID.value = '';
        inputCantidad.value = 1;
    } else {
        crearAlerta("danger","No se pudo agregar el producto. Verifique los datos");
    }
    mostrarTodo();
};

async function subirTicket(){
    const res = await fetch(API+"subirTicket/",{
        method : "POST",
        headers : {
            "Content-Type" : "application/json"
        },
        body : JSON.stringify({
            Cliente : inputCliente.value
        })
    });
    if(res.ok)
    {
        const resJson = await res.json();
        console.log(resJson);
        inputCliente.value = '';
        crearAlerta("success","Venta Exitosa");
        mostrarTodo();

    } else {
        crearAlerta("danger","La venta no se pudo realizar. Verifique los datos");
    }
};

function habilitarElementos() {
    let elementos = document.querySelectorAll('extra');
    elementos.forEach(function(elemento) {
        elemento.removeAttribute('disabbleb');
    })
}
