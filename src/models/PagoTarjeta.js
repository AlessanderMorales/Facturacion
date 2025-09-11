// src/modules/PagoTarjeta.js
import Pago from "./Pago.js";

export default class PagoTarjeta extends Pago {
    constructor(monto, monto_en_letras, numero_tarjeta) {
        super();
        this.monto = monto;
        this.monto_en_letras = monto_en_letras;
        this.numero_tarjeta = numero_tarjeta;
    }

    realizar_pago() {
        console.log(`Pago con tarjeta realizado por ${this.monto}. Tarjeta: ****${this.numero_tarjeta.slice(-4)}`);
        return true;
    }
}