use master
GO
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
IdProveedor int foreign key references Proveedores(IdProveedor) on delete cascade
);

create table Personas(
IdPersona int not null identity primary key,
Nombre varchar(50) not null,
Apellidos varchar(100) not null,
Direccion varchar(50) not null,
Cuenta varchar(20) not null,
Telefono varchar(10) not null
);

create table Clientes(
IdCliente int not null identity primary key,
IdPersona int foreign key references Personas(IdPersona) on delete cascade
);


create table Ventas(
IdVenta int not null identity primary key,
IdProducto int foreign key references Productos(IdProducto) on delete cascade,
Cantidad int not null,
Precio int not null,
Ticket int not null,
Monto money not null
);

select * from Ventas

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
select * from Personas
select * from Productos
select * from Proveedores
select * from Ventas
select * from DetalleVenta
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

CREATE PROCEDURE sp_borrarProveedor(
	@id int
)
as
BEGIN
	DELETE FROM Proveedores where IdProveedor = @id;
END
GO

-- PROCEDURE PARA AGREGAR PERSONAS
CREATE PROCEDURE sp_insertPersonas(
    @persona varchar(50),
	@apellido varchar(100),
	@direccion varchar(50),
	@cuenta varchar(20),
    @telefono varchar(10)
)
AS
BEGIN
    INSERT into Personas VALUES(UPPER(@persona),UPPER(@apellido),@direccion,@cuenta,@telefono)
END
GO


