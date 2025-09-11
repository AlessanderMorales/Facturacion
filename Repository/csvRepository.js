const fs = require('fs');
const path = require('path');
const csv = require('csv-parser');
const { createObjectCsvWriter } = require('csv-writer');

const dataDir = path.join(__dirname, '..', 'data');

/**
 * Lee un archivo CSV y devuelve su contenido como un array de objetos.
 * @param {string} fileName - Nombre del archivo CSV en la carpeta /data.
 * @returns {Promise<Array<Object>>}
 */
const readCSV = (fileName) => {
    return new Promise((resolve, reject) => {
        const results = [];
        const filePath = path.join(dataDir, fileName);
        fs.createReadStream(filePath)
            .pipe(csv())
            .on('data', (data) => results.push(data))
            .on('end', () => resolve(results))
            .on('error', (error) => reject(error));
    });
};

/**
 * Escribe un array de objetos completo en un archivo CSV, sobrescribiéndolo.
 * @param {string} fileName - Nombre del archivo CSV.
 * @param {Array<Object>} data - Array de objetos a escribir.
 */
const writeCSV = async (fileName, data) => {
    const filePath = path.join(dataDir, fileName);
    if (data.length === 0) return; // No escribir si no hay datos

    const headers = Object.keys(data[0]).map(key => ({ id: key, title: key }));
    const csvWriter = createObjectCsvWriter({
        path: filePath,
        header: headers
    });
    await csvWriter.writeRecords(data);
};

/**
 * Agrega un nuevo registro al final de un archivo CSV.
 * @param {string} fileName - Nombre del archivo CSV.
 * @param {Object} record - Objeto a agregar.
 */
const appendCSV = async (fileName, record) => {
    const filePath = path.join(dataDir, fileName);
    const headers = Object.keys(record).map(key => ({ id: key, title: key }));
    const fileExists = fs.existsSync(filePath) && fs.statSync(filePath).size > 0;
    
    const csvWriter = createObjectCsvWriter({
        path: filePath,
        header: headers,
        append: fileExists // Apendiza si el archivo ya existe y tiene contenido
    });
    await csvWriter.writeRecords([record]);
};

// --- Funciones específicas ---

const findById = async (fileName, id) => {
    const data = await readCSV(fileName);
    // Los IDs leídos del CSV son strings, los convertimos a número para comparar
    return data.find(item => Number(item.id) === Number(id));
};

const findMultipleByIds = async (fileName, ids) => {
    const data = await readCSV(fileName);
    return data.filter(item => ids.includes(Number(item.id)));
};

/**
 * Guarda toda la transacción de la venta en los archivos CSV correspondientes.
 */
const saveVentaTransaction = async (ventaData) => {
    // 1. Obtener el siguiente ID para la Venta
    const ventas = await readCSV('ventas.csv');
    const nextVentaId = ventas.length > 0 ? Math.max(...ventas.map(v => Number(v.id))) + 1 : 1;
    
    // 2. Guardar la Venta principal
    await appendCSV('ventas.csv', {
        id: nextVentaId,
        cliente_id: ventaData.venta.cliente.id,
        total: ventaData.venta.total,
        qr: ventaData.qr,
        fecha: new Date().toISOString()
    });

    // 3. Guardar los Items y actualizar el stock de productos
    let itemsVenta = await readCSV('items_venta.csv');
    let nextItemId = itemsVenta.length > 0 ? Math.max(...itemsVenta.map(i => Number(i.id))) + 1 : 1;

    let productos = await readCSV('productos.csv');

    for (const item of ventaData.venta.items) {
        // Guardar item
        await appendCSV('items_venta.csv', {
            id: nextItemId++,
            venta_id: nextVentaId,
            producto_id: item.producto.id,
            cantidad: item.cantidad,
            subtotal: item.subtotal
        });
        
        // Actualizar stock en memoria
        const productoIndex = productos.findIndex(p => Number(p.id) === item.producto.id);
        if (productoIndex !== -1) {
            productos[productoIndex].stock = Number(productos[productoIndex].stock) - item.cantidad;
        }
    }
    // Escribir el archivo de productos actualizado
    await writeCSV('productos.csv', productos);

    // 4. Guardar el Pago
    const pagos = await readCSV('pagos.csv');
    const nextPagoId = pagos.length > 0 ? Math.max(...pagos.map(p => Number(p.id))) + 1 : 1;
    await appendCSV('pagos.csv', {
        id: nextPagoId,
        venta_id: nextVentaId,
        metodo: ventaData.pago.metodo,
        monto: ventaData.venta.total
    });

    return nextVentaId;
};


const readAll = async (fileName) => {
    return await readCSV(fileName);
};

module.exports = {
    findById,
    findMultipleByIds,
    saveVentaTransaction,
    readAll
};