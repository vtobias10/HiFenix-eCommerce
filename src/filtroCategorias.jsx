import React, { useEffect, useState } from 'react';
import { useSearchParams, useNavigate } from 'react-router-dom';
import Navbar from './Navbar';
import { useCarrito } from './CarritoContext';

const FiltroCategorias = () => {
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();
  const { carrito, actualizarCarrito } = useCarrito();
  const categoriaSeleccionada = searchParams.get('categoria');

  const [productos, setProductos] = useState([]);
  const [productosFiltrados, setProductosFiltrados] = useState([]);

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

  useEffect(() => {
    const productosGuardados = JSON.parse(localStorage.getItem('productos')) || [];
    setProductos(productosGuardados);
  }, []);

  useEffect(() => {
    if (categoriaSeleccionada) {
      const filtrados = productos.filter(
        (producto) => producto.categoria === categoriaSeleccionada
      );
      setProductosFiltrados(filtrados);
    }
  }, [categoriaSeleccionada, productos]);

  const anadirAlCarrito = (producto) => {
    const productoExistente = carrito.find((item) => item.id === producto.id);
    const nuevoCarrito = productoExistente
      ? carrito.map((item) =>
          item.id === producto.id
            ? { ...item, cantidad: (item.cantidad || 1) + 1 }
            : item
        )
      : [...carrito, { ...producto, cantidad: 1 }];

    actualizarCarrito(nuevoCarrito);
    alert(`${producto.nombre} ha sido añadido al carrito.`);
  };

  const verProducto = (producto) => {
    localStorage.setItem('productoSeleccionado', JSON.stringify(producto));
    navigate('/vistaProductos');
  };

  return (
    <>
      <Navbar />
      <div className="flex">
        {/* Panel lateral fijo */}
        <div className="w-1/4 h-screen bg-gray-100 p-4 fixed top-16 left-0 overflow-y-auto">
          <h2 className="text-lg font-bold mb-4">Categorías</h2>
          <ul>
            {categorias.map((categoria) => (
              <li key={categoria}>
                <button
                  className={`block w-full text-left px-4 py-2 ${
                    categoria === categoriaSeleccionada ? 'bg-gray-300 font-bold' : 'hover:bg-gray-200'
                  }`}
                  onClick={() => navigate(`/filtroCategorias?categoria=${categoria}`)}
                >
                  {categoria}
                </button>
              </li>
            ))}
          </ul>
        </div>

        {/* Contenido principal con scrollbar */}
        <div className="flex-1 ml-[25%] p-6 h-screen overflow-y-scroll">
          <h1 className="text-2xl font-bold mb-4">
            Categoría: {categoriaSeleccionada || 'Selecciona una categoría'}
          </h1>

          {categoriaSeleccionada ? (
            productosFiltrados.length > 0 ? (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                {productosFiltrados.map((producto) => (
                  <div
                    key={producto.id}
                    className="bg-white p-4 rounded-lg shadow-md flex flex-col items-center cursor-pointer"
                    onClick={() => verProducto(producto)} // Llama a la función verProducto al hacer clic en la tarjeta
                  >
                    {/* Imagen del producto */}
                    <img
                      src={producto.imagen || 'https://via.placeholder.com/150'}
                      alt={producto.nombre}
                      className="w-32 h-32 object-cover mb-4"
                    />
                    {/* Detalles del producto */}
                    <h2 className="text-lg font-bold mb-2">{producto.nombre}</h2>
                    <p className="text-gray-600 mb-2">${producto.precio}</p>

                    {/* Botón para añadir al carrito */}
                    <button
                      onClick={(e) => {
                        e.stopPropagation(); // Detiene la propagación para evitar que se active el onClick de la tarjeta
                        anadirAlCarrito(producto); // Añade el producto al carrito
                      }}
                      className="bg-black text-white px-4 py-2 mt-2 rounded hover:bg-gray-700"
                    >
                      Añadir al carrito
                    </button>
                  </div>
                ))}
              </div>
            ) : (
              <p className="text-gray-500">No hay productos disponibles en esta categoría.</p>
            )
          ) : (
            <p>Por favor, selecciona una categoría del panel lateral.</p>
          )}
        </div>
      </div>
    </>
  );
};

export default FiltroCategorias;
