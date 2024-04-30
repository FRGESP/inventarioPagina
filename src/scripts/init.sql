--Creacion de la base de datos
create database Tienda;
go
use Tienda;

-- Creacion de las tablas
create table Categorias(
    idCategoria int not null IDENTITY PRIMARY KEY,
    Categoria varchar(50) not null
)
go

CREATE TABLE Productos(
    idProducto int not null IDENTITY PRIMARY KEY,
    Producto varchar(50) not null,
    idCategoria int FOREIGN KEY REFERENCES Categorias(idCategoria),
    PrecioCompra money not null check(PrecioCompra>=0),
    PrecioVenta money not null CHECK(PrecioVenta>=0),
    Stock int DEFAULT 0 not NULL CHECK(Stock>=0)
)
go

CREATE TABLE Ventas(
    idVenta int not null IDENTITY PRIMARY KEY,
    Monto money not NULL,
    Fecha DATE not null
)
go

CREATE TABLE DetalleVenta(
    idDetalle int not null IDENTITY PRIMARY KEY,
    idVenta int FOREIGN KEY REFERENCES Ventas(idVenta),
    idProducto int FOREIGN KEY REFERENCES Productos(idProducto),
    Cantidad SMALLINT not null,
    Total money not null CHECK(Total>=0)
)
go

create table Temp_Ventas(
    idProducto int,
    cantidad SMALLINT,
    Total money
)
go

-- Primer Procedure para agregar categorias
CREATE PROCEDURE sp_insertCategoria(
    @categoria varchar(50)
)
AS
BEGIN
    INSERT into Categorias VALUES (UPPER(@categoria))
END
go

-- Segundo Procedure para agregar productos
CREATE PROCEDURE sp_insertProducto(
    @producto varchar(50),
    @idCategoria int,
	@precioCompra money,
    @precioVenta money,
    @stock int
)
AS
BEGIN
    INSERT into Productos VALUES(UPPER(@producto),@idCategoria,@precioCompra,@precioVenta,@stock)
   
END
GO

-- Tercer procedure para extraer y guardar los datos de venta 
create PROCEDURE sp_TempVentas(
    @idProducto int,
    @cantidad SMALLINT
)
AS
BEGIN
    DECLARE @Total money
    SELECT @Total=@cantidad*PrecioVenta from Productos where idProducto=@idProducto
    INSERT into Temp_Ventas VALUES(@idProducto,@cantidad,@Total)

END
GO

-- Cuarto procedure para llenar la tabla DetalleVenta
create PROCEDURE sp_DetalleVenta
AS
BEGIN
    DECLARE @idVenta int, @Monto money
    insert into Ventas VALUES((select sum(total) from Temp_Ventas),GETDATE())
    SET @idVenta =(SELECT IDENT_CURRENT('Ventas'))
    insert into DetalleVenta(idProducto,Cantidad,Total)
    SELECT * from Temp_Ventas
    UPDATE DetalleVenta set idVenta=@idVenta where idDetalle=(SELECT IDENT_CURRENT('Ventas'));
	DELETE from Temp_Ventas 
END
go

--Quinto procedure para restar el stock que se vendió
create procedure sp_restarStock
as
begin
	declare @idDetalle int, @idProducto int, @cantidad int,@cantidadActual int

	set @idDetalle=(select IDENT_CURRENT('DetalleVenta'));
	set @idProducto =(select idProducto from DetalleVenta where idDetalle=@idDetalle);
	set @cantidad = (select Cantidad from DetalleVenta where idDetalle = @idDetalle);
	set @cantidadActual = (select Stock from Productos where idProducto = @idProducto)
	update Productos set Stock = @cantidadActual-@cantidad where idProducto=@idProducto;
end;
go

-- Sexto procedure que agrupa funciones anteriores y permite hacer la venta
create procedure sp_RegistrarVenta(
	@idProducto int,
    @cantidad SMALLINT
)
as 
begin
	exec sp_TempVentas @idProducto,@cantidad;
	exec sp_DetalleVenta;
	exec sp_restarStock;
end
go


-- Agreando categorias
EXEC sp_insertCategoria 'Mascotas'
EXEC sp_insertCategoria 'Embutidos'
EXEC sp_insertCategoria 'Bebidas'
EXEC sp_insertCategoria 'Limpieza'
GO

-- Agregando Productos
EXEC sp_insertProducto 'Leche lala 1 lt ',1,22.50,25,100
EXEC sp_insertProducto 'coca-cola 600 ml ',3,15,17.50,50
EXEC sp_insertProducto 'Pepsi 600 ml',3,14,16,100;

EXEC sp_insertProducto 'Agua Bonafont', 1, 10, 11, 500
EXEC sp_insertProducto 'Leche Lala', 1, 15, 20, 300
EXEC sp_insertProducto 'Pan Bimbo Integral', 2, 5, 7, 200
EXEC sp_insertProducto 'Manzanas Fuji', 3, 12, 15, 150
EXEC sp_insertProducto 'Coca-Cola 2L', 1, 7, 9, 250
EXEC sp_insertProducto 'Huevos Blancos', 1, 18, 22, 100
EXEC sp_insertProducto 'Arroz Blanco', 2, 6, 8, 350
EXEC sp_insertProducto 'Atún en lata', 3, 10, 12, 180
EXEC sp_insertProducto 'Yogurt Danone', 1, 7, 9, 280
EXEC sp_insertProducto 'Carne de res', 4, 25, 30, 120
EXEC sp_insertProducto 'Pasta de dientes Colgate', 1, 4, 6, 200
EXEC sp_insertProducto 'Detergente Ace', 2, 8, 10, 300
EXEC sp_insertProducto 'Café Nescafé', 3, 10, 13, 180
EXEC sp_insertProducto 'Jabón Dove', 4, 3, 5, 400
go