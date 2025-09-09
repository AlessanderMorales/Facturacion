class ItemVenta {
  constructor(producto, cantidad) {
    this.producto = producto;
    this.cantidad = cantidad;
    this.subtotal = this.calcularSubtotal();
  }

  calcularSubtotal() {
    return this.producto.precio * this.cantidad;
  }
}

module.exports = ItemVenta;
