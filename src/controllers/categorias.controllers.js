import { getConnection } from "../database/connection.js";
import sql from 'mssql';

export const getCategorias =  async (req, res) => {
    try{
        const pool = await getConnection();
    const result = await pool.request().query('select * from Categorias');
    res.json(result.recordset);
    }catch(error)
    {
        console.error("Error:", error.message);
        return res.status(404).json({message : error.message})
    }
}
