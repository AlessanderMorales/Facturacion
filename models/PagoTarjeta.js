const { Pago } = require('./Pago.js');


class PagoTarjeta extends Pago {
   
    constructor(monto, numero_tarjeta) {
        super(monto);
        this.numero_tarjeta = `**** **** **** ${numero_tarjeta.slice(-4)}`;
    }

   
    procesarPago() {
        return `Pago con TARJETA ${this.numero_tarjeta} por Bs. ${this.monto} procesado exitosamente.`;
    }
}

module.exports = { PagoTarjeta };