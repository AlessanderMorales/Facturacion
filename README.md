Facturas
##Conexion a la BD

CREATE DATABASE db_facturacion; USE db_facturacion;

CREATE TABLE Cliente ( id INT AUTO_INCREMENT PRIMARY KEY, nombre VARCHAR(100), correo VARCHAR(100) );

CREATE TABLE Producto ( id INT AUTO_INCREMENT PRIMARY KEY, nombre VARCHAR(100), precio DECIMAL(10,2), stock INT );

CREATE TABLE Venta ( id INT AUTO_INCREMENT PRIMARY KEY, cliente_id INT, total DECIMAL(10,2), qr VARCHAR(255), fecha DATETIME DEFAULT CURRENT_TIMESTAMP, FOREIGN KEY (cliente_id) REFERENCES Cliente(id) );

CREATE TABLE ItemVenta ( id INT AUTO_INCREMENT PRIMARY KEY, venta_id INT, producto_id INT, cantidad INT, subtotal DECIMAL(10,2), FOREIGN KEY (venta_id) REFERENCES Venta(id), FOREIGN KEY (producto_id) REFERENCES Producto(id) );

CREATE TABLE Pago ( id INT AUTO_INCREMENT PRIMARY KEY, venta_id INT, metodo VARCHAR(50), monto DECIMAL(10,2), FOREIGN KEY (venta_id) REFERENCES Venta(id) );

ALTER TABLE Producto ADD COLUMN codigo VARCHAR(20) UNIQUE AFTER id;

USE db_facturacion;

-- ==================== -- CLIENTES (10 registros) -- ==================== INSERT INTO Cliente (nombre, correo) VALUES ('Carlos López', 'carlos.lopez@mail.com'), ('María Fernández', 'maria.fernandez@mail.com'), ('Luis Martínez', 'luis.martinez@mail.com'), ('Ana Torres', 'ana.torres@mail.com'), ('Pedro Gutiérrez', 'pedro.gutierrez@mail.com'), ('Sofía Morales', 'sofia.morales@mail.com'), ('Andrés Vargas', 'andres.vargas@mail.com'), ('Valeria Rojas', 'valeria.rojas@mail.com'), ('Javier Castillo', 'javier.castillo@mail.com'), ('Fernanda Ruiz', 'fernanda.ruiz@mail.com');

-- ==================== -- PRODUCTOS (10 registros con código de producto) -- ==================== INSERT INTO Producto (codigo, nombre, precio, stock) VALUES ('P001', 'Laptop Dell Inspiron', 750.00, 15), ('P002', 'Mouse Inalámbrico Logitech', 25.50, 50), ('P003', 'Teclado Mecánico Redragon', 60.00, 30), ('P004', 'Monitor LG 24"', 180.00, 20), ('P005', 'Disco SSD 500GB Kingston', 95.00, 25), ('P006', 'Impresora HP DeskJet', 120.00, 10), ('P007', 'Auriculares Sony WH-CH510', 65.00, 40), ('P008', 'Silla Gamer Cougar', 250.00, 8), ('P009', 'Memoria RAM 8GB DDR4', 45.00, 35), ('P010', 'Cargador Universal Laptop', 30.00, 60);

-- Seleccionar todos los clientes SELECT * FROM Cliente;

-- Seleccionar todos los productos SELECT * FROM Producto;

-- Seleccionar todas las ventas SELECT * FROM Venta;

-- Seleccionar todos los items de venta SELECT * FROM ItemVenta;

-- Seleccionar todos los pagos SELECT * FROM Pago;

