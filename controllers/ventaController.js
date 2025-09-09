const conexion = require('../db/conexion');

function crearVenta(venta, callback) {
  conexion.query(
    'INSERT INTO Venta (cliente_id, total, qr) VALUES (?, ?, ?)',
    [venta.cliente.id, venta.total, venta.qr],
    (err, result) => {
      if(err) return callback(err);

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

module.exports = { crearVenta };