create PROCEDURE sp_updPersonas(
    @idpersona INT,
	@persona varchar(50),
	@apellido varchar(100),
	@direccion varchar(50),
	@cuenta varchar,
    @telefono varchar(10)
)
AS
BEGIN
    update Personas set Nombre=UPPER(@persona), Apellidos=UPPER(@apellido), Direccion=UPPER(@direccion
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
create function obtenerTicket()
 returns int
 as
 begin
	declare @ID int;
	set @ID = (SELECT IDENT_CURRENT('DetalleVenta')+1);
	return @ID;
end
go
Create Procedure sp_DetalleVenta (@IdCliente int)
as
begin
	
	declare @CantidadTotal int, @Total money, @Id int;
	

	IF (select SUM(Cantidad) from Ventas where Ticket = 2) IS NULL AND (select dbo.obtenerTicket()) < 3
	BEGIN 
		set @Id = 1;
		set @CantidadTotal = (select SUM(Cantidad) from Ventas where Ticket = @Id);
		set @Total = (select SUM(Monto) from Ventas where Ticket = @Id)
		insert into DetalleVenta values (@CantidadTotal,@Total,GETDATE(),@IdCliente)
	END
	ELSE
	BEGIN 
		set @Id = (SELECT IDENT_CURRENT('DetalleVenta')+1);
		set @CantidadTotal = (select SUM(Cantidad) from Ventas where Ticket = @Id);
		set @Total = (select SUM(Monto) from Ventas where Ticket = @Id)
		insert into DetalleVenta values (@CantidadTotal,@Total,GETDATE(),@IdCliente)
	END
end;
go

CREATE PROCEDURE sp_VentasPrimerVenta(
	@IdProducto int,
	@Cantidad smallint
)
AS
BEGIN
	
	declare @Monto money, @Precio money;
	set @Precio = (select PrecioVenta from Productos where IdProducto = @IdProducto)
	select @Monto = @Cantidad*@Precio;

	insert into Ventas values (@IdProducto,@Cantidad,@Precio,1,@Monto);

END
go

CREATE OR ALTER PROCEDURE sp_RegistroPrecio(@id int)
AS
BEGIN
	declare @PrecioAnCompra money, @PrecioAnVenta money, @PrecioActCompra money, @PrecioActVenta money;
	set @PrecioAnCompra = (select PrecioCompraAnterior from RegistroPrecioProducto where idAproducto = @id);
	set @PrecioAnVenta = (select PrecioVentaAnterior from RegistroPrecioProducto where idAproducto = @id);
	set @PrecioActCompra = (select PrecioCompraActual from RegistroPrecioProducto where idAproducto = @id);
	set @PrecioActVenta = (select PrecioVentaActual from RegistroPrecioProducto where idAproducto = @id);

	IF @PrecioAnCompra = @PrecioActCompra
	BEGIN
		select RP.idAproducto,RP.IdProducto,P.Nombre,RP.Fecha,RP.Usuario,'Precio Venta' as 'Campo',RP.PrecioVentaAnterior as 'PrecioAnterior', RP.PrecioVentaActual as 'PrecioActual'  from RegistroPrecioProducto as RP INNER JOIN Productos as P ON RP.idProducto=P.IdProducto where idAproducto = @id
	END
	ELSE
	BEGIN 
		select RP.idAproducto,RP.IdProducto,P.Nombre,RP.Fecha,RP.Usuario,'Precio Compra' as 'Campo',RP.PrecioCompraAnterior as 'PrecioAnterior', RP.PrecioCompraActual as 'PrecioActual'  from RegistroPrecioProducto as RP INNER JOIN Productos as P ON RP.idProducto=P.IdProducto where idAproducto = @id
	END
END
GO

CREATE OR ALTER PROCEDURE sp_RegistroPrecioProducto(@id int)
AS
BEGIN
	declare @PrecioAnCompra money, @PrecioAnVenta money, @PrecioActCompra money, @PrecioActVenta money;
	set @PrecioAnCompra = (select PrecioCompraAnterior from RegistroPrecioProducto where idAproducto = @id);
	set @PrecioAnVenta = (select PrecioVentaAnterior from RegistroPrecioProducto where idAproducto = @id);
	set @PrecioActCompra = (select PrecioCompraActual from RegistroPrecioProducto where idAproducto = @id);
	set @PrecioActVenta = (select PrecioVentaActual from RegistroPrecioProducto where idAproducto = @id);

	IF @PrecioAnCompra = @PrecioActCompra
	BEGIN
		select RP.idAproducto,RP.IdProducto,P.Nombre,RP.Fecha,RP.Usuario,'Precio Venta' as 'Campo',RP.PrecioVentaAnterior as 'PrecioAnterior', RP.PrecioVentaActual as 'PrecioActual'  from RegistroPrecioProducto as RP INNER JOIN Productos as P ON RP.idProducto=P.IdProducto where RP.idProducto = @id
	END
	ELSE
	BEGIN 
		select RP.idAproducto,RP.IdProducto,P.Nombre,RP.Fecha,RP.Usuario,'Precio Compra' as 'Campo',RP.PrecioCompraAnterior as 'PrecioAnterior', RP.PrecioCompraActual as 'PrecioActual'  from RegistroPrecioProducto as RP INNER JOIN Productos as P ON RP.idProducto=P.IdProducto where RP.idAproducto = @id
	END
END
GO

-----------------------------------------------FUNCIONES---------------------------------------------------------

--FUNCION PARA APLICAR DESCUENTO MEDIANTE LA CANTIDAD

create function sumasVenta()
returns int 
as
begin 
	declare @Total int
	set @Total = (select SUM(Monto) from Ventas where Ticket = dbo.obtenerTicket()); 
	return @Total
end
go
create function sumasPrimerVenta()
returns int 
as
begin 
	declare @Total int
	set @Total = (select SUM(Monto) from Ventas where Ticket = 1); 
	return @Total
end
go

create function sumaDetalleVenta()
returns int
as
begin 
	declare @Total int
	set @Total = (select SUM(Cantidad) from DetalleVenta);
	return @Total;
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
CREATE or ALTER TRIGGER TR_UpdateProducto
ON Productos
FOR UPDATE
AS
SET NOCOUNT ON;
DECLARE @idProducto INT
BEGIN TRY 
	BEGIN TRANSACTION
	SELECT @idProducto=idProducto FROM inserted
	INSERT INTO RegistroProducto VALUES(@idProducto,GETDATE(),'Update',SYSTEM_USER)
	COMMIT
	END TRY
	BEGIN CATCH
		ROLLBACK TRANSACTION
	END CATCH
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

create or alter TRIGGER TR_DevolucionProducto
ON Ventas
after UPDATE 
AS
SET NOCOUNT ON;
DECLARE @Acantidad int, @Bcantidad int, @Idventa INT, @ticket int
SELECT @Acantidad=Cantidad FROM deleted
SELECT @Bcantidad=Cantidad FROM inserted
SELECT @Idventa =IdVenta from inserted
SELECT @ticket = Ticket from inserted
IF @Acantidad >=@Bcantidad
BEGIN
BEGIN TRY 
	BEGIN TRANSACTION
	UPDATE Productos SET Productos.Stock=Productos.Stock+(@Acantidad-@Bcantidad) FROM inserted
    INNER JOIN Productos ON Productos.idProducto=inserted.idProducto
    UPDATE Ventas SET Monto=(@Bcantidad*Precio) where IdVenta=@Idventa
	UPDATE DetalleVenta  SET DetalleVenta.Total=(select sum(Monto) FROM Ventas WHERE Ticket=@ticket) WHERE IdDetalleVenta= @ticket
	COMMIT
	END TRY
	BEGIN CATCH
		ROLLBACK TRANSACTION
	END CATCH
END
GO
--Update Precio--
CREATE OR ALTER TRIGGER TR_UpdatePrecio
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
	IF UPDATE(PrecioCompra) OR UPDATE(PrecioVenta)
	BEGIN 	
		IF @PrecioVentaAnterior != @PrecioVentaActual
		BEGIN
		INSERT INTO RegistroPrecioProducto VALUES(@idProducto,GETDATE(),'Update',SYSTEM_USER,@PrecioCompraAnterior,
			@PrecioCompraAnterior,@PrecioVentaAnterior,@PrecioVentaActual)
		END
		IF @PrecioCompraActual != @PrecioCompraAnterior
		BEGIN
		INSERT INTO RegistroPrecioProducto VALUES(@idProducto,GETDATE(),'Update',SYSTEM_USER,@PrecioCompraAnterior,
			@PrecioCompraActual,@PrecioVentaAnterior,@PrecioVentaAnterior)
		END
	END
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

CREATE or ALTER VIEW vistaNombreCliente
AS
	SELECT c.IdCliente,CONCAT(p.Nombre,' ', p.Apellidos) as Nombre from Clientes as c INNER JOIN Personas as p ON c.IdPersona = p.IdPersona;
go

CREATE VIEW vistaTicketPrimerVenta
as
	select v.IdVenta ,p.Nombre as Producto, v.Cantidad, v.Precio,v.Monto  from Ventas as v INNER JOIN Productos as p ON v.IdProducto = p.IdProducto where v.Ticket = 1;
go

CREATE OR ALTER VIEW vistaTicketProductos
as
	select v.IdVenta ,p.Nombre as Producto, v.Cantidad, v.Precio,v.Monto,v.Ticket  from Ventas as v INNER JOIN Productos as p ON v.IdProducto = p.IdProducto;
go

CREATE VIEW vistaNombresRegistro
AS
 select RP.idAproducto as ID, P.Nombre from RegistroPrecioProducto as RP INNER JOIN Productos as P on RP.idProducto = P.IdProducto;
go

CREATE OR ALTER VIEW facturaClienteDatos
AS
 select c.IdCliente as ID,CONCAT(p.Nombre,' ', p.Apellidos) as 'Nombre', p.Cuenta, p.Direccion, p.Telefono from Personas as p INNER JOIN Clientes as c on p.IdPersona = c.IdPersona
go

SELECT * FROM DetalleVenta

-------------------------------------TRANSACCIONES-------------------------------------------------------------------
go


CREATE OR ALTER PROCEDURE sp_Factura(@id int)
AS
BEGIN
	DECLARE @IdCliente int = (SELECT IdCliente from DetalleVenta where IdDetalleVenta = @id);
	select v.IdVenta, p.IdProducto ,p.Nombre, v.Cantidad, v.Precio, v.Ticket, v.Monto, d.Fecha, d.Total from Ventas as v INNER JOIN DetalleVenta as d on v.Ticket = d.IdDetalleVenta INNER JOIN Productos as p ON v.IdProducto = p.IdProducto where Ticket = @id;
	select * from facturaClienteDatos where ID = @IdCliente;
END