import Pago from "./Pago.js";

export default class PagoCash extends Pago {
  constructor(monto, monto_en_letras) {
    super(monto, monto_en_letras);
  }

  procesarPago() {
    return `Pago en efectivo recibido: ${this.monto} (${this.monto_en_letras})`;
  }
}
