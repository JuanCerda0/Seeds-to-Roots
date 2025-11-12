

/* 
    Que mierda es esto?
    Solo dios lo sabe.

    Es el servidor del back-end, que por ahora no hace nada, pero en un futuro
    hara muchas cosas.

    Por ahora solo escucha en el puerto 5500.

    Gracias copilot por los comentarios.
*/

const express = require("express");
const productosRoutes = require('./routes/productos');
const usuariosRoutes = require('./routes/usuarios');

const app = express();
app.use(express.json());

// Middleware CORS (opcional, descomentar si el frontend está en otro puerto)
// app.use((req, res, next) => {
//     res.header('Access-Control-Allow-Origin', '*');
//     res.header('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE, OPTIONS');
//     res.header('Access-Control-Allow-Headers', 'Content-Type');
//     next();
// });

// Rutas
app.use('/api/productos', productosRoutes);
app.use('/api/usuarios', usuariosRoutes);

// Ruta de bienvenida
app.get('/', (req, res) => {
    res.json({ 
        mensaje: 'Bienvenido al servidor del backend de Waifu Farm',
        endpoints: {
            usuarios: {
                obtener_todos: 'GET /api/usuarios',
                obtener_uno: 'GET /api/usuarios/:id',
                crear: 'POST /api/usuarios',
                actualizar: 'PUT /api/usuarios/:id',
                eliminar: 'DELETE /api/usuarios/:id'
            },
            productos: {
                obtener_todos: 'GET /api/productos',
                obtener_uno: 'GET /api/productos/:id',
                crear: 'POST /api/productos',
                actualizar: 'PUT /api/productos/:id',
                eliminar: 'DELETE /api/productos/:id'
            }
        }
    });
});

app.listen(5500, () => {
    console.log('Servidor escuchando en el puerto 5500');
    console.log('Documentación disponible en http://localhost:5500/');
});









