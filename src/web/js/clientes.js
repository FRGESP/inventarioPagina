let idP;

const magia = document.getElementById("magia");
const tabla = document.getElementById("tabla");
const div = document.getElementById("divVentana");
const alertas = document.getElementById("alertas");
const divCrear = document.getElementById("divCrear");


API = "http://localhost:3100/";


async function mostrarTodo() {
    const res = await fetch(API+"clientesVista/");
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
        console.log("No hay clientes");
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
        crearAlerta("danger","Cliente no registrado")
    }
};



async function crearCliente(){
    limpiarTabla(tabla);
    const res = await fetch(API+"clientes/",{
        method : "POST",
        headers : {
            "Content-Type" : "application/json"
        },
        body : JSON.stringify({
            IdPersona : document.getElementById("inIdPersonaCr").value,
           
        })
    });
    if(res.ok)
    {
        const resJson = await res.json();
        encontrarPorId("clientes/",resJson.IdCliente);
        console.log(resJson);
        crearAlerta("success","El Cliente se creó correctamente")
    } else {
        crearAlerta("danger","No se pudo agregar al cliente. Verifique los datos");
    }
    
};

async function obtenerProducto() {
    div.innerHTML = '';
    idP = this.getAttribute('editar-id');
    console.log(idP);
    const res = await fetch(API + "productosVista/" + idP);
    if (res.ok) {
        const resJson = await res.json();
        crearFormulario(resJson);
    }
}

async function editarProducto() {
    limpiarTabla(tabla);
    console.log(idP);
    const res = await fetch(API+"Productos/"+idP,{
        method : "PUT",
        headers : {
            "Content-Type" : "application/json"
        },
        body : JSON.stringify({
            Nombre : document.getElementById("inIdPersona").value,
            IdCategoria : document.getElementById("inCategoria").value,
            PrecioCompra : document.getElementById("inPrecioCompra").value,
            PrecioVenta : document.getElementById("inPrecioVenta").value,
            Stock : document.getElementById("inStock").value,
            IdProveedor : document.getElementById("inProveedor").value
        })
    });
    if(res.ok)
    {
        encontrarPorId("productosVista/",idP)
        crearAlerta("success","El producto de ha actualizado con exito");
    } else {
        crearAlerta("danger","Categoria no registrada. Vuelva a intentarlo");
    }
}

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
        crearAlerta("danger","El Cliente no se ha encontrado. Vuelva a intentarlo");
    }
};

async function borrarCliente() {
    idP = this.getAttribute('borrar-id');
    const res = await fetch(API+"clientes/"+idP, {
        method : "DELETE",
        headers : {
            "Content-Type" : "application/json"
        }
    });
    if(res.ok)
    {
        mostrarTodo();
        crearAlerta("success","El Cliente se ha eliminado exitosamente");
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



function crearFormulario(producto)
{
    const form = document.createElement("div");
    const p = document.createElement("p");
    p.textContent = "ID de Cliente: "+producto.IdCliente;
    form.appendChild(p);

    const lbIdPersona = document.createElement("laber");
    lbIdPersona.classList.add("form-labe");
    lbIdPersona.textContent = "Nombre:"
    form.appendChild(lbIdPersona);
    const inIdPersona = document.createElement("input");
    inIdPersona.classList.add("form-control");
    inIdPersona.id = "inIdPersona";
    inIdPersona.value = producto.IdPersona;
    form.appendChild(inIdPersona);

    

    div.appendChild(form);
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
    thID.textContent = producto.IdCliente;
    thID.setAttribute("scope","row");
    console.log(producto.IdCliente);
    tr.appendChild(thID);

    const thProducto = document.createElement("td");
    thProducto.textContent = producto.Nombre;
    tr.appendChild(thProducto);

    

    const botonEditar = document.createElement("button");
    const iconoEditar = document.createElement("i");
    


    const iconoEliminar = document.createElement("i");
    iconoEliminar.classList.add("fa-solid", "fa-trash");
    const botonEliminar = document.createElement("button");
    botonEliminar.classList.add("boton-icono");
    botonEliminar.setAttribute("borrar-id",producto.IdCliente);
    botonEliminar.onclick = borrarCliente;
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

//Seleccion de buscar por ID

function seleccionID()
{
    const eleccion = document.getElementById("selectBuscar").value;
    const input = document.getElementById("inputBuscar").value;
    if(eleccion == "Nombre") {
        buscarPorNombre("clienteNombre",input);
    }
    if(eleccion == "ID") {
        encontrarPorId("clientes/",input);
    }
    
}

function crearFormularioCrearProducto()
{
    divCrear.innerHTML="";
    const form = document.createElement("div");

    const lbIdPersona = document.createElement("laber");
    lbIdPersona.classList.add("form-labe");
    lbIdPersona.textContent = "IdPersona:"
    form.appendChild(lbIdPersona);
    const inIdPersona = document.createElement("input");
    inIdPersona.classList.add("form-control");
    inIdPersona.id = "inIdPersonaCr";
    form.appendChild(inIdPersona);

    
    divCrear.appendChild(form);
}
