import { BrowserRouter, Routes, Route } from 'react-router-dom';
import { CartProvider } from './context/CartContext';
import Home from './pages/Home';
import Login from './pages/Log-in';
import Register from './pages/Sign-in';
import Productos from './pages/Productos';
import Blog from './pages/Blog.jsx';
import Carrito from './pages/Carrito.jsx'
import Test from './pages/test.jsx';
import Admin from './pages/admin/dashboard';

function App() {
  return (
    <CartProvider>
      <BrowserRouter>
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/login" element={<Login />} />
          <Route path="/register" element={<Register />} />
          <Route path="/productos" element={<Productos />} /> 
          <Route path="/blog" element={<Blog />} />
          <Route path="/carrito" element={<Carrito />} />
          <Route path="/test" element={<Test />} />
          <Route path="/admin/dashboard" element={<Admin />} />
        </Routes>
      </BrowserRouter>
    </CartProvider>
  );
}

export default App;