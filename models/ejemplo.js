
const {Cliente} = require('./Cliente.js');
const { Producto } = require('./Producto.js');
const { ItemVenta } = require('./ItemVenta.js');
const { Venta } = require('./Venta.js');
const { Tienda } = require('./Tienda.js');
const { PagoCashFactory } = require('./PagoCashFactory.js');
const { PagoTarjetaFactory } = require('./PagoTarjetaFactory.js');
const { Factura } = require('./Factura.js');

async function main() {
    const miTienda = new Tienda("Tienda 'El Buen Precio'", "Av. Principal 123", 77712345, 1001, 123456789);
    const cliente1 = new Cliente(1, "Juan", "Perez", 543210);
    const producto1 = new Producto(101, "Laptop Gamer", 8500.50);
    const producto2 = new Producto(102, "Mouse Óptico", 150.00);
    const producto3 = new Producto(103, "Teclado Mecanico", 450.75);
    const venta1 = new Venta(1, cliente1);
    const item1 = new ItemVenta(producto1, 1);
    const item2 = new ItemVenta(producto2, 2);
    const item3 = new ItemVenta(producto3, 1);
    venta1.agregar_item(item1);
    venta1.agregar_item(item2);
    venta1.agregar_item(item3);
    const fabricaDePago = new PagoTarjetaFactory();
    const numeroDeTarjeta = "1234567890123456";
    
    const metodoDePago = fabricaDePago.crearPago(venta1.total, numeroDeTarjeta);
    const numeroDeFactura = 201;
    const factura1 = new Factura(numeroDeFactura, venta1, metodoDePago, miTienda);
    await factura1.generarFactura();
}
main();