import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import AuthProvider from '@/store/AuthProvider';
import { BrowserRouter } from 'react-router-dom';
import Router from './routes/router';
import './styles/global.css';
import ScrollToTop from './components/layout/ScrollToTop';

const App = () => {
  return (
    <QueryClientProvider client={new QueryClient()}>
      <AuthProvider>
        <BrowserRouter>
          <div className="mobile-container">
            <ScrollToTop />
            <Router />
          </div>
        </BrowserRouter>
      </AuthProvider>
    </QueryClientProvider>
  );
};

export default App;
