const conexion = require('../db/conexion');

class Cliente {
  constructor(id, nombreYApellido, correo, nit) {
    this.id = id;
    this.nombreYApellido = nombreYApellido;
    this.correo = correo;
    this.nit = nit;
  }

  static crear(cliente, callback) {
    conexion.query(
      'INSERT INTO Cliente (nombre, correo) VALUES (?, ?)',
      [cliente.nombreYApellido, cliente.correo],
      (err, result) => {
        if (err) return callback(err);
        callback(null, result.insertId);
      }
    );
  }

  static obtenerTodos(callback) {
    conexion.query('SELECT * FROM Cliente', (err, results) => {
      if (err) return callback(err);
      callback(null, results);
    });
  }

  static obtenerPorId(id, callback) {
    conexion.query('SELECT * FROM Cliente WHERE id = ?', [id], (err, results) => {
      if (err) return callback(err);
      callback(null, results[0]);
    });
  }
}

module.exports = Cliente;
