import sql from "mssql"

const dbsettings = {
    user : "sa",
    password : "Password!",
    server : "Localhost",
    database : "Tienda",
    options : {
        encrypt : false,
        trustServerCertificate : true
    } 
};

export const getConnection = async () =>
{
    try{
        const pool = await sql.connect(dbsettings);
        return pool;
    }
    catch(error){
        console.error(error);
    }
}
