// src/modules/CreadorDePago.js
export default class CreadorDePago {
    crearPago() {
        throw new Error("El método crearPago() debe ser implementado.");
    }

    realizarTransaccion(monto, monto_en_letras, ...args) {
        const pago = this.crearPago(monto, monto_en_letras, ...args);
        return pago.realizar_pago();
    }
}