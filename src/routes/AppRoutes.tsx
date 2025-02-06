import { lazy, Suspense } from "react";
import { Routes, Route } from "react-router-dom";
import { MainLayout } from "@/components/layout/MainLayout";

const Home = lazy(() => import("@/pages/Home/Home"));
const Categories = lazy(() => import("@/pages/Categories/Categories"));
const SubCategories = lazy(() => import("@/pages/SubCategories/SubCategories"));
const Details = lazy(() => import("@/pages/Details/Details"));
const Cart = lazy(() => import("@/pages/Cart/Cart"));
const Form = lazy(() => import("@/pages/Form/Form"));
const PaymentOptions = lazy(() => import("@/pages/PaymentOptions/PaymentOptions"));
const DatafastInstructions = lazy(() => import("@/pages/DatafastInstructions/DatafastInstructions"));
const ThankYouPage = lazy(() => import("@/pages/ThankYouPage/ThankYouPage"));

export const AppRoutes = () => (
  <Suspense fallback={<div>Loading...</div>}>
    <Routes>
      <Route element={<MainLayout />}>
        <Route path="/" element={<Home />} />
        <Route path="/categories" element={<Categories />} />
        <Route path="/categories/:category" element={<SubCategories />} />
        <Route
          path="/categories/:category/:subCategory"
          element={<Details />}
        />
        <Route path="/cart" element={<Cart />} />
        <Route path="/form" element={<Form />} />
        <Route path="/payment-options" element={<PaymentOptions />} />
        <Route
          path="/datafast-instructions"
          element={<DatafastInstructions />}
        />
        <Route path="/thankyou" element={<ThankYouPage />} />
      </Route>
    </Routes>
  </Suspense>
);
