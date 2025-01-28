export const PRINTER_T20III_VM = {
    id: 't20iii_vm',
    name: 'Impresora T20III_VM',
    brand: 'Tronxy',
    model: 'T20III-VM',
    description: 'Impresora 3D de alta precisión diseñada para impresiones detalladas y de calidad.',
    features: [
      'Área de impresión: 220 x 220 x 250 mm',
      'Tecnología de impresión: FDM (Modelado por Deposición Fundida)',
      'Velocidad máxima de impresión: 100 mm/s',
      'Precisión de impresión: 0.1 mm',
      'Temperatura de extrusor: hasta 260°C',
      'Cama caliente con nivelación automática',
      'Compatible con múltiples materiales: PLA, ABS, PETG, TPU'
    ],
    specifications: {
      printVolume: '220 x 220 x 250 mm',
      nozzleDiameter: '0.4 mm',
      filamentDiameter: '1.75 mm',
      maxPrintSpeed: '100 mm/s',
      maxNozzleTemperature: '260°C',
      maxBedTemperature: '100°C'
    },
    imageUrl: '/images/t20iii-vm-printer.jpg',
    price: 299.99,
    videoTutorialUrl: '/videos/t20iii-vm-setup.mp4'
};