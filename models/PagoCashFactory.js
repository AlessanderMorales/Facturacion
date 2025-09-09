const { PagoCash } = require('./PagoCash.js');


class PagoCashFactory extends PagoFactory {
    
    crearPago(monto) {
        return new PagoCash(monto);
    }
}

module.exports = { PagoCashFactory };