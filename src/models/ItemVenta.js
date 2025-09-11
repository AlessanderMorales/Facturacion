// src/modules/ItemVenta.js
export default class ItemVenta {
    constructor(cantidad, producto) {
        this.cantidad = cantidad;
        this.producto = producto;
        this.subtotal = this.calcular_subtotal();
    }

    calcular_subtotal() {
        return this.cantidad * this.producto.precio;
    }
}