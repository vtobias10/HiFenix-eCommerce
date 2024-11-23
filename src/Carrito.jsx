import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useCarrito } from './CarritoContext'; // Usamos el contexto
import Navbar from './Navbar';
import Footer from './Footer';

const Carrito = () => {
  const { carrito, actualizarCarrito } = useCarrito(); // Obtenemos carrito y su actualizador
  const [subtotal, setSubtotal] = useState(0);
  const navigate = useNavigate();

  useEffect(() => {
    const nuevoSubtotal = carrito.reduce(
      (total, producto) => total + Number(producto.precio) * (producto.cantidad || 1),
      0
    );
    setSubtotal(nuevoSubtotal);
  }, [carrito]);

  const handleActualizarCantidad = (id, accion) => {
    const nuevosProductos = carrito.map((producto) =>
      producto.id === id
        ? {
            ...producto,
            cantidad:
              accion === 'incrementar'
                ? (producto.cantidad || 1) + 1
                : Math.max((producto.cantidad || 1) - 1, 1),
          }
        : producto
    );
    actualizarCarrito(nuevosProductos); // Actualizamos el carrito en el contexto
  };

  const handleEliminarProducto = (id) => {
    const nuevosProductos = carrito.filter((producto) => producto.id !== id);
    actualizarCarrito(nuevosProductos); // Actualizamos el carrito en el contexto
  };

  const handleComprar = () => {
    const currentUser = JSON.parse(localStorage.getItem('currentUser'));
    if (!currentUser) {
      alert('Inicia sesión para seguir la compra');
      navigate('/userLogin');
    } else {
      // Guardar los productos comprados en el historial de compras
      const comprasAnteriores = JSON.parse(localStorage.getItem(`compras_${currentUser.email}`)) || [];
      const nuevaCompra = carrito.map((producto) => ({
        ...producto,
        fechaCompra: new Date().toLocaleString(), // Fecha de compra
      }));
      const comprasActualizadas = [...comprasAnteriores, ...nuevaCompra];
      localStorage.setItem(`compras_${currentUser.email}`, JSON.stringify(comprasActualizadas));
  
      alert('Compra realizada con éxito');
      actualizarCarrito([]); // Limpiamos el carrito tras la compra
    }
  };
  

  return (
    <div className="flex flex-col min-h-screen">
      {/* Navbar */}
      <Navbar />

      {/* Contenido principal */}
      <main className="flex-grow">
        <div className="max-w-7xl mx-auto p-6">
          <h1 className="text-3xl font-bold mb-4">Tu Carrito</h1>
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            {/* Productos */}
            <div className="lg:col-span-2 bg-white shadow-md rounded-lg p-4 max-h-[400px] overflow-y-auto">
              {carrito.length > 0 ? (
                carrito.map((producto) => (
                  <div
                    key={producto.id}
                    className="flex items-center justify-between py-4 border-b"
                  >
                    <div className="flex items-center space-x-4">
                      {producto.imagen && (
                        <img
                          src={producto.imagen}
                          alt={producto.nombre}
                          className="w-16 h-16 object-cover rounded"
                        />
                      )}
                      <div>
                        <h2 className="text-lg font-bold">{producto.nombre}</h2>
                        <p className="text-gray-600">${Number(producto.precio).toFixed(2)}</p>
                      </div>
                    </div>
                    <div className="flex items-center space-x-4">
                      <button
                        onClick={() => handleActualizarCantidad(producto.id, 'decrementar')}
                        className="px-2 py-1 border rounded text-gray-700 hover:bg-gray-200"
                      >
                        -
                      </button>
                      <span>{producto.cantidad || 1}</span>
                      <button
                        onClick={() => handleActualizarCantidad(producto.id, 'incrementar')}
                        className="px-2 py-1 border rounded text-gray-700 hover:bg-gray-200"
                      >
                        +
                      </button>
                      <button
                        onClick={() => handleEliminarProducto(producto.id)}
                        className="text-red-500 hover:text-red-700"
                      >
                        🗑️
                      </button>
                    </div>
                  </div>
                ))
              ) : (
                <p className="text-gray-500 text-center">No hay productos en el carrito.</p>
              )}
            </div>

            {/* Resumen del Pedido */}
            <div className="bg-white shadow-md rounded-lg p-4">
              <h2 className="text-2xl font-bold mb-4">Resumen del Pedido</h2>
              <div className="mb-4">
                <div className="flex justify-between">
                  <span className="text-gray-700">Subtotal</span>
                  <span className="text-gray-700">${subtotal.toFixed(2)}</span>
                </div>
              </div>
              <div className="border-t pt-4">
                <div className="flex justify-between">
                  <span className="text-lg font-bold">Total</span>
                  <span className="text-lg font-bold">${subtotal.toFixed(2)}</span>
                </div>
              </div>
              <button
                onClick={handleComprar}
                className="w-full mt-4 bg-black text-white py-2 rounded hover:bg-gray-700 transition duration-300"
              >
                Comprar →
              </button>
            </div>
          </div>
        </div>
      </main>

      {/* Footer */}
      <Footer />
    </div>
  );
};

export default Carrito;
