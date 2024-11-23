import React from 'react';
import visaLogo from './assets/visa.jpg';
import mastercardLogo from './assets/mastercard.png';
import mpLogo from './assets/mercadopago.png';

const Footer = () => {
  return (
    <footer className="bg-gray-100">
      <div className="flex justify-center py-6 px-4">
        <div className="bg-black text-white py-6 px-8 rounded-lg max-w-4xl w-full flex flex-col md:flex-row items-center justify-between">
          <h2 className="text-2xl font-bold mb-4 md:mb-0">¡Recibí ofertas nuevas!</h2>
          <div className="flex flex-col md:flex-row items-center">
            <input
              type="email"
              placeholder="Correo electrónico"
              className="w-full md:w-auto px-4 py-2 rounded-full text-gray-700 mb-4 md:mb-0 md:mr-4"
            />
            <button className="bg-white text-black px-6 py-2 rounded-full hover:bg-gray-300 transition">
              ¡Suscribirse!
            </button>
          </div>
        </div>
      </div>

      <div className="py-8 px-4 md:px-16 lg:px-32 bg-gray-100">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
          <div>
            <h3 className="text-lg font-bold mb-4">Hi Fenix</h3>
            <p className="text-gray-700">
              Potencia tu experiencia gamer con lo último en tecnología. ¡Gracias por elegirnos!
            </p>
            <div className="flex space-x-4 mt-4">
              <a href="#" className="text-gray-700 hover:text-black">
                <i className="fab fa-facebook-f"></i>
              </a>
              <a href="#" className="text-gray-700 hover:text-black">
                <i className="fab fa-twitter"></i>
              </a>
              <a href="#" className="text-gray-700 hover:text-black">
                <i className="fab fa-instagram"></i>
              </a>
            </div>
          </div>

          <div>
            <h3 className="text-lg font-bold mb-4">Empresa</h3>
            <ul className="space-y-2">
              <li><a href="#" className="text-gray-700 hover:text-black">Sobre Nosotros</a></li>
              <li><a href="#" className="text-gray-700 hover:text-black">Características</a></li>
              <li><a href="#" className="text-gray-700 hover:text-black">Trabajos</a></li>
              <li><a href="#" className="text-gray-700 hover:text-black">Carrera</a></li>
            </ul>
          </div>

          <div>
            <h3 className="text-lg font-bold mb-4">Ayuda</h3>
            <ul className="space-y-2">
              <li><a href="#" className="text-gray-700 hover:text-black">Atención al cliente</a></li>
              <li><a href="#" className="text-gray-700 hover:text-black">Detalles de entrega</a></li>
              <li><a href="#" className="text-gray-700 hover:text-black">Términos y condiciones</a></li>
              <li><a href="#" className="text-gray-700 hover:text-black">Política de privacidad</a></li>
            </ul>
          </div>

          <div>
            <h3 className="text-lg font-bold mb-4">Frecuentes</h3>
            <ul className="space-y-2">
              <li><a href="#" className="text-gray-700 hover:text-black">Cuenta</a></li>
              <li><a href="#" className="text-gray-700 hover:text-black">Gestionar entregas</a></li>
              <li><a href="#" className="text-gray-700 hover:text-black">Pedidos</a></li>
              <li><a href="#" className="text-gray-700 hover:text-black">Pagos</a></li>
            </ul>
          </div>
        </div>

        <hr className="my-8 border-gray-300" />

        <div className="flex flex-col md:flex-row items-center justify-between">
          <p className="text-gray-700">Hi Fenix © 2024</p>
          <div className="flex space-x-4 mt-4 md:mt-0">
            <img src={visaLogo} alt="Visa" className="w-12" />
            <img src={mastercardLogo} alt="Mastercard" className="w-12" />
            <img src={mpLogo} alt="MercadoPago" className="w-12" />
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
