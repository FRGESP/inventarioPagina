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

async function buscarPorNombre(ruta,nombre){
    limpiarTabla(tabla);
    const res = await fetch(API+ruta,{
        method : "POST",
        headers : {
            "Content-Type" : "application/json"
        },
        body : JSON.stringify({
            Nombre : nombre
        })
    });
    if(res.ok)
    {
        const resJson = await res.json();
        resJson.forEach( producto => {
            const fila = agregarTabla(producto);
            tabla.appendChild(fila);
        })
    }else
    {
        console.log("Algo salio mal");
        crearAlerta("danger","Producto no encontrado")
    }
};



async function crearProducto(){
    limpiarTabla(tabla);
    const res = await fetch(API+"productos/",{
        method : "POST",
        headers : {
            "Content-Type" : "application/json"
        },
        body : JSON.stringify({
            Nombre : document.getElementById("inProductoCr").value,
            IdCategoria : document.getElementById("inCategoriaCr").value,
            PrecioCompra : document.getElementById("inPrecioCompraCr").value,
            PrecioVenta : document.getElementById("inPrecioVentaCr").value,
            Stock : document.getElementById("inStockCr").value,
            IdProveedor : document.getElementById("inProveedorCr").value
        })
    });
    if(res.ok)
    {
        const resJson = await res.json();
        encontrarPorId("productosVista/",resJson.IdProducto);
        console.log(resJson);
        crearAlerta("success","El producto se creó correctamente")
    } else {
        crearAlerta("danger","No se pudo agregar el producto. Verifique los datos");
    }
    
};

async function obtenerTabla() {
    div.innerHTML = '';
    idP = this.getAttribute('editar-id');
    console.log(idP);
    const res = await fetch(API + "devoluciones/" + idP);
    if (res.ok) {

        const resJson = await res.json();
        const p = document.createElement("p");
        p.textContent = "Ticket: "+resJson[0].Ticket;
        div.appendChild(p);
    
        resJson.forEach(producto =>{
            const fila=crearDevolucion(producto)
            div.appendChild(fila)
        })
    }
}

async function DevolucionProducto(Cantidad, id) {
    limpiarTabla(tabla);
    console.log(idP);
    const res = await fetch(API+"devolucion/"+id,{
        method : "PUT",
        headers : {
            "Content-Type" : "application/json"
        },
        body : JSON.stringify({
            "Cantidad": Cantidad
        })
    });
    
}

function DevolucionCp(){
    let elementos= document.querySelectorAll('.inputDevolucion') 
    elementos.forEach(input=>{
        const productoDev = input.getAttribute("Devolucion-id")
        console.log("idventa" +productoDev)
        const cantidadDev = input.value 
        console.log("cantidad" +cantidadDev)
        DevolucionProducto(cantidadDev, productoDev)
        

    })
    encontrarPorId("ventasIDVista/",idP)
}

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


async function encontrarPorId(ruta,id) {

    limpiarTabla(tabla);
    const res = await fetch(API+ruta+id);
    if(res.ok)
    {
        const resJson = await res.json();
        const fila = agregarTabla(resJson);
        tabla.appendChild(fila);
    }else
    {  
        crearAlerta("danger","El producto no se ha encontrado. Vuelva a intentarlo");
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


async function obtenerNombre(ruta,select,actual) {
    const res = await fetch(API+ruta);
    console.log(actual);
    if(res.ok)
    {
        const resJson = await res.json();
        resJson.forEach(elemento => {
            const opcion = document.createElement("option");
            if(elemento.Nombre == actual) {
                opcion.setAttribute("selected","");
            }
            opcion.value = elemento.Id;
            opcion.textContent = elemento.Nombre;
            select.appendChild(opcion);
        });
        console.log(resJson);
    }
    else{
        console.log("No hay productos");
    }
};


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

    const botonEditar = document.createElement("button");
    const iconoEditar = document.createElement("i");
    

    iconoEditar.classList.add("fa-solid","fa-arrow-rotate-left");
    botonEditar.classList.add("boton-icono");
    botonEditar.onclick = obtenerTabla;
    botonEditar.appendChild(iconoEditar);
    botonEditar.setAttribute('editar-id',producto.IdDetalleVenta);
    botonEditar.setAttribute('data-bs-toggle',"modal");
    botonEditar.setAttribute('data-bs-target',"#staticBackdrop");
    divBotones.appendChild(botonEditar);

    tr.appendChild(divBotones);

    return tr;

}
function TablaChiquita(producto){
    const tr = document.createElement("tr");
    const divBotones = document.createElement("div"); 
    tabla.appendChild(tr);

    const thID = document.createElement("th");
    thID.textContent = producto.IdVenta;
    thID.setAttribute("scope","row");
    console.log(producto.IdVenta);
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

    const thtTicket = document.createElement("td");
    thtTicket.textContent = producto.Ticket;
    tr.appendChild(thtTicket);

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
    
    const input = document.getElementById("inputBuscar").value;
     mostrarPorIdVenta("ventasIDVista/",input);
}

function crearDevolucion(producto)
{
    const form = document.createElement("div");
   
    const lbProducto = document.createElement("laber");
    lbProducto.classList.add("form-labe");
    lbProducto.textContent = producto.Producto
    form.appendChild(lbProducto);
    const inProducto = document.createElement("input");
    inProducto.classList.add("form-control","inputDevolucion");
    inProducto.setAttribute('Devolucion-id',producto.IdVenta);
    inProducto.value = producto.Cantidad;
    form.appendChild(inProducto);


    return form
    
}
