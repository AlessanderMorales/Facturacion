const mysql = require('mysql2');

const conexion = mysql.createConnection({
  host: 'localhost',
  user: 'root',
  password: 'Ucb.6538925',
  database: 'db_facturacion'
})  ;

conexion.connect(err => {
  if(err) throw err;
  console.log('Conectado a MySQL');
});

module.exports = conexion;w         