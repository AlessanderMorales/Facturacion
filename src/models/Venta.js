// src/modules/Venta.js
export default class Venta {
    constructor() {
        this.items = [];
    }

    agregar_item(item) {
        this.items.push(item);
    }

    calcular_total() {
        return this.items.reduce((total, item) => total + item.subtotal, 0);
    }
}