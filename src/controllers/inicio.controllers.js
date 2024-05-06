import { getConnection } from "../database/connection.js";
import sql from 'mssql';

//Aqui se va a mostrar todas las columnas de la tabla
export const getTicket =  async (req, res) => {
    const pool = await getConnection();
    const result = await pool.request().query('select * from vistaTicket');
    res.json(result.recordset);
}

export const getSuma =  async (req, res) => {
    const pool = await getConnection();
    const result = await pool.request().query('select dbo.sumasVenta() as Total');
    res.json(result.recordset);
}
//Aqui se va a obtener un solo elemento por su ID
export const getVentaTicket = async (req, res) => {
    try{const pool = await getConnection();
    const result = await pool.request()
    .input('id',sql.Int, req.params.id)
    .query("select * from vistaTicket where IdVenta = @id") 

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
};

//Aqui se crean los elementos
export const generarVenta = async (req, res) => {
    try {
        console.log(req.body);
        const pool = await getConnection();
        const result = await pool.request()
        .input('Producto',sql.Int,req.body.Producto)
        .input('Cantidad',sql.Int,req.body.Cantidad)
        .query("EXEC sp_Ventas @Producto, @Cantidad");
        console.log(result);
        return res.json({message : "Venta generada"});
    }catch(error){
        console.error("Error:", error.message);
        return res.status(404).json({message : error.message});
    }
};

export const subirTicket = async (req, res) => {
    try {
        console.log(req.body);
        const pool = await getConnection();
        const result = await pool.request()
        .input('Cliente',sql.Int,req.body.Cliente)
        .query("EXEC sp_DetalleVenta @Cliente;");
        console.log(result);
        return res.json({message : "Cliente subido"});
    }catch(error){
        console.error("Error:", error.message);
        return res.status(404).json({message : error.message});
    }
};



// Aqui se borran los elementos
export const deleteProductTicket = async (req, res) => {
    try
    {
        const pool = await getConnection();

    const result = await pool.request()
    .input('id',sql.Int,req.params.id)
    .query("EXEC sp_borrarProductoTicket @id");

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

