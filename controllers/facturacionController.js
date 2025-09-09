
const csvRepository = require('../repository/csvRepository');
const { Cliente } = require('../models/Cliente');
const { Producto } = require('../models/Producto');
const { ItemVenta } = require('../models/ItemVenta');
const { Venta } = require('../models/Venta');
const { Tienda } = require('../models/Tienda');
const { PagoCashFactory } = require('../models/PagoCashFactory');
const { PagoTarjetaFactory } = require('../models/PagoTarjetaFactory');
const { Factura } = require('../models/Factura');

const DATOS_TIENDA = new Tienda("Tienda 'El Buen Precio'", "Av. Principal 123", 77712345, 1001, 123456789);

const crearNuevaVenta = async (req, res) => {
    try {
        const { cliente_id, nit_cliente, items, pago } = req.body;

        if (!cliente_id || !items || !pago || !items.length) {
            throw new Error("Datos incompletos para procesar la venta.");
        }
        const dbCliente = await csvRepository.findById('clientes.csv', cliente_id);
        if (!dbCliente) throw new Error(`Cliente con id ${cliente_id} no encontrado.`);

        const idsProductos = items.map(item => item.producto_id);
        const productosRows = await csvRepository.findMultipleByIds('productos.csv', idsProductos);
        if (productosRows.length !== idsProductos.length) throw new Error("Uno o más productos no fueron encontrados.");
        const cliente = new Cliente(dbCliente.id, dbCliente.nombre, dbCliente.correo, nit_cliente);
        const venta = new Venta(null, cliente);

        for (const item of items) {
            const dbProducto = productosRows.find(p => Number(p.id) === item.producto_id);
            if (Number(dbProducto.stock) < item.cantidad) {
                throw new Error(`Stock insuficiente para el producto: ${dbProducto.nombre}`);
            }
            const producto = new Producto(dbProducto.id, dbProducto.nombre, parseFloat(dbProducto.precio));
            const itemVenta = new ItemVenta(producto, item.cantidad);
            venta.agregar_item(itemVenta);
        }
        let fabricaDePago;
        if (pago.metodo.toLowerCase() === 'tarjeta') {
            fabricaDePago = new PagoTarjetaFactory();
        } else {
            fabricaDePago = new PagoCashFactory();
        }
        const metodoDePago = fabricaDePago.crearPago(venta.total, pago.numero_tarjeta);
        const factura = new Factura(null, venta, metodoDePago, DATOS_TIENDA);
        const qrCodeDataURL = await factura.generarCodigoQR();
        const ventaId = await csvRepository.saveVentaTransaction({
            venta: venta,
            pago: pago,
            qr: qrCodeDataURL
        });
        factura.nro_factura = ventaId;

        console.log("--- FACTURA GENERADA EN CONSOLA ---");
        await factura.generarFactura();
        
        res.status(201).json({ 
            message: 'Venta creada exitosamente', 
            ventaId: ventaId,
            factura: {
                total: factura.total,
                cliente: factura.venta.cliente.nombre_completo(),
                qr: qrCodeDataURL
            } 
        });

    } catch (error) {
        console.error("Error procesando la venta:", error.message);
        res.status(500).json({ error: error.message });
    }
};

module.exports = {
    crearNuevaVenta
};