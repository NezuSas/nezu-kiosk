import React, { lazy } from 'react';
import { RouteObject } from 'react-router-dom';

// Lazy load del componente de detalles de la impresora
const PrinterDetails = lazy(() => import('./PrinterDetails'));

export const printerRoutes: RouteObject[] = [
  {
    path: '/printers/t20iii-vm',
    element: React.createElement(PrinterDetails),
  },
];