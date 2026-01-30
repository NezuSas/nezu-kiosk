import { BrowserRouter } from 'react-router-dom';
import { AppRoutes } from './routes/AppRoutes';
import ScrollToTop from './components/common/ScrollToTop';
import GlobalImagePreloader from './components/common/GlobalImagePreloader';
import './styles/global.css';

function App() {
  return (
    <BrowserRouter>
      <ScrollToTop />
      <GlobalImagePreloader />
      <AppRoutes />
    </BrowserRouter>
  );
}

export default App;