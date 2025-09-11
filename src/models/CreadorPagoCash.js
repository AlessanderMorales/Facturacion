// src/modules/CreadorPagoCash.js
import CreadorDePago from "./CreadorDePago.js";
import PagoCash from "./PagoCash.js";

export default class CreadorPagoCash extends CreadorDePago {
    crearPago(monto, monto_en_letras) {
        return new PagoCash(monto, monto_en_letras);
    }
}