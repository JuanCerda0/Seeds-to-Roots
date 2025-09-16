const form = document.getElementById('registerForm');
const username = document.getElementById('username');
const email = document.getElementById('email');
const password = document.getElementById('password');
const confirmPassword = document.getElementById('confirmPassword');
const address = document.getElementById('address');
const phone = document.getElementById('phone');

const usernameError = document.getElementById('usernameError');
const emailError = document.getElementById('emailError');
const passwordError = document.getElementById('passwordError');
const confirmPasswordError = document.getElementById('confirmPasswordError');
const addressError = document.getElementById('addressError');
const phoneError = document.getElementById('phoneError');

form.addEventListener('submit', function(e) {
    e.preventDefault(); 
    let valid = true;

    // Validar usuario
    if (username.value.trim() === "") {
        usernameError.textContent = "El nombre de usuario es obligatorio.";
        valid = false;
    } else {
        usernameError.textContent = "";
    }

    // Validar email
    if (email.value.trim() === "") {
        emailError.textContent = "El correo es obligatorio.";
        valid = false;
    } else if (!/^[^@\s]+@[^@\s]+\.[^@\s]+$/.test(email.value)) {
        emailError.textContent = "Formato de correo no válido.";
        valid = false;
    } else {
        emailError.textContent = "";
    }

    // Validar contraseña
    if (password.value.trim() === "") {
        passwordError.textContent = "La contraseña es obligatoria.";
        valid = false;
    } else if (password.value.length < 6) {
        passwordError.textContent = "Mínimo 6 caracteres.";
        valid = false;
    } else {
        passwordError.textContent = "";
    }

    // Confirmar contraseña
    if (confirmPassword.value.trim() === "") {
        confirmPasswordError.textContent = "Confirma tu contraseña.";
        valid = false;
    } else if (confirmPassword.value !== password.value) {
        confirmPasswordError.textContent = "Las contraseñas no coinciden.";
        valid = false;
    } else {
        confirmPasswordError.textContent = "";
    }

    // Validar dirección
    if (address.value.trim() === "") {
        addressError.textContent = "La dirección es obligatoria.";
        valid = false;
    } else {
        addressError.textContent = "";
    }

    // Validar teléfono
    if (phone.value.trim() === "") {
        phoneError.textContent = "El número de teléfono es obligatorio.";
        valid = false;
    } else if (!/^\+?\d{9,15}$/.test(phone.value)) {
        phoneError.textContent = "Número telefónico inválido.";
        valid = false;
    } else {
        phoneError.textContent = "";
    }

    if (valid) {
        // Aquí iría la conexión a la DB si tan solo no fuera un irresponsable que deja todo a ultimo minuto
        alert("Registro exitoso... tampoco hay base de datos 7-7");

        // Redirigir al login después del registro
        window.location.href = "index.html";
    }
});
