import React, { createContext, useContext, useState, useEffect } from 'react';

const CarritoContext = createContext();

export const useCarrito = () => useContext(CarritoContext);

export const CarritoProvider = ({ children }) => {
  const [carrito, setCarrito] = useState([]);

  useEffect(() => {
    // Leer el carrito desde localStorage al cargar el componente
    const currentUser = JSON.parse(localStorage.getItem('currentUser'));
    const carritoKey = currentUser ? `carrito_${currentUser.email}` : 'carrito_guest';
    const carritoGuardado = JSON.parse(localStorage.getItem(carritoKey)) || [];
    setCarrito(carritoGuardado);
  }, []);

  const actualizarCarrito = (nuevoCarrito) => {
    const currentUser = JSON.parse(localStorage.getItem('currentUser'));
    const carritoKey = currentUser ? `carrito_${currentUser.email}` : 'carrito_guest';
    localStorage.setItem(carritoKey, JSON.stringify(nuevoCarrito));
    setCarrito(nuevoCarrito); // Actualiza el estado global
  };

  return (
    <CarritoContext.Provider value={{ carrito, actualizarCarrito }}>
      {children}
    </CarritoContext.Provider>
  );
};
