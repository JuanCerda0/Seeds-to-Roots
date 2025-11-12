const { getConnection } = require('../db');

// Obtener todos los productos
async function obtenerProductos(req, res) {
    let connection;
    try {
        connection = await getConnection();
        
        // TODO: Ajusta el nombre de la tabla según tu esquema de BD
        const result = await connection.execute(
            `SELECT id, nombre, categoria, precio, stock, fecha_creacion, estado 
             FROM productos`
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
        console.error('Error al obtener productos:', error);
        res.status(500).json({ 
            error: 'Error al obtener productos',
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

// Obtener un producto por ID
async function obtenerProductoPorId(req, res) {
    let connection;
    try {
        const { id } = req.params;
        connection = await getConnection();
        
        const result = await connection.execute(
            `SELECT id, nombre, categoria, precio, stock, fecha_creacion, estado 
             FROM productos WHERE id = :id`,
            [id]
        );

        if (result.rows && result.rows.length > 0) {
            res.json(result.rows[0]);
        } else {
            res.status(404).json({ error: 'Producto no encontrado' });
        }

    } catch (error) {
        console.error('Error al obtener producto:', error);
        res.status(500).json({ 
            error: 'Error al obtener producto',
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

// Crear un nuevo producto
async function crearProducto(req, res) {
    let connection;
    try {
        const { nombre, categoria, precio, stock, estado } = req.body;
        
        // Validaciones básicas
        if (!nombre || !categoria || !precio || stock === undefined) {
            return res.status(400).json({ 
                error: 'Nombre, categoría, precio y stock son requeridos' 
            });
        }

        connection = await getConnection();
        
        const result = await connection.execute(
            `INSERT INTO productos (nombre, categoria, precio, stock, fecha_creacion, estado) 
             VALUES (:nombre, :categoria, :precio, :stock, SYSDATE, :estado)`,
            [nombre, categoria, precio, stock, estado || 'activo']
        );

        await connection.commit();
        
        res.status(201).json({ 
            mensaje: 'Producto creado exitosamente',
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
        console.error('Error al crear producto:', error);
        res.status(500).json({ 
            error: 'Error al crear producto',
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

// Actualizar un producto
async function actualizarProducto(req, res) {
    let connection;
    try {
        const { id } = req.params;
        const { nombre, categoria, precio, stock, estado } = req.body;

        if (!nombre || !categoria || !precio || stock === undefined) {
            return res.status(400).json({ 
                error: 'Nombre, categoría, precio y stock son requeridos' 
            });
        }

        connection = await getConnection();
        
        const result = await connection.execute(
            `UPDATE productos 
             SET nombre = :nombre, categoria = :categoria, precio = :precio, 
                 stock = :stock, estado = :estado
             WHERE id = :id`,
            [nombre, categoria, precio, stock, estado || 'activo', id]
        );

        await connection.commit();

        if (result.rowsAffected === 0) {
            return res.status(404).json({ error: 'Producto no encontrado' });
        }

        res.json({ 
            mensaje: 'Producto actualizado exitosamente',
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
        console.error('Error al actualizar producto:', error);
        res.status(500).json({ 
            error: 'Error al actualizar producto',
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

// Eliminar un producto
async function eliminarProducto(req, res) {
    let connection;
    try {
        const { id } = req.params;
        connection = await getConnection();
        
        const result = await connection.execute(
            `DELETE FROM productos WHERE id = :id`,
            [id]
        );

        await connection.commit();

        if (result.rowsAffected === 0) {
            return res.status(404).json({ error: 'Producto no encontrado' });
        }

        res.json({ 
            mensaje: 'Producto eliminado exitosamente',
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
        console.error('Error al eliminar producto:', error);
        res.status(500).json({ 
            error: 'Error al eliminar producto',
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
    obtenerProductos,
    obtenerProductoPorId,
    crearProducto,
    actualizarProducto,
    eliminarProducto
};
