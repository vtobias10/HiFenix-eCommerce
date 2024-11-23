import React from 'react';
import NavbarAdmin from './navbarAdmin';
import Catalogo from './Catalogo';
import Footer from './Footer';

const MenuAdmin = () => {
    const handleModificar = (id) => {
        // Redirigir al componente modificarProducto con el ID en la URL
        window.location.href = `/modificarProducto?id=${id}`;
      };
      

  const handleEliminar = (id) => {
    const confirmacion = window.confirm('¿Estás seguro de que deseas eliminar este producto?');
    if (confirmacion) {
      const productosGuardados = JSON.parse(localStorage.getItem('productos')) || [];
      const productosActualizados = productosGuardados.filter((producto) => producto.id !== id);

      localStorage.setItem('productos', JSON.stringify(productosActualizados));
      window.location.reload(); // Recargar la página para actualizar la lista
    }
  };

  return (
    <div className="min-h-screen bg-gray-100">
      <NavbarAdmin />
      <div className="mt-4">
        {/* Pasar esAdmin como true para habilitar botones */}
        <Catalogo esAdmin={true} onModificar={handleModificar} onEliminar={handleEliminar} />
      </div>
      <Footer />
    </div>
  );
};

export default MenuAdmin;
