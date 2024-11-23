import React from 'react';
import ReactDOM from 'react-dom/client';
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import App from './App.jsx';
import UserLogin from './userLogin.jsx';
import UserRegister from './userRegister.jsx';
import MenuAdmin from './menuAdmin.jsx';
import CrearProducto from './crearProducto.jsx';
import EliminarProducto from './eliminarProducto.jsx';
import ModificarProducto from './modificarProducto.jsx';
import Carrito from './Carrito.jsx';
import ProtectedRoute from './ProtectedRoute.jsx';
import { CarritoProvider } from './CarritoContext.jsx';
import FiltroCategorias from './filtroCategorias.jsx';
import FiltroMarcas from './filtroMarcas.jsx';
import VistaProductos from './vistaProductos.jsx';
import VerPerfil from './verPerfil.jsx';
import MisCompras from './misCompras.jsx';
import './styles.css';

ReactDOM.createRoot(document.getElementById('root')).render(
  <React.StrictMode>
    <BrowserRouter>
      <CarritoProvider>
        <Routes>
          {/* Rutas públicas */}
          <Route path="/" element={<App />} />
          <Route path="/userLogin" element={<UserLogin />} />
          <Route path="/userRegister" element={<UserRegister />} />
          <Route path="/filtroCategorias" element={<FiltroCategorias />} />
          <Route path="/filtroMarcas" element={<FiltroMarcas />} />
          <Route path="/vistaProductos" element={<VistaProductos />} />

          {/* Rutas protegidas para administradores */}
          <Route
            path="/menuAdmin"
            element={
              <ProtectedRoute role="admin">
                <MenuAdmin />
              </ProtectedRoute>
            }
          />
          <Route
            path="/crearProducto"
            element={
              <ProtectedRoute role="admin">
                <CrearProducto />
              </ProtectedRoute>
            }
          />
          <Route
            path="/eliminarProducto"
            element={
              <ProtectedRoute role="admin">
                <EliminarProducto />
              </ProtectedRoute>
            }
          />
          <Route
            path="/modificarProducto"
            element={
              <ProtectedRoute role="admin">
                <ModificarProducto />
              </ProtectedRoute>
            }
          />

          {/* Ruta protegida para el perfil */}
          <Route
            path="/verPerfil"
            element={
              <ProtectedRoute allowOwnProfile profileEmail={JSON.parse(localStorage.getItem('currentUser'))?.email}>
                <VerPerfil />
              </ProtectedRoute>
            }
          />

<Route
  path="/misCompras"
  element={
    <ProtectedRoute>
      <MisCompras />
    </ProtectedRoute>
  }
/>


          {/* Ruta pública del carrito */}
          <Route path="/carrito" element={<Carrito />} />

          {/* Catálogo */}
          <Route path="/catalogo" element={<App />} />
        </Routes>
      </CarritoProvider>
    </BrowserRouter>
  </React.StrictMode>
);
