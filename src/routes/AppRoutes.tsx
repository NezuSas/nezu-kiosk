import { Routes, Route } from 'react-router-dom';
import { Home } from '@/pages/Home/Home';
import { Categories } from '@/pages/Categories/Categories';
import { SubCategories } from '@/pages/SubCategories/SubCategories';
import { Details } from '@/pages/Details';
import { Cart } from '@/pages/Cart';
import { MainLayout } from '@/components/layout/MainLayout';
import { Form } from '@/pages/Form';

export const AppRoutes = () => (
  <Routes>
    <Route path="/" element={<Home />} />
    <Route element={<MainLayout />}>
      <Route path="/categories" element={<Categories />} />
      <Route path="/categories/:category" element={<SubCategories />} />
      <Route path="/categories/:category/:subCategory" element={<Details />} />
      <Route path="/cart" element={<Cart />} />
      <Route path="/form" element={<Form />} />
    </Route>
  </Routes>
);