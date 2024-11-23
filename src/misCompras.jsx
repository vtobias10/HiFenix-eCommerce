import React, { useEffect, useState } from 'react';
import Navbar from './Navbar';

const MisCompras = () => {
  const currentUser = JSON.parse(localStorage.getItem('currentUser'));
  const [compras, setCompras] = useState([]);

  useEffect(() => {
    if (currentUser) {
      const comprasGuardadas = JSON.parse(localStorage.getItem(`compras_${currentUser.email}`)) || [];
      setCompras(comprasGuardadas);
    }
  }, [currentUser]);

  return (
    <>
      <Navbar />
      <div className="max-w-5xl mx-auto mt-24 p-6">
        <h1 className="text-3xl font-bold mb-6">Mis Compras</h1>
        {compras.length > 0 ? (
          <div className="space-y-4">
            {compras.map((producto, index) => (
              <div
                key={index}
                className="flex items-center justify-between bg-white shadow-md rounded-lg p-6"
              >
                <div className="flex items-center space-x-4">
                  {producto.imagen && (
                    <img
                      src={producto.imagen}
                      alt={producto.nombre}
                      className="w-24 h-24 object-cover rounded-lg"
                    />
                  )}
                  <div>
                  <p className="text-gray-600">Categoría: {producto.categoria}</p>
                    <h2 className="text-lg font-bold">{producto.nombre}</h2>
                    <p className="text-gray-600">Marca: {producto.marca}</p>
                    <p className="text-gray-600">Cantidad: {producto.cantidad}</p>
                  </div>
                </div>
                <div>
                <span className="text-lg font-bold text-green-600">${producto.precio}</span>
                  <p className="text-gray-500 text-sm">{producto.fechaCompra}</p>
                </div>
              </div>
            ))}
          </div>
        ) : (
          <p className="text-gray-500">No has realizado compras aún.</p>
        )}
      </div>
    </>
  );
};

export default MisCompras;
