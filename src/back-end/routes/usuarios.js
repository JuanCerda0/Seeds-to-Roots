const express = require('express');
const router = express.Router();
const {
    obtenerUsuarios,
    obtenerUsuarioPorId,
    crearUsuario,
    actualizarUsuario,
    eliminarUsuario
} = require('../controllers/usuariosController');

// Rutas CRUD para usuarios
router.get('/', obtenerUsuarios);                    // GET /api/usuarios
router.get('/:id', obtenerUsuarioPorId);             // GET /api/usuarios/:id
router.post('/', crearUsuario);                      // POST /api/usuarios
router.put('/:id', actualizarUsuario);               // PUT /api/usuarios/:id
router.delete('/:id', eliminarUsuario);              // DELETE /api/usuarios/:id

module.exports = router;
