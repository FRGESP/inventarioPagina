import { getConnection } from "../database/connection.js";
import sql from 'mssql';

//Aqui se crean los elementos
export const createProveedor = async (req, res) => {
    try {
        console.log(req.body);
        const pool = await getConnection();
        const result = await pool.request()
        .input('Proveedor',sql.VarChar,req.body.Proveedor)
        .input('Telefono',sql.VarChar,req.body.Telefono)
        .query("EXEC sp_insertProveedor @Proveedor, @Telefono; SELECT IDENT_CURRENT('Proveedores') as id;");
        console.log(result);
        res.json({
            IdProveedor : result.recordset[0].id,
            Proveedor : req.body.Proveedor,
            Telefono : req.body.Telefono,
        })
    }catch(error){
        console.error("Error:", error.message);
        return res.status(404).json({message : error.message});
    }
};

// Aqui se actualiza los elementos
export const updateProveedor= async (req, res) => {
    try
    {
        const pool = await getConnection();
        const result = await pool.request()
        .input('id',sql.Int, req.params.id)
        .input('Proveedor',sql.VarChar,req.body.Proveedor)
        .input('Telefono',sql.VarChar,req.body.Telefono)
        .query("update Proveedores set Proveedor = @Proveedor,Telefono = @Telefono where IdProveedor = @id");
        console.log(result);
        if (result.rowsAffected[0] === 0)
        {
            return res.status(404).json({message: "Proveedor not found"})
        }
        return res.json({message : "Proveedor Updated"});
    }
    catch(error)
    {
        console.error("Error:", error.message);
        return res.status(404).json({message : "El proveedor no está registrado"})
    }
    
};

// Aqui se borran los elementos
export const deleteProveedor = async (req, res) => {
    try
    {
        const pool = await getConnection();

    const result = await pool.request()
    .input('id',sql.Int,req.params.id)
    .query("EXEC sp_borrarProveedor @id");

    console.log(result);

    if (result.rowsAffected[0] === 0)
    {
        return res.status(404).json({message: "Proveedor not found"})
    }
    return res.json({message : "Proveedor deleted"});  
    } catch(error)
    {
        console.error("Error:", error.message);
    }
      
};

//Aqui se obtiene los elementos por nombre

export const getProveedorName = async (req,res) => {
    const pool =  await getConnection();

    const result = await pool.request()
    .input('Proveedor',sql.VarChar,req.body.Nombre)
    .query("select * from Proveedores where Proveedor like '%'+@Proveedor+'%'");
    
    console.log(result);

    if(result.rowsAffected[0] === 0) {
        return res.status(404).json({message : "Proveedor not found"});
    }
    return res.json(result.recordset);
}

//Este es un ejemplo de vista
export const getProveedores =  async (req, res) => {
    try {
        const pool = await getConnection();
    const result = await pool.request().query('select * from Proveedores');
    res.json(result.recordset);
    }catch(error) {
        console.error("Error:", error.message);
    }
}

//Ejemplo de vista para obtener un elemento de una vista por ID
export const getProveedor = async (req, res) => {
    try{const pool = await getConnection();
    const result = await pool.request()
    .input('id',sql.Int, req.params.id)
    .query("select * from Proveedores where idProveedor = @id") 

    if (result.rowsAffected[0] === 0)
    {
        return res.status(404).json({message: "Proveedor not found"})
        
    }
    return res.json(result.recordset[0]);
    }
    catch(error)
    { 
        console.error("Error:", error.message);
        return res.status(404).json({message : error.message})
    }
};