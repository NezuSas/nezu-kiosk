import express from 'express';
import escpos from 'escpos';
import Usb from 'escpos-usb';

escpos.USB = Usb; // Configuración del USB

const device = new escpos.USB(); // Detecta la impresora conectada
const printer = new escpos.Printer(device);

const app = express();
app.use(express.json()); // Middleware para manejar JSON en las solicitudes

// Ruta para imprimir
app.post('/print', (req, res) => {
  const { text } = req.body;

  // Abre la conexión con la impresora y envía el texto
  device.open(() => {
    printer
      .align('ct') // Centrar texto
      .text(text) // Texto a imprimir
      .cut() // Cortar papel
      .close(); // Cerrar la conexión

    res.status(200).send('Impresión enviada correctamente');
  });
});

// Puerto en el que correrá el servidor
const PORT = 3001;
app.listen(PORT, () => {
  console.log(`Servidor corriendo en http://localhost:${PORT}`);
});