import { getConnection } from "../database/connection.js";
import sql from 'mssql';


//Este es un ejemplo de vista
export const getVentasVista =  async (req, res) => {
    try {
        const pool = await getConnection();
    const result = await pool.request().query('select * from DetalleVenta');
    res.json(result.recordset);
    }catch(error) {
        console.error("Error:", error.message);
    }
}

//Ejemplo de vista para obtener un elemento de una vista por ID de Cliente
export const getClienteVista = async (req, res) => {
    try{const pool = await getConnection();
    const result = await pool.request()
    .input('id',sql.Int, req.params.id)
    .query("select * from DetalleVenta where IdCliente = @id") 

    
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

//Ejemplo de vista para obtener un elemento de una vista por ID de Venta
export const getVentaVista = async (req, res) => {
    try{const pool = await getConnection();
    const result = await pool.request()
    .input('id',sql.Int, req.params.id)
    .query("select * from DetalleVenta where IdDetalleVenta = @id") 

    if (result.rowsAffected[0] === 0)
    {
        return res.status(404).json({message: "Venta not found"})
    }
    return res.json(result.recordset[0]);
    }
    catch(error)
    { 
        console.error("Error:", error.message);
        return res.status(404).json({message : error.message})
    }
};