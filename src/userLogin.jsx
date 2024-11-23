import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';

const UserLogin = () => {
  const navigate = useNavigate();

  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    if (name === 'email') {
      setEmail(value);
    } else if (name === 'password') {
      setPassword(value);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      const response = await fetch('/usuarios/login', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ correo: email, contrasena: password }),
      });

      const data = await response.json();

      if (response.ok) {
        // Verificar si la respuesta contiene el token y el rol
        if (data.token && data.rol) {
          // Guardar el token y rol en localStorage
          localStorage.setItem('authToken', data.token);
          localStorage.setItem('currentUser', JSON.stringify({ email, role: data.rol }));

          // Redirigir según el rol
          if (data.rol === 'admin') {
            navigate('/menuAdmin'); // Redirige al menuAdmin si el rol es admin
          } else {
            navigate('/'); // Redirige a la página principal si no es admin
          }
        } else {
          setError('Error: Rol o token no recibido.');
        }
      } else {
        setError(data.message || 'Correo o contraseña incorrectos.');
      }
    } catch (err) {
      setError('Error en la conexión con el servidor');
    }
  };

  const handleRegisterRedirect = () => {
    navigate('/userRegister');
  };

  // UseEffect para redirigir automáticamente si ya existe un token en localStorage
  useEffect(() => {
    const currentUser = localStorage.getItem('currentUser');
    if (currentUser) {
      const user = JSON.parse(currentUser);
      if (user.rol === 'admin') {
        navigate('/menuAdmin');
      } else {
        navigate('/');
      }
    }
  }, [navigate]);

  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-gray-100">
      <nav className="w-full bg-white shadow-md fixed top-0 left-0 px-4 py-3 flex justify-between items-center">
        <span className="text-xl font-bold cursor-pointer" onClick={() => navigate('/')}>
          Hi Fenix
        </span>
        <button
          className="bg-black text-white px-4 py-2 rounded hover:bg-gray-600"
          onClick={handleRegisterRedirect}
        >
          Registrarse
        </button>
      </nav>

      <div className="w-full max-w-md mt-20 p-6 bg-white rounded-lg shadow-lg">
        <h2 className="text-2xl font-bold text-center mb-6">Iniciar Sesión</h2>

        {error && <div className="text-red-500 text-center mb-4">{error}</div>}

        <form onSubmit={handleSubmit} autoComplete="off">
          <div className="mb-4">
            <label className="block text-gray-700 text-sm font-bold mb-2">
              Correo <span className="text-red-500">*</span>
            </label>
            <input
              type="email"
              name="email"
              value={email}
              onChange={handleInputChange}
              className="w-full px-3 py-2 border rounded focus:outline-none focus:ring-2 focus:ring-blue-500"
              required
              autoComplete="off"
            />
          </div>
          <div className="mb-6">
            <label className="block text-gray-700 text-sm font-bold mb-2">
              Contraseña <span className="text-red-500">*</span>
            </label>
            <input
              type="password"
              name="password"
              value={password}
              onChange={handleInputChange}
              className="w-full px-3 py-2 border rounded focus:outline-none focus:ring-2 focus:ring-blue-500"
              required
            />
          </div>
          <button
            type="submit"
            className="w-full bg-black text-white py-2 rounded hover:bg-gray-600 transition-colors duration-300"
          >
            Iniciar Sesión
          </button>
        </form>
      </div>
    </div>
  );
};

export default UserLogin;