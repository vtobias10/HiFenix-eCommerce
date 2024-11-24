import React, { useState, useEffect } from 'react';
import NavbarAdmin from './navbarAdmin'; // Importa el NavbarAdmin
import { useLocation, useNavigate } from 'react-router-dom';

const ModificarProducto = () => {
  const [id, setId] = useState('');
  const [producto, setProducto] = useState(null);
  const [formData, setFormData] = useState({
    nombre: '',
    descripcion: '',
    precio: '',
    stock: '',
    imagenUrl: ''
  });
  const [mensaje, setMensaje] = useState('');

  const navigate = useNavigate();
  const location = useLocation(); // Usamos el hook para obtener los parámetros pasados

  // Función para buscar el producto por ID
  const buscarProducto = async (id) => {
    if (!id) return;  // Si no hay ID, no hacemos nada

    try {
      const response = await fetch(`/productos/${id}`);
      if (response.ok) {
        const productoData = await response.json();
        setProducto(productoData);
        setFormData({
          nombre: productoData.nombre,
          descripcion: productoData.descripcion,
          precio: productoData.precio,
          stock: productoData.stock,
          imagenUrl: productoData.imagenUrl
        });
        setMensaje(''); // Limpiamos el mensaje de error si se encuentra el producto
      } else {
        setProducto(null);
        setMensaje('Producto no encontrado.');
      }
    } catch (error) {
      setProducto(null);
      setMensaje('Error al obtener el producto.');
    }
  };

  // Extraemos el id desde el estado pasado en la navegación
  useEffect(() => {
    if (location.state && location.state.productoId) {
      setId(location.state.productoId);  // Establecemos el id del producto
      buscarProducto(location.state.productoId);  // Buscamos el producto por id
    }
  }, [location.state]);

  const handleGuardarCambios = async (e) => {
    e.preventDefault();
    
    const token = localStorage.getItem('authToken');  // Verifica que el token esté guardado
    if (!token) {
      setMensaje('No se encuentra el token de autenticación.');
      return;
    }
  
    try {
      const response = await fetch(`/productos/${id}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`,
        },
        body: JSON.stringify(formData),
      });
  
      if (response.ok) {
        setMensaje('Producto modificado exitosamente.');
        // Puedes redirigir o hacer alguna acción después de guardar
      } else {
        setMensaje('Error al modificar el producto.');
      }
    } catch (error) {
      setMensaje('Error en la conexión.');
    }
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData((prevData) => ({
      ...prevData,
      [name]: value
    }));
  };

  return (
    <div className="min-h-screen bg-gray-100">
      <NavbarAdmin />

      <div className="flex flex-col items-center justify-center mt-6">
        <h1 className="text-3xl font-bold mb-6">Modificar Producto</h1>

        {mensaje && <p className={`mb-4 ${producto ? 'text-green-500' : 'text-red-500'} font-bold`}>{mensaje}</p>}

        {/* Formulario de búsqueda o modificación */}
        <div className="w-full max-w-md bg-white p-6 rounded-lg shadow-lg mb-6">
          <div className="mb-4">
            <label className="block text-gray-700 font-bold mb-2">ID del Producto</label>
            <input
              type="number"
              value={id}
              onChange={(e) => {
                setId(e.target.value);  // Permite buscar un producto por ID
                setProducto(null);  // Limpiamos los datos del producto al cambiar el ID
                setMensaje('');  // Limpiamos el mensaje
                buscarProducto(e.target.value);  // Realizamos la búsqueda inmediatamente
              }}
              className="w-full px-3 py-2 border rounded focus:outline-none focus:ring-2 focus:ring-blue-500"
              placeholder="Ingrese el ID del producto"
            />
          </div>
        </div>

        {producto && (
          <form onSubmit={handleGuardarCambios} className="w-full max-w-5xl bg-white p-6 rounded-lg shadow-lg flex space-x-6">
            <div className="w-1/2">
              <h2 className="text-xl font-bold mb-4">Información Actual</h2>
              <p><strong>ID:</strong> {producto.id}</p>
              <p><strong>Nombre:</strong> {producto.nombre}</p>
              <p><strong>Descripción:</strong> {producto.descripcion}</p>
              <p><strong>Precio:</strong> ${producto.precio}</p>
              <p><strong>Stock:</strong> {producto.stock}</p>
              {producto.imagenUrl && (
                <img
                  src={producto.imagenUrl}
                  alt={producto.nombre}
                  className="w-42 h-42 object-cover rounded mt-4"
                />
              )}
            </div>

            {/* Formulario de modificación (derecha) */}
            <div className="w-1/2">
              <div className="mb-4">
                <label className="block text-gray-700 font-bold mb-2">ID del Producto</label>
                <input
                  type="text"
                  value={id}
                  className="w-full px-3 py-2 border rounded focus:outline-none focus:ring-2 focus:ring-blue-500"
                  readOnly // Hace que el campo sea no editable
                />
              </div>
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
                <label className="block text-gray-700 font-bold mb-2">Imagen del Producto (URL)</label>
                <input
                  type="text"
                  name="imagenUrl"
                  value={formData.imagenUrl}
                  onChange={handleInputChange}
                  className="w-full px-3 py-2 border rounded focus:outline-none focus:ring-2 focus:ring-blue-500"
                  required
                />
              </div>
              <button
                type="submit"
                className="w-full bg-black text-white py-2 rounded hover:bg-gray-600 transition duration-300"
              >
                Guardar Cambios
              </button>
            </div>
          </form>
        )}
      </div>
    </div>
  );
};

export default ModificarProducto;
