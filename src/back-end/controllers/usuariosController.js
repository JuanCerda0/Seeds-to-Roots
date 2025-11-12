const { getConnection } = require('../db');

// Obtener todos los usuarios
async function obtenerUsuarios(req, res) {
    let connection;
    try {
        connection = await getConnection();
        
        // TODO: Ajusta el nombre de la tabla según tu esquema de BD
        const result = await connection.execute(
            `SELECT id, nombre, email, telefono, fecha_registro, estado 
             FROM usuarios`
        );

        // Si usa resultSet (para muchos registros)
        if (result.resultSet) {
            const rows = await result.resultSet.getRows(1000);
            await result.resultSet.close();
            res.json(rows);
        } else {
            res.json(result.rows || []);
        }

    } catch (error) {
        console.error('Error al obtener usuarios:', error);
        res.status(500).json({ 
            error: 'Error al obtener usuarios',
            mensaje: error.message 
        });
    } finally {
        if (connection) {
            try {
                await connection.close();
            } catch (err) {
                console.error('Error al cerrar conexión:', err);
            }
        }
    }
}

// Obtener un usuario por ID
async function obtenerUsuarioPorId(req, res) {
    let connection;
    try {
        const { id } = req.params;
        connection = await getConnection();
        
        const result = await connection.execute(
            `SELECT id, nombre, email, telefono, fecha_registro, estado 
             FROM usuarios WHERE id = :id`,
            [id]
        );

        if (result.rows && result.rows.length > 0) {
            res.json(result.rows[0]);
        } else {
            res.status(404).json({ error: 'Usuario no encontrado' });
        }

    } catch (error) {
        console.error('Error al obtener usuario:', error);
        res.status(500).json({ 
            error: 'Error al obtener usuario',
            mensaje: error.message 
        });
    } finally {
        if (connection) {
            try {
                await connection.close();
            } catch (err) {
                console.error('Error al cerrar conexión:', err);
            }
        }
    }
}

// Crear un nuevo usuario
async function crearUsuario(req, res) {
    let connection;
    try {
        const { nombre, email, telefono, estado } = req.body;
        
        // Validaciones básicas
        if (!nombre || !email) {
            return res.status(400).json({ 
                error: 'Nombre y email son requeridos' 
            });
        }

        connection = await getConnection();
        
        const result = await connection.execute(
            `INSERT INTO usuarios (nombre, email, telefono, fecha_registro, estado) 
             VALUES (:nombre, :email, :telefono, SYSDATE, :estado)`,
            [nombre, email, telefono || null, estado || 'activo']
        );

        await connection.commit();
        
        res.status(201).json({ 
            mensaje: 'Usuario creado exitosamente',
            rowsAffected: result.rowsAffected 
        });

    } catch (error) {
        if (connection) {
            try {
                await connection.rollback();
            } catch (err) {
                console.error('Error al hacer rollback:', err);
            }
        }
        console.error('Error al crear usuario:', error);
        res.status(500).json({ 
            error: 'Error al crear usuario',
            mensaje: error.message 
        });
    } finally {
        if (connection) {
            try {
                await connection.close();
            } catch (err) {
                console.error('Error al cerrar conexión:', err);
            }
        }
    }
}

// Actualizar un usuario
async function actualizarUsuario(req, res) {
    let connection;
    try {
        const { id } = req.params;
        const { nombre, email, telefono, estado } = req.body;

        if (!nombre || !email) {
            return res.status(400).json({ 
                error: 'Nombre y email son requeridos' 
            });
        }

        connection = await getConnection();
        
        const result = await connection.execute(
            `UPDATE usuarios 
             SET nombre = :nombre, email = :email, telefono = :telefono, estado = :estado
             WHERE id = :id`,
            [nombre, email, telefono || null, estado || 'activo', id]
        );

        await connection.commit();

        if (result.rowsAffected === 0) {
            return res.status(404).json({ error: 'Usuario no encontrado' });
        }

        res.json({ 
            mensaje: 'Usuario actualizado exitosamente',
            rowsAffected: result.rowsAffected 
        });

    } catch (error) {
        if (connection) {
            try {
                await connection.rollback();
            } catch (err) {
                console.error('Error al hacer rollback:', err);
            }
        }
        console.error('Error al actualizar usuario:', error);
        res.status(500).json({ 
            error: 'Error al actualizar usuario',
            mensaje: error.message 
        });
    } finally {
        if (connection) {
            try {
                await connection.close();
            } catch (err) {
                console.error('Error al cerrar conexión:', err);
            }
        }
    }
}

// Eliminar un usuario
async function eliminarUsuario(req, res) {
    let connection;
    try {
        const { id } = req.params;
        connection = await getConnection();
        
        const result = await connection.execute(
            `DELETE FROM usuarios WHERE id = :id`,
            [id]
        );

        await connection.commit();

        if (result.rowsAffected === 0) {
            return res.status(404).json({ error: 'Usuario no encontrado' });
        }

        res.json({ 
            mensaje: 'Usuario eliminado exitosamente',
            rowsAffected: result.rowsAffected 
        });

    } catch (error) {
        if (connection) {
            try {
                await connection.rollback();
            } catch (err) {
                console.error('Error al hacer rollback:', err);
            }
        }
        console.error('Error al eliminar usuario:', error);
        res.status(500).json({ 
            error: 'Error al eliminar usuario',
            mensaje: error.message 
        });
    } finally {
        if (connection) {
            try {
                await connection.close();
            } catch (err) {
                console.error('Error al cerrar conexión:', err);
            }
        }
    }
}

module.exports = {
    obtenerUsuarios,
    obtenerUsuarioPorId,
    crearUsuario,
    actualizarUsuario,
    eliminarUsuario
};
