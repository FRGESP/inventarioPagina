
const magia = document.getElementById("magia");
const tabla = document.getElementById("tabla");
const inputId = document.getElementById("inputId");
const formularioId = document.getElementById("formId");
const errores = document.getElementById("errores");
const formularioNombre = document.getElementById("formNombre");
const inputNombre = document.getElementById("inputNombre");

API = "http://localhost:3100/"

magia.addEventListener("click", async() => {
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
});

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
            Producto : f.target[0].value
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
        alert(await res.text());
    }
});


function agregarTabla(producto)
{
    const tr = document.createElement("tr");
    const th = document.createElement("th");

    tabla.appendChild(tr);

    const thID = document.createElement("th");
    thID.textContent = producto.idProducto;
    console.log(producto.Producto);
    tr.appendChild(thID);

    const thProducto = document.createElement("th");
    thProducto.textContent = producto.Producto;
    tr.appendChild(thProducto);

    const thIdCategoria = document.createElement("th");
    thIdCategoria.textContent = producto.idCategoria;
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

    return tr;

}

function limpiarTabla(tabla) {
    const filas = tabla.querySelectorAll("tr:not(:first-child)");
    filas.forEach(fila => {
        fila.remove();
    });
}