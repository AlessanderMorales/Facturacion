const conexion = require('../db/conexion');

class Producto {
  constructor(id, codigo, nombre, precio, stock) {
    this.id = id;
    this.codigo = codigo;
    this.nombre = nombre;
    this.precio = precio;
    this.stock = stock;
  }
  // ===== CRUD =====
  static crear(producto, callback) {
    conexion.query(
      'INSERT INTO Producto (codigo, nombre, precio, stock) VALUES (?, ?, ?, ?)',
      [producto.codigo, producto.nombre, producto.precio, producto.stock],
      (err, result) => {
        if (err) return callback(err);
        callback(null, result.insertId);
      }
    );
  }

  static obtenerTodos(callback) {
    conexion.query('SELECT * FROM Producto', (err, results) => {
      if (err) return callback(err);
      callback(null, results);
    });
  }

  static obtenerPorId(id, callback) {
    conexion.query('SELECT * FROM Producto WHERE id = ?', [id], (err, results) => {
      if (err) return callback(err);
      callback(null, results[0]);
    });
  }

  static actualizar(id, producto, callback) {
    conexion.query(
      'UPDATE Producto SET codigo=?, nombre=?, precio=?, stock=? WHERE id=?',
      [producto.codigo, producto.nombre, producto.precio, producto.stock, id],
      (err, result) => {
        if (err) return callback(err);
        callback(null, result);
      }
    );
  }

  static eliminar(id, callback) {
    conexion.query('DELETE FROM Producto WHERE id = ?', [id], (err, result) => {
      if (err) return callback(err);
      callback(null, result);
    });
  }
}

module.exports = Producto;
