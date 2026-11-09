import { lazy, Suspense } from "react";
import { Navigate, Route, Routes, useLocation } from "react-router-dom";
import { KioskLayout } from "./KioskLayout";

const HomeScreen = lazy(() => import("@/features/home/HomeScreen").then((m) => ({ default: m.HomeScreen })));
const CategoriesScreen = lazy(() => import("@/features/catalog/CategoriesScreen").then((m) => ({ default: m.CategoriesScreen })));
const LinesScreen = lazy(() => import("@/features/catalog/LinesScreen").then((m) => ({ default: m.LinesScreen })));
const LineScreen = lazy(() => import("@/features/catalog/LineScreen").then((m) => ({ default: m.LineScreen })));
const SelectionScreen = lazy(() => import("@/features/selection/SelectionScreen").then((m) => ({ default: m.SelectionScreen })));
const ThanksScreen = lazy(() => import("@/features/handoff/ThanksScreen").then((m) => ({ default: m.ThanksScreen })));
const PaymentOptionsScreen = lazy(() => import("@/features/handoff/PaymentScreens").then((m) => ({ default: m.PaymentOptionsScreen })));
const CardInstructionsScreen = lazy(() => import("@/features/handoff/PaymentScreens").then((m) => ({ default: m.CardInstructionsScreen })));
const PhonePage = lazy(() => import("@/features/phone/PhonePage").then((m) => ({ default: m.PhonePage })));

/** Redirige conservando la consulta (`?session=…`), para los enlaces de versiones anteriores. */
const Moved = ({ to }: { to: string }) => {
  const { search } = useLocation();
  return <Navigate to={`${to}${search}`} replace />;
};

export const AppRouter = () => (
  <Suspense fallback={null}>
    <Routes>
      <Route element={<KioskLayout />}>
        <Route path="/" element={<HomeScreen />} />
        <Route path="/categories" element={<CategoriesScreen />} />
        <Route path="/categories/:categoryId" element={<LinesScreen />} />
        <Route path="/categories/:categoryId/:lineId" element={<LineScreen />} />
        <Route path="/selection" element={<SelectionScreen />} />
        <Route path="/payment" element={<PaymentOptionsScreen />} />
        <Route path="/card" element={<CardInstructionsScreen />} />
        <Route path="/thanks" element={<ThanksScreen />} />
        <Route path="/cart" element={<Moved to="/selection" />} />
        <Route path="/payment-options" element={<Moved to="/payment" />} />
        <Route path="/datafast-instructions" element={<Moved to="/card" />} />
        <Route path="/thankyou" element={<Moved to="/thanks" />} />
      </Route>
      {/* La página del teléfono no lleva el reposo ni el armazón del tótem */}
      <Route path="/phone" element={<PhonePage />} />
      <Route path="/form" element={<Moved to="/phone" />} />
      <Route path="*" element={<Navigate to="/" replace />} />
    </Routes>
  </Suspense>
);
