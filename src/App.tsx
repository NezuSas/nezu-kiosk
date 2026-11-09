import { BrowserRouter } from 'react-router-dom';
import { AppRoutes } from './routes/AppRoutes';
import ScrollToTop from './components/common/ScrollToTop';
import GlobalImagePreloader from './components/common/GlobalImagePreloader';
import './styles/global.css';

function App() {
  // BASE_URL lets the same build live at the root (Vercel) or under a sub-path (the GitHub Pages demo).
  return (
    <BrowserRouter basename={import.meta.env.BASE_URL}>
      <ScrollToTop />
      <GlobalImagePreloader />
      <AppRoutes />
    </BrowserRouter>
  );
}

export default App;