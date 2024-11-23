import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import Destacado from './Destacado';
import { useCarrito } from './CarritoContext';
import intelLogo from './assets/intelLogo.png';
import amdLogo from './assets/amdLogo.png';
import nvidiaLogo from './assets/nvidiaLogo.png';
import logitechLogo from './assets/logitechLogo.png';

const Catalogo = ({ esAdmin = false, onModificar, onEliminar }) => {
  const [productos, setProductos] = useState([]);
  const [relevantes, setRelevantes] = useState([]);
  const [mostrarMasNovedades, setMostrarMasNovedades] = useState(false);
  const [mostrarMasRelevantes, setMostrarMasRelevantes] = useState(false);
  const [mostrarModalDetalles, setMostrarModalDetalles] = useState(false);
  const [modalProducto, setModalProducto] = useState(null);
  const [mostrarModalRelevantes, setMostrarModalRelevantes] = useState(false);

  const navigate = useNavigate();
  
  const { carrito, actualizarCarrito } = useCarrito(); // Usamos el contexto

  useEffect(() => {
    const productosGuardados = JSON.parse(localStorage.getItem('productos')) || [];
    setProductos(productosGuardados);

    const relevantesGuardados = JSON.parse(localStorage.getItem('relevantes')) || [];
    setRelevantes(relevantesGuardados);
  }, []);

  const guardarRelevantes = (relevantesActualizados) => {
    setRelevantes(relevantesActualizados);
    localStorage.setItem('relevantes', JSON.stringify(relevantesActualizados));
  };

  const agregarRelevante = (producto) => {
    if (!relevantes.find((p) => p.id === producto.id)) {
      const nuevosRelevantes = [...relevantes, producto];
      guardarRelevantes(nuevosRelevantes);
    }
    setMostrarModalRelevantes(false);
  };

  const eliminarRelevante = (id) => {
    const nuevosRelevantes = relevantes.filter((p) => p.id !== id);
    guardarRelevantes(nuevosRelevantes);
  };

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
    localStorage.setItem('productoSeleccionado', JSON.stringify(producto));
    navigate('/vistaProductos');
  };  

  return (
    <div className="p-4">
      <Destacado />
      <div id="novedades"></div>
      {/* Novedades */}
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
            onClick={() => verProducto(producto)} // Llama a la función verProducto
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
                    onClick={() => abrirModalProducto(producto)}
                    className="bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600 transition duration-300"
                  >
                    Ver Detalles
                  </button>
                  <div className="flex space-x-4">
                    <button
                      onClick={() => onModificar(producto.id)}
                      className="bg-green-500 text-white px-4 py-2 rounded hover:bg-green-600 transition duration-300"
                    >
                      Modificar
                    </button>
                    <button
                      onClick={() => onEliminar(producto.id)}
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

      {/* Más Relevantes */}
      <div className="max-w-7xl mx-auto mt-12 text-center">
        <h1 className="text-3xl font-bold text-gray-800">Más Relevantes</h1>
        <p className="text-gray-600 mt-2">Productos destacados seleccionados</p>
      </div>

      <div className="max-w-7xl mx-auto mt-8">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
          {relevantes.slice(0, mostrarMasRelevantes ? relevantes.length : 4).map((producto) => (
            <div
              onClick={() => verProducto(producto)} // Llama a la función verProducto
              key={producto.id}
              className="bg-white rounded-lg shadow-lg p-4 flex flex-col items-center cursor-pointer"
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
                onClick={() => anadirAlCarrito(producto)}
                className="bg-black text-white px-4 py-2 mt-4 rounded hover:bg-gray-600 transition duration-300"
              >
                Añadir al carrito
              </button>

              {esAdmin && (
                <div className="flex flex-col space-y-2 mt-4">
                  <button
                    onClick={() => eliminarRelevante(producto.id)}
                    className="bg-red-500 text-white px-4 py-2 rounded hover:bg-red-600 transition duration-300"
                  >
                    Quitar de Relevantes
                  </button>
                  <button
                    onClick={() => abrirModalProducto(producto)}
                    className="bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600 transition duration-300"
                  >
                    Ver Detalles
                  </button>
                </div>
              )}
            </div>
          ))}
        </div>

        {relevantes.length > 4 && (
          <div className="flex justify-center mt-8">
            <button
              onClick={() => setMostrarMasRelevantes(!mostrarMasRelevantes)}
              className="px-6 py-2 border border-gray-400 rounded-full text-gray-700 hover:bg-gray-100 transition"
            >
              {mostrarMasRelevantes ? 'Ver Menos' : 'Ver Más'}
            </button>
          </div>
        )}

        {esAdmin && (
          <div className="flex justify-center mt-8">
            <button
              onClick={() => setMostrarModalRelevantes(true)}
              className="px-6 py-2 bg-black text-white rounded-full hover:bg-gray-600 transition duration-300"
            >
              Agregar Más Relevantes
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

      {/* Sección Buscar por Marcas */}
      <div className="max-w-7xl mx-auto mt-12 text-center">
        <h2 className="text-3xl font-bold text-gray-800 mb-4">Buscar por Marcas</h2>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-8">
          <button
            onClick={() => navigate(`/filtroMarcas?marca=Intel}`)}
            className="bg-gray-100 rounded-lg shadow-lg p-6 flex items-center justify-center"
          >
            <img src={intelLogo} alt="Intel" className="w-32" />
          </button>
          <button
          onClick={() => navigate(`/filtroMarcas?marca=AMD`)}
            className="bg-gray-100 rounded-lg shadow-lg p-6 flex items-center justify-center"
          >
            <img src={amdLogo} alt="AMD" className="w-32" />
          </button>
          <button
          onClick={() => navigate(`/filtroMarcas?marca=NVIDIA`)}
            className="bg-gray-100 rounded-lg shadow-lg p-6 flex items-center justify-center"
          >
             <img src={nvidiaLogo} alt="NVIDIA" className="w-32" />
          </button>
          <button
            onClick={() => navigate(`/filtroMarcas?marca=Logitech`)}
            className="bg-gray-100 rounded-lg shadow-lg p-6 flex items-center justify-center"
          >
             <img src={logitechLogo} alt="Logitech" className="w-32" />
          </button>
        </div>
        <div className="mt-8">
          <button
            onClick={() => navigate('/filtroMarcas')}
            className="px-6 py-2 border border-gray-400 rounded-full text-gray-700 hover:bg-gray-100 transition"
          >
            Ver Todas
          </button>
        </div>
      </div>

      {/* Modal para agregar relevantes */}
      {mostrarModalRelevantes && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white p-6 rounded-lg shadow-lg w-full max-w-4xl max-h-[70vh] overflow-y-auto">
            <button
              onClick={() => setMostrarModalRelevantes(false)}
              className="absolute top-4 right-4 text-gray-700 text-2xl hover:text-red-600"
            >
              &times;
            </button>
            <h2 className="text-2xl font-bold mb-4 text-center">Selecciona un Producto</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
              {productos.map((producto) => (
                <div
                  key={producto.id}
                  className="bg-gray-100 p-4 rounded-lg flex flex-col items-center"
                >
                  {producto.imagen && (
                    <img
                      src={producto.imagen}
                      alt={producto.nombre}
                      className="w-20 h-20 object-cover mb-2"
                    />
                  )}
                  <h3 className="text-lg font-bold text-center">{producto.nombre}</h3>
                  <button
                    onClick={() => agregarRelevante(producto)}
                    className="mt-2 bg-black text-white px-4 py-2 rounded hover:bg-gray-600 transition duration-300"
                  >
                    Agregar
                  </button>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}
    </div>
  );
};



export default Catalogo;
