import { BrowserRouter } from 'react-router-dom';
import { AppRoutes } from './routes/AppRoutes';
import GlobalImagePreloader from './components/common/GlobalImagePreloader';
import './styles/global.css';

function App() {
  return (
    <BrowserRouter>
      <GlobalImagePreloader />
      <AppRoutes />
    </BrowserRouter>
  );
}

export default App;