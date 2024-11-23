import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';

const UserRegister = () => {
  const navigate = useNavigate();

  const [formData, setFormData] = useState({
    nombre: '',
    correo: '',
    telefono: '',
    contrasena: '',
    confirmarContrasena: '',
    direccion: '',
  });

  const [error, setError] = useState('');

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData((prevData) => ({
      ...prevData,
      [name]: value,
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    // Validar nombre
    const nameRegex = /^[a-zA-ZÀ-ÿ\u00f1\u00d1 ]+$/;
    if (!nameRegex.test(formData.nombre)) {
      setError('El nombre solo debe contener letras.');
      return;
    }

    // Validar longitud del teléfono
    if (formData.telefono.length < 8 || formData.telefono.length > 15) {
      setError('El teléfono debe tener entre 8 y 15 dígitos.');
      return;
    }

    // Validar contraseñas
    if (formData.contrasena.length < 6 || formData.contrasena.length > 50) {
      setError('La contraseña debe tener entre 6 y 50 caracteres.');
      return;
    }

    if (formData.contrasena !== formData.confirmarContrasena) {
      setError('Las contraseñas no coinciden.');
      return;
    }

    const newUser = {
      nombre: formData.nombre,
      correo: formData.correo,
      contrasena: formData.contrasena,
      telefono: formData.telefono,
      direccion: formData.direccion,
      esAdmin: false, // Asumimos que los nuevos usuarios son 'client'
    };

    try {
      const response = await fetch('/usuarios/registro', { // La URL es relativa, se maneja a través del proxy
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(newUser),
      });

      const data = await response.json();
      if (response.ok) {
        navigate('/userLogin');
      } else {
        setError(data.message || 'Error al registrar el usuario');
      }
    } catch (err) {
      setError('Error en la conexión con el servidor');
    }
  };

  const handleLoginRedirect = () => {
    navigate('/userLogin');
  };

  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-gray-100">
      <nav className="w-full bg-white shadow-md fixed top-0 left-0 px-4 py-3 flex justify-between items-center">
        <span className="text-xl font-bold cursor-pointer" onClick={() => navigate('/')}>
          Hi Fenix
        </span>
        <button
          className="bg-black text-white px-4 py-2 rounded hover:bg-gray-600"
          onClick={handleLoginRedirect}
        >
          Iniciar Sesión
        </button>
      </nav>

      <div className="w-full max-w-md mt-20 p-6 bg-white rounded-lg shadow-lg">
        <h2 className="text-2xl font-bold text-center mb-6">Registro</h2>

        {error && <div className="text-red-500 text-center mb-4">{error}</div>}

        <form onSubmit={handleSubmit} autoComplete="off">
          <div className="mb-4">
            <label className="block text-gray-700 text-sm font-bold mb-2">
              Nombre <span className="text-red-500">*</span>
            </label>
            <input
              type="text"
              name="nombre"
              value={formData.nombre}
              onChange={handleInputChange}
              className="w-full px-3 py-2 border rounded focus:outline-none focus:ring-2 focus:ring-blue-500"
              maxLength="30"
              pattern="^[a-zA-ZÀ-ÿ\u00f1\u00d1 ]+$"
              title="El nombre solo debe contener letras."
              required
            />
          </div>

          <div className="mb-4">
            <label className="block text-gray-700 text-sm font-bold mb-2">
              Correo <span className="text-red-500">*</span>
            </label>
            <input
              type="email"
              name="correo"
              value={formData.correo}
              onChange={handleInputChange}
              className="w-full px-3 py-2 border rounded focus:outline-none focus:ring-2 focus:ring-blue-500"
              maxLength="50"
              required
            />
          </div>

          <div className="mb-4">
            <label className="block text-gray-700 text-sm font-bold mb-2">
              Teléfono <span className="text-red-500">*</span>
            </label>
            <input
              type="tel"
              name="telefono"
              value={formData.telefono}
              onChange={handleInputChange}
              className="w-full px-3 py-2 border rounded focus:outline-none focus:ring-2 focus:ring-blue-500"
              maxLength="15"
              minLength="8"
              pattern="^\d+$"
              title="El teléfono solo debe contener números."
              required
            />
          </div>

          <div className="mb-4">
            <label className="block text-gray-700 text-sm font-bold mb-2">
              Dirección
            </label>
            <input
              type="text"
              name="direccion"
              value={formData.direccion}
              onChange={handleInputChange}
              className="w-full px-3 py-2 border rounded focus:outline-none focus:ring-2 focus:ring-blue-500"
              maxLength="100"
            />
          </div>

          <div className="mb-4">
            <label className="block text-gray-700 text-sm font-bold mb-2">
              Contraseña <span className="text-red-500">*</span>
            </label>
            <input
              type="password"
              name="contrasena"
              value={formData.contrasena}
              onChange={handleInputChange}
              className="w-full px-3 py-2 border rounded focus:outline-none focus:ring-2 focus:ring-blue-500"
              maxLength="50"
              minLength="6"
              required
            />
          </div>

          <div className="mb-6">
            <label className="block text-gray-700 text-sm font-bold mb-2">
              Confirmar Contraseña <span className="text-red-500">*</span>
            </label>
            <input
              type="password"
              name="confirmarContrasena"
              value={formData.confirmarContrasena}
              onChange={handleInputChange}
              className="w-full px-3 py-2 border rounded focus:outline-none focus:ring-2 focus:ring-blue-500"
              maxLength="50"
              minLength="6"
              required
            />
          </div>

          <button
            type="submit"
            className="w-full bg-black text-white py-2 rounded hover:bg-gray-600 transition-colors duration-300"
          >
            Registrarse
          </button>
        </form>
      </div>
    </div>
  );
};

export default UserRegister;
