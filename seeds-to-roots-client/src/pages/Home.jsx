import React, { useState, useEffect } from 'react';
import '../components/css/styles.css'

export default function Home() {
  const [currentSlide, setCurrentSlide] = useState(0);
  const [currentAboutSlide, setCurrentAboutSlide] = useState(0);

  // Auto-advance main carousel
  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentSlide((prev) => (prev + 1) % 3);
    }, 5000);
    return () => clearInterval(interval);
  }, []);

  // Auto-advance about carousel
  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentAboutSlide((prev) => (prev + 1) % 3);
    }, 4000);
    return () => clearInterval(interval);
  }, []);

  const goToSlide = (index) => setCurrentSlide(index);
  const nextSlide = () => setCurrentSlide((prev) => (prev + 1) % 3);
  const prevSlide = () => setCurrentSlide((prev) => (prev - 1 + 3) % 3);

  const goToAboutSlide = (index) => setCurrentAboutSlide(index);
  const nextAboutSlide = () => setCurrentAboutSlide((prev) => (prev + 1) % 3);
  const prevAboutSlide = () => setCurrentAboutSlide((prev) => (prev - 1 + 3) % 3);

  const handleContactForm = (e) => {
    e.preventDefault();
    const formData = new FormData(e.target);
    const data = {
      name: formData.get('name'),
      email: formData.get('email'),
      message: formData.get('message')
    };
    console.log('Formulario de contacto:', data);
    alert('¡Gracias por tu mensaje! Nos pondremos en contacto pronto.');
    e.target.reset();
  };

  const subscribeNewsletter = (e) => {
    e.preventDefault();
    const email = e.target.elements[0].value;
    console.log('Suscripción al newsletter:', email);
    alert('¡Gracias por suscribirte!');
    e.target.reset();
  };

  return (
    <div>
      {/* ======================================== 
           HEADER Y NAVEGACIÓN
           ======================================== */}
      <header>
        <div className="header-container">
          <div className="logo">
            <a href="/"> 🌱 Seeds to Roots </a>
          </div>
          <nav>
            <ul>
              <li><a href="/">Inicio</a></li>
              <li><a href="#categorias">Productos</a></li>
              <li><a href="#como-funciona">Cómo Funciona</a></li>
              <li><a href="#contacto">Contacto</a></li>
              <li><a href="/blog">Blog</a></li>
            </ul>
          </nav>
          <div className="nav-icons">
            <span className="nav-icon" title="Buscar">🔍</span>
            <span className="nav-icon" title="Carrito" onClick={() => window.location.href='/carrito'}>🛒</span>
            <a href="/login" className="nav-icon" id="navCuenta" title="Cuenta">👤</a>
          </div>
        </div>
      </header>

      {/* ======================================== 
           CARRUSEL (HERO SECTION)
           ======================================== */}
      <section className="carousel-container" id="inicio">
        <div className="carousel-wrapper">
          {/* Slide 1 */}
          <div className={`carousel-slide ${currentSlide === 0 ? 'active' : ''} slide-1`}>
            <div className="slide-content">
              <h2>Productos Frescos del Campo</h2>
              <p>Conectamos directamente con agricultores locales para traerte lo más fresco a tu hogar</p>
              <button className="btn btn-secondary" onClick={() => window.location.href='/productos'}>Explorar Productos</button>
            </div>
          </div>

          {/* Slide 2 */}
          <div className={`carousel-slide ${currentSlide === 1 ? 'active' : ''} slide-2`}>
            <div className="slide-content">
              <h2>Agricultura Sostenible</h2>
              <p>Apoyamos prácticas agrícolas responsables con el medio ambiente</p>
              <button className="btn btn-secondary" onClick={() => window.location.href='/blog'}>Conocer Más</button>
            </div>
          </div>

          {/* Slide 3 */}
          <div className={`carousel-slide ${currentSlide === 2 ? 'active' : ''} slide-3`}>
            <div className="slide-content">
              <h2>Entrega Rápida a tu Puerta</h2>
              <p>Recibe tus productos frescos en menos de 24 horas</p>
              <button className="btn btn-secondary" onClick={() => window.location.href='/productos'}>Ver Catálogo</button>
            </div>
          </div>

          {/* Controles */}
          <div className="carousel-controls">
            <span 
              className={`carousel-dot ${currentSlide === 0 ? 'active' : ''}`} 
              onClick={() => goToSlide(0)}
            ></span>
            <span 
              className={`carousel-dot ${currentSlide === 1 ? 'active' : ''}`} 
              onClick={() => goToSlide(1)}
            ></span>
            <span 
              className={`carousel-dot ${currentSlide === 2 ? 'active' : ''}`} 
              onClick={() => goToSlide(2)}
            ></span>
          </div>

          {/* Flechas de navegación */}
          <span className="carousel-arrow left" onClick={prevSlide}>❮</span>
          <span className="carousel-arrow right" onClick={nextSlide}>❯</span>
        </div>
      </section>

      {/* ======================================== 
           ABOUT US - MINI CARRUSEL
           ======================================== */}
      <section className="about-carousel-container" id="about-carousel">
        <div className="about-carousel-wrapper">
          {/* Slide 1 - Quiénes Somos */}
          <div className={`about-carousel-slide ${currentAboutSlide === 0 ? 'active' : ''}`}>
            <div className="about-slide-content">
              <h3>🌱 Quiénes Somos</h3>
              <p>Somos Seeds to Roots, una tienda online que conecta a familias chilenas con el campo. Con más de 6 años de experiencia en 9 ciudades del país, traemos frescura y calidad directamente del campo a tu puerta.</p>
            </div>
          </div>

          {/* Slide 2 - Nuestra Misión */}
          <div className={`about-carousel-slide ${currentAboutSlide === 1 ? 'active' : ''}`}>
            <div className="about-slide-content">
              <h3>🎯 Nuestra Misión</h3>
              <p>Proporcionar productos frescos y de calidad desde el campo hasta tu hogar. Conectamos consumidores con agricultores locales, apoyando prácticas sostenibles y promoviendo una alimentación saludable en Chile.</p>
            </div>
          </div>

          {/* Slide 3 - Nuestra Visión */}
          <div className={`about-carousel-slide ${currentAboutSlide === 2 ? 'active' : ''}`}>
            <div className="about-slide-content">
              <h3>🚀 Nuestra Visión</h3>
              <p>Ser la tienda online líder en distribución de productos frescos en Chile. Reconocidos por calidad, servicio y sostenibilidad. Buscamos expandirnos nacional e internacionalmente, estableciendo un nuevo estándar en el sector.</p>
            </div>
          </div>

          {/* Controles */}
          <div className="about-carousel-controls">
            <span 
              className={`about-carousel-dot ${currentAboutSlide === 0 ? 'active' : ''}`} 
              onClick={() => goToAboutSlide(0)}
            ></span>
            <span 
              className={`about-carousel-dot ${currentAboutSlide === 1 ? 'active' : ''}`} 
              onClick={() => goToAboutSlide(1)}
            ></span>
            <span 
              className={`about-carousel-dot ${currentAboutSlide === 2 ? 'active' : ''}`} 
              onClick={() => goToAboutSlide(2)}
            ></span>
          </div>

          {/* Flechas */}
          <span className="about-carousel-arrow left" onClick={prevAboutSlide}>❮</span>
          <span className="about-carousel-arrow right" onClick={nextAboutSlide}>❯</span>
        </div>
      </section>

      <main>
        {/* Sección: Por qué Seeds to Roots */}
        <section className="why-section">
          <h2>¿Por qué elegir Seeds to Roots?</h2>
          <div className="why-grid">
            <div className="why-card">
              <div className="why-card-icon">🌾</div>
              <h3>100% Fresco</h3>
              <p>Recolectado el mismo día de tu compra directamente de huertos locales</p>
            </div>
            <div className="why-card">
              <div className="why-card-icon">🤝</div>
              <h3>Apoyo Local</h3>
              <p>Apoyamos directamente a agricultores y comunidades de Chile</p>
            </div>
            <div className="why-card">
              <div className="why-card-icon">🌍</div>
              <h3>Sostenible</h3>
              <p>Prácticas agrícolas responsables con el medio ambiente</p>
            </div>
            <div className="why-card">
              <div className="why-card-icon">⚡</div>
              <h3>Entrega Rápida</h3>
              <p>Recibe tus productos en menos de 24 horas en tu domicilio</p>
            </div>
          </div>
        </section>

          {/* Sección: Categorías de Productos */}
          <section id="categorias">
            <h2>Nuestras Categorías</h2>
            <div className="categories-grid">
              <div className="category-card" onClick={() => window.location.href='/productos'}>
                <h3>🍎 Frutas Frescas</h3>
                <p>Manzanas, naranjas, plátanos, uvas y más</p>
              </div>
              <div className="category-card" onClick={() => window.location.href='/productos'}>
                <h3>🥬 Verduras Orgánicas</h3>
                <p>Lechugas, espinacas, tomates, pimientos</p>
              </div>
              <div className="category-card" onClick={() => window.location.href='/productos'}>
                <h3>🌽 Productos Locales</h3>
                <p>Productos de temporada de nuestros agricultores</p>
              </div>
              <div className="category-card" onClick={() => window.location.href='/productos'}>
                <h3>🥛 Lácteos y Granos</h3>
                <p>Leche fresca, quesos, quinua y cereales</p>
              </div>
            </div>
          </section>

          {/* Sección: Cómo Funciona */}
        <section id="como-funciona">
          <h2>¿Cómo Funciona?</h2>
          <div className="steps-container">
            <div className="step">
              <div className="step-number">1</div>
              <h3>Explora</h3>
              <p>Navega nuestro catálogo de productos frescos y elige tus favoritos</p>
            </div>
            <div className="step">
              <div className="step-number">2</div>
              <h3>Compra</h3>
              <p>Añade productos a tu carrito y procede al pago de forma segura</p>
            </div>
            <div className="step">
              <div className="step-number">3</div>
              <h3>Prepara</h3>
              <p>Preparamos tu pedido el mismo día de tu compra</p>
            </div>
            <div className="step">
              <div className="step-number">4</div>
              <h3>Recibe</h3>
              <p>Entrega rápida a tu puerta en menos de 24 horas</p>
            </div>
          </div>
        </section>

        {/* Sección: Testimonios */}
        <section>
          <h2>Lo que Dicen Nuestros Clientes</h2>
          <div className="testimonials-container">
            <div className="testimonial">
              <p className="testimonial-text">"Los productos son increíblemente frescos. Noto la diferencia en el sabor comparado con supermercados. Altamente recomendado!"</p>
              <div className="testimonial-author">
                <div className="testimonial-avatar">MC</div>
                <div className="testimonial-info">
                  <h4>María Contreras</h4>
                  <p className="testimonial-role">Cliente desde 2023</p>
                </div>
              </div>
            </div>

            <div className="testimonial">
              <p className="testimonial-text">"Adoro la idea de apoyar a agricultores locales. Seeds to Roots hace que sea fácil ser parte del cambio hacia una alimentación más sostenible."</p>
              <div className="testimonial-author">
                <div className="testimonial-avatar">JR</div>
                <div className="testimonial-info">
                  <h4>Juan Ramírez</h4>
                  <p className="testimonial-role">Cliente desde 2022</p>
                </div>
              </div>
            </div>

            <div className="testimonial">
              <p className="testimonial-text">"La entrega es rápida y los productos llegan en perfectas condiciones. Uso Seeds to Roots para toda mi familia."</p>
              <div className="testimonial-author">
                <div className="testimonial-avatar">SG</div>
                <div className="testimonial-info">
                  <h4>Sandra García</h4>
                  <p className="testimonial-role">Cliente desde 2024</p>
                </div>
              </div>
            </div>
          </div>
        </section>
      </main>

      {/* ======================================== 
           SECCIÓN: CONTACTO
           ======================================== */}
      <section style={{ backgroundColor: 'var(--gris-claro)', padding: '5rem 2rem' }} id="contacto">
        <div style={{ maxWidth: '600px', margin: '0 auto' }}>
          <h2 style={{ textAlign: 'center', marginBottom: '1rem' }}>¿Preguntas? ¡Contáctanos!</h2>
          <p style={{ textAlign: 'center', marginBottom: '3rem', color: 'var(--gris-medio)' }}>
            Completa el formulario y nos pondremos en contacto pronto
          </p>
          
          <form onSubmit={handleContactForm} style={{ display: 'grid', gap: '1.5rem' }}>
            {/* Nombre */}
            <div>
              <label 
                htmlFor="contact-name" 
                style={{ display: 'block', fontWeight: '600', marginBottom: '0.5rem', color: 'var(--gris-oscuro)' }}
              >
                Nombre *
              </label>
              <input 
                type="text" 
                id="contact-name" 
                name="name" 
                placeholder="Tu nombre completo" 
                required 
                style={{ 
                  width: '100%', 
                  padding: '0.8rem', 
                  border: '1px solid #ddd', 
                  borderRadius: '5px', 
                  fontSize: '1rem', 
                  fontFamily: 'var(--font-main)' 
                }}
              />
            </div>

            {/* Email */}
            <div>
              <label 
                htmlFor="contact-email" 
                style={{ display: 'block', fontWeight: '600', marginBottom: '0.5rem', color: 'var(--gris-oscuro)' }}
              >
                Correo Electrónico *
              </label>
              <input 
                type="email" 
                id="contact-email" 
                name="email" 
                placeholder="tu.email@ejemplo.com" 
                required 
                style={{ 
                  width: '100%', 
                  padding: '0.8rem', 
                  border: '1px solid #ddd', 
                  borderRadius: '5px', 
                  fontSize: '1rem', 
                  fontFamily: 'var(--font-main)' 
                }}
              />
            </div>

            {/* Mensaje */}
            <div>
              <label 
                htmlFor="contact-message" 
                style={{ display: 'block', fontWeight: '600', marginBottom: '0.5rem', color: 'var(--gris-oscuro)' }}
              >
                Mensaje *
              </label>
              <textarea 
                id="contact-message" 
                name="message" 
                placeholder="Cuéntanos tu consulta o comentario..." 
                rows="5" 
                required 
                style={{ 
                  width: '100%', 
                  padding: '0.8rem', 
                  border: '1px solid #ddd', 
                  borderRadius: '5px', 
                  fontSize: '1rem', 
                  fontFamily: 'var(--font-main)', 
                  resize: 'vertical' 
                }}
              ></textarea>
            </div>

            {/* Botón */}
            <button type="submit" className="btn btn-primary" style={{ width: '100%', padding: '1rem' }}>
              Enviar Mensaje
            </button>
          </form>
        </div>
      </section>

      {/* ======================================== 
           SECCIÓN: NEWSLETTER
           ======================================== */}
      <section className="newsletter-section">
        <h2>¿Prefieres Suscribirte?</h2>
        <p>Recibe ofertas exclusivas, recetas y consejos sobre alimentación saludable directamente en tu correo</p>
        <form className="newsletter-form" onSubmit={subscribeNewsletter}>
          <input type="email" placeholder="Tu correo electrónico" required />
          <button type="submit" className="btn" style={{ cursor: 'pointer' }}>Suscribirse</button>
        </form>
      </section>

      {/* ======================================== 
           FOOTER
           ======================================== */}
      <footer>
        <div className="footer-container">
          {/* Sobre Nosotros */}
          <div className="footer-section">
            <h4>Sobre Seeds to Roots</h4>
            <p>Conectamos familias con agricultores locales para productos frescos, sostenibles y de calidad.</p>
          </div>

          {/* Enlaces Rápidos */}
          <div className="footer-section">
            <h4>Enlaces Rápidos</h4>
            <ul>
              <li><a href="#inicio">Inicio</a></li>
              <li><a href="#categorias">Productos</a></li>
              <li><a href="#como-funciona">Cómo Funciona</a></li>
              <li><a href="---RUTA-PRODUCTS---">Catálogo</a></li>
            </ul>
          </div>

          {/* Atención al Cliente */}
          <div className="footer-section">
            <h4>Atención al Cliente</h4>
            <ul>
              <li><a href="#contacto">Contacto</a></li>
              <li><a href="---RUTA-FAQ---">Preguntas Frecuentes</a></li>
              <li><a href="---RUTA-PRIVACY---">Política de Privacidad</a></li>
              <li><a href="---RUTA-TERMS---">Términos de Servicio</a></li>
            </ul>
          </div>

          {/* Redes Sociales */}
          <div className="footer-section">
            <h4>Síguenos</h4>
            <div className="social-links">
              <a href="---RUTA-FACEBOOK---" className="social-link" title="Facebook">f</a>
              <a href="---RUTA-INSTAGRAM---" className="social-link" title="Instagram">📷</a>
              <a href="---RUTA-TWITTER---" className="social-link" title="Twitter">𝕏</a>
              <a href="---RUTA-YOUTUBE---" className="social-link" title="YouTube">▶</a>
            </div>
          </div>
        </div>

        <div className="footer-bottom">
          <p>&copy; 2024 Seeds to Roots. Todos los derechos reservados. | Hecho con 💚 en Chile</p>
        </div>
      </footer>
    </div>
  );
}