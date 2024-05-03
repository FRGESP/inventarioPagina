create database Tienda;
go
use Tienda;
go
--CREACION DE LAS TABLAS--
create table Provedores(
IdProvedor int not null identity primary key,
Provedor varchar(50) not null,
Telefono varchar(10) not null
);

create table Categorias(
IdCategoria int not null identity primary key,
Nombre varchar(50) not null
);

create table Productos(
IdProducto int not null identity primary key,
Nombre varchar(50) not null,
IdCategoria int foreign key references Categorias(idCategoria) on delete set null,
PrecioCompra money not null check(PrecioCompra>=0),
PrecioVenta money not null check(PrecioVenta>=0),
Stock int default 0 not null check(Stock>=0),
IdProvedor int foreign key references Provedores(IdProvedor)
);

create table Personas(
IdPersona int not null identity primary key,
Nombre varchar(50) not null,
Apellidos varchar(100) not null,
Direccion varchar(50) not null,
Cuenta int,
Telefono varchar(10) not null
);

create table Clientes(
IdCliente int not null identity primary key,
IdPersona int foreign key references Personas(IdPersona) on delete set null
);



create table Empleados(
IdEmpleado int not null identity primary key,
IdPersona int foreign key references Personas(IdPersona) on delete set null,
Sueldo money not null,
Estatus varchar(50) check(Estatus IN('Empleado','Despedido','Ausente'))
);

create table Ventas(
IdVenta int not null identity primary key,
IdProducto int foreign key references Productos(IdProducto) on delete set null,
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
IdCliente int foreign key references Clientes(IdCliente) on delete set null
);

create table Temp_Ventas(
    IdCliente int
)
go

create table Devoluciones(
IdDevolucion int not null identity primary key,
IdDetalleVenta int foreign key references DetalleVenta(IdDetalleVenta) on delete set null,
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
select * from Provedores
select * from Ventas
go

-----------------------------------------------STORE PROCEDURES----------------------------------------------

-- PROCEDURE PARA AGREGAR CATEGORIAS
CREATE PROCEDURE sp_insertCategoria(
    @categoria varchar(50)
)
AS
BEGIN
    INSERT into Categorias VALUES (UPPER(@categoria))
END
GO

-- PROCEDURE PARA AGREGAR PROVEDORES
CREATE PROCEDURE sp_insertProvedor(
    @provedor varchar(50),
    @telefono varchar(10)
)
AS
BEGIN
    INSERT into Provedores VALUES(UPPER(@provedor),@telefono)
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

-- PROCEDURE PARA AGREGAR PERSONAS
CREATE PROCEDURE sp_insertPersonas(
    @persona varchar(50),
	@apellido varchar(100),
	@direccion varchar(50),
	@cuenta int,
    @telefono varchar(10)
)
AS
BEGIN
    INSERT into Personas VALUES(UPPER(@persona),UPPER(@apellido),@direccion,@cuenta,@telefono)
END
GO


-- PROCEDURE PARA AGREGAR PRODUCTOS
CREATE PROCEDURE sp_insertProducto(
    @producto varchar(50),
    @idCategoria int,
	@precioCompra money,
    @precioVenta money,
    @stock int,
	@idProvedor int
)
AS
BEGIN
    INSERT into Productos VALUES(UPPER(@producto),@idCategoria,@precioCompra,@precioVenta,@stock,@idProvedor)
END
GO


-----------------------------------------------FUNCIONES----------------------------------------------------------

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
	idProducto INT FOREIGN KEY REFERENCES Productos(IdProducto) on delete set null,
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
EXEC sp_insertProvedor 'Pepsi',8009016200;
EXEC sp_insertProducto 'Pepsi 600 ml',1,14,16,100,1;

go
CREATE PROCEDURE sp_Ventas(
	@IdProducto int,
	@Cantidad smallint,
	@Precio money
)
AS
BEGIN
	
	declare @Monto money, @NumTicket int;
	select @Monto = @Cantidad*@Precio;
	set @NumTicket = (SELECT IDENT_CURRENT('DetalleVenta')+1);

	insert into Ventas values (@IdProducto,@Cantidad,@Precio,@NumTicket,@Monto);

END
go

create Procedure sp_DetalleVenta
as
begin
	
	declare @CantidadTotal int, @Total money, @Id int, @IdCliente int;
	set @Id = (SELECT IDENT_CURRENT('DetalleVenta')+1);
	set @CantidadTotal = (select SUM(Cantidad) from Ventas where Ticket = @Id);
	set @Total = (select SUM(Monto) from Ventas where Ticket = @Id)
	set @IdCliente = (select IdCliente from Temp_Ventas);
	insert into DetalleVenta values (@CantidadTotal,@Total,GETDATE(),@IdCliente)
	DELETE from Temp_Ventas;
end;
go

create Procedure sp_TempVentas(@IdCliente int)
as
begin 
	insert into Temp_Ventas values (@IdCliente)
end;
go

select * from Ventas

/*EXEC sp_TempVentas 1

EXEC sp_Ventas 1, 2, 20

EXEC sp_DetalleVenta */