const { NumerosALetras } = require('numero-a-letras');

class Pago {
    
    constructor(monto) {
        if (this.constructor === Pago) {
            throw new Error("La clase abstracta 'Pago' no puede ser instanciada directamente.");
        }
        this.monto = monto;
        this.monto_en_letras = this.convertir_monto_a_letras(monto);
    }

    
    procesarPago() {
        throw new Error("El método 'procesarPago()' debe ser implementado.");
    }

   
    convertir_monto_a_letras(monto) {
        return NumerosALetras(monto);
    }
}

module.exports = { Pago };