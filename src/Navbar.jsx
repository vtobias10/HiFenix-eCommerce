import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { FaShoppingCart, FaCaretDown } from 'react-icons/fa';
import { useCarrito } from './CarritoContext';

const Navbar = () => {
  const navigate = useNavigate();
  const { carrito } = useCarrito();
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [user, setUser] = useState(null);
  const [dropdownCategoriasOpen, setDropdownCategoriasOpen] = useState(false);
  const [dropdownMarcasOpen, setDropdownMarcasOpen] = useState(false);
  const [dropdownUsuarioOpen, setDropdownUsuarioOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [productos, setProductos] = useState([]);
  const [filteredProductos, setFilteredProductos] = useState([]);

  const cantidadCarrito = carrito.reduce((total, item) => total + (item.cantidad || 1), 0);

  const categorias = [
    'Procesadores',
    'Placas de Video',
    'Memorias RAM',
    'Auriculares',
    'Teclados',
    'Mouses',
    'Mouse Pads',
    'Joysticks',
    'Micrófonos',
    'Otros',
  ];

  const marcas = [
    'Intel',
    'AMD',
    'NVIDIA',
    'Logitech',
    'Redragon',
    'Razer',
    'Hyperx',
    'Corsair',
    'Otros',
  ];

  useEffect(() => {
    const token = localStorage.getItem('authToken');
    const currentUser = JSON.parse(localStorage.getItem('currentUser'));

    if (token && currentUser) {
      setIsLoggedIn(true);
      setUser(currentUser);
    } else {
      setIsLoggedIn(false);
      setUser(null);
    }

    // Cargar productos desde localStorage
    const productosGuardados = JSON.parse(localStorage.getItem('productos')) || [];
    setProductos(productosGuardados);
  }, []);

  useEffect(() => {
    // Filtrar productos en tiempo real basado en la búsqueda
    if (searchQuery) {
      const resultados = productos.filter((producto) =>
        producto.nombre.toLowerCase().includes(searchQuery.toLowerCase())
      );
      setFilteredProductos(resultados);
    } else {
      setFilteredProductos([]);
    }
  }, [searchQuery, productos]);

  const handleSearchSelect = (producto) => {
    // Guardar el producto seleccionado en localStorage y redirigir a vistaProductos.jsx
    localStorage.setItem('productoSeleccionado', JSON.stringify(producto));
    setSearchQuery(''); // Limpiar el campo de búsqueda
    navigate('/vistaProductos');
  };

  const handleCategoriaClick = (categoria) => {
    navigate(`/filtroCategorias?categoria=${categoria}`);
    setDropdownCategoriasOpen(false);
  };

  const handleMarcaClick = (marca) => {
    navigate(`/filtroMarcas?marca=${marca}`);
    setDropdownMarcasOpen(false);
  };

  const toggleDropdown = (dropdownType) => {
    if (dropdownType === 'categorias') {
      setDropdownCategoriasOpen((prev) => !prev);
      setDropdownMarcasOpen(false);
      setDropdownUsuarioOpen(false);
    } else if (dropdownType === 'marcas') {
      setDropdownMarcasOpen((prev) => !prev);
      setDropdownCategoriasOpen(false);
      setDropdownUsuarioOpen(false);
    } else if (dropdownType === 'usuario') {
      setDropdownUsuarioOpen((prev) => !prev);
      setDropdownCategoriasOpen(false);
      setDropdownMarcasOpen(false);
    }
  };

  const scrollToNovedades = () => {
    navigate('/');
    setTimeout(() => {
      const novedadesSection = document.getElementById('novedades');
      if (novedadesSection) {
        novedadesSection.scrollIntoView({ behavior: 'smooth' });
      }
    }, 100);
  };

  const handleLogout = () => {
    localStorage.removeItem('authToken');
    localStorage.removeItem('currentUser');
    setIsLoggedIn(false);
    setUser(null);
    navigate('/');
  };

  const handleLoginRedirect = () => {
    navigate('/userLogin');
  };

  const handleRegisterRedirect = () => {
    navigate('/userRegister');
  };

  const handleAppRedirect = () => {
    navigate('/');
  };

  return (
    <nav className="fixed top-0 left-0 right-0 z-50 bg-white shadow-md py-3 px-6 flex items-center justify-between">
      <div className="flex items-center space-x-4">
        <button>
          <span className="text-xl font-bold" onClick={handleAppRedirect}>
            Hi Fenix
          </span>
        </button>

        {/* Dropdown de Categorías */}
        <div className="relative">
          <button
            className="text-gray-700 hover:text-gray-900 cursor-pointer"
            onClick={() => toggleDropdown('categorias')}
          >
            Categorías
          </button>
          {dropdownCategoriasOpen && (
            <div className="absolute top-full mt-2 w-48 bg-white border border-gray-300 rounded-lg shadow-lg z-50">
              {categorias.map((categoria) => (
                <button
                  key={categoria}
                  onClick={() => handleCategoriaClick(categoria)}
                  className="block w-full text-left px-4 py-2 text-gray-700 hover:bg-gray-100"
                >
                  {categoria}
                </button>
              ))}
            </div>
          )}
        </div>

        {/* Dropdown de Marcas */}
        <div className="relative">
          <button
            className="text-gray-700 hover:text-gray-900 cursor-pointer"
            onClick={() => toggleDropdown('marcas')}
          >
            Marcas
          </button>
          {dropdownMarcasOpen && (
            <div className="absolute top-full mt-2 w-48 bg-white border border-gray-300 rounded-lg shadow-lg z-50">
              {marcas.map((marca) => (
                <button
                  key={marca}
                  onClick={() => handleMarcaClick(marca)}
                  className="block w-full text-left px-4 py-2 text-gray-700 hover:bg-gray-100"
                >
                  {marca}
                </button>
              ))}
            </div>
          )}
        </div>

        {/* Botón de Novedades */}
        <a
          href="#novedades"
          className="text-gray-700 hover:text-gray-900"
          onClick={(e) => {
            e.preventDefault();
            scrollToNovedades();
          }}
        >
          Novedades
        </a>
      </div>

      {/* Barra de búsqueda */}
      <div className="flex-grow mx-8 relative">
        <input
          type="text"
          placeholder="Buscar productos..."
          className="w-full max-w-lg px-4 py-2 rounded-full bg-gray-100 text-gray-700 focus:outline-none focus:ring-2 focus:ring-gray-400"
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
        />
        {filteredProductos.length > 0 && (
          <ul className="absolute w-full max-w-lg bg-white border border-gray-300 rounded-lg shadow-lg mt-2 z-50">
            {filteredProductos.map((producto) => (
              <li
                key={producto.id}
                className="flex items-center px-4 py-2 hover:bg-gray-100 cursor-pointer"
                onClick={() => handleSearchSelect(producto)}
              >
                <img
                  src={producto.imagen || 'https://via.placeholder.com/50'}
                  alt={producto.nombre}
                  className="w-10 h-10 object-cover rounded-full mr-4"
                />
                <span>{producto.nombre}</span>
              </li>
            ))}
          </ul>
        )}
      </div>

      <div className="flex items-center space-x-4">
        {user?.role === 'admin' && (
          <button
            className="bg-green-600 text-white px-4 py-2 rounded hover:bg-green-500 transition duration-300"
            onClick={() => navigate('/menuAdmin')}
          >
            Vista Admin
          </button>
        )}

        {/* Icono del Carrito */}
        <div className="relative">
          <FaShoppingCart
            className="text-gray-700 hover:text-gray-900 cursor-pointer text-2xl"
            onClick={() => navigate('/Carrito')}
          />
          {cantidadCarrito > 0 && (
            <span className="absolute -top-2 -right-2 bg-red-500 text-white text-xs rounded-full px-2">
              {cantidadCarrito}
            </span>
          )}
        </div>

{/* Dropdown de Usuario */}
{isLoggedIn ? (
  <div className="relative">
    <button
      className="flex items-center space-x-2 text-gray-700 hover:text-gray-900 cursor-pointer"
      onClick={() => toggleDropdown('usuario')}
    >
      <span>
        {user?.firstName} {user?.lastName}
      </span>
      <FaCaretDown />
    </button>
    {dropdownUsuarioOpen && (
      <div className="absolute right-0 mt-2 w-48 bg-white border border-gray-300 rounded-lg shadow-lg">
        <button
          className="w-full text-left px-4 py-2 text-gray-700 hover:bg-gray-100"
          onClick={() => navigate('/verPerfil')}
        >
          Ver Perfil
        </button>
        <button
          className="w-full text-left px-4 py-2 text-gray-700 hover:bg-gray-100"
          onClick={() => navigate('/misCompras')}
        >
          Mis Compras
        </button>
        <button
          className="w-full text-left px-4 py-2 text-gray-700 hover:bg-gray-100"
          onClick={handleLogout}
        >
          Cerrar sesión
        </button>
      </div>
    )}
  </div>
) : (
  <div className="flex items-center space-x-4">
    <button
      className="bg-black text-white px-4 py-2 rounded hover:bg-gray-600"
      onClick={handleLoginRedirect}
    >
      Iniciar sesión
    </button>
    <button
      className="bg-black text-white px-4 py-2 rounded hover:bg-gray-600"
      onClick={handleRegisterRedirect}
    >
      Registrarse
    </button>
  </div>
)}


      </div>
    </nav>
  );
};

export default Navbar;
