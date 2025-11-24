import APIClient from "../../api/api.js";

const api = new APIClient();

const registerForm = document.getElementById("registerForm");

registerForm.addEventListener("submit", async (e) => {
  e.preventDefault();
  const nombre = registerForm.nombre.value.trim();
  const apellidos = registerForm.apellidos.value.trim();
  const email = registerForm.email.value.trim();
  const password = registerForm.password.value.trim();

  if (!nombre || !apellidos || !email || !password) {
    alert("Por favor, completa todos los campos.");
    return;
  }

  // Llamada al APIClient para registro
  const res = await api.registerUser({ nombre, apellidos, email, password });
  if (res.success) {
    alert("¡Registro exitoso! Ahora puedes iniciar sesión.");
    window.location.href = "log-in.html";
  } else {
    alert(res.error || "Error al registrar usuario");
  }
});
