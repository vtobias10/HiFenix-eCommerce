import React, { useState, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import Navbar from './Navbar';
import { FaUserCircle, FaPencilAlt, FaTimes } from 'react-icons/fa';

const VerPerfil = () => {
  const navigate = useNavigate();
  const currentUser = JSON.parse(localStorage.getItem('currentUser'));
  const [userData, setUserData] = useState({
    firstName: currentUser?.firstName || '',
    lastName: currentUser?.lastName || '',
    email: currentUser?.email || '',
    phone: currentUser?.phone || '',
  });
  const [editableFields, setEditableFields] = useState({
    firstName: false,
    lastName: false,
    email: false,
    phone: false,
  });
  const [modalOpen, setModalOpen] = useState(false);
  const [passwordConfirmation, setPasswordConfirmation] = useState('');
  const [currentPassword, setCurrentPassword] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [confirmNewPassword, setConfirmNewPassword] = useState('');
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const inputRefs = useRef({});

  const handleInputChange = (e) => {
    setUserData({ ...userData, [e.target.name]: e.target.value });
  };

  const toggleEdit = (field) => {
    setEditableFields((prev) => ({
      ...prev,
      [field]: !prev[field],
    }));

    // Reset field value if canceling edit
    if (editableFields[field]) {
      setUserData((prev) => ({
        ...prev,
        [field]: currentUser[field],
      }));
    } else {
      // Focus on the input when enabling edit
      setTimeout(() => {
        inputRefs.current[field]?.focus();
      }, 100);
    }
  };

  const handleProfileUpdate = (e) => {
    e.preventDefault();

    // Validar nombre y apellido
    const nameRegex = /^[a-zA-ZÀ-ÿ\u00f1\u00d1 ]+$/;
    if (!nameRegex.test(userData.firstName)) {
      setError('El nombre solo debe contener letras.');
      return;
    }
    if (!nameRegex.test(userData.lastName)) {
      setError('El apellido solo debe contener letras.');
      return;
    }

    // Validar teléfono
    if (!userData.phone.match(/^\d+$/) || userData.phone.length < 8 || userData.phone.length > 15) {
      setError('El teléfono debe contener solo números y tener entre 8 y 15 dígitos.');
      return;
    }

    // Validar correo
    if (!userData.email.match(/^[^\s@]+@[^\s@]+\.[^\s@]+$/)) {
      setError('El correo no tiene un formato válido.');
      return;
    }

    if (passwordConfirmation !== currentUser.password) {
      setError('La contraseña actual no es válida.');
      return;
    }

    const updatedUser = { ...currentUser, ...userData };
    localStorage.setItem('currentUser', JSON.stringify(updatedUser));
    setError('');
    setSuccess('Perfil actualizado con éxito');
    window.location.reload();
  };

  const handlePasswordChange = (e) => {
    e.preventDefault();

    if (newPassword.length < 6 || newPassword.length > 30) {
      setError('La nueva contraseña debe tener entre 6 y 30 caracteres');
      setSuccess('');
      return;
    }

    if (newPassword !== confirmNewPassword) {
      setError('Las contraseñas nuevas no coinciden');
      setSuccess('');
      return;
    }

    if (currentPassword !== currentUser.password) {
      setError('La contraseña actual no es correcta');
      setSuccess('');
      return;
    }

    // Guardar nueva contraseña
    const updatedUser = { ...currentUser, password: newPassword };
    localStorage.setItem('currentUser', JSON.stringify(updatedUser));
    setError('');
    setSuccess('Contraseña cambiada con éxito');
    setCurrentPassword('');
    setNewPassword('');
    setConfirmNewPassword('');
  };

  return (
    <>
      <Navbar />
      <div className="max-w-4xl mx-auto mt-20 p-6 bg-white shadow rounded">
        {/* Botón Volver al Catálogo */}
        <button
          className="mb-6 bg-gray-200 text-gray-700 px-4 py-2 rounded hover:bg-gray-300"
          onClick={() => navigate('/catalogo')}
        >
          Volver al Catálogo
        </button>

        {/* Foto de perfil */}
        <div className="flex flex-col items-center mb-6">
          <FaUserCircle className="text-gray-500 text-8xl" />
          <h2 className="text-xl font-bold mt-4">
            {userData.firstName} {userData.lastName}
          </h2>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {/* Formulario de perfil */}
          <div>
            <h1 className="text-2xl font-bold mb-4">Perfil del Usuario</h1>
            <form
              onSubmit={(e) => {
                e.preventDefault();
                setModalOpen(true); // Abre el modal
              }}
              className="mb-6"
            >
              {/* Campo: Nombre */}
              <div className="mb-4 flex items-center">
                <div className="flex-grow">
                  <label className="block text-gray-700">Nombre</label>
                  <input
                    type="text"
                    name="firstName"
                    value={userData.firstName}
                    onChange={handleInputChange}
                    className="w-full px-4 py-2 rounded border"
                    maxLength={20}
                    pattern="^[a-zA-ZÀ-ÿ\u00f1\u00d1 ]+$"
                    title="El nombre solo debe contener letras."
                    readOnly={!editableFields.firstName}
                    ref={(el) => (inputRefs.current.firstName = el)}
                    required
                  />
                </div>
                <button
                  type="button"
                  className="ml-2 bg-gray-200 text-gray-500 p-2 rounded hover:bg-gray-300"
                  onClick={() => toggleEdit('firstName')}
                >
                  {editableFields.firstName ? <FaTimes /> : <FaPencilAlt />}
                </button>
              </div>

              {/* Campo: Apellido */}
              <div className="mb-4 flex items-center">
                <div className="flex-grow">
                  <label className="block text-gray-700">Apellido</label>
                  <input
                    type="text"
                    name="lastName"
                    value={userData.lastName}
                    onChange={handleInputChange}
                    className="w-full px-4 py-2 rounded border"
                    maxLength={20}
                    pattern="^[a-zA-ZÀ-ÿ\u00f1\u00d1 ]+$"
                    title="El apellido solo debe contener letras."
                    readOnly={!editableFields.lastName}
                    ref={(el) => (inputRefs.current.lastName = el)}
                    required
                  />
                </div>
                <button
                  type="button"
                  className="ml-2 bg-gray-200 text-gray-500 p-2 rounded hover:bg-gray-300"
                  onClick={() => toggleEdit('lastName')}
                >
                  {editableFields.lastName ? <FaTimes /> : <FaPencilAlt />}
                </button>
              </div>

              {/* Campo: Correo */}
              <div className="mb-4 flex items-center">
                <div className="flex-grow">
                  <label className="block text-gray-700">Correo</label>
                  <input
                    type="email"
                    name="email"
                    value={userData.email}
                    onChange={handleInputChange}
                    className="w-full px-4 py-2 rounded border"
                    maxLength={50}
                    readOnly={!editableFields.email}
                    ref={(el) => (inputRefs.current.email = el)}
                    required
                  />
                </div>
                <button
                  type="button"
                  className="ml-2 bg-gray-200 text-gray-500 p-2 rounded hover:bg-gray-300"
                  onClick={() => toggleEdit('email')}
                >
                  {editableFields.email ? <FaTimes /> : <FaPencilAlt />}
                </button>
              </div>

              {/* Campo: Teléfono */}
              <div className="mb-4 flex items-center">
                <div className="flex-grow">
                  <label className="block text-gray-700">Teléfono</label>
                  <input
                    type="tel"
                    name="phone"
                    value={userData.phone}
                    onChange={handleInputChange}
                    className="w-full px-4 py-2 rounded border"
                    maxLength={15}
                    pattern="^\d+$"
                    title="El teléfono solo debe contener números."
                    readOnly={!editableFields.phone}
                    ref={(el) => (inputRefs.current.phone = el)}
                    required
                  />
                </div>
                <button
                  type="button"
                  className="ml-2 bg-gray-200 text-gray-500 p-2 rounded hover:bg-gray-300"
                  onClick={() => toggleEdit('phone')}
                >
                  {editableFields.phone ? <FaTimes /> : <FaPencilAlt />}
                </button>
              </div>

              <button className="bg-black text-white px-4 py-2 rounded" type="submit">
                Guardar Cambios
              </button>
            </form>
          </div>

          {/* Cambiar contraseña */}
          <div>
            <h2 className="text-xl font-bold mb-4">Cambiar Contraseña</h2>
            <form onSubmit={handlePasswordChange}>
              <div className="mb-4">
                <label className="block text-gray-700">Contraseña Actual</label>
                <input
                  type="password"
                  value={currentPassword}
                  onChange={(e) => setCurrentPassword(e.target.value)}
                  className="w-full px-4 py-2 rounded border"
                />
              </div>

              <div className="mb-4">
                <label className="block text-gray-700">Nueva Contraseña</label>
                <input
                  type="password"
                  value={newPassword}
                  onChange={(e) => setNewPassword(e.target.value)}
                  className="w-full px-4 py-2 rounded border"
                  minLength={6}
                  maxLength={50}
                />
              </div>

              <div className="mb-4">
                <label className="block text-gray-700">Confirmar Nueva Contraseña</label>
                <input
                  type="password"
                  value={confirmNewPassword}
                  onChange={(e) => setConfirmNewPassword(e.target.value)}
                  className="w-full px-4 py-2 rounded border"
                  maxLength={50}
                />
              </div>

              <button className="bg-black text-white px-4 py-2 rounded" type="submit">
                Cambiar Contraseña
              </button>
            </form>
          </div>
        </div>
        {error && <p className="text-red-500 mt-4">{error}</p>}
        {success && <p className="text-green-500 mt-4">{success}</p>}

        {/* Contenedor de Mis Compras */}
        <div className="flex justify-between items-center bg-gray-100 shadow-md rounded-lg p-6 mt-6">
          <h3 className="text-xl font-bold">Mis Compras</h3>
          <button
            className="bg-black text-white px-4 py-2 rounded hover:bg-gray-700"
            onClick={() => navigate('/misCompras')}
          >
            Ver Mis Compras
          </button>
        </div>
      </div>

      {/* Modal para confirmar contraseña */}
      {modalOpen && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center">
          <div className="bg-white p-6 rounded shadow-lg">
            <h2 className="text-xl font-bold mb-4">Confirmar Contraseña</h2>
            <input
              type="password"
              placeholder="Contraseña actual"
              value={passwordConfirmation}
              onChange={(e) => setPasswordConfirmation(e.target.value)}
              className="w-full px-4 py-2 rounded border mb-4"
            />
            <div className="flex justify-end space-x-4">
              <button
                className="bg-gray-300 px-4 py-2 rounded"
                onClick={() => setModalOpen(false)}
              >
                Cancelar
              </button>
              <button
                className="bg-black text-white px-4 py-2 rounded"
                onClick={handleProfileUpdate}
              >
                Confirmar
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  );
};

export default VerPerfil;
