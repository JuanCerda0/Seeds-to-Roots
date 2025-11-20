function loadNavBar(basePath = './') {
  const navHTML = `
    <header>
      <div>
        <img src="${basePath}../src/img/HuertoHogar.png" alt="Icono">
        <h1>Waifu Farm</h1>
      </div>

      <li>
        <a href="${basePath}../src/index.html"> Home </a>
        <a href="${basePath}../src/pages/productos.html"> Productos </a>
        <a href="${basePath}../src/pages/nosotros.html"> Nosotros </a>
        <a href=""> Blogs </a>
        <a href="${basePath}../src/pages/contacto.html"> Contacto </a>
      </li>

      <div>
        <img src="${basePath}../src/img/carrito.png" alt="Icono Carrito">
        <h1> Cart (0)</h1>
      </div>
    </header>
  `;

  document.body.insertAdjacentHTML('afterbegin', navHTML);
}