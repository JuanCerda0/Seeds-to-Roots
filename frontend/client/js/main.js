
/**
 * Seeds to Roots - Main JavaScript
 * Maneja carruseles, interacciones y funcionalidades generales
 */

// ========================================
// CARRUSEL HERO - Slide Principal
// ========================================

let currentSlide = 0;
const slides = document.querySelectorAll('.carousel-slide');
const dots = document.querySelectorAll('.carousel-dot');
const autoRotateInterval = 5000; // 5 segundos

/**
 * Navega a un slide específico
 */
function goToSlide(n) {
  slides[currentSlide].classList.remove('active');
  dots[currentSlide].classList.remove('active');

  currentSlide = n;

  slides[currentSlide].classList.add('active');
  dots[currentSlide].classList.add('active');
}

/**
 * Siguiente slide del hero carousel
 */
function nextSlide() {
  let n = (currentSlide + 1) % slides.length;
  goToSlide(n);
}

/**
 * Anterior slide del hero carousel
 */
function prevSlide() {
  let n = (currentSlide - 1 + slides.length) % slides.length;
  goToSlide(n);
}

// Auto-rotar el carrusel hero
setInterval(nextSlide, autoRotateInterval);

// ========================================
// CARRUSEL ABOUT US - Mini Carrusel
// ========================================

let currentAboutSlide = 0;
const aboutSlides = document.querySelectorAll('.about-carousel-slide');
const aboutDots = document.querySelectorAll('.about-carousel-dot');
const aboutAutoRotateInterval = 6000; // 6 segundos

/**
 * Navega a un slide específico del About Us
 */
function goToAboutSlide(n) {
  aboutSlides[currentAboutSlide].classList.remove('active');
  aboutDots[currentAboutSlide].classList.remove('active');

  currentAboutSlide = n;

  aboutSlides[currentAboutSlide].classList.add('active');
  aboutDots[currentAboutSlide].classList.add('active');
}

/**
 * Siguiente slide del About Us carousel
 */
function nextAboutSlide() {
  let n = (currentAboutSlide + 1) % aboutSlides.length;
  goToAboutSlide(n);
}

/**
 * Anterior slide del About Us carousel
 */
function prevAboutSlide() {
  let n = (currentAboutSlide - 1 + aboutSlides.length) % aboutSlides.length;
  goToAboutSlide(n);
}

// Auto-rotar el About Us carrusel
setInterval(nextAboutSlide, aboutAutoRotateInterval);

// ========================================
// NEWSLETTER
// ========================================

/**
 * Maneja la suscripción al newsletter
 */
function subscribeNewsletter(event) {
  event.preventDefault();
  const email = event.target.querySelector('input[type="email"]').value;
  alert(`¡Gracias por suscribirte con ${email}! Pronto recibirás nuestras ofertas exclusivas.`);
  event.target.reset();
}

// ========================================
// FORMULARIO DE CONTACTO
// ========================================

/**
 * Maneja el envío del formulario de contacto
 */
function handleContactForm(event) {
  event.preventDefault();
  
  const name = document.getElementById('contact-name').value;
  const email = document.getElementById('contact-email').value;
  const message = document.getElementById('contact-message').value;
  
  // Validar que no esté vacío
  if (!name.trim() || !email.trim() || !message.trim()) {
    alert('Por favor completa todos los campos');
    return;
  }
  
  // Mostrar confirmación (hipotéticamente se enviaría al servidor)
  alert(`¡Gracias ${name}! Tu mensaje ha sido enviado.\n\nNos pondremos en contacto en tu correo: ${email}\n\nMensaje recibido: "${message.substring(0, 50)}..."`);
  
  // Limpiar formulario
  event.target.reset();
}
