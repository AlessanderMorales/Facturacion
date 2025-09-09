
class ItemVenta {
  
    constructor(producto, cantidad) {
        this.producto = producto;
        this.cantidad = cantidad;
        this.subtotal = this.calcular_subtotal();
    }

   
    calcular_subtotal() {
        return this.producto.precio * this.cantidad;
    }
}

module.exports = { ItemVenta };