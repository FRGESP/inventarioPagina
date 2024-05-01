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
    console.log(req.body);
    const pool = await getConnection();
    const result = await pool.request()
    .input('Producto',sql.VarChar,req.body.Producto)
    .input('idCategoria',sql.Int,req.body.idCategoria)
    .input('PrecioCompra',sql.Int,req.body.PrecioCompra)
    .input('PrecioVenta',sql.Int,req.body.PrecioVenta)
    .input('Stock',sql.Int,req.body.Stock)
    .query("insert into Productos values(@Producto, @idCategoria, @PrecioCompra, @PrecioVenta, @Stock); select scope_identity() as id;");
    console.log(result);
    res.json({
        id : result.recordset[0].id,
        Producto : req.body.Producto,
        idCategoria : req.body.idCategoria,
        PrecioCompra : req.body.PrecioCompra,
        PrecioVenta : req.body.PrecioVenta,
        Stock : req.body.Stock
    })
};

export const updateProduct= async (req, res) => {
    const pool = await getConnection();

    const result = await pool.request()
    .input('id',sql.Int,req.params.id)
    .input('Producto',sql.VarChar,req.body.Producto)
    .input('idCategoria',sql.Int,req.body.idCategoria)
    .input('PrecioCompra',sql.Int,req.body.PrecioCompra)
    .input('PrecioVenta',sql.Int,req.body.PrecioVenta)
    .input('Stock',sql.Int,req.body.Stock)
    .query("update Productos set Producto = @Producto,idCategoria = @idCategoria, PrecioCompra = @PrecioCompra, PrecioVenta =  @PrecioVenta, Stock = @Stock where idProducto = @id");
    console.log(result);
    if (result.rowsAffected[0] === 0)
    {
        return res.status(404).json({message: "Product not found"})
    }
    res.json({
        id : req.params.id,
        Producto : req.body.Producto,
        idCategoria : req.body.idCategoria,
        PrecioCompra : req.body.PrecioCompra,
        PrecioVenta : req.body.PrecioVenta,
        Stock : req.body.Stock
    })
};

export const deleteProduct = async (req, res) => {
    const pool = await getConnection();

    const result = await pool.request()
    .input('id',sql.Int,req.params.id)
    .query("delete from Productos where idProducto = @id");

    console.log(result);

    if (result.rowsAffected[0] === 0)
    {
        return res.status(404).json({message: "Product not found"})
    }
    return res.json({message : "Product deleted"});    
};

//Para obtener por nombre

export const getName = async (req,res) => {
    const pool =  await getConnection();

    const result = await pool.request()
    .input('Producto',sql.VarChar,req.body.Producto)
    .query("select * from Productos where Producto like '%'+@Producto+'%'");
    
    

    console.log(result);

    if(result.rowsAffected[0] === 0) {
        return res.status(404).json({message : "Product not found"});
    }
    return res.json(result.recordset);
}