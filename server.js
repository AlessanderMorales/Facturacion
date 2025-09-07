const express = require('express');
const cors = require('cors');
const conexion = require('./db/conexion');
const app = express();

app.use(cors());
app.use(express.json());

// Clientes
app.get('/clientes', (req, res) => {
  conexion.query('SELECT * FROM Cliente', (err, results) => {
    if(err) return res.status(500).send(err);
    res.json(results);
  });
});

app.post('/clientes', (req, res) => {
  const { nombre, correo } = req.body;
  conexion.query('INSERT INTO Cliente (nombre, correo) VALUES (?, ?)', [nombre, correo], (err, result) => {
    if(err) return res.status(500).send(err);
    res.json({id: result.insertId, nombre, correo});
  });
});

// Productos
app.get('/productos', (req, res) => {
  conexion.query('SELECT * FROM Producto', (err, results) => {
    if(err) return res.status(500).send(err);
    res.json(results);
  });
});

app.post('/productos', (req, res) => {
  const { nombre, precio, stock } = req.body;
  conexion.query('INSERT INTO Producto (nombre, precio, stock) VALUES (?, ?, ?)', [nombre, precio, stock], (err, result) => {
    if(err) return res.status(500).send(err);
    res.json({id: result.insertId, nombre, precio, stock});
  });
});

app.listen(3000, () => console.log('Servidor corriendo en puerto 3000'));