import { getConnection } from "../database/connection.js";
import sql from 'mssql';

//Aqui se va a mostrar todas las columnas de la tabla
export const getRegistrosPrecios =  async (req, res) => {
    const pool = await getConnection();
    const result = await pool.request().query('select idAProducto as ID from RegistroPrecioProducto');
    res.json(result.recordset);
}

//Aqui se va a mostrar todas las columnas de la tabla
export const getRegistrosPreciosProcesados =  async (req, res) => {
    try{const pool = await getConnection();
        const result = await pool.request()
        .input('id',sql.Int, req.params.id)
        .query("EXEC sp_RegistroPrecio @id") 
    
        if (result.rowsAffected[0] === 0)
        {
            return res.status(404).json({message: "Product not found"})
            
        }
        return res.json(result.recordset);
        }
        catch(error)
        { 
            console.error("Error:", error.message);
            return res.status(404).json({message : error.message})
        }
}

export const getRegistrosPreciosPorProducto =  async (req, res) => {
    try{const pool = await getConnection();
        const result = await pool.request()
        .input('id',sql.Int, req.params.id)
        .query("select idAProducto as ID from RegistroPrecioProducto where iDProducto = @id") 
    
        if (result.rowsAffected[0] === 0)
        {
            return res.status(404).json({message: "Product not found"})
            
        }
        return res.json(result.recordset);
        }
        catch(error)
        { 
            console.error("Error:", error.message);
            return res.status(404).json({message : error.message})
        }
}

//Aqui se obtiene los elementos por nombre

export const getNameRP = async (req,res) => {
    const pool =  await getConnection();

    const result = await pool.request()
    .input('Nombre',sql.VarChar,req.body.Nombre)
    .query("select * FROM vistaNombresRegistro where Nombre like '%'+@Nombre+'%'");
    
    

    console.log(result);

    if(result.rowsAffected[0] === 0) {
        return res.status(404).json({message : "Product not found"});
    }
    return res.json(result.recordset);
}
