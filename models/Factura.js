class Factura {
  constructor(numero_factura, fecha, venta, pago, tienda) {
    this.numero_factura = numero_factura;
    this.fecha = fecha;
    this.venta = venta;
    this.pago = pago;
    this.tienda = tienda;
    this.total = venta.total;
    this.facturaOnline = null;
  }

  emitirFactura(enLinea = false) {
    if (enLinea) {
      this.facturaOnline = `QR-Factura-${this.numero_factura}`;
      return `Factura ${this.numero_factura} emitida online con QR: ${this.facturaOnline}`;
    }
    return `Factura ${this.numero_factura} emitida físicamente. Total: ${this.total}`;
  }
}

module.exports = Factura;
