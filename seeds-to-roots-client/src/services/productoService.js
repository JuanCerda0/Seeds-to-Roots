import productosData from '../../../frontend/api/mockData/productos.json';

// Simular una base de datos local con los datos del JSON
let productosDB = productosData.data || [];

const productoService = {
  /**
   * Obtener todos los productos
   * @returns {Promise<Array>}
   */
  async getAll() {
    try {
      // Simular delay de red
      await new Promise(resolve => setTimeout(resolve, 300));
      return productosDB;
    } catch (error) {
      console.error('Error al obtener productos:', error);
      throw error;
    }
  },

  /**
   * Obtener un producto por ID
   * @param {number} id
   * @returns {Promise<Object>}
   */
  async getById(id) {
    try {
      await new Promise(resolve => setTimeout(resolve, 200));
      const producto = productosDB.find(p => p.id === parseInt(id));
      if (!producto) {
        throw new Error('Producto no encontrado');
      }
      return producto;
    } catch (error) {
      console.error('Error al obtener producto:', error);
      throw error;
    }
  },

  /**
   * Crear un nuevo producto (solo ADMIN)
   * @param {Object} producto
   * @returns {Promise<Object>}
   */
  async create(producto) {
    try {
      await new Promise(resolve => setTimeout(resolve, 200));
      const nuevoId = Math.max(...productosDB.map(p => p.id), 0) + 1;
      const nuevoProducto = {
        id: nuevoId,
        ...producto,
        fechaCreacion: new Date().toISOString().split('T')[0],
        fechaActualizacion: new Date().toISOString().split('T')[0],
      };
      productosDB.push(nuevoProducto);
      return nuevoProducto;
    } catch (error) {
      console.error('Error al crear producto:', error);
      throw error;
    }
  },

  /**
   * Actualizar un producto (solo ADMIN)
   * @param {number} id
   * @param {Object} producto
   * @returns {Promise<Object>}
   */
  async update(id, producto) {
    try {
      await new Promise(resolve => setTimeout(resolve, 200));
      const indice = productosDB.findIndex(p => p.id === parseInt(id));
      if (indice === -1) {
        throw new Error('Producto no encontrado');
      }
      const productoActualizado = {
        ...productosDB[indice],
        ...producto,
        id: parseInt(id),
        fechaActualizacion: new Date().toISOString().split('T')[0],
      };
      productosDB[indice] = productoActualizado;
      return productoActualizado;
    } catch (error) {
      console.error('Error al actualizar producto:', error);
      throw error;
    }
  },
  /**
   * Eliminar un producto (solo ADMIN)
   * @param {number} id
   * @returns {Promise<void>}
   */
  async delete(id) {
    try {
      await new Promise(resolve => setTimeout(resolve, 200));
      const indice = productosDB.findIndex(p => p.id === parseInt(id));
      if (indice === -1) {
        throw new Error('Producto no encontrado');
      }
      productosDB.splice(indice, 1);
    } catch (error) {
      console.error('Error al eliminar producto:', error);
      throw error;
    }
  },

  /**
   * Buscar productos por nombre o categoría
   * @param {string} termino
   * @returns {Promise<Array>}
   */
  async buscar(termino) {
    try {
      await new Promise(resolve => setTimeout(resolve, 200));
      const terminoLower = termino.toLowerCase();
      return productosDB.filter(p =>
        p.nombre.toLowerCase().includes(terminoLower) ||
        p.categoria.toLowerCase().includes(terminoLower)
      );
    } catch (error) {
      console.error('Error al buscar productos:', error);
      throw error;
    }
  },

  /**
   * Obtener productos por categoría
   * @param {string} categoria
   * @returns {Promise<Array>}
   */
  async getByCategoria(categoria) {
    try {
      await new Promise(resolve => setTimeout(resolve, 200));
      return productosDB.filter(p => p.categoria === categoria);
    } catch (error) {
      console.error('Error al obtener productos por categoría:', error);
      throw error;
    }
  },
};

export default productoService;