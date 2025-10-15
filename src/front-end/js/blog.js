// Datos de ejemplo (solo para presentación)
const noticiasDemo = [
  {
    id: 1,
    categoria: "Salud",
    titulo: "Nuevo enfoque en bienestar urbano",
    fecha: "10 octubre 2025",
    descripcion: "Ejemplo de cómo se vería una noticia sobre bienestar o salud urbana.",
    imagen: "https://picsum.photos/900/300?random=1"
  },
  {
    id: 2,
    categoria: "Agricultura",
    titulo: "Innovación en cultivos verticales",
    fecha: "5 octubre 2025",
    descripcion: "Texto de demostración para visualizar el diseño del módulo de noticias agrícolas.",
    imagen: "https://picsum.photos/900/300?random=2"
  }
];

// Renderizar noticias
const contenedor = document.getElementById('noticias');

contenedor.innerHTML = noticiasDemo.map(n => `
  <article>
    <img src="${n.imagen}" alt="imagen de ejemplo">
    <p class="categoria">${n.categoria}</p>
    <h2>${n.titulo}</h2>
    <p class="fecha">${n.fecha}</p>
    <p>${n.descripcion}</p>
  </article>
`).join('');
