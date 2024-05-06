let idP;

const magia = document.getElementById("magia");
const tabla = document.getElementById("tabla");
const div = document.getElementById("divVentana");
const alertas = document.getElementById("alertas");
const divCrear = document.getElementById("divCrear");


API = "http://localhost:3100/";


async function mostrarTodo() {
    const res = await fetch(API+"personas/");
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

async function obtenerProducto() {
    div.innerHTML = '';
    idP = this.getAttribute('editar-id');
    console.log(idP);
    const res = await fetch(API + "personas/" + idP);
    if (res.ok) {
        const resJson = await res.json();
        crearFormulario(resJson);
    }
}

async function editarProducto() {
    limpiarTabla(tabla);
    console.log(idP);
    const res = await fetch(API+"personas/"+idP,{
        method : "PUT",
        headers : {
            "Content-Type" : "application/json"
        },
        body : JSON.stringify({
            Nombre : document.getElementById("inNombre").value,
            Apellidos : document.getElementById("inApellidos").value,
            Direccion : document.getElementById("inDireccion").value,
            Cuenta : document.getElementById("inCuenta").value,
            Telefono : document.getElementById("inTelefono").value,
           
        })
    });
    if(res.ok)
    {
        encontrarPorId("personas/",idP)
        crearAlerta("success","La persona se ha actualizado con exito");
    } else {
        crearAlerta("danger","Persona no registrada. Vuelva a intentarlo");
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
        crearAlerta("danger","La persona no se ha encontrado. Vuelva a intentarlo");
    }
};

async function borrarProducto() {
    idP = this.getAttribute('borrar-id');
    const res = await fetch(API+"personas/"+idP, {
        method : "DELETE",
        headers : {
            "Content-Type" : "application/json"
        }
    });
    if(res.ok)
    {
        mostrarTodo();
        crearAlerta("success","La persona se ha borrado exitosamente");
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
    p.textContent = "ID de la persona: "+producto.IdPersona;
    form.appendChild(p);

    const lbProducto = document.createElement("laber");
    lbProducto.classList.add("form-labe");
    lbProducto.textContent = "Nombre:"
    form.appendChild(lbProducto);
    const inProducto = document.createElement("input");
    inProducto.classList.add("form-control");
    inProducto.id = "inNombre";
    inProducto.value = producto.Nombre;
    form.appendChild(inProducto);

    

    const lbPrecioC = document.createElement("label");
    lbPrecioC.classList.add("form-labe");
    lbPrecioC.textContent = "Apellidos:"
    form.appendChild(lbPrecioC);
    const inPrecioCompra = document.createElement("input");
    inPrecioCompra.classList.add("form-control");
    inPrecioCompra.id = "inApellidos";
    inPrecioCompra.value = producto.Apellidos;
    form.appendChild(inPrecioCompra);

    const lbPrecioV = document.createElement("label");
    lbPrecioV.classList.add("form-labe");
    lbPrecioV.textContent = "Direccion:"
    form.appendChild(lbPrecioV);
    const inPrecioVenta = document.createElement("input");
    inPrecioVenta.classList.add("form-control");
    inPrecioVenta.id = "inDireccion";
    inPrecioVenta.value = producto.Direccion;
    form.appendChild(inPrecioVenta);

    const lbStock = document.createElement("label");
    lbStock.classList.add("form-labe");
    lbStock.textContent = "Cuenta:"
    form.appendChild(lbStock);
    const inStock = document.createElement("input");
    inStock.classList.add("form-control");
    inStock.id = "inCuenta";
    inStock.value = producto.Cuenta;
    form.appendChild(inStock);

    const lbTelefono = document.createElement("label");
    lbTelefono.classList.add("form-labe");
    lbTelefono.textContent = "Telefono:"
    form.appendChild(lbTelefono);
    const inTelefono = document.createElement("input");
    inTelefono.classList.add("form-control");
    inTelefono.id = "inTelefono";
    inTelefono.value = producto.Telefono;
    form.appendChild(inTelefono);

    

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
    thID.textContent = producto.IdPersona;
    thID.setAttribute("scope","row");
    console.log(producto.IdPersona);
    tr.appendChild(thID);

    const thProducto = document.createElement("td");
    thProducto.textContent = producto.Nombre;
    tr.appendChild(thProducto);

    const thIdCategoria = document.createElement("td");
    thIdCategoria.textContent = producto.Apellidos;
    tr.appendChild(thIdCategoria);

    const thPrecioCompra = document.createElement("td");
    thPrecioCompra.textContent = producto.Direccion;
    tr.appendChild(thPrecioCompra);

    const ththPreciVenta = document.createElement("td");
    ththPreciVenta.textContent = producto.Cuenta;
    tr.appendChild(ththPreciVenta);

    
    const thStock = document.createElement("td");
    thStock.textContent = producto.Telefono;
    tr.appendChild(thStock);

    
    const botonEditar = document.createElement("button");
    const iconoEditar = document.createElement("i");
    

    iconoEditar.classList.add("fa-solid","fa-pen-to-square");
    botonEditar.classList.add("boton-icono");
    botonEditar.onclick = obtenerProducto;
    botonEditar.appendChild(iconoEditar);
    botonEditar.setAttribute('editar-id',producto.IdPersona);
    botonEditar.setAttribute('data-bs-toggle',"modal");
    botonEditar.setAttribute('data-bs-target',"#staticBackdrop");
    divBotones.appendChild(botonEditar);

    const iconoEliminar = document.createElement("i");
    iconoEliminar.classList.add("fa-solid", "fa-trash");
    const botonEliminar = document.createElement("button");
    botonEliminar.classList.add("boton-icono");
    botonEliminar.setAttribute("borrar-id",producto.IdPersona);
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

//Seleccion de buscar por ID

function seleccionID()
{
    const eleccion = document.getElementById("selectBuscar").value;
    const input = document.getElementById("inputBuscar").value;
    if(eleccion == "Nombre") {
        buscarPorNombre("productosNombre",input);
    }
    if(eleccion == "ID") {
        encontrarPorId("productosVista/",input);
    }
    
}

function crearFormularioCrearProducto()
{
    divCrear.innerHTML="";
    const form = document.createElement("div");

    const lbProducto = document.createElement("laber");
    lbProducto.classList.add("form-labe");
    lbProducto.textContent = "Nombre:"
    form.appendChild(lbProducto);
    const inProducto = document.createElement("input");
    inProducto.classList.add("form-control");
    inProducto.id = "inProductoCr";
    form.appendChild(inProducto);

    const lbCategoria = document.createElement("label");
    lbCategoria.classList.add("form-labe");
    lbCategoria.textContent = "Categoria:"
    form.appendChild(lbCategoria);
    const inCategoria = document.createElement("select");
    inCategoria.classList.add("form-select","form-control-sm");
    inCategoria.setAttribute("aria-label","Default select example");
    inCategoria.id = "inCategoriaCr";
    form.appendChild(inCategoria);
    obtenerNombre("nombresCategorias",inCategoria,"");

    const lbPrecioC = document.createElement("label");
    lbPrecioC.classList.add("form-labe");
    lbPrecioC.textContent = "Precio de compra:"
    form.appendChild(lbPrecioC);
    const inPrecioCompra = document.createElement("input");
    inPrecioCompra.classList.add("form-control");
    inPrecioCompra.id = "inPrecioCompraCr";
    form.appendChild(inPrecioCompra);

    const lbPrecioV = document.createElement("label");
    lbPrecioV.classList.add("form-labe");
    lbPrecioV.textContent = "Precio de Venta:"
    form.appendChild(lbPrecioV);
    const inPrecioVenta = document.createElement("input");
    inPrecioVenta.classList.add("form-control");
    inPrecioVenta.id = "inPrecioVentaCr";
    form.appendChild(inPrecioVenta);

    const lbStock = document.createElement("label");
    lbStock.classList.add("form-labe");
    lbStock.textContent = "Stock:"
    form.appendChild(lbStock);
    const inStock = document.createElement("input");
    inStock.classList.add("form-control");
    inStock.id = "inStockCr";
    form.appendChild(inStock);

    const lbProv = document.createElement("label");
    lbProv.classList.add("form-labe");
    lbProv.textContent = "Proveedor:"
    form.appendChild(lbProv);
    const inProvedor = document.createElement("select");
    inProvedor.id = "inProveedorCr";
    inProvedor.classList.add("form-select","form-control-sm");
    inProvedor.setAttribute("aria-label","Default select example");
    form.appendChild(inProvedor);
    obtenerNombre("nombresProveedores",inProvedor,"");

    divCrear.appendChild(form);
}
