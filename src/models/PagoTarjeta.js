import Pago from "./Pago.js";

export default class PagoTarjeta extends Pago {
  constructor(monto, monto_en_letras, numero_tarjeta) {
    super(monto, monto_en_letras);
    this.numero_tarjeta = numero_tarjeta;
  }

  procesarPago() {
    return `Pago con tarjeta terminada en ${this.numero_tarjeta.slice(-4)} por ${this.monto}`;
  }
}
