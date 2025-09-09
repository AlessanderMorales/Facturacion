const { PagoCash } = require('./PagoCash.js');
const { PagoFactory } = require('./PagoFactory.js');

class PagoCashFactory extends PagoFactory {
    
    crearPago(monto) {
        return new PagoCash(monto);
    }
}

module.exports = { PagoCashFactory };