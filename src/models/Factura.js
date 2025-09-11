// src/modules/Factura.js
export default class Factura {
    constructor(numero_factura, fecha, venta, pago, tienda) {
        this.numero_factura = numero_factura;
        this.fecha = fecha;
        this.venta = venta;
        this.pago = pago;
        this.tienda = tienda;
        this.total = this.venta.calcular_total();
        this.facturaOnline = this.generarFacturaOnline();
    }

    generarFacturaOnline() {
        // Lógica para generar un código QR o URL para visualizar la factura
        return `https://example.com/factura/${this.numero_factura}`;
    }
}