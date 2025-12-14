import { BrowserRouter, Routes, Route } from 'react-router-dom';
import { CartProvider } from './context/CartContext';
import Home from './pages/Home';
import Login from './pages/Log-in';
import Register from './pages/Sign-in';
import Productos from './pages/Productos';
import Blog from './pages/Blog';
import Carrito from './pages/Carrito'
import Test from './pages/test';
import Admin from './pages/admin/Dashboard';
import ProdAmin from './pages/admin/ProductsAdmin';
import Users from './pages/admin/Users';
import ProductForm from './pages/admin/ProductForm';
import UserForm from './pages/admin/UserForm';

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
          <Route path="/admin/products" element={<ProdAmin />} />
          <Route path="/admin/users" element={<Users />} />
          <Route path="/admin/product-form" element={<ProductForm />} />
          <Route path="/admin/user-form" element={<UserForm />} />
        </Routes>
      </BrowserRouter>
    </CartProvider>
  );
}

export default App;
