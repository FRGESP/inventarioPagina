import { getConnection } from "../database/connection.js";
import sql from 'mssql';

//Aqui se va a mostrar todas las columnas de la tabla
export const getClientes =  async (req, res) => {
    const pool = await getConnection();
    const result = await pool.request().query('select * from vistaNombreCliente');
    res.json(result.recordset);
}

//Aqui se va a obtener un solo elemento por su ID
export const getCliente = async (req, res) => {
    try{const pool = await getConnection();
    const result = await pool.request()
    .input('id',sql.Int, req.params.id)
    .query("select * from vistaNombreCliente where IdCliente = @id") 

    if (result.rowsAffected[0] === 0)
    {
        return res.status(404).json({message: "Client not found"})
        
    }
    return res.json(result.recordset[0]);
    }
    catch(error)
    { 
        console.error("Error:", error.message);
        return res.status(404).json({message : error.message})
    }
};

//Aqui se crean los elementos
export const createClient = async (req, res) => {
    try {
        console.log(req.body);
        const pool = await getConnection();
        const result = await pool.request()
        .input('IdPersona',sql.Int,req.body.IdPersona)
        .query("insert into Clientes Values (@IdPersona); SELECT IDENT_CURRENT('Clientes') as id;");
        console.log(result);
        res.json({
            IdCliente : result.recordset[0].id,
            
        })
    }catch(error){
        console.error("Error:", error.message);
        return res.status(404).json({message : error.message});
    }
};

// Aqui se borran los elementos
export const deleteClient = async (req, res) => {
    try
    {
        const pool = await getConnection();

    const result = await pool.request()
    .input('id',sql.Int,req.params.id)
    .query("delete  from Clientes where IdCliente=@id");

    console.log(result);

    if (result.rowsAffected[0] === 0)
    {
        return res.status(404).json({message: "Product not found"})
    }
    return res.json({message : "Product deleted"});  
    } catch(error)
    {
        console.error("Error:", error.message);
    }
      
};

//Aqui se obtiene los elementos por nombre

export const getName = async (req,res) => {
    const pool =  await getConnection();

    const result = await pool.request()
    .input('Nombre',sql.VarChar,req.body.Nombre)
    .query("select * from vistaNombreCliente where Nombre like '%'+@Nombre+'%'");
    
    

    console.log(result);

    if(result.rowsAffected[0] === 0) {
        return res.status(404).json({message : "Product not found"});
    }
    return res.json(result.recordset);
}
