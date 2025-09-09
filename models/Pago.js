class Pago {
  constructor(monto) {
    this.monto = monto;
    this.monto_en_letras = this.convertirMontoALetras();
  }

  convertirMontoALetras() {
    return `${this.monto} en letras`; // Placeholder
  }

  procesarPago() {
    return `Procesando pago de ${this.monto}`;
  }
}

module.exports = Pago;
