import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useCarrito } from './CarritoContext';
import Navbar from './Navbar';
import Footer from './Footer';
import mastercardImg from './assets/mastercard.png';
import mercadopagoImg from './assets/mercadopago.png';
import visaImg from './assets/visa.jpg';

const VistaProductos = () => {
  const navigate = useNavigate();
  const { carrito, actualizarCarrito } = useCarrito();
  const producto = JSON.parse(localStorage.getItem('productoSeleccionado'));

  const [mostrarDescripcionCompleta, setMostrarDescripcionCompleta] = useState(false);

  // Desplazar al inicio al cargar el componente
  useEffect(() => {
    window.scrollTo(0, 0);
  }, []);

  const anadirAlCarrito = () => {
    const productoExistente = carrito.find((item) => item.id === producto.id);
    const nuevoCarrito = productoExistente
      ? carrito.map((item) =>
          item.id === producto.id ? { ...item, cantidad: item.cantidad + 1 } : item
        )
      : [...carrito, { ...producto, cantidad: 1 }];
    actualizarCarrito(nuevoCarrito);
    alert(`${producto.nombre} añadido al carrito.`);
  };

  const toggleDescripcion = () => {
    setMostrarDescripcionCompleta(!mostrarDescripcionCompleta);
  };

  return (
    <>
      <Navbar />
      <div className="pt-20 bg-gray-100">
        <div className="max-w-5xl mx-auto bg-white shadow-lg rounded-lg overflow-hidden mb-6">
          {/* Imagen y detalles del producto */}
          <div className="flex flex-col lg:flex-row">
            {/* Imagen */}
            <div className="w-full lg:w-1/2 p-6">
              <img
                src={producto.imagen || 'https://via.placeholder.com/300'}
                alt={producto.nombre}
                className="w-full h-auto object-cover rounded-lg"
              />
            </div>

            {/* Detalles */}
            <div className="w-full lg:w-1/2 p-6">
              <h1 className="text-3xl font-bold text-gray-800 mb-4">{producto.nombre}</h1>
              <p className="text-green-600 font-bold text-2xl mb-4">${producto.precio}</p>
              <p className="text-gray-600 mb-4">Stock disponible: {producto.stock}</p>

              {/* Botones */}
              <div className="flex flex-col space-y-4">
                <button
                  className="bg-black text-white px-6 py-2 rounded hover:bg-gray-700"
                  onClick={anadirAlCarrito}
                >
                  Agregar al carrito
                </button>
                <button
                  className="bg-gray-200 text-black px-6 py-2 rounded hover:bg-gray-300"
                  onClick={() => navigate('/')}
                >
                  Volver al catálogo
                </button>
              </div>

              {/* Métodos de pago */}
              <div className="mt-6">
                <h2 className="text-lg font-bold text-gray-800 mb-2">Métodos de pago</h2>
                <div className="flex items-center space-x-4">
                  <img src={visaImg} alt="Visa" className="w-12 h-8 object-contain" />
                  <img src={mastercardImg} alt="MasterCard" className="w-12 h-8 object-contain" />
                  <img src={mercadopagoImg} alt="MercadoPago" className="w-12 h-8 object-contain" />
                </div>
              </div>
            </div>
          </div>

          {/* Características y descripción */}
          <div className="p-6 border-t">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
              {/* Características */}
              <div>
                <h2 className="text-lg font-bold text-gray-800 mb-4">Características del producto</h2>
                <ul className="text-gray-700">
                  <li className="mb-2">
                    <strong>Categoría:</strong> {producto.categoria}
                  </li>
                  <li className="mb-2">
                    <strong>Marca:</strong> {producto.marca}
                  </li>
                </ul>
              </div>

              {/* Descripción */}
              <div>
                <h2 className="text-lg font-bold text-gray-800 mb-4">Descripción</h2>
                <p className="text-gray-700">
                  {mostrarDescripcionCompleta
                    ? producto.descripcion
                    : `${producto.descripcion.slice(0, 150)}...`}
                </p>
                {producto.descripcion.length > 150 && (
                  <button
                    className="text-blue-600 hover:underline mt-2"
                    onClick={toggleDescripcion}
                  >
                    {mostrarDescripcionCompleta ? 'Ver menos' : 'Ver más'}
                  </button>
                )}
              </div>
            </div>
          </div>
        </div>
      </div>
      {/* Footer */}
      <Footer />
    </>
  );
};

export default VistaProductos;
