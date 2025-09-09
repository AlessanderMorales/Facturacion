const QRCode = require('qrcode');


class Factura {
   
    constructor(nro_factura, venta, pago, tienda) {
        this.nro_factura = nro_factura;
        this.fecha = new Date();
        this.total = venta.total;
        this.codigoQR = null; 
        this.venta = venta;
        this.pago = pago;
        this.tienda = tienda;
    }

    
    async generarCodigoQR() {
        const dataParaQR = JSON.stringify({
            tienda: this.tienda.nombre_tienda,
            nit: this.tienda.nit,
            nro_factura: this.nro_factura,
            cliente: this.venta.cliente.nombre_completo(),
            total: this.total,
            fecha: this.fecha.toISOString(),
        });

        try {
            const qrDataURL = await QRCode.toDataURL(dataParaQR);
            return qrDataURL;
        } catch (err) {
            console.error('Error al generar el código QR', err);
            return "Error al generar QR";
        }
    }

    
    async generarFactura() {
        this.codigoQR = await this.generarCodigoQR();

        console.log("\n=========================================");
        console.log(`            FACTURA`);
        console.log("=========================================");
        console.log(`Tienda: ${this.tienda.nombre_tienda}`);
        console.log(`Ubicación: ${this.tienda.ubicacion}`);
        console.log(`Teléfono: ${this.tienda.telefono}`);
        console.log(`NIT: ${this.tienda.nit}`);
        console.log(`Nro. Factura: ${this.nro_factura}`);
        console.log(`Autorización: ${this.tienda.codigo_autorizacion}`);
        console.log("-----------------------------------------");
        console.log(`Fecha: ${this.fecha.toLocaleDateString()} ${this.fecha.toLocaleTimeString()}`);
        console.log(`Cliente: ${this.venta.cliente.nombre_completo()}`);
        console.log(`NIT/CI: ${this.venta.cliente.nit}`);
        console.log("-----------------------------------------");
        console.log("CANT.  DESCRIPCIÓN      P.UNIT.  SUBTOTAL");
        console.log("-----------------------------------------");
        this.venta.items.forEach(item => {
            const nombre = item.producto.nombre.padEnd(15).substring(0, 15);
            const precio = item.producto.precio.toFixed(2).padStart(7);
            const subtotal = item.subtotal.toFixed(2).padStart(7);
            console.log(`${item.cantidad.toString().padEnd(3)}    ${nombre} ${precio}  ${subtotal}`);
        });
        console.log("-----------------------------------------");
        console.log(`TOTAL A PAGAR:      Bs. ${this.total.toFixed(2).padStart(7)}`);
        console.log(`SON: ${this.pago.monto_en_letras}`);
        console.log("-----------------------------------------");
        console.log(this.pago.procesarPago());
        console.log(`\nCódigo QR generado (Data URL):`);
        console.log(this.codigoQR.substring(0, 80) + '...'); 
        console.log("=========================================\n");
    }
}

module.exports = { Factura };