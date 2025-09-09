const Pago = require('./Pago');

class PagoTarjeta extends Pago {
  constructor(monto, numero_tarjeta, cuotas = 1) {
    super(monto);
    this.numero_tarjeta = numero_tarjeta;
    this.cuotas = cuotas;
  }

  procesarPago() {
    return `Pago con tarjeta ${this.numero_tarjeta}, monto: ${this.monto}, cuotas: ${this.cuotas}`;
  }
}

module.exports = PagoTarjeta;
