import express from "express";
import fs from "fs";
import csv from "csv-parser";
import cors from "cors";
import PDFDocument from "pdfkit";
import QRCode from "qrcode"; // Asegúrate de que esta línea esté presente

const app = express();
app.use(cors());
app.use(express.json());

// === Lectura CSV auxiliar ===
function leerCSV(ruta) {
    return new Promise((resolve, reject) => {
        const resultados = [];
        if (!fs.existsSync(ruta)) return resolve([]);
        fs.createReadStream(ruta)
            .pipe(csv())
            .on("data", data => resultados.push(data))
            .on("end", () => resolve(resultados))
            .on("error", err => reject(err));
    });
}

// === Productos y clientes ===
app.get("/productos", async (req, res) => {
    try {
        const productos = await leerCSV("./backend/productos.csv");
        res.json(productos);
    } catch (e) { res.status(500).json({ error: "Error leyendo productos" }) }
});
app.get("/clientes", async (req, res) => {
    try {
        const clientes = await leerCSV("./backend/clientes.csv");
        res.json(clientes);
    } catch (e) { res.status(500).json({ error: "Error leyendo clientes" }) }
});

// === Tienda ===
const rutaTienda = "./backend/tienda.json";
app.get("/tienda", (req, res) => {
    if (!fs.existsSync(rutaTienda)) return res.status(404).json({ error: "Tienda no encontrada" });
    const tienda = JSON.parse(fs.readFileSync(rutaTienda, "utf8"));
    res.json(tienda);
});
app.post("/tienda", (req, res) => {
    const nuevaTienda = req.body;
    fs.writeFileSync(rutaTienda, JSON.stringify(nuevaTienda, null, 2), "utf8");
    res.json({ mensaje: "Datos de la tienda actualizados" });
});

// === Facturas ===
const rutaFacturas = "./backend/facturas.csv";
app.post("/facturas", (req, res) => {
    const f = req.body;
    const header = "numero_factura,fecha,cliente,nit,detalle,total,metodo_pago\n";
    const fila = `${f.numero_factura},"${f.fecha}","${f.cliente}","${f.nit}","${f.detalle}",${f.total},"${f.metodo_pago}"\n`;
    if (!fs.existsSync(rutaFacturas)) fs.writeFileSync(rutaFacturas, header, "utf8");
    fs.appendFileSync(rutaFacturas, fila, "utf8");
    res.json({ mensaje: "Factura guardada" });
});

app.get("/facturas", async (req, res) => {
    try {
        const facturas = await leerCSV(rutaFacturas);
        const { nit } = req.query;
        if (nit) return res.json(facturas.filter(f => f.nit === nit));
        res.json(facturas);
    } catch (e) { res.status(500).json({ error: "Error leyendo facturas" }) }
});

// === PDF con QR ===
app.get("/facturas/:numero/pdf", async (req, res) => {
    try {
        const facturas = await leerCSV(rutaFacturas);
        const f = facturas.find(f => f.numero_factura === req.params.numero);
        if (!f) return res.status(404).send("Factura no encontrada");

        const qrData = `Factura N°${f.numero_factura} | Cliente: ${f.cliente} | Total: ${f.total} Bs.`;
        const qrImage = await QRCode.toDataURL(qrData);

        const doc = new PDFDocument();
        res.setHeader("Content-Disposition", `attachment; filename=factura_${f.numero_factura}.pdf`);
        res.setHeader("Content-Type", "application/pdf");
        doc.pipe(res);

        doc.fontSize(20).text("Factura", { align: "center" });
        doc.moveDown();
        doc.fontSize(12).text(`Factura N°: ${f.numero_factura}`);
        doc.text(`Fecha: ${f.fecha}`);
        doc.text(`Cliente: ${f.cliente}`);
        doc.text(`NIT: ${f.nit}`);
        doc.moveDown();
        doc.text("Detalle de compra:");
        doc.text(f.detalle);
        doc.moveDown();
        doc.fontSize(14).text(`TOTAL: ${f.total} Bs.`, { align: "right" });
        doc.text(`Método de Pago: ${f.metodo_pago}`, { align: "right" });
        doc.moveDown();

        const qrBuffer = Buffer.from(qrImage.split(",")[1], "base64");
        doc.image(qrBuffer, { fit: [120, 120], align: "center", valign: "center" });

        doc.end();
    } catch (e) { res.status(500).json({ error: "Error generando PDF" }) }
});

const PORT = 3000;
app.listen(PORT, () => console.log(`Servidor corriendo en http://localhost:${PORT}`));