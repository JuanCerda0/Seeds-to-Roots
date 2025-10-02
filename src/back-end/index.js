

/* 
    Que mierda es esto?
    Solo dios lo sabe.

    Es el servidor del back-end, que por ahora no hace nada, pero en un futuro
    hara muchas cosas.

    Por ahora solo escucha en el puerto 3000.

    Gracias copilot por los comentarios.
*/

const express = require("express");

// const productosRoutes = require('./routes/productos'); --- Aun no hago ningun endpoint ---

const app = express();
app.use(express.json());

// Rutas

// app.use('/api/productos', productosRoutes); --- Aun no hago ningun endpoint ---


app.listen(5500, () => {

    console.log('Servidor escuchando en el puerto 5500');
});









