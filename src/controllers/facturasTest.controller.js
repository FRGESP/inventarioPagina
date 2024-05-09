import { getConnection } from "../database/connection.js";
//import PDFFocument from 'pdfkit';
import fs from 'fs';
import sql from 'mssql';
import PDFFocument from "pdfkit-construct";

function buildPDF(dataCallback, endCallback,cliente,venta) {
    try{
        const doc = new PDFFocument();
    const fecha = venta[0].Fecha.toLocaleDateString();

    doc.on('data', dataCallback)
    doc.on('end',endCallback)

   

    doc.setDocumentHeader({
        height: "48%"
    }, () => {


        doc.fontSize(30).text("Factura de Venta",{
            align : 'center'
        });
        doc.moveDown(1);
    
        doc.fontSize(15).text("Ticket : " + venta[0].Ticket +"\nFecha de compra: " + fecha, {
            align : 'right'
        });
        doc.moveDown();
        doc.fontSize(15).text(`ID Cliente:  ${cliente.ID} \nCliente: ${cliente.Nombre} \nDireccion: ${cliente.Direccion} \nTeléfono: ${cliente.Telefono}`);
        doc.moveDown(2);
        doc.fontSize(20).text(`Total de la venta: $${venta[0].Total}`,{align : 'right'})
        doc.moveDown();
        doc.fontSize(20).text("Productos",{
            align : 'center'
        });
        
    });
    doc.addTable([
        {key: "IdProducto", label: "ID",align: "center"},
        {key: "Nombre", label: "Producto",align: "left"},
        {key: "Cantidad", label: "Cantidad",align: "left"},
        {key: "Precio", label: "Precio",align: "left"},
        {key: "Monto", label: "Monto",align: "left"},
    ], venta,
    {
        border: null,
        width: "fill_body",
        striped: true,
        stripedColors: ["#ffffff", "#f2f2f2"],
        cellsPadding: 10,
        marginLeft: 45,
        marginRight: 45,
        headAlign: 'center',
        headBackground : "#9e9e9e"
    });

    doc.render();
    doc.end();
    }
    catch(error) {
        console.log(error);
    }
    
}

export const getFactura = async (req, res) => {
    try{const pool = await getConnection();
    const result = await pool.request()
    .input('id',sql.Int, req.params.id)
    .query("EXEC sp_Factura @id") 

    if (result.recordsets === 0)
    {
        return res.status(404).json({message: "Product not found"})
        
    }else {
        const infoCliente = result.recordsets[1][0];
        const infoVentas = result.recordsets[0];
        const stream = res.writeHead(200, {
            "Content-Type" : "application/pdf",
            "Content-Disposition" : "attachment; filename=factura.pdf"
        });
        buildPDF((data) => {stream.write(data);}, () => {stream.end()},infoCliente,infoVentas)

    }
    
    }
    catch(error)
    { 
        console.error("Error:", error.message);
        return res.status(404).json({message : error.message})
    }
};

export const getTicketFact = async (req, res) => {
    try{const pool = await getConnection();
    const result = await pool.request()
    .input('id',sql.Int, req.params.id)
    .query("select * from DetalleVenta where IdDetalleVenta = @id") 

    
    if (result.rowsAffected[0] === 0)
        {
            return res.status(404).json({message: "Venta not found"})
        }
        return res.json(result.recordset);
        }
        catch(error)
        { 
            console.error("Error:", error.message);
            return res.status(404).json({message : error.message})
        }
    
};
