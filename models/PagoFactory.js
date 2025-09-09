
class PagoFactory {
    constructor() {
        if (this.constructor === PagoFactory) {
            throw new Error("La clase abstracta 'PagoFactory' no puede ser instanciada directamente.");
        }
    }

    crearPago() {
        throw new Error("El método 'crearPago()' debe ser implementado.");
    }
}

module.exports = { PagoFactory };