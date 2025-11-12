const express = require('express');
const router = express.Router();
const {
    obtenerProductos,
    obtenerProductoPorId,
    crearProducto,
    actualizarProducto,
    eliminarProducto
} = require('../controllers/productosController');

// Rutas CRUD para productos
router.get('/', obtenerProductos);                    // GET /api/productos
router.get('/:id', obtenerProductoPorId);             // GET /api/productos/:id
router.post('/', crearProducto);                      // POST /api/productos
router.put('/:id', actualizarProducto);               // PUT /api/productos/:id
router.delete('/:id', eliminarProducto);              // DELETE /api/productos/:id

module.exports = router;
