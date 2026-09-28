import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { Provider, useSelector } from 'react-redux';
import { store } from './store/store.js';

// Navigation & Composants
import Navbar from './component/Navbar';
import Footer from './component/Footer';
import Home from './pages/Home';
import ProductList from './pages/ProductList';
import Cart from './component/Cart';
import Contact from './pages/Contact';
import Statistique from './pages/Statistique';
import Login from './pages/Login';
import Register from './pages/Register';
import OrderForm from './pages/OrderForm';
import AdminOrders from './pages/AdminOrders';

import './App.css';

// Composant de protection des routes Admin
function AdminRoute({ children }) {
  // Récupération depuis Redux
  const authState = useSelector((state) => state.auth || {});
  
  // Récupération de secours depuis le localStorage si Redux se réinitialise
  const storedUser = localStorage.getItem('user');
  const localUser = storedUser ? JSON.parse(storedUser) : null;
  const token = localStorage.getItem('token');

  const user = authState.user || localUser;
  const isAuthenticated = authState.isAuthenticated || Boolean(token || localUser);

  // Vérification du rôle admin (supporte "admin" ou "administrateur")
  const role = user?.role?.toLowerCase() || user?.nom?.toLowerCase() || '';
  const isAdmin = role === 'admin' || role === 'administrateur';

  if (!isAuthenticated || !isAdmin) {
    return <Navigate to="/" replace />;
  }

  return children;
}

function App() {
  return (
    <Provider store={store}>
      <Router>
        <div className="app">
          <Navbar />
          <Routes>
            {/* Routes publiques */}
            <Route path="/" element={<Home />} />
            <Route path="/boutique" element={<ProductList />} />
            <Route path="/cart" element={<Cart />} />
            <Route path="/commander" element={<OrderForm />} />
            <Route path="/contact" element={<Contact />} />
            <Route path="/login" element={<Login />} />
            <Route path="/register" element={<Register />} />

            {/* Routes réservées à l'Admin */}
            <Route 
              path="/statistiques" 
              element={
                <AdminRoute>
                  <Statistique />
                </AdminRoute>
              } 
            />

            {/* Route "/commandes" (pour correspondre au lien de la Navbar) */}
            <Route 
              path="/commandes" 
              element={
                <AdminRoute>
                  <AdminOrders />
                </AdminRoute>
              } 
            />

            {/* Redirection / Alias optionnel pour "/admin/commandes" */}
            <Route 
              path="/admin/commandes" 
              element={
                <AdminRoute>
                  <AdminOrders />
                </AdminRoute>
              } 
            />
          </Routes>
          <Footer />
        </div>
      </Router>
    </Provider>
  );
}

export default App;