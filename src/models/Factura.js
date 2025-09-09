import Venta from "./Venta.js";
import Pago from "./Pago.js";
import Tienda from "./Tienda.js";

export default class Factura {
  constructor(numero_factura, fecha, venta, pago, tienda) {
    if (!(venta instanceof Venta)) throw new Error("Venta inválida.");
    if (!(pago instanceof Pago)) throw new Error("Pago inválido.");
    if (!(tienda instanceof Tienda)) throw new Error("Tienda inválida.");

    this.numero_factura = numero_factura;
    this.fecha = fecha;
    this.venta = venta;
    this.pago = pago;
    this.tienda = tienda;
    this.total = venta.calcularTotal();
    this.facturaOnline = this.generarFacturaOnline();
  }

  generarFacturaOnline() {
    return `FacturaOnline-QR-${this.numero_factura}-${Date.now()}`;
  }
}
