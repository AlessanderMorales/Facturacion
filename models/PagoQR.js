const Pago = require('./Pago');

class PagoQR extends Pago {
  constructor(monto, codigoQR = null) {
    super(monto);
    this.codigoQR = codigoQR || `QR-Pago-${Date.now()}`;
  }

  procesarPago() {
    return `Pago con QR: ${this.codigoQR}, monto: ${this.monto}`;
  }
}

module.exports = PagoQR;
