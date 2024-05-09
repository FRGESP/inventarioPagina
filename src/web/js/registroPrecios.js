let idP;

const magia = document.getElementById("magia");
const tabla = document.getElementById("tabla");
const div = document.getElementById("divVentana");
const alertas = document.getElementById("alertas");
const divCrear = document.getElementById("divCrear");
let IDs = [];


API = "http://localhost:3100/";


async function mostrarTodo() {
    const res = await fetch(API+"registrosPrecios/");
    if(res.ok)
    {
        const resJson = await res.json();
        limpiarTabla(tabla);
        console.log(resJson);
        resJson.forEach(async producto => {
            let num = producto.ID
            await mostrarTodoProcesado("registrosPreciosProcesados/",num)
        });
        
    }
    else{
        console.log("No hay productos");
    }
};

async function mostrarTodoGenec(ruta,rutaProc,valor) {
    const res = await fetch(API+ruta+valor);
    if(res.ok)
    {
        const resJson = await res.json();
        limpiarTabla(tabla);
        console.log(resJson);
        resJson.forEach(async producto => {
            let num = producto.ID
            await mostrarTodoProcesado(rutaProc,num)
        });
        
    }
    else{
        console.log("No hay productos");
        crearAlerta("danger","Verifique los datos")
    }
};

async function mostrarTodoProcesado(ruta,elemento) {
    const res = await fetch(API+ruta+elemento);
    if(res.ok)
    {
        const resJson = await res.json();
        const fila = agregarTabla(resJson[0]);
        tabla.appendChild(fila);
        console.log(resJson);
    }
    else{
        console.log("No hay Elementos");
        crearAlerta("danger","Verifique los datos")
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
        resJson.forEach(async producto => {
            let num = producto.ID
            await mostrarTodoProcesado("registrosPreciosProcesados/",num)
        });
    }else
    {
        console.log("Algo salio mal");
        crearAlerta("danger","Producto no encontrado")
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
    thID.textContent = producto.idAproducto;
    thID.setAttribute("scope","row");
    tr.appendChild(thID);

    const thNombre = document.createElement("td");
    thNombre.textContent = producto.Nombre;
    console.log(producto.Nombre);
    tr.appendChild(thNombre);

    const thIdProdcuto = document.createElement("td");
    thIdProdcuto.textContent = producto.IdProducto;
    console.log(producto.IdProducto);
    tr.appendChild(thIdProdcuto);

    

    const thFecha = document.createElement("td");
    thFecha.textContent = producto.Fecha.substring(0,10);
    console.log(producto.Fecha);
    tr.appendChild(thFecha);

    const thUsuario = document.createElement("td");
    thUsuario.textContent = producto.Usuario;
    console.log(producto.Usuario);
    tr.appendChild(thUsuario);

    const thCampo = document.createElement("td");
    thCampo.textContent = producto.Campo;
    console.log(producto.Campo);
    tr.appendChild(thCampo);

    const thPrecioAnterior = document.createElement("td");
    thPrecioAnterior.textContent = producto.PrecioAnterior;
    console.log(producto.PrecioAnterior);
    tr.appendChild(thPrecioAnterior);

    const thPrecioActual = document.createElement("td");
    thPrecioActual.textContent = producto.PrecioActual;
    console.log(producto.PrecioActual);
    tr.appendChild(thPrecioActual);
    
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
    limpiarTabla(tabla);
    const eleccion = document.getElementById("selectBuscar").value;
    const input = document.getElementById("inputBuscar").value;
    if(eleccion == "Nombre") {
        buscarPorNombre("resgistrosPrecioNombre",input);
    }
    if(eleccion == "IDRegistro") {
        mostrarTodoProcesado("registrosPreciosProcesados/",input)
    }
    if(eleccion == "IDProducto") {
        mostrarTodoGenec("resgistrosPorProducto/","registrosPreciosProcesados/",input);
    }
    
}
