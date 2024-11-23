import React, { useState } from 'react';
import NavbarAdmin from './navbarAdmin'; // Importa el NavbarAdmin

const EliminarProducto = () => {
  const [busqueda, setBusqueda] = useState('');
  const [resultados, setResultados] = useState([]);
  const [mensaje, setMensaje] = useState('');
  const [modalDescripcion, setModalDescripcion] = useState({ abierto: false, descripcion: '' });

  // Manejar cambios en el input de búsqueda
  const handleBusquedaChange = (e) => {
    const termino = e.target.value.toLowerCase();
    setBusqueda(termino);

    const productosGuardados = JSON.parse(localStorage.getItem('productos')) || [];
    const productosFiltrados = productosGuardados.filter(
      (producto) =>
        producto.nombre.toLowerCase().includes(termino) || producto.id.toString().includes(termino)
    );

    setResultados(productosFiltrados);
  };

  // Eliminar producto
  const handleEliminarProducto = (id) => {
    const confirmar = window.confirm('¿Estás seguro de que deseas eliminar este producto?');
    if (confirmar) {
      const productosGuardados = JSON.parse(localStorage.getItem('productos')) || [];
      const productosActualizados = productosGuardados.filter((producto) => producto.id !== id);

      localStorage.setItem('productos', JSON.stringify(productosActualizados));
      setResultados((prevResultados) => prevResultados.filter((producto) => producto.id !== id));
      setMensaje('Producto eliminado exitosamente.');
    }
  };

  const abrirModalDescripcion = (descripcion) => {
    setModalDescripcion({ abierto: true, descripcion });
  };

  const cerrarModalDescripcion = () => {
    setModalDescripcion({ abierto: false, descripcion: '' });
  };

  return (
    <div className="min-h-screen bg-gray-100">
      {/* NavbarAdmin */}
      <NavbarAdmin />

      <div className="flex flex-col items-center justify-center mt-6">
        <h1 className="text-3xl font-bold mb-6">Eliminar Producto</h1>

        {/* Formulario de búsqueda */}
        <div className="w-full max-w-md bg-white p-6 rounded-lg shadow-lg mb-6">
          <div className="mb-4">
            <label className="block text-gray-700 font-bold mb-2">Buscar por ID o Nombre</label>
            <input
              type="text"
              value={busqueda}
              onChange={handleBusquedaChange}
              className="w-full px-3 py-2 border rounded focus:outline-none focus:ring-2 focus:ring-blue-500"
              placeholder="Ingrese ID o nombre del producto"
              required
            />
          </div>
          {mensaje && <p className="mt-4 text-green-500 font-bold">{mensaje}</p>}
        </div>

        {/* Resultados de búsqueda */}
        {resultados.length > 0 && (
          <div
            className={`w-full max-w-3xl bg-white p-6 rounded-lg shadow-lg ${
              resultados.length > 3 ? 'max-h-96 overflow-y-auto' : ''
            }`}
          >
            <h2 className="text-xl font-bold mb-4">Resultados</h2>
            {resultados.map((producto) => (
              <div
                key={producto.id}
                className="border-b last:border-none pb-4 mb-4 flex justify-between items-center"
              >
                <div>
                  <p><strong>ID:</strong> {producto.id}</p>
                  <p><strong>Nombre:</strong> {producto.nombre}</p>
                  <p><strong>Categoría:</strong> {producto.categoria}</p>
                  <p><strong>Marca:</strong> {producto.marca}</p>
                  <button
                    className="text-blue-500 underline mt-1"
                    onClick={() => abrirModalDescripcion(producto.descripcion)}
                  >
                    Ver Descripción
                  </button>
                  <p><strong>Precio:</strong> ${producto.precio}</p>
                  <p><strong>Stock:</strong> {producto.stock}</p>
                </div>
                <div className="flex items-center space-x-2">
                  {producto.imagen && (
                    <img
                      src={producto.imagen}
                      alt={producto.nombre}
                      className="w-16 h-16 object-cover rounded"
                    />
                  )}
                  <button
                    onClick={() => handleEliminarProducto(producto.id)}
                    className="bg-red-500 text-white px-4 py-2 rounded hover:bg-red-600 transition duration-300"
                  >
                    Eliminar
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}

        {/* Modal de descripción */}
        {modalDescripcion.abierto && (
          <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50 z-50">
            <div className="bg-white p-6 rounded shadow-lg max-w-lg w-full">
              <h2 className="text-xl font-bold mb-4">Descripción del Producto</h2>
              <p>{modalDescripcion.descripcion}</p>
              <button
                className="mt-4 bg-gray-500 text-white px-4 py-2 rounded hover:bg-gray-600"
                onClick={cerrarModalDescripcion}
              >
                Cerrar
              </button>
            </div>
          </div>
        )}

        {/* Mensaje si no hay resultados */}
        {busqueda && resultados.length === 0 && (
          <p className="text-red-500 font-bold mt-4">No se encontraron productos.</p>
        )}
      </div>
    </div>
  );
};

export default EliminarProducto;
