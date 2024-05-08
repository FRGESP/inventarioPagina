import { getConnection } from "../database/connection.js";
import PDFFocument from 'pdfkit';
import fs from 'fs';
import sql from 'mssql';


function buildPDF(dataCallback, endCallback,cliente,venta) {
    const doc = new PDFFocument();

    doc.on('data', dataCallback)
    doc.on('end',endCallback)

    doc.fontSize(30).text("Factura de Venta",{
        align : 'center'
    });
    const fecha = venta[0].Fecha;
    doc.fontSize(15).text("Ticket : " + venta[0].Ticket +"\nFecha de compra: " + fecha)
    doc.fontSize(12).text(cliente.Nombre);
    doc.end();
}

export const getFactura = async (req, res) => {
    try{const pool = await getConnection();
    const result = await pool.request()
    .input('id',sql.Int, req.params.id)
    .query("EXEC sp_Factura @id") 

    if (result.rowsAffected[0] === 0)
    {
        return res.status(404).json({message: "Product not found"})
        
    }
       const stream = res.writeHead(200, {
            "Content-Type" : "application/pdf",
            "Content-Disposition" : "attachment; filename=factura.pdf"
        });

        const infoCliente = result.recordsets[1][0];
        const infoVentas = result.recordsets[0];

        buildPDF((data) => {stream.write(data);}, () => {stream.end()},infoCliente,infoVentas)

    // return res.json(result.recordsets[0])
    }
    catch(error)
    { 
        console.error("Error:", error.message);
        return res.status(404).json({message : error.message})
    }
};

export const getProducts =  async (req, res) => {
    const pool = await getConnection();
    const result = await pool.request().query('select * from Productos');
    res.json(result.recordset);
}


export const getProductsPDF =  async (req, res) => {
        
    const pool = await getConnection();
    const result = await pool.request().query('select * from Productos; Select * from Categorias');
    
    // const stream = res.writeHead(200, {
    //         "Content-Type" : "application/pdf",
    //         "Content-Disposition" : "attachment; filename=factura.pdf"
    //     });

    //     buildPDF((data) => {
    //     stream.write(data);
    //    }, () =>{
    //     stream.end()
    //    },result)
    res.json(result.recordsets[1]);res.json(result.recordset);
}
