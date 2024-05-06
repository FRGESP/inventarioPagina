import { getConnection } from "../database/connection.js";
import sql from 'mssql';

//Aqui se va a mostrar todas las columnas de la tabla

export const getPersonas =  async (req, res) => {
    const pool = await getConnection();
    const result = await pool.request().query('select * from Personas');
    res.json(result.recordset);
}

//Aqui se va a obtener un solo elemento por su ID
export const getPersona = async (req, res) => {
    try{const pool = await getConnection();
    const result = await pool.request()
    .input('id',sql.Int, req.params.id)
    .query("select * from Personas where IdPersona = @id") 

    if (result.rowsAffected[0] === 0)
    {
        return res.status(404).json({message: "subject not found"})
        
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
export const createProduct = async (req, res) => {
    try {
        console.log(req.body);
        const pool = await getConnection();
        const result = await pool.request()
        .input('Nombre',sql.VarChar,req.body.Nombre)
        .input('IdCategoria',sql.Int,req.body.IdCategoria)
        .input('PrecioCompra',sql.Money,req.body.PrecioCompra)
        .input('PrecioVenta',sql.Money,req.body.PrecioVenta)
        .input('Stock',sql.Int,req.body.Stock)
        .input('IdProveedor',sql.Int,req.body.IdProveedor)
        .query("EXEC sp_insertProducto @Nombre, @IdCategoria, @PrecioCompra,@PrecioVenta,@Stock,@IdProveedor; SELECT IDENT_CURRENT('Productos') as id;");
        console.log(result);
        res.json({
            IdProducto : result.recordset[0].id,
            Nombre : req.body.Nombre,
            IdCategoria : req.body.IdCategoria,
            PrecioCompra : req.body.PrecioCompra,
            PrecioVenta : req.body.PrecioVenta,
            Stock : req.body.Stock,
            IdProveedor : req.body.IdProveedor
        })
    }catch(error){
        console.error("Error:", error.message);
        return res.status(404).json({message : error.message});
    }
};

// Aqui se actualiza los elementos
export const updatePersona= async (req, res) => {
    try
    {
        const pool = await getConnection();
        const result = await pool.request()
        .input('id',sql.Int, req.params.id)
        .input('Nombre',sql.VarChar,req.body.Nombre)
        .input('Apellidos',sql.VarChar,req.body.Apellidos)
        .input('Direccion',sql.VarChar,req.body.Direccion)
        .input('Cuenta',sql.VarChar,req.body.Cuenta)
        .input('Telefono',sql.VarChar,req.body.Telefono)
        .query("exec sp_updPersonas @id, @Nombre, @Apellidos, @Direccion, @Cuenta, @Telefono");
        console.log(result);
        if (result.rowsAffected[0] === 0)
        {
            return res.status(404).json({message: "Subject not found"})
        }
        return res.json({message : "Subject Updated"});
    }
    catch(error)
    {
        console.error("Error:", error.message);
        return res.status(404).json({message : "La Persona no existe"})
    }
    
};

// Aqui se borran los elementos
export const deletePersona = async (req, res) => {
    try
    {
        const pool = await getConnection();

    const result = await pool.request()
    .input('id',sql.Int,req.params.id)
    .query("EXEC sp_borrarPersona @id");

    console.log(result);

    if (result.rowsAffected[0] === 0)
    {
        return res.status(404).json({message: "subject not found"})
    }
    return res.json({message : "subject deleted"});  
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
    .query("select * from ProductosVista where Nombre like '%'+@Nombre+'%'");
    
    

    console.log(result);

    if(result.rowsAffected[0] === 0) {
        return res.status(404).json({message : "Product not found"});
    }
    return res.json(result.recordset);
}

//Este es un ejemplo de vista
export const getProductsVista =  async (req, res) => {
    try {
        const pool = await getConnection();
    const result = await pool.request().query('select * from ProductosVista');
    res.json(result.recordset);
    }catch(error) {
        console.error("Error:", error.message);
    }
}

//Ejemplo de vista para obtener un elemento de una vista por ID
export const getProductVista = async (req, res) => {
    try{const pool = await getConnection();
    const result = await pool.request()
    .input('id',sql.Int, req.params.id)
    .query("select * from ProductosVista where idProducto = @id") 

    if (result.rowsAffected[0] === 0)
    {
        return res.status(404).json({message: "Product not found"})
        
    }
    return res.json(result.recordset[0]);
    }
    catch(error)
    { 
        console.error("Error:", error.message);
        return res.status(404).json({message : error.message})
    }
};

//Se obtienen los nombres de proveedores para la tabla productos
export const getNombresProveedores =  async (req, res) => {
    try {
        const pool = await getConnection();
    const result = await pool.request().query('select * from NombresProveedores');
    res.json(result.recordset);
    }catch(error) {
        console.error("Error:", error.message);
    }
}

//Se obtienen los nombres de las categorias para la tabla productos
export const getNombresCategorias =  async (req, res) => {
    try {
        const pool = await getConnection();
    const result = await pool.request().query('select * from NombresCategorias');
    res.json(result.recordset);
    }catch(error) {
        console.error("Error:", error.message);
    }
}