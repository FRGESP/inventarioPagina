
let idP;

const magia = document.getElementById("magia");
const tabla = document.getElementById("tabla");
const inputId = document.getElementById("inputId");
const formularioId = document.getElementById("formId");
const errores = document.getElementById("errores");
const formularioNombre = document.getElementById("formNombre");
const inputNombre = document.getElementById("inputNombre");
const formularioCrear = document.getElementById("formCreate");
const inputIdCategoria = document.getElementById("inputIdCategoria");
const inputPrecioCompra = document.getElementById("inputPrecioCompra");
const inputPrecioVenta = document.getElementById("inputPrecioVenta");
const inputStock = document.getElementById("inputStock");
const botonCrear = document.getElementById("botonCrear");
const div = document.getElementById("divVentana");
const alertas = document.getElementById("alertas");

API = "http://localhost:3100/"

async function mostrarTodo() {
    const res = await fetch(API+"productos/");
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
        console.log("No hay productos");
    }
    tabla.classList.add("table", "table-sm");
};

formularioNombre.addEventListener("submit", async (f) => {
    f.preventDefault();
    limpiarTabla(tabla);
    console.log(inputNombre.value);
    const res = await fetch(API+"productosNombre",{
        method : "POST",
        headers : {
            "Content-Type" : "application/json"
        },
        body : JSON.stringify({
            Nombre : f.target[0].value
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
    }
})

formularioId.addEventListener("submit", async(e) =>{
    e.preventDefault();
    limpiarTabla(tabla);
    console.log(inputId.value);
    const res = await fetch(API+"productos/"+inputId.value);
    if(res.ok)
    {
        const resJson = await res.json();
        const fila = agregarTabla(resJson);
        tabla.appendChild(fila);
        console.log(resJson);
    }else
    {
        crearAlerta("danger","El producto no se ha encontrado. Vuelva a intentarlo");
    }
});

formularioCrear.addEventListener("submit", async(f) =>{
    f.preventDefault();
    limpiarTabla(tabla);
    const res = await fetch(API+"productos/",{
        method : "POST",
        headers : {
            "Content-Type" : "application/json"
        },
        body : JSON.stringify({
            Nombre : f.target[0].value,
            IdCategoria : f.target[1].value,
            PrecioCompra : f.target[2].value,
            PrecioVenta : f.target[3].value,
            Stock : f.target[4].value,
            IdProvedor : f.target[5].value
        })
    });
    if(res.ok)
    {
        const resJson = await res.json();
        const fila = agregarTabla(resJson);
        tabla.appendChild(fila);
        console.log(resJson);
    } else {
        crearAlerta("danger","Algo ha salido mal");
    }
    
});

async function obtenerProducto() {
    div.innerHTML = '';
    idP = this.getAttribute('editar-id');
    console.log(idP);
    const res = await fetch(API + "productos/" + idP);
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
            Nombre : document.getElementById("inProducto").value,
            IdCategoria : document.getElementById("inIdcategoria").value,
            PrecioCompra : document.getElementById("inPrecioCompra").value,
            PrecioVenta : document.getElementById("inPrecioVenta").value,
            Stock : document.getElementById("inStock").value,
            IdProvedor : document.getElementById("inProvedor").value
        })
    });
    if(res.ok)
    {
        const resJson = await res.json();
        const fila = agregarTabla(resJson);
        tabla.appendChild(fila);
        console.log(resJson);
        crearAlerta("success","El producto de ha actualizado con exito");
    } else {
        crearAlerta("danger","Categoria no registrada. Vuelva a intentarlo");
    }
}

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



function crearFormulario(producto)
{
    const form = document.createElement("form");
    const p = document.createElement("p");
    p.textContent = "ID de producto: "+producto.IdProducto;
    form.appendChild(p);

    const inProducto = document.createElement("input");
    inProducto.id = "inProducto";
    inProducto.value = producto.Nombre;
    form.appendChild(inProducto);

    const inIdcategoria = document.createElement("input");
    inIdcategoria.id = "inIdcategoria";
    inIdcategoria.value = producto.IdCategoria;
    form.appendChild(inIdcategoria);

    const inPrecioCompra = document.createElement("input");
    inPrecioCompra.id = "inPrecioCompra";
    inPrecioCompra.value = producto.PrecioCompra;
    form.appendChild(inPrecioCompra);

    const inPrecioVenta = document.createElement("input");
    inPrecioVenta.id = "inPrecioVenta";
    inPrecioVenta.value = producto.PrecioVenta;
    form.appendChild(inPrecioVenta);

    const inStock = document.createElement("input");
    inStock.id = "inStock";
    inStock.value = producto.Stock;
    form.appendChild(inStock);

    const inProvedor = document.createElement("input");
    inProvedor.id = "inProvedor";
    inProvedor.value = producto.IdProvedor;
    form.appendChild(inProvedor);

    div.appendChild(form);
}


function agregarTabla(producto)
{
    const tr = document.createElement("tr");

    tabla.appendChild(tr);

    const thID = document.createElement("th");
    thID.textContent = producto.IdProducto;
    console.log(producto.IdProducto);
    tr.appendChild(thID);

    const thProducto = document.createElement("th");
    thProducto.textContent = producto.Nombre;
    tr.appendChild(thProducto);

    const thIdCategoria = document.createElement("th");
    thIdCategoria.textContent = producto.IdCategoria;
    tr.appendChild(thIdCategoria);

    const thPrecioCompra = document.createElement("th");
    thPrecioCompra.textContent = producto.PrecioCompra;
    tr.appendChild(thPrecioCompra);

    const ththPreciVenta = document.createElement("th");
    ththPreciVenta.textContent = producto.PrecioVenta;
    tr.appendChild(ththPreciVenta);

    
    const thStock = document.createElement("th");
    thStock.textContent = producto.Stock;
    tr.appendChild(thStock);

    const thIdProvedor = document.createElement("th");
    thIdProvedor.textContent = producto.IdProvedor;
    tr.append(thIdProvedor);

    const botonEditar = document.createElement("button");
    const iconoEditar = document.createElement("i");
    
    iconoEditar.classList.add("fa-solid","fa-pen-to-square");
    botonEditar.classList.add("boton-icono");
    botonEditar.onclick = obtenerProducto;
    botonEditar.appendChild(iconoEditar);
    botonEditar.setAttribute('editar-id',producto.IdProducto);
    botonEditar.setAttribute('data-bs-toggle',"modal");
    botonEditar.setAttribute('data-bs-target',"#staticBackdrop");
    tr.appendChild(botonEditar);

    const iconoEliminar = document.createElement("i");
    iconoEliminar.classList.add("fa-solid", "fa-trash");
    const botonEliminar = document.createElement("button");
    botonEliminar.classList.add("boton-icono");
    botonEliminar.setAttribute("borrar-id",producto.IdProducto);
    botonEliminar.onclick = borrarProducto;
    botonEliminar.appendChild(iconoEliminar);
    tr.appendChild(botonEliminar);
    

    return tr;

}

function limpiarTabla(tabla) {
    const filas = tabla.querySelectorAll("tr:not(:first-child)");
    filas.forEach(fila => {
        fila.remove();
    });
}