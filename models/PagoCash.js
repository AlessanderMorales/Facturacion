const Pago = require('./Pago');

class PagoCash extends Pago {
  constructor(monto, efectivoRecibido = null) {
    super(monto);
    this.efectivoRecibido = efectivoRecibido;
  }

  procesarPago() {
    if (this.efectivoRecibido !== null) {
      return `Pago en efectivo recibido: ${this.efectivoRecibido}, cambio: ${this.efectivoRecibido - this.monto}`;
    }
    return super.procesarPago();
  }
}

module.exports = PagoCash;
