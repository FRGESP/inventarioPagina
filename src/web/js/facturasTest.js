API = "http://localhost:3100/";
const input = document.getElementById("inputBuscar");


async function SacarPDF() {
    const res = await fetch(API + "factura/" + input.value);
    if (res.ok) {
        const blob = await res.blob();
        const url = window.URL.createObjectURL(blob);
        const a = document.createElement('a');
        a.href = url;
        //Quitar la siguiente Linea
        a.setAttribute("target","_blank")
        // a.download = 'factura.pdf';
        document.body.appendChild(a);
        a.click();
        window.URL.revokeObjectURL(url);
    } else {
        console.log("Hubo un error al obtener el PDF");
    }
};