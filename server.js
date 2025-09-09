const express = require('express');
const cors = require('cors');
const path = require('path');
const app = express();

const facturacionController = require('./controllers/facturacionController');

app.use(cors());
app.use(express.json());
app.use(express.static(__dirname));
app.post('/ventas', facturacionController.crearNuevaVenta);


app.listen(3000, () => console.log('Servidor corriendo en puerto 3000'));