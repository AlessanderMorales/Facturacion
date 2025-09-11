// src/modules/CreadorPagoQR.js
import CreadorDePago from "./CreadorDePago.js";
import PagoQR from "./PagoQR.js";

export default class CreadorPagoQR extends CreadorDePago {
    crearPago(monto, monto_en_letras, codigoQR) {
        return new PagoQR(monto, monto_en_letras, codigoQR);
    }
}