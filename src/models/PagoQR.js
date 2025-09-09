import Pago from "./Pago.js";

export default class PagoQR extends Pago {
  constructor(monto, monto_en_letras, codigoQR) {
    super(monto, monto_en_letras);
    this.codigoQR = codigoQR || this.generarQR();
  }

  generarQR() {
    return `QR-${Date.now()}-${Math.floor(Math.random() * 1000)}`;
  }

  procesarPago() {
    return `Pago mediante QR generado: ${this.codigoQR}`;
  }
}
