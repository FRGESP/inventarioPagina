create database Tienda;
go
use Tienda;
go
--CREACION DE LAS TABLAS--
create table Proveedores(
IdProveedor int not null identity primary key,
Proveedor varchar(50) not null,
Telefono varchar(10) not null
);

CREATE table Categorias(
IdCategoria int not null identity primary key,
Categoria varchar(50) not null
);

create table Productos(
IdProducto int not null identity primary key,
Nombre varchar(50) not null,
IdCategoria int foreign key references Categorias(idCategoria) on delete cascade,
PrecioCompra money not null check(PrecioCompra>=0),
PrecioVenta money not null check(PrecioVenta>=0),
Stock int default 0 not null check(Stock>=0),
IdProveedor int foreign key references Proveedores(IdProveedor)
);

create table Personas(
IdPersona int not null identity primary key,
Nombre varchar(50) not null,
Apellidos varchar(100) not null,
Direccion varchar(50) not null,
Cuenta varchar(20),
Telefono varchar(10) not null
);

create table Clientes(
IdCliente int not null identity primary key,
IdPersona int foreign key references Personas(IdPersona) on delete cascade
);



create table Empleados(
IdEmpleado int not null identity primary key,
IdPersona int foreign key references Personas(IdPersona) on delete cascade,
Sueldo money not null,
Estatus varchar(50) check(Estatus IN('Empleado','Despedido','Ausente'))
);

create table Ventas(
IdVenta int not null identity primary key,
IdProducto int foreign key references Productos(IdProducto) on delete cascade,
Cantidad int not null,
Precio int not null,
Ticket int not null,
Monto money not null
);

create table DetalleVenta(
IdDetalleVenta int not null identity primary key,
Cantidad smallint not null,
Total money not null check(Total>=0),
Fecha date not null,
IdCliente int not null foreign key references Clientes(IdCliente) on delete cascade
);


create table Devoluciones(
IdDevolucion int not null identity primary key,
IdDetalleVenta int foreign key references DetalleVenta(IdDetalleVenta) on delete cascade,
Fecha date not null
);

--SELECCION DE TABLAS--
select * from Categorias
select * from Clientes
select * from DetalleVenta
select * from Devoluciones
select * from Empleados
select * from Personas
select * from Productos
select * from Proveedores
select * from Ventas
go

-----------------------------------------------STOCK PROCEDURES----------------------------------------------

-- PROCEDURE PARA AGREGAR CATEGORIAS
CREATE PROCEDURE sp_insertCategoria(
    @categoria varchar(50)
)
AS
BEGIN
    INSERT into Categorias VALUES (UPPER(@categoria))
END
GO

-- PROCEDURE PARA AGREGAR PROVEEDORES
CREATE PROCEDURE sp_insertProveedor(
    @proveedor varchar(50),
    @telefono varchar(10)
)
AS
BEGIN
    INSERT into Proveedores VALUES(UPPER(@proveedor),@telefono)
END
GO

CREATE PROCEDURE sp_borrarProducto(
	@id int
)
AS
BEGIN
	DELETE FROM Productos where IdProducto = @id;
END
GO

CREATE PROCEDURE sp_borrarCategoria(
	@id int
)
as
BEGIN 
	DELETE FROM Categorias where IdCategoria = @id;
END
GO

CREATE PROCEDURE sp_borrarPersona(
	@id int
)
as
BEGIN 
	DELETE FROM Personas where IdPersona = @id;
END
go

CREATE PROCEDURE sp_borrarProductoTicket(
	@id int
)
AS
BEGIN
	DELETE FROM Ventas where IdVenta = @id;
END
GO


-- PROCEDURE PARA AGREGAR PERSONAS
CREATE PROCEDURE sp_insertPersonas(
    @persona varchar(50),
	@apellido varchar(100),
	@direccion varchar(50),
	@cuenta varchar,
    @telefono varchar(10)
)
AS
BEGIN
    INSERT into Personas VALUES(UPPER(@persona),UPPER(@apellido),@direccion,@cuenta,@telefono)
END
GO


CREATE PROCEDURE sp_updPersonas(
    @idpersona INT,
	@persona varchar(50),
	@apellido varchar(100),
	@direccion varchar(50),
	@cuenta varchar,
    @telefono varchar(10)
)
AS
BEGIN
    update Personas set Nombre=UPPER(@persona), Apellidos=UPPER(@apellido), Direccion=UPPER(@apellido
	), Cuenta=@cuenta, Telefono=@telefono WHERE IdPersona=@idpersona
END
GO



-- PROCEDURE PARA AGREGAR PRODUCTOS
CREATE PROCEDURE sp_insertProducto(
    @producto varchar(50),
    @idCategoria int,
	@precioCompra money,
    @precioVenta money,
    @stock int,
	@idProveedor int
)
AS
BEGIN
    INSERT into Productos VALUES(UPPER(@producto),@idCategoria,@precioCompra,@precioVenta,@stock,@idProveedor)
