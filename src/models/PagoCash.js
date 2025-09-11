// src/modules/PagoCash.js
import Pago from "./Pago.js";

export default class PagoCash extends Pago {
    constructor(monto, monto_en_letras) {
        super();
        this.monto = monto;
        this.monto_en_letras = monto_en_letras;
    }

    realizar_pago() {
        console.log(`Pago en efectivo realizado por ${this.monto} (${this.monto_en_letras}).`);
        return true;
    }
}