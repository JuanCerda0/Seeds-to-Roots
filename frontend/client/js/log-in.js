import APIClient from "../../api/api.js";

const api = new APIClient();

const loginForm = document.getElementById("loginForm");

loginForm.addEventListener("submit", async (e) => {
  e.preventDefault();
  const email = loginForm.email.value.trim();
  const password = loginForm.password.value.trim();

  if (!email || !password) {
    alert("Por favor, completa todos los campos.");
    return;
  }

  // Llamada al APIClient para login
  const res = await api.loginUser(email, password);
  if (res.success) {
    // Guardar sesión en localStorage
    localStorage.setItem('usuarioSesion', JSON.stringify({
      id: res.data.id,
      nombre: res.data.nombre,
      apellidos: res.data.apellidos,
      email: res.data.email,
      rol: res.data.rol
    }));
    // Redirigir según el rol
    if (res.data.rol === 'admin') {
      window.location.href = '../admin/pages/dashboard.html';
    } else {
      window.location.href = 'index.html';
    }
  } else {
    alert(res.error || "Error al iniciar sesión");
  }
});
