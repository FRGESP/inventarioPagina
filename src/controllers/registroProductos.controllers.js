import { getConnection } from "../database/connection.js";
import sql from 'mssql';


//Aqui se obtiene los elementos por nombre

export const getAccion = async (req,res) => {
    const pool =  await getConnection();

    const result = await pool.request()
    .input('Accion',sql.VarChar,req.body.Nombre)
    .query("select * from RegistroProducto where Accion like '%'+@Accion+'%'");
    
    console.log(result);

    if(result.rowsAffected[0] === 0) {
        return res.status(404).json({message : "Registro de Producto not found"});
    }
    return res.json(result.recordset);
}

//Este es un ejemplo de vista
export const getRegistrosVista =  async (req, res) => {
    try {
        const pool = await getConnection();
    const result = await pool.request().query('select * from RegistroProducto');
    res.json(result.recordset);
    }catch(error) {
        console.error("Error:", error.message);
    }
}

//Ejemplo de vista para obtener un elemento de una vista por ID
export const getIDRegistro = async (req, res) => {
    try{const pool = await getConnection();
    const result = await pool.request()
    .input('id',sql.Int, req.params.id)
    .query("select * from RegistroProducto where idAProducto = @id") 

    if (result.rowsAffected[0] === 0)
    {
        return res.status(404).json({message: "Registro de Producto not found"})
        
    }
    return res.json(result.recordset[0]);
    }
    catch(error)
    { 
        console.error("Error:", error.message);
        return res.status(404).json({message : error.message})
    }
};
