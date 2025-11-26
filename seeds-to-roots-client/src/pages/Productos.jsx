import React from 'react';

export default function SeedsToRoots() {
  const products = [
    {
      id: 1,
      name: 'Tomate Cherry',
      price: '$5.990',
      description: 'Tomates cherry frescos de cultivo orgánico',
      image: '--RutaIMG--/1-TomateCherry.jpg'
    },
    {
      id: 2,
      name: 'Lechuga Romana',
      price: '$3.500',
      description: 'Lechuga romana fresca y crujiente',
      image: '--RutaIMG--/2-LechugaRomana.jpg'
    },
    {
      id: 3,
      name: 'Brócoli Orgánico',
      price: '$4.990',
      description: 'Brócoli 100% orgánico, sin pesticidas',
      image: '--RutaIMG--/3-BrocoliOrganico.jpg'
    },
    {
      id: 4,
      name: 'Zanahoria',
      price: '$2.990',
      description: 'Zanahorias frescas de la mejor calidad',
      image: '--RutaIMG--/4-Zanahoria.jpg'
    },
    {
      id: 5,
      name: 'Espinaca Fresca',
      price: '$4.500',
      description: 'Espinaca tierna y fresca',
      image: '--RutaIMG--/5-EspinacFresca.jpg'
    },
    {
      id: 6,
      name: 'Pimiento Rojo',
      price: '$3.750',
      description: 'Pimientos rojos dulces y jugosos',
      image: '--RutaIMG--/6-PimientoRojo.jpg'
    },
    {
      id: 7,
      name: 'Cebolla Blanca',
      price: '$1.990',
      description: 'Cebolla blanca dulce',
      image: '--RutaIMG--/7-CebollaBlanca.jpg'
    },
    {
      id: 8,
      name: 'Ajo Fresco',
      price: '$2.500',
      description: 'Ajo natural sin aditivos',
      image: '--RutaIMG--/8-AjoFresco.jpg'
    },
    {
      id: 9,
      name: 'Rúcula',
      price: '$5.250',
      description: 'Rúcula fresca con sabor picante',
      image: '--RutaIMG--/9-Rucula.jpg'
    },
    {
      id: 10,
      name: 'Pepino Inglés',
      price: '$4.000',
      description: 'Pepinos ingleses sin semillas grandes',
      image: '--RutaIMG--/10-PepinoIngles.jpg'
    }
  ];

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <header className="bg-white shadow-sm">
        <div className="max-w-7xl mx-auto px-4 py-4 flex justify-between items-center">
          <a href="index.html" className="text-2xl font-bold text-green-600 flex items-center gap-2">
            🌱 Seeds to Roots
          </a>
          <div className="flex items-center gap-4">
            <span className="text-2xl cursor-pointer" title="Buscar">🔍</span>
            <span className="text-2xl cursor-pointer" title="Carrito">🛒</span>
            <a href="log-in.html" className="text-2xl cursor-pointer" title="Cuenta">👤</a>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="max-w-7xl mx-auto px-4 py-8">
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
          {products.map((product) => (
            <article key={product.id} className="bg-white rounded-lg shadow-md overflow-hidden hover:shadow-lg transition-shadow">
              <div className="aspect-square overflow-hidden">
                <img 
                  src={product.image} 
                  alt={product.name}
                  className="w-full h-full object-cover hover:scale-105 transition-transform"
                />
              </div>
              <div className="p-4">
                <p className="text-2xl font-bold text-green-600 mb-2">{product.price}</p>
                <h3 className="text-lg font-semibold text-gray-800 mb-1">{product.name}</h3>
                <p className="text-sm text-gray-500 mb-2">Producto {product.id}</p>
                <p className="text-sm text-gray-600">{product.description}</p>
              </div>
            </article>
          ))}
        </div>
      </main>

      {/* Footer */}
      <footer className="bg-gray-800 text-white mt-12">
        <div className="max-w-7xl mx-auto px-4 py-8">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
            <div>
              <h4 className="text-lg font-semibold mb-4">Sobre Seeds to Roots</h4>
              <p className="text-gray-300 text-sm">
                Conectamos familias con agricultores locales para productos frescos, sostenibles y de calidad.
              </p>
            </div>

            <div>
              <h4 className="text-lg font-semibold mb-4">Enlaces Rápidos</h4>
              <ul className="space-y-2 text-sm">
                <li><a href="#inicio" className="text-gray-300 hover:text-white">Inicio</a></li>
                <li><a href="#categorias" className="text-gray-300 hover:text-white">Productos</a></li>
                <li><a href="#como-funciona" className="text-gray-300 hover:text-white">Cómo Funciona</a></li>
                <li><a href="products.html" className="text-gray-300 hover:text-white">Catálogo</a></li>
              </ul>
            </div>

            <div>
              <h4 className="text-lg font-semibold mb-4">Atención al Cliente</h4>
              <ul className="space-y-2 text-sm">
                <li><a href="#" className="text-gray-300 hover:text-white">Contacto</a></li>
                <li><a href="#" className="text-gray-300 hover:text-white">Preguntas Frecuentes</a></li>
                <li><a href="#" className="text-gray-300 hover:text-white">Política de Privacidad</a></li>
                <li><a href="#" className="text-gray-300 hover:text-white">Términos de Servicio</a></li>
              </ul>
            </div>

            <div>
              <h4 className="text-lg font-semibold mb-4">Síguenos</h4>
              <div className="flex gap-4 text-2xl">
                <a href="#" className="hover:text-green-400" title="Facebook">f</a>
                <a href="#" className="hover:text-green-400" title="Instagram">📷</a>
                <a href="#" className="hover:text-green-400" title="Twitter">𝕏</a>
                <a href="#" className="hover:text-green-400" title="YouTube">▶</a>
              </div>
            </div>
          </div>

          <div className="border-t border-gray-700 mt-8 pt-6 text-center text-sm text-gray-400">
            <p>&copy; 2024 Seeds to Roots. Todos los derechos reservados. | Hecho con 💚 en Chile</p>
          </div>
        </div>
      </footer>
    </div>
  );
}