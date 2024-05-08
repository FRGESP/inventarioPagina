API = "http://localhost:3100/";


// async function SacarPDF() {
//     const res = await fetch(API+"productosPDF/");
//     if(res.ok)
//     {
//         console.log("SIUUU")
//     }
//     else{
//         console.log("NOOOO");
//     }
// };

async function SacarPDF() {
    const res = await fetch(API + "productosPDF/");
    if (res.ok) {
        const blob = await res.blob();
        const url = window.URL.createObjectURL(blob);
        const a = document.createElement('a');
        a.href = url;
        a.download = 'factura.pdf';
        document.body.appendChild(a);
        a.click();
        window.URL.revokeObjectURL(url);
    } else {
        console.log("Hubo un error al obtener el PDF");
    }
};