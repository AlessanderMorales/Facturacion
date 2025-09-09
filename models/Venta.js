
class Venta {
    constructor(id, cliente) {
        this.id = id;
        this.cliente = cliente;
        this.items = [];
        this.total = 0;
    }
    agregar_item(item) {
        this.items.push(item);
        this.calcular_total();
    }
    calcular_total() {
        this.total = this.items.reduce((total, item) => total + item.subtotal, 0);
    }
}

module.exports = { Venta };