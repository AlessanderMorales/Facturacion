// src/modules/CreadorPagoTarjeta.js
import CreadorDePago from "./CreadorDePago.js";
import PagoTarjeta from "./PagoTarjeta.js";

export default class CreadorPagoTarjeta extends CreadorDePago {
    crearPago(monto, monto_en_letras, numero_tarjeta) {
        return new PagoTarjeta(monto, monto_en_letras, numero_tarjeta);
    }
}