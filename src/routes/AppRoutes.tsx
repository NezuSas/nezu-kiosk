import { Routes, Route } from 'react-router-dom';
import { Home } from '@/pages/Home/Home';
import { Categories } from '@/pages/Categories/Categories';
import { SubCategories } from '@/pages/SubCategories/SubCategories';
import { Details } from '@/pages/Details';
import { Cart } from '@/pages/Cart';
import { MainLayout } from '@/components/layout/MainLayout';
import { Form } from '@/pages/Form';
import { PaymentOptions } from '@/pages/PaymentOptions';
import { DatafastInstructions } from '@/pages/DatafastInstructions';

export const AppRoutes = () => (
  <Routes>
    <Route element={<MainLayout />}>
      <Route path="/" element={<Home />} />
      <Route path="/categories" element={<Categories />} />
      <Route path="/categories/:category" element={<SubCategories />} />
      <Route path="/categories/:category/:subCategory" element={<Details />} />
      <Route path="/cart" element={<Cart />} />
      <Route path="/form" element={<Form />} />
      <Route path="/payment-options" element={<PaymentOptions />} />
      <Route path="/datafast-instructions" element={<DatafastInstructions />} />
    </Route>
  </Routes>
);