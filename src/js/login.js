const form = document.getElementById('loginForm');
const email =  document.getElementById('email');
const password = document.getElementById('password');
const emailError = document.getElementById('emailError');
const passError = document.getElementById('passError');

form.addEventListener('submit', function(e) {
    e.preventDefault(); // Evita recargar la página
    let valid = true;

    // Validacion de correo
    if (email.value.trim() === "") {
        emailError.textContent = "El correo es obligatorio.";
        valid = false;
    } else if (!/^[^@\s]+@[^@\s]+\.[^@\s]+$/.test(email.value)) {
        emailError.textContent = "Formato de correo no válido.";
        valid = false;
    } else {
        emailError.textContent = "";
    }

    // Validacion de Contraseña
    if (password.value.trim() === "") {
        passError.textContent = "La contraseña es obligatoria.";
        valid = false;
    } else if (password.value.length < 8) {
        passError.textContent = "Mínimo 8 caracteres.";
        valid = false;
    } else if (password == "12345678") { //No se me puede olvidar agregar esto en el Sing In
        passError.textContent = "Tu contraseña no puede ser números seguidos, no estan permitidos";
        valid = false;
    }else {
        passError.textContent = "";
    }

    if (valid) {
        //  Cuando hagamos la base de datos la conecto
        /*
        fetch("Aqui pondria una url a la DB, si tan solo tuviera una" {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({
                email: email.value,
                password: password.value
            })
        })
        .then(res => res.json())
        .then(data => {
            if (data.success) {
                alert("Login exitoso");
                // Redirigir o guardar token
            } else {
                alert("Credenciales inválidas");
            }
        })
        .catch(err => console.error(err));
        */
        alert("Validaciones correctas... Nope aún no hago la DB :^");
        window.location.href = "../index.html";
    }
});