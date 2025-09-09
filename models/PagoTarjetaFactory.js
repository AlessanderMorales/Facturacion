const { PagoFactory } = require('./PagoFactory.js');
const { PagoTarjeta } = require('./PagoTarjeta.js');

class PagoTarjetaFactory extends PagoFactory {
    crearPago(monto, numero_tarjeta) {
        if (!numero_tarjeta) {
            throw new Error("El número de tarjeta es requerido para este tipo de pago.");
        }
        return new PagoTarjeta(monto, numero_tarjeta);
    }
}

module.exports = { PagoTarjetaFactory };