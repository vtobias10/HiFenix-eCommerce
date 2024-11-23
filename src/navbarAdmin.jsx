import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { FaCaretDown } from 'react-icons/fa';

const NavbarAdmin = () => {
  const navigate = useNavigate();
  const [dropdownOpen, setDropdownOpen] = useState(false);

  const handleLogout = () => {
    localStorage.removeItem('authToken');
    localStorage.removeItem('currentUser');
    navigate('/');
  };

  const toggleDropdown = () => {
    setDropdownOpen(!dropdownOpen);
  };

  return (
    <nav className="fixed top-0 left-0 right-0 z-50 bg-white shadow-md py-3 px-6 flex items-center justify-between">
      <div className="flex items-center space-x-4">
        <span className="text-xl font-bold cursor-pointer" onClick={() => navigate('/menuAdmin')}>
          Hi Fenix
        </span>
        <button
          className="bg-black text-white px-4 py-2 rounded hover:bg-gray-600 transition duration-300"
          onClick={() => navigate('/crearProducto')}
        >
          Crear Producto
        </button>
        <button
          className="bg-black text-white px-4 py-2 rounded hover:bg-gray-600 transition duration-300"
          onClick={() => navigate('/eliminarProducto')}
        >
          Eliminar Producto
        </button>
        <button
          className="bg-black text-white px-4 py-2 rounded hover:bg-gray-600 transition duration-300"
          onClick={() => navigate('/modificarProducto')}
        >
          Modificar Producto
        </button>
        <button
          className="bg-green-600 text-white px-4 py-2 rounded hover:bg-green-500 transition duration-300"
          onClick={() => navigate('/')}
        >
          Vista Cliente
        </button>
      </div>

      <div className="relative">
        <button
          className="flex items-center space-x-2 text-gray-700 font-bold hover:text-gray-900 cursor-pointer"
          onClick={toggleDropdown}
        >
          <span>Administrador</span>
          <FaCaretDown />
        </button>
        {dropdownOpen && (
          <div className="absolute right-0 mt-2 w-48 bg-white border border-gray-300 rounded-lg shadow-lg">
            <button
              className="w-full text-left px-4 py-2 text-gray-700 hover:bg-gray-100"
              onClick={handleLogout}
            >
              Cerrar Sesión
            </button>
          </div>
        )}
      </div>
    </nav>
  );
};

export default NavbarAdmin;
