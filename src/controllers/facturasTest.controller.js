import { getConnection } from "../database/connection.js";
import PDFFocument from 'pdfkit';
import fs from 'fs';

function buildPDF(dataCallback, endCallback,data) {
    const doc = new PDFFocument();

    doc.on('data', dataCallback)
    doc.on('end',endCallback)

    doc.fontSize(30).text("Prueba");
    doc.fontSize(12).text(JSON.stringify(data));
    doc.end();
}

export const getProductsPDF =  async (req, res) => {
        
    const pool = await getConnection();
    const result = await pool.request().query('select * from Productos');
    
    const stream = res.writeHead(200, {
            "Content-Type" : "application/pdf",
            "Content-Disposition" : "attachment; filename=factura.pdf"
        });

        buildPDF((data) => {
        stream.write(data);
       }, () =>{
        stream.end()
       },result)
}

export const getProducts =  async (req, res) => {
    const pool = await getConnection();
    const result = await pool.request().query('select * from Productos');
    res.json(result.recordset);
}

