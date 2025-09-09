const conexion = require('../db/conexion');

class Venta {
  constructor(id, cliente_id, total, qr) {
    this.id = id;
    this.cliente_id = cliente_id;
    this.total = total;
    this.qr = qr;
    this.items = [];
  }

  agregarItem(item) {
    this.items.push(item);
    this.calcularTotal();
  }

  calcularTotal() {
    this.total = this.items.reduce((acc, item) => acc + item.subtotal, 0);
    return this.total;
  }

  // ===== CRUD =====
  static crear(venta, callback) {
    conexion.query(
      'INSERT INTO Venta (cliente_id, total, qr) VALUES (?, ?, ?)',
      [venta.cliente_id, venta.total, venta.qr],
      (err, result) => {
        if (err) return callback(err);

        const ventaId = result.insertId;

        venta.items.forEach(item => {
          conexion.query(
            'INSERT INTO ItemVenta (venta_id, producto_id, cantidad, subtotal) VALUES (?, ?, ?, ?)',
            [ventaId, item.producto.id, item.cantidad, item.subtotal]
          );
        });

        callback(null, ventaId);
      }
    );
  }

  static obtenerTodos(callback) {
    conexion.query('SELECT * FROM Venta', (err, results) => {
      if (err) return callback(err);
      callback(null, results);
    });
  }

  static obtenerPorId(id, callback) {
    conexion.query('SELECT * FROM Venta WHERE id = ?', [id], (err, results) => {
      if (err) return callback(err);
      callback(null, results[0]);
    });
  }
}

module.exports = Venta;
