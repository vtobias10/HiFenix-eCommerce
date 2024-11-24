import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import Destacado from './Destacado';
import { useCarrito } from './CarritoContext';

const Catalogo = ({ esAdmin = false, onModificar, onEliminar }) => {
  const [productos, setProductos] = useState([]);
  const [mostrarMasNovedades, setMostrarMasNovedades] = useState(false);
  const [mostrarModalDetalles, setMostrarModalDetalles] = useState(false);
  const [modalProducto, setModalProducto] = useState(null);

  const navigate = useNavigate();
  const { carrito, actualizarCarrito } = useCarrito(); // Usamos el contexto

  // Función para obtener los productos desde el backend
  useEffect(() => {
    const fetchProductos = async () => {
      try {
        const response = await fetch('/productos'); // Asegúrate de que esta URL sea la correcta para tu API
        if (!response.ok) {
          throw new Error('Error al obtener los productos');
        }
        const data = await response.json();
        setProductos(data);
      } catch (error) {
        console.error("Error al obtener los productos:", error);
      }
    };

    fetchProductos();
  }, []);

  const anadirAlCarrito = (producto) => {
    const productoExistente = carrito.find((item) => item.id === producto.id);
    const nuevoCarrito = productoExistente
      ? carrito.map((item) =>
          item.id === producto.id ? { ...item, cantidad: item.cantidad + 1 } : item
        )
      : [...carrito, { ...producto, cantidad: 1 }];
    actualizarCarrito(nuevoCarrito); // Actualizamos el carrito con la función del contexto
    alert(`${producto.nombre} ha sido añadido al carrito.`);
  };

  const abrirModalProducto = (producto) => {
    setModalProducto(producto);
    setMostrarModalDetalles(true);
  };

  const cerrarModalProducto = () => {
    setMostrarModalDetalles(false);
    setModalProducto(null);
  };

  const verProducto = (producto) => {
    navigate(`/vistaProductos/${producto.id}`);
  };

  const handleModificar = (producto, e) => {
    e.stopPropagation();  // Detener la propagación del clic, para evitar que se navegue a vistaProductos
    // Navegamos a la página de modificación sin el id en la URL
    navigate('/modificarProducto', { state: { productoId: producto.id } });
  };

  const handleEliminar = async (producto, e) => {
    e.stopPropagation(); // Detener la propagación para evitar navegar a vistaProductos al hacer clic en el botón de eliminar

    // Confirmación para eliminar
    const confirmacion = window.confirm(`¿Estás seguro de eliminar el producto ${producto.nombre}?`);
    if (confirmacion) {
      try {
        // Realizamos la solicitud para eliminar el producto usando la misma URL y lógica de tu otro componente
        const response = await fetch(`/productos/${producto.id}`, {
          method: 'DELETE',
          headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${localStorage.getItem('authToken')}`,  // Autenticación si es necesaria
          },
        });

        if (!response.ok) {
          throw new Error('Error al eliminar el producto');
        }

        // Actualiza la lista de productos después de la eliminación
        setProductos(productos.filter((prod) => prod.id !== producto.id));
        alert(`Producto ${producto.nombre} eliminado correctamente.`);
      } catch (error) {
        console.error("Error al eliminar el producto:", error);
        alert("Hubo un error al intentar eliminar el producto.");
      }
    }
  };

  return (
    <div className="p-4">
      <Destacado />
      <div id="novedades"></div>
      <div className="max-w-7xl mx-auto mt-12 text-center">
        <h1 className="text-3xl font-bold text-gray-800">Novedades</h1>
        <p className="text-gray-600 mt-2">Descubre los últimos productos agregados</p>
      </div>

      <div className="max-w-7xl mx-auto mt-8">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
          {productos.slice(0, mostrarMasNovedades ? productos.length : 8).map((producto) => (
            <div
              key={producto.id}
              className="bg-white rounded-lg shadow-lg p-4 flex flex-col items-center cursor-pointer"
              onClick={() => verProducto(producto)} // Llama a la función verProducto solo al hacer clic en la card
            >
              <p className="text-gray-600 text-center">{producto.categoria}</p>
              {producto.imagen && (
                <img
                  src={producto.imagen}
                  alt={producto.nombre}
                  className="w-32 h-32 object-cover mb-4"
                />
              )}
              <h2 className="text-xl font-bold text-center">
                {esAdmin ? `${producto.id} - ${producto.nombre}` : producto.nombre}
              </h2>
              <p className="text-green-600 font-bold mt-2 text-center">${producto.precio}</p>
              <p className="text-gray-700 text-center">Stock: {producto.stock}</p>

              <button
                onClick={(e) => {
                  e.stopPropagation(); // Evita la navegación al hacer clic en el botón
                  anadirAlCarrito(producto);
                }}
                className="bg-black text-white px-4 py-2 mt-4 rounded hover:bg-gray-600 transition duration-300"
              >
                Añadir al carrito
              </button>

              {esAdmin && (
                <div className="mt-4 flex flex-col space-y-2">
                  <button
                    onClick={(e) => {
                      e.stopPropagation();  // Evita la propagación para que solo se ejecute la función de ver detalles
                      abrirModalProducto(producto);
                    }}
                    className="bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600 transition duration-300"
                  >
                    Ver Detalles
                  </button>
                  <div className="flex space-x-4">
                    <button
                      onClick={(e) => handleModificar(producto, e)} // Llamar a handleModificar y evitar la propagación
                      className="bg-green-500 text-white px-4 py-2 rounded hover:bg-green-600 transition duration-300"
                    >
                      Modificar
                    </button>
                    <button
                      onClick={(e) => handleEliminar(producto, e)} // También evitar la propagación aquí
                      className="bg-red-500 text-white px-4 py-2 rounded hover:bg-red-600 transition duration-300"
                    >
                      Eliminar
                    </button>
                  </div>
                </div>
              )}
            </div>
          ))}
        </div>

        {productos.length > 8 && (
          <div className="flex justify-center mt-8">
            <button
              onClick={() => setMostrarMasNovedades(!mostrarMasNovedades)}
              className="px-6 py-2 border border-gray-400 rounded-full text-gray-700 hover:bg-gray-100 transition"
            >
              {mostrarMasNovedades ? 'Ver Menos' : 'Ver Más'}
            </button>
          </div>
        )}
      </div>

      {/* Modal para detalles del producto */}
      {mostrarModalDetalles && modalProducto && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white p-6 rounded-lg shadow-lg w-full max-w-md">
            <h2 className="text-2xl font-bold mb-4">{modalProducto.nombre}</h2>
            <p><strong>ID:</strong> {modalProducto.id}</p>
            <p><strong>Categoría:</strong> {modalProducto.categoria}</p>
            <p><strong>Marca:</strong> {modalProducto.marca}</p>
            <p><strong>Descripción:</strong> {modalProducto.descripcion}</p>
            <p><strong>Precio:</strong> ${modalProducto.precio}</p>
            <p><strong>Stock:</strong> {modalProducto.stock}</p>
            {modalProducto.imagen && (
              <img
                src={modalProducto.imagen}
                alt={modalProducto.nombre}
                className="w-full h-32 object-cover mt-4"
              />
            )}
            <button
              onClick={cerrarModalProducto}
              className="mt-4 bg-gray-500 text-white px-4 py-2 rounded hover:bg-gray-600"
            >
              Cerrar
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

export default Catalogo;