END
GO
--PROCEDURE PARA CLIENTES
CREATE PROCEDURE sp_insertClientes(
	@idPersona INT
)
AS
BEGIN
    INSERT into Clientes VALUES(@idPersona)
END
GO
--PROCEDURE PARA EMPLEADOS
CREATE PROCEDURE sp_inserteEmpleados(
	@idPersona int,
	@Sueldo money,
	@Estatus VARCHAR(50)
)
AS
BEGIN
    INSERT INTO Empleados VALUES(@idPersona, @Sueldo, @Estatus)
END
GO

-----------------------------------------------FUNCIONES---------------------------------------------------------

--FUNCION PARA APLICAR DESCUENTO MEDIANTE LA CANTIDAD
CREATE OR ALTER FUNCTION DescuentoCantidad(@Producto varchar(50), @Cantidad int)
RETURNS varchar(255)
AS
BEGIN
	declare @result varchar(255);
	declare @nombreProducto varchar(100);
	SET @nombreProducto = (Select Nombre FROM Productos WHERE Nombre LIKE '%'+@Producto+'%');									
	IF @nombreProducto IS NOT NULL
		BEGIN
		    declare @precioDescuento float
			IF @Cantidad>=10
			BEGIN
			set @precioDescuento =(Select PrecioVenta-(PrecioVenta*25/100) from Productos where Nombre=@nombreProducto);
			END
			ELSE
			IF @Cantidad>=5
			BEGIN
			set @precioDescuento =(Select PrecioVenta-(PrecioVenta*10/100) from Productos where Nombre=@nombreProducto);
		    END
			ELSE
			IF @Cantidad>=3
			BEGIN
			set @precioDescuento =(Select PrecioVenta-(PrecioVenta*5/100) from Productos where Nombre=@nombreProducto);
			END
			ELSE
			set @precioDescuento =(Select PrecioVenta from Productos where Nombre=@nombreProducto);
		SET @result = 'EL PRODUCTO: '+@nombreProducto+' CON DESCUENTO TENDRA UN COSTO DE: '+CAST(@precioDescuento as varchar(50))+' PESOS';
		END
	ELSE
		SET @result = 'NO SE HA ENCONTRADO EL PRODUCTO';
	RETURN @result
END
GO

create function obtenerTicket()
 returns int
 as
 begin
	declare @ID int;
	set @ID = (SELECT IDENT_CURRENT('DetalleVenta')+1);
	return @ID;
end
go

create function sumasVenta()
returns int 
as
begin 
	declare @Total int
	set @Total = (select SUM(Monto) from Ventas where Ticket = dbo.obtenerTicket()); 
	return @Total
end
go
-----------------------------------------------TRIGGERS----------------------------------------------------------

CREATE TABLE RegistroProducto(
	idAproducto INT IDENTITY PRIMARY KEY,
	idProducto INT,
	Fecha DATE,
	Accion VARCHAR(25),
	Usuario VARCHAR(25),
)
GO

CREATE TABLE RegistroPrecioProducto(
	idAproducto INT IDENTITY PRIMARY KEY,
	idProducto INT FOREIGN KEY REFERENCES Productos(IdProducto) on delete cascade,
	Fecha DATE,
	Accion VARCHAR(25),
	Usuario VARCHAR(25),
	PrecioCompraAnterior MONEY,
	PrecioCompraActual MONEY,
	PrecioVentaAnterior MONEY,
	PrecioVentaActual MONEY
)
GO
 
--Insert--
CREATE TRIGGER TR_InsertProducto
ON Productos
FOR INSERT
AS
SET NOCOUNT ON;
DECLARE @idProducto INT
SELECT @idProducto=idProducto FROM inserted
INSERT INTO RegistroProducto VALUES(@idProducto,GETDATE(),'Insert',SYSTEM_USER)
GO

--Delete--
CREATE TRIGGER TR_DeleteProducto
ON Productos
FOR DELETE
AS
SET NOCOUNT ON;
DECLARE @idProducto INT
SELECT @idProducto=idProducto FROM deleted
INSERT INTO RegistroProducto VALUES(@idProducto,GETDATE(),'Delete',SYSTEM_USER)
GO

CREATE TRIGGER TR_DeletedProductTicket
ON Ventas
FOR DELETE
AS
SET NOCOUNT ON;
DECLARE @IdProducto INT, @Cantidad INT
select @Cantidad = Cantidad from deleted;
select @IdProducto = IdProducto from deleted;
update Productos set Productos.Stock = Productos.Stock+@Cantidad where Productos.IdProducto = @IdProducto;
go


