/**
 * ============================================================================
 * WHATSAPP.JS — Arma el mensaje del pedido y abre WhatsApp
 * ============================================================================
 * Toda la redacción del mensaje final vive en `construirMensaje()`.
 * Si algún día hay que cambiar el formato del pedido que llega por WhatsApp,
 * este es el único lugar que hay que tocar.
 * ============================================================================
 */

const Whatsapp = (() => {
  /** Formatea un número como precio en pesos argentinos: 3000 -> "$3.000" */
  function formatearPrecio(numero) {
    if (typeof numero !== "number") return "Consultar";
    return `$${numero.toLocaleString("es-AR")}`;
  }

  /** Arma la línea de sabores de un ítem: "Dulce de leche, Pistacho x2" */
  function formatearSabores(sabores) {
    if (!sabores || sabores.length === 0) return "";
    return sabores
      .map((s) => (s.cantidad > 1 ? `${s.nombre} x${s.cantidad}` : s.nombre))
      .join(", ");
  }

  /** Arma el bloque de texto para un ítem del pedido */
  function formatearItem(item) {
    const subtotal = (item.precioUnitario || 0) * item.cantidad;
    const lineas = [`• ${item.cantidad}x ${item.nombre} — ${formatearPrecio(subtotal)}`];

    const saboresTexto = formatearSabores(item.sabores);
    if (saboresTexto) {
      lineas.push(`  Sabores: ${saboresTexto}`);
    }
    if (item.aclaracion) {
      lineas.push(`  Nota: ${item.aclaracion}`);
    }
    return lineas.join("\n");
  }

  /** Arma el bloque de dirección para delivery */
  function formatearDireccion(entrega) {
    if (entrega.tipo !== "delivery") return "";
    const { calle, piso, entreCalles, referencia } = entrega.direccion;
    let texto = `📍 Dirección: ${calle}`;
    if (piso) texto += `, ${piso}`;
    const extra = [];
    if (entreCalles) extra.push(`   Entre calles: ${entreCalles}`);
    if (referencia) extra.push(`   Referencia: ${referencia}`);
    return [texto, ...extra].join("\n");
  }

  /** Arma el texto de método de pago, incluyendo el vuelto si corresponde */
  function formatearPago(pago) {
    const nombres = {
      efectivo: "Efectivo",
      transferencia: "Transferencia",
      mercadopago: "Mercado Pago",
    };
    let texto = `💵 Pago: ${nombres[pago.metodo] || pago.metodo}`;
    if (pago.metodo === "efectivo" && pago.montoAbona) {
      texto += ` (abona con ${formatearPrecio(Number(pago.montoAbona))})`;
    }
    return texto;
  }

  /**
   * Construye el mensaje completo del pedido, listo para mandar por WhatsApp.
   * @param {Object} pedido
   *   - nombreCliente: string
   *   - entrega: { tipo: 'retiro'|'delivery', direccion: {calle, piso, entreCalles, referencia} }
   *   - items: array de ítems del carrito (ver cart.js)
   *   - total: number
   *   - pago: { metodo, montoAbona }
   *   - notas: string
   *   - sucursal: string (nombre de la sucursal, para el encabezado)
   */
  function construirMensaje(pedido) {
    const bloques = [];

    bloques.push(`🍦 *NUEVO PEDIDO — Sei Tu ${pedido.sucursal}*`);
    bloques.push("");
    bloques.push(`👤 Nombre: ${pedido.nombreCliente}`);

    if (pedido.entrega.tipo === "delivery") {
      bloques.push(`🛵 Entrega: Delivery`);
      bloques.push(formatearDireccion(pedido.entrega));
    } else {
      bloques.push(`🏠 Entrega: Retiro en el local`);
    }

    bloques.push("");
    bloques.push("📝 *PEDIDO*");
    pedido.items.forEach((item) => bloques.push(formatearItem(item)));

    bloques.push("");
    bloques.push(`💰 Total: ${formatearPrecio(pedido.total)}`);
    bloques.push(formatearPago(pedido.pago));

    if (pedido.notas) {
      bloques.push(`📌 Notas: ${pedido.notas}`);
    }

    bloques.push("");
    bloques.push(`Pedido generado desde ${pedido.origenTexto || "seitudonorione.com.ar"}`);

    return bloques.filter((linea) => linea !== "").join("\n").replace(/\n{3,}/g, "\n\n");
  }

  /** Abre WhatsApp con el mensaje ya cargado */
  function abrirChat(mensaje, urlBase) {
    const url = `${urlBase}?text=${encodeURIComponent(mensaje)}`;
    window.open(url, "_blank", "noopener");
  }

  return {
    formatearPrecio,
    construirMensaje,
    abrirChat,
  };
})();
