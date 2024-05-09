import { getConnection } from "../database/connection.js";
import sql from 'mssql';

//Vista para obtener un elemento de una vista por ID
export const getProductosTicket = async (req, res) => {
    try{const pool = await getConnection();
    const result = await pool.request()
    .input('id',sql.Int, req.params.id)
    .query("select * from vistaTicketProductos where Ticket = @id") 

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
