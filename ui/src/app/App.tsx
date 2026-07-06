import { BrowserRouter } from 'react-router-dom';
import { ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import { AppRoutes } from '../routes';

export function App() {
  return (
    <BrowserRouter>
      <AppRoutes />
      <ToastContainer
        position="top-right"
        autoClose={4000}
        newestOnTop
        closeOnClick
        pauseOnHover
        pauseOnFocusLoss
        limit={3}
        theme="light"
      />
    </BrowserRouter>
  );
}
