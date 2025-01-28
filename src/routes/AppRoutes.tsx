import { Routes, Route } from 'react-router-dom';
import { Home } from '../pages/Home/Home';
import { Categories } from '../pages/Categories/Categories';
import { SubCategories } from '../pages/SubCategories/SubCategories';
import PrinterDetails from '@/integrations/printer/PrinterDetails';

export const AppRoutes = () => (
  <Routes>
    <Route path="/" element={<Home />} />
    <Route path="/categories" element={<Categories />} />
    <Route path="/categories/:category" element={<SubCategories />} />
    <Route path="/printers/:printerId" element={<PrinterDetails />} />
  </Routes>
);