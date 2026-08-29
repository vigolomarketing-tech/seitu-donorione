/**
 * ============================================================================
 * CART.JS — Manejo del carrito de compras
 * ============================================================================
 * El carrito vive en memoria (variable `items`) y se sincroniza con
 * sessionStorage para no perderse si el usuario recarga la página.
 * No se conecta a ningún backend ni API externa.
 * ============================================================================
 */

const Cart = (() => {
  const STORAGE_KEY = "seitu_carrito";
  let items = [];

  function cargarDesdeStorage() {
    try {
      const guardado = sessionStorage.getItem(STORAGE_KEY);
      items = guardado ? JSON.parse(guardado) : [];
    } catch (error) {
      items = [];
    }
  }

  function guardarEnStorage() {
    try {
      sessionStorage.setItem(STORAGE_KEY, JSON.stringify(items));
    } catch (error) {
      // Si sessionStorage no está disponible (modo privado, etc.) seguimos solo en memoria
    }
  }

  function generarId() {
    return `item-${Date.now()}-${Math.random().toString(36).slice(2, 8)}`;
  }

  /**
   * Agrega un ítem al carrito.
   * @param {Object} datos - { productoId, nombre, precioUnitario, cantidad, sabores, aclaracion }
   *   sabores: array de { id, nombre, cantidad }
   */
  function agregarItem(datos) {
    const item = {
      uid: generarId(),
      productoId: datos.productoId,
      nombre: datos.nombre,
      precioUnitario: datos.precioUnitario,
      cantidad: datos.cantidad || 1,
      sabores: datos.sabores || [],
      aclaracion: (datos.aclaracion || "").trim(),
    };
    items.push(item);
    guardarEnStorage();
    return item;
  }

  function eliminarItem(uid) {
    items = items.filter((item) => item.uid !== uid);
    guardarEnStorage();
  }

  function actualizarCantidad(uid, cantidad) {
    const item = items.find((i) => i.uid === uid);
    if (!item) return;
    item.cantidad = Math.max(1, cantidad);
    guardarEnStorage();
  }

  function vaciar() {
    items = [];
    guardarEnStorage();
  }

  function obtenerItems() {
    return items;
  }

  function contarItems() {
    return items.reduce((total, item) => total + item.cantidad, 0);
  }

  function calcularSubtotal(item) {
    const precio = typeof item.precioUnitario === "number" ? item.precioUnitario : 0;
    return precio * item.cantidad;
  }

  function calcularTotal() {
    return items.reduce((total, item) => total + calcularSubtotal(item), 0);
  }

  function estaVacio() {
    return items.length === 0;
  }

  // Se inicializa apenas se carga el script
  cargarDesdeStorage();

  return {
    agregarItem,
    eliminarItem,
    actualizarCantidad,
    vaciar,
    obtenerItems,
    contarItems,
    calcularSubtotal,
    calcularTotal,
    estaVacio,
  };
})();
