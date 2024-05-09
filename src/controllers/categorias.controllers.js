import { getConnection } from "../database/connection.js";
import sql from 'mssql';

//Aqui se va a mostrar todas las columnas de la tabla
export const getCategorias =  async (req, res) => {
    const pool = await getConnection();
    const result = await pool.request().query('select * from Categorias');
    res.json(result.recordset);
}

//Aqui se va a obtener un solo elemento por su ID
export const getCategoria = async (req, res) => {
    try{const pool = await getConnection();
    const result = await pool.request()
    .input('id',sql.Int, req.params.id)
    .query("select * from Categorias where IdCategoria = @id") 

    if (result.rowsAffected[0] === 0)
    {
        return res.status(404).json({message: "Categoria not found"})
        
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
export const createCategoria = async (req, res) => {
    try {
        console.log(req.body);
        const pool = await getConnection();
        const result = await pool.request()
        .input('Categoria',sql.VarChar,req.body.Categoria)
        .query("EXEC sp_insertCategoria @Categoria; SELECT IDENT_CURRENT('Categorias') as id;");
        console.log(result);
        res.json({
            IdCategoria : result.recordset[0].id,
            Categoria : req.body.Categoria,
        })
    }catch(error){
        console.error("Error:", error.message);
        return res.status(404).json({message : error.message});
    }
};

// Aqui se actualiza los elementos
export const updateCategoria= async (req, res) => {
    try
    {
        const pool = await getConnection();
        const result = await pool.request()
        .input('id',sql.Int, req.params.id)
        .input('Categoria',sql.VarChar,req.body.Categoria)
        .query("update Categorias set Categoria = UPPER(@Categoria) where IdCategoria = @id");
        console.log(result);
        if (result.rowsAffected[0] === 0)
        {
            return res.status(404).json({message: "Categoria not found"})
        }
        return res.json({message : "Categoria Updated"});
    }
    catch(error)
    {
        console.error("Error:", error.message);
        return res.status(404).json({message : "Error al actualizar"})
    }
    
};

// Aqui se borran los elementos
export const deleteCategoria = async (req, res) => {
    try
    {
        const pool = await getConnection();

    const result = await pool.request()
    .input('id',sql.Int,req.params.id)
    .query("EXEC sp_borrarCategoria @id");

    console.log(result);

    if (result.rowsAffected[0] === 0)
    {
        return res.status(404).json({message: "Product not found"})
    }
    return res.json({message : "Categoria deleted"});  
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
    .query("select * from Categorias where Categoria like '%'+@Nombre+'%'");
    
    

    console.log(result);

    if(result.rowsAffected[0] === 0) {
        return res.status(404).json({message : "Categoria not found"});
    }
    return res.json(result.recordset);
}

//Ejemplo de vista para obtener un elemento de una vista por ID
export const getCategoriaVista = async (req, res) => {
    try{const pool = await getConnection();
    const result = await pool.request()
    .input('id',sql.Int, req.params.id)
    .query("select * from Categorias where idCategoria = @id") 

    if (result.rowsAffected[0] === 0)
    {
        return res.status(404).json({message: "Categoria not found"})
        
    }
    return res.json(result.recordset[0]);
    }
    catch(error)
    { 
        console.error("Error:", error.message);
        return res.status(404).json({message : error.message})
    }
};
