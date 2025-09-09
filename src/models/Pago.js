export default class Pago {
  constructor(monto, monto_en_letras) {
    this.monto = monto;
    this.monto_en_letras = monto_en_letras;
  }

  procesarPago() {
    throw new Error("Este método debe implementarse en las subclases.");
  }
}
