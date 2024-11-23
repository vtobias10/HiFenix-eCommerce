import React, { useState, useEffect } from 'react';
import NavbarAdmin from './navbarAdmin'; // Importa el NavbarAdmin
import { useLocation } from 'react-router-dom';

const ModificarProducto = () => {
  const [id, setId] = useState('');
  const [producto, setProducto] = useState(null);
  const [formData, setFormData] = useState({
    nombre: '',
    descripcion: '',
    precio: '',
    stock: '',
    imagen: '',
    categoria: '',
    marca: ''
  });
  const [mensaje, setMensaje] = useState('');
  const [modalDescripcion, setModalDescripcion] = useState({ abierto: false, descripcion: '' });

  const location = useLocation();

  useEffect(() => {
    const params = new URLSearchParams(location.search);
    const idParam = params.get('id');

    if (idParam) {
      setId(idParam);
      buscarProducto(idParam);
    } else {
      resetFormulario(); // Si no hay ID en la URL, resetea el formulario
    }
  }, [location]);

  const buscarProducto = (id) => {
    const productosGuardados = JSON.parse(localStorage.getItem('productos')) || [];
    const productoEncontrado = productosGuardados.find((prod) => prod.id === parseInt(id));

    if (productoEncontrado) {
      setProducto(productoEncontrado);
      setFormData(productoEncontrado); // Llenar el formulario con los datos del producto encontrado
      setMensaje('');
    } else {
      setProducto(null);
      setMensaje(id ? 'Producto no encontrado.' : '');
    }
  };

  const resetFormulario = () => {
    setId('');
    setProducto(null);
    setFormData({
      nombre: '',
      descripcion: '',
      precio: '',
      stock: '',
      imagen: '',
      categoria: '',
      marca: ''
    });
    setMensaje('');
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData((prevData) => ({
      ...prevData,
      [name]: value
    }));
  };

  const handleImageChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setFormData((prevData) => ({
          ...prevData,
          imagen: reader.result
        }));
      };
      reader.readAsDataURL(file);
    }
  };

  const handleGuardarCambios = (e) => {
    e.preventDefault();

    const productosGuardados = JSON.parse(localStorage.getItem('productos')) || [];
    const indice = productosGuardados.findIndex((prod) => prod.id === parseInt(id));

    if (indice !== -1) {
      productosGuardados[indice] = { ...formData, id: parseInt(id) }; // Actualizar el producto
      localStorage.setItem('productos', JSON.stringify(productosGuardados)); // Guardar en localStorage
      setMensaje('Producto modificado exitosamente.');
    } else {
      setMensaje('Error al modificar el producto.');
    }
  };

  const handleIdChange = (e) => {
    const idIngresado = e.target.value;
    setId(idIngresado);
    buscarProducto(idIngresado); // Búsqueda en tiempo real
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
        <h1 className="text-3xl font-bold mb-6">Modificar Producto</h1>

        {mensaje && <p className={`mb-4 ${producto ? 'text-green-500' : 'text-red-500'} font-bold`}>{mensaje}</p>}

        {/* Entrada para buscar producto */}
        <div className="w-full max-w-md bg-white p-6 rounded-lg shadow-lg mb-6">
          <div className="mb-4">
            <label className="block text-gray-700 font-bold mb-2">ID del Producto</label>
            <input
              type="number"
              value={id}
              onChange={handleIdChange}
              className="w-full px-3 py-2 border rounded focus:outline-none focus:ring-2 focus:ring-blue-500"
              placeholder="Ingrese el ID del producto"
            />
          </div>
        </div>

        {producto && (
          <div className="w-full max-w-5xl bg-white p-6 rounded-lg shadow-lg flex space-x-6">
            {/* Información actual del producto (izquierda) */}
            <div className="w-1/2">
              <h2 className="text-xl font-bold mb-4">Información Actual</h2>
              <p><strong>ID:</strong> {producto.id}</p>
              <p><strong>Nombre:</strong> {producto.nombre}</p>
              <p><strong>Categoría:</strong> {producto.categoria}</p>
              <p><strong>Marca:</strong> {producto.marca}</p>
              <p>
                <strong>Descripción:</strong>{' '}
                {producto.descripcion.length > 50 ? (
                  <>
                    {producto.descripcion.slice(0, 50)}...
                    <button
                      className="text-blue-500 underline ml-2"
                      onClick={() => abrirModalDescripcion(producto.descripcion)}
                    >
                      Ver más
                    </button>
                  </>
                ) : (
                  producto.descripcion
                )}
              </p>
              <p><strong>Precio:</strong> ${producto.precio}</p>
              <p><strong>Stock:</strong> {producto.stock}</p>
              {producto.imagen && (
                <img
                  src={producto.imagen}
                  alt={producto.nombre}
                  className="w-42 h-42 object-cover rounded mt-4"
                />
              )}
            </div>

            {/* Formulario de modificación (derecha) */}
            <form onSubmit={handleGuardarCambios} className="w-1/2">
              <div className="mb-4">
                <label className="block text-gray-700 font-bold mb-2">Nombre del Producto</label>
                <input
                  type="text"
                  name="nombre"
                  value={formData.nombre}
                  onChange={handleInputChange}
                  className="w-full px-3 py-2 border rounded focus:outline-none focus:ring-2 focus:ring-blue-500"
                  required
                />
              </div>
              <div className="mb-4">
                <label className="block text-gray-700 font-bold mb-2">Categoría</label>
                <select
                  name="categoria"
                  value={formData.categoria}
                  onChange={handleInputChange}
                  className="w-full px-3 py-2 border rounded focus:outline-none focus:ring-2 focus:ring-blue-500"
                  required
                >
                  <option value="" disabled>Selecciona una categoría</option>
                  <option value="Procesadores">Procesadores</option>
                  <option value="Placas de Video">Placas de Video</option>
                  <option value="Memorias RAM">Memorias RAM</option>
                  <option value="Auriculares">Auriculares</option>
                  <option value="Teclados">Teclados</option>
                  <option value="Mouses">Mouses</option>
                  <option value="Joysticks">Joysticks</option>
                  <option value="Micrófonos">Micrófonos</option>
                  <option value="Otros">Otros</option>
                </select>
              </div>
              <div className="mb-4">
                <label className="block text-gray-700 font-bold mb-2">Marca</label>
                <select
                  name="marca"
                  value={formData.marca}
                  onChange={handleInputChange}
                  className="w-full px-3 py-2 border rounded focus:outline-none focus:ring-2 focus:ring-blue-500"
                  required
                >
                  <option value="" disabled>Selecciona una marca</option>
                  <option value="Intel">Intel</option>
                  <option value="AMD">AMD</option>
                  <option value="Logitech">Logitech</option>
                  <option value="Redragon">Redragon</option>
                  <option value="Razer">Razer</option>
                  <option value="Hyperx">Hyperx</option>
                  <option value="Corsair">Corsair</option>
                  <option value="Otros">Otros</option>
                </select>
              </div>
              <div className="mb-4">
                <label className="block text-gray-700 font-bold mb-2">Descripción</label>
                <textarea
                  name="descripcion"
                  value={formData.descripcion}
                  onChange={handleInputChange}
                  className="w-full px-3 py-2 border rounded focus:outline-none focus:ring-2 focus:ring-blue-500 resize-none"
                  required
                />
              </div>
              <div className="mb-4">
                <label className="block text-gray-700 font-bold mb-2">Precio</label>
                <input
                  type="number"
                  name="precio"
                  value={formData.precio}
                  onChange={handleInputChange}
                  className="w-full px-3 py-2 border rounded focus:outline-none focus:ring-2 focus:ring-blue-500"
                  required
                />
              </div>
              <div className="mb-4">
                <label className="block text-gray-700 font-bold mb-2">Stock</label>
                <input
                  type="number"
                  name="stock"
                  value={formData.stock}
                  onChange={handleInputChange}
                  className="w-full px-3 py-2 border rounded focus:outline-none focus:ring-2 focus:ring-blue-500"
                  required
                />
              </div>
              <div className="mb-4">
                <label className="block text-gray-700 font-bold mb-2">Imagen del Producto</label>
                <input
                  type="file"
                  accept="image/*"
                  onChange={handleImageChange}
                  className="w-full px-3 py-2 border rounded focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
              </div>
              <button
                type="submit"
                className="w-full bg-black text-white py-2 rounded hover:bg-gray-600 transition duration-300"
              >
                Guardar Cambios
              </button>
            </form>
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
      </div>
    </div>
  );
};

export default ModificarProducto;
