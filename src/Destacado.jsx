import React from 'react';
import productoImagen from './assets/rtx4080.png';
import logitech from './assets/logitech.png';
import redragon from './assets/redragon.png';
import razer from './assets/razer.png';
import hyperx from './assets/hyperx.png';
import corsair from './assets/corsair.png';

const Destacado = () => {
  return (
    <div>
      {/* Sección destacada */}
      <div className="flex flex-col md:flex-row-reverse items-center justify-between bg-gray-100 p-8">
        <div className="flex justify-center md:w-2/5 lg:w-1/2 -mr-0">
          <img
            src={productoImagen}
            alt="RTX 4080"
            className="w-full max-w-xl"
          />
        </div>
        <div className="md:w-3/5 lg:w-1/2 text-center md:text-left md:pl-20 lg:pl-32">
          <h1 className="text-5xl font-bold mb-4">RTX 4080</h1>
          <h2 className="text-3xl font-bold mb-4">GAMING X TRIO 16G</h2>
          <p className="text-gray-700 text-lg mb-6 max-w-lg mx-auto md:mx-0">
            MSI imaginó la serie GAMING como la solución de tarjetas gráficas favorita para todo
            tipo de jugadores, incluidos los buscadores de aventuras, los competidores de deportes
            electrónicos, las emisoras de transmisión en vivo y más.
          </p>
          <button
            className="bg-black text-white px-6 py-3 rounded-full hover:bg-gray-700 transition duration-300"
            onClick={() => alert('Comprar Ahora')}
          >
            Comprar Ahora
          </button>
        </div>
      </div>

      {/* Franja de marcas */}
      <div className="bg-black w-full py-4 px-8">
        <div className="flex justify-between items-center space-x-8 max-w-6xl mx-auto">
          <img src={logitech} alt="Logitech" className="h-12" />
          <img src={redragon} alt="Redragon" className="h-12" />
          <img src={razer} alt="Razer" className="h-12" />
          <img src={hyperx} alt="HyperX" className="h-12" />
          <img src={corsair} alt="Corsair" className="h-12" />
        </div>
      </div>
    </div>
  );
};

export default Destacado;
