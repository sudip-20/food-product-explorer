import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Navbar from './components/Navbar';
import HomePage from './pages/HomePage';
import ProductDetailPage from './pages/ProductDetailPage';
import CartPage from './pages/CartPage';

const App = () => {
  return (
    <Router>
        <div className="min-h-screen bg-gradient-to-br from-green-50 to-blue-50 flex flex-col">
          <Navbar />
          <main className="flex-grow container mx-auto px-4 py-8 max-w-6xl">
            <Routes>
              <Route path="/" element={<HomePage />} />
              <Route path="/product/:barcode" element={<ProductDetailPage />} />
              <Route path="/cart" element={<CartPage />} />
            </Routes>
          </main>
          <footer className="bg-gray-800 text-white py-6">
            <div className="container mx-auto px-4 max-w-6xl text-center">
              <p className="text-sm">
                © {new Date().getFullYear()} Food Product Explorer | 
                Powered by Open Food Facts
              </p>
            </div>
          </footer>
        </div>
    </Router>
  );
};

export default App;