--Update--
CREATE TRIGGER TR_UpdateProducto
ON Productos
FOR UPDATE
AS
SET NOCOUNT ON;
DECLARE @idProducto INT
SELECT @idProducto=idProducto FROM inserted
INSERT INTO RegistroProducto VALUES(@idProducto,GETDATE(),'Update',SYSTEM_USER)
GO

--Update Stock--
CREATE TRIGGER TR_UpdateInventarioProductos 
ON Ventas
FOR INSERT 
AS
SET NOCOUNT ON;

UPDATE Productos SET Productos.Stock=Productos.Stock-inserted.Cantidad FROM inserted
INNER JOIN Productos ON Productos.idProducto=inserted.idProducto
GO

--Update Precio--
CREATE TRIGGER TR_UpdatePrecio
ON Productos
AFTER UPDATE
AS
SET NOCOUNT ON;
DECLARE @idProducto INT
DECLARE @PrecioCompraAnterior MONEY
DECLARE @PrecioCompraActual MONEY
DECLARE @PrecioVentaAnterior MONEY
DECLARE @PrecioVentaActual MONEY
SELECT @idProducto=idProducto FROM inserted
SELECT @PrecioCompraAnterior=PrecioCompra FROM deleted
SELECT @PrecioCompraActual=PrecioCompra FROM inserted
SELECT @PrecioVentaAnterior=PrecioVenta FROM deleted
SELECT @PrecioVentaActual=PrecioVenta FROM inserted
INSERT INTO RegistroPrecioProducto VALUES(@idProducto,GETDATE(),'Update',SYSTEM_USER,@PrecioCompraAnterior,
	@PrecioCompraActual,@PrecioVentaAnterior,@PrecioVentaActual)
GO

EXEC sp_insertCategoria 'Bebidas'
EXEC sp_insertCategoria 'Comida'
EXEC sp_insertProveedor 'Pepsi','8009016200';
EXEC sp_insertProveedor 'Sabritas','4545454545454';
EXEC sp_insertProducto 'Pepsi 600 ml',1,14,16,100,1;
EXEC sp_insertProducto 'Doritos Nacho',2,10,14,250,2;
EXEC sp_insertProducto 'Pan Dulce',2,9,12,15,2;

EXEC sp_insertPersonas 'Juan','Pérez','Calle Guadalupe 54','454545','4545454545454'
EXEC sp_insertClientes 1

go
CREATE PROCEDURE sp_Ventas(
	@IdProducto int,
	@Cantidad smallint
)
AS
BEGIN
	
	declare @Monto money, @NumTicket int, @Precio money;
	set @Precio = (select PrecioVenta from Productos where IdProducto = @IdProducto)
	select @Monto = @Cantidad*@Precio;
	set @NumTicket = (SELECT IDENT_CURRENT('DetalleVenta')+1);

	insert into Ventas values (@IdProducto,@Cantidad,@Precio,@NumTicket,@Monto);

END
go

Create Procedure sp_DetalleVenta (@IdCliente int)
as
begin
	
	declare @CantidadTotal int, @Total money, @Id int;
	set @Id = (SELECT IDENT_CURRENT('DetalleVenta')+1);
	set @CantidadTotal = (select SUM(Cantidad) from Ventas where Ticket = @Id);
	set @Total = (select SUM(Monto) from Ventas where Ticket = @Id)
	insert into DetalleVenta values (@CantidadTotal,@Total,GETDATE(),@IdCliente)
end;
go


select * from DetalleVenta

/*

EXEC sp_Ventas 20, 2

EXEC sp_DetalleVenta 1*/

-------------------------------------VISTAS--------------------------------------------------------------------
GO
CREATE VIEW ProductosVista 
AS
	SELECT p.IdProducto ,p.Nombre,c.Categoria, p.PrecioCompra, p.PrecioVenta, p.Stock, pr.Proveedor from Productos AS p INNER JOIN Categorias AS c
	ON p.IdCategoria=c.IdCategoria 
	INNER JOIN Proveedores AS pr 
	ON p.IdProveedor=pr.IdProveedor

GO

CREATE VIEW NombresProveedores
as
 select IdProveedor as Id, Proveedor as Nombre from Proveedores;
go

CREATE VIEW NombresCategorias
as
 select IdCategoria as Id, Categoria as Nombre from Categorias;
go

CREATE VIEW vistaTicket
as
	select v.IdVenta ,p.Nombre as Producto, v.Cantidad, v.Precio,v.Monto  from Ventas as v INNER JOIN Productos as p ON v.IdProducto = p.IdProducto where v.Ticket = dbo.obtenerTicket();
go


select dbo.sumasVenta() as Total
-------------------------------------TRANSACCIONES-------------------------------------------------------------------
