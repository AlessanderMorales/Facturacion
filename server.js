const express = require('express');
const cors = require('cors');
const app = express();

const facturacionController = require('./controllers/facturacionController');

app.use(cors());
app.use(express.json());

// --- RUTA PRINCIPAL PARA CREAR VENTAS ---
app.post('/ventas', facturacionController.crearNuevaVenta);

// Puedes agregar nuevas rutas GET aquí que usen el csvRepository si las necesitas

app.listen(3000, () => console.log('Servidor corriendo en puerto 3000'));

