// src/modules/PagoQR.js
import Pago from "./Pago.js";
import QRCode from "qrcode"; // Necesitas instalar la librería 'qrcode'

export default class PagoQR extends Pago {
    constructor(monto, monto_en_letras, codigoQR) {
        super();
        this.monto = monto;
        this.monto_en_letras = monto_en_letras;
        this.codigoQR = codigoQR;
    }

    generar_QR() {
        return new Promise((resolve, reject) => {
            QRCode.toString(this.codigoQR, { type: 'terminal' }, (err, url) => {
                if (err) reject(err);
                resolve(url);
            });
        });
    }

    realizar_pago() {
        console.log(`Pago con QR realizado por ${this.monto}.`);
        return true;
    }
}