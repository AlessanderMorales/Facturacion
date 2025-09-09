
const { Pago } = require('./Pago.js');

class PagoCash extends Pago {
    constructor(monto) {
        super(monto);
    }

    procesarPago() {
        return `Pago en EFECTIVO por Bs. ${this.monto} procesado exitosamente.`;
    }
}

module.exports = { PagoCash };
