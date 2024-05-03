import { getConnection } from "../database/connection.js";
import sql from 'mssql';

export const getProducts =  async (req, res) => {
    const pool = await getConnection();
    const result = await pool.request().query('select * from Productos');
    res.json(result.recordset);
}

export const getProduct = async (req, res) => {
    try{const pool = await getConnection();
    const result = await pool.request()
    .input('id',sql.Int, req.params.id)
    .query("select * from Productos where idProducto = @id") 

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
        .input('IdProvedor',sql.Int,req.body.IdProvedor)
        .query("EXEC sp_insertProducto @Nombre, @IdCategoria, @PrecioCompra,@PrecioVenta,@Stock,@IdProvedor; select scope_identity() as id;");
        console.log(result);
        res.json({
            IdProducto : result.recordset[0].id,
            Nombre : req.body.Nombre,
            IdCategoria : req.body.IdCategoria,
            PrecioCompra : req.body.PrecioCompra,
            PrecioVenta : req.body.PrecioVenta,
            Stock : req.body.Stock,
            IdProvedor : req.body.IdProvedor
        })
    }catch(error){
        console.error("Error:", error.message);
        return res.status(404).json({message : error.message});
    }
};

export const updateProduct= async (req, res) => {
    try
    {
        const pool = await getConnection();
        const result = await pool.request()
        .input('id',sql.Int, req.params.id)
        .input('Nombre',sql.VarChar,req.body.Nombre)
        .input('IdCategoria',sql.Int,req.body.IdCategoria)
        .input('PrecioCompra',sql.Money,req.body.PrecioCompra)
        .input('PrecioVenta',sql.Money,req.body.PrecioVenta)
        .input('Stock',sql.Int,req.body.Stock)
        .input('IdProvedor',sql.Int,req.body.IdProvedor)
        .query("update Productos set Nombre = @Nombre,IdCategoria = @IdCategoria, PrecioCompra = @PrecioCompra, PrecioVenta =  @PrecioVenta, Stock = @Stock, IdProvedor = @IdProvedor where IdProducto = @id");
        console.log(result);
        if (result.rowsAffected[0] === 0)
        {
            return res.status(404).json({message: "Product not found"})
        }
        res.json({
            id : req.params.id,
            Nombre : req.body.Nombre,
            IdCategoria : req.body.IdCategoria,
            PrecioCompra : req.body.PrecioCompra,
            PrecioVenta : req.body.PrecioVenta,
            Stock : req.body.Stock,
            IdProvedor : req.body.IdProvedor
        })
    }
    catch(error)
    {
        console.error("Error:", error.message);
        return res.status(404).json({message : "La categoria no está registrada"})
    }
    
};

export const deleteProduct = async (req, res) => {
    try
    {
        const pool = await getConnection();

    const result = await pool.request()
    .input('id',sql.Int,req.params.id)
    .query("EXEC sp_borrarProducto @id");

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

//Para obtener por nombre

export const getName = async (req,res) => {
    const pool =  await getConnection();

    const result = await pool.request()
    .input('Nombre',sql.VarChar,req.body.Nombre)
    .query("select * from Productos where Nombre like '%'+@Nombre+'%'");
    
    

    console.log(result);

    if(result.rowsAffected[0] === 0) {
        return res.status(404).json({message : "Product not found"});
    }
    return res.json(result.recordset);
}