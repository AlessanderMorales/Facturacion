const express = require('express');
const cors = require('cors');
const path = require('path'); // solo una vez
const app = express();

const facturacionController = require('./controllers/facturacionController');
const csvRepository = require('./repository/csvRepository');

app.use(cors());
app.use(express.json());

// ✅ Corrección aquí
app.use(express.static(path.join(__dirname, 'public')));

app.post('/ventas', facturacionController.crearNuevaVenta);

app.get('/api/productos', async (req, res) => {
  try {
    const productos = await csvRepository.readAll('productos.csv');
    res.json(productos);
  } catch (error) {
    console.error('Error al leer productos:', error);
    res.status(500).json({ error: 'Error al leer productos' });
  }
});

app.get('/api/clientes', async (req, res) => {
  try {
    const clientes = await csvRepository.readAll('clientes.csv');
    res.json(clientes);
  } catch (error) {
    console.error('Error al leer clientes:', error);
    res.status(500).json({ error: 'No se pudieron cargar los clientes' });
  }
});

app.listen(3000, () => console.log('Servidor corriendo en puerto 3000'));
