/**
 * ============================================================================
 * APP.JS — Renderiza el sitio a partir de CONFIG y maneja toda la interacción
 * ============================================================================
 * Este archivo NO contiene precios, textos de productos ni datos de contacto:
 * todo sale de `CONFIG` (js/config.js). Acá solo hay lógica de UI.
 * ============================================================================
 */

(() => {
  "use strict";

  // --------------------------------------------------------------------------
  // Estado de la app
  // --------------------------------------------------------------------------
  const estado = {
    modalProducto: {
      producto: null,
      sabores: new Map(), // saborId -> cantidad elegida
      cantidadProducto: 1,
      aclaracion: "",
    },
    filtroSabores: "todos",
    ultimoFocoAntesDelModal: null,
    entregaTipo: "retiro",
  };

  // --------------------------------------------------------------------------
  // Utilidades generales
  // --------------------------------------------------------------------------
  function $(selector, contexto = document) {
    return contexto.querySelector(selector);
  }

  function crearEl(tag, props = {}, hijos = []) {
    const el = document.createElement(tag);
    Object.entries(props).forEach(([clave, valor]) => {
      if (clave === "class") el.className = valor;
      else if (clave === "text") el.textContent = valor;
      else if (clave === "html") el.innerHTML = valor;
      else if (clave.startsWith("on") && typeof valor === "function") {
        el.addEventListener(clave.slice(2).toLowerCase(), valor);
      } else if (valor !== undefined && valor !== null && valor !== false) {
        el.setAttribute(clave, valor);
      }
    });
    hijos.forEach((hijo) => hijo && el.appendChild(hijo));
    return el;
  }

  function formatearPrecio(numero) {
    return Whatsapp.formatearPrecio(numero);
  }

  function buscarProducto(id) {
    return CONFIG.productos.find((p) => p.id === id);
  }

  function buscarSabor(id) {
    return CONFIG.sabores.find((s) => s.id === id);
  }

  // --------------------------------------------------------------------------
  // Horarios: calcula si el local / delivery están abiertos AHORA (hora AR)
  // --------------------------------------------------------------------------
  function obtenerAhoraEnZona(zona) {
    const formatter = new Intl.DateTimeFormat("en-US", {
      timeZone: zona,
      weekday: "short",
      hour: "2-digit",
      minute: "2-digit",
      hour12: false,
    });
    const partes = formatter.formatToParts(new Date());
    const mapa = {};
    partes.forEach((p) => (mapa[p.type] = p.value));
    const diasSemana = { Sun: 0, Mon: 1, Tue: 2, Wed: 3, Thu: 4, Fri: 5, Sat: 6 };
    let hora = parseInt(mapa.hour, 10);
    if (hora === 24) hora = 0;
    return {
      dia: diasSemana[mapa.weekday],
      minutos: hora * 60 + parseInt(mapa.minute, 10),
    };
  }

  function hhmmAMinutos(hhmm) {
    const [h, m] = hhmm.split(":").map(Number);
    return h * 60 + m;
  }

  function estaEnHorario(horarioConfig) {
    const ahora = obtenerAhoraEnZona(CONFIG.horarios.zonaHoraria);
    if (!horarioConfig.dias.includes(ahora.dia)) return false;

    const apertura = hhmmAMinutos(horarioConfig.apertura);
    let cierre = hhmmAMinutos(horarioConfig.cierre);

    if (cierre > apertura) {
      return ahora.minutos >= apertura && ahora.minutos < cierre;
    }
    // Rango que cruza la medianoche (ej. 19:00 a 00:00)
    return ahora.minutos >= apertura || ahora.minutos < cierre;
  }

  function renderBannerHorario() {
    const cont = $("#banner-horario");
    if (!cont) return;
    cont.innerHTML = "";

    const abierto = estaEnHorario(CONFIG.horarios.local);
    const clase = abierto ? "banner-horario banner-horario--abierto" : "banner-horario banner-horario--cerrado";
    const texto = abierto
      ? "🟢 Abierto ahora"
      : `🔴 Cerrado ahora — Abrimos a las ${CONFIG.horarios.local.apertura} hs`;

    cont.className = clase;
    cont.appendChild(crearEl("span", { text: texto }));
  }

  // --------------------------------------------------------------------------
  // Header / Hero
  // --------------------------------------------------------------------------
  function renderHero() {
    const { negocio, horarios } = CONFIG;

    $("#logo-img").src = negocio.imagenes.logo;
    $("#logo-img").alt = `Logo de ${negocio.nombreCompleto} en ${negocio.direccion.localidad}`;
    $("#hero-img").src = negocio.imagenes.hero;
    $("#hero-img").alt = `Helados artesanales de ${negocio.nombre} en ${negocio.direccion.barrio}, ${negocio.direccion.localidad}`;
    $("#hero-nombre").textContent = `${negocio.eslogan} — ${negocio.nombre} ${negocio.sucursal}`;
    $("#hero-direccion").textContent = negocio.direccion.textoCorto;
    $("#hero-horario").textContent = horarios.local.textoLegible;

    $("#btn-pedir-ahora").addEventListener("click", () => {
      $("#catalogo").scrollIntoView({ behavior: "smooth" });
    });
  }

  // --------------------------------------------------------------------------
  // Navegación de categorías (sticky, scroll horizontal)
  // --------------------------------------------------------------------------
  function renderCategoriasNav() {
    const nav = $("#categorias-nav");
    nav.innerHTML = "";
    CONFIG.categoriasProductos.forEach((cat) => {
      const boton = crearEl("button", {
        class: "categoria-tab",
        type: "button",
        text: `${cat.icono} ${cat.nombre}`,
        "data-categoria": cat.id,
        onClick: () => {
          $(`#categoria-${cat.id}`).scrollIntoView({ behavior: "smooth", block: "start" });
        },
      });
      nav.appendChild(boton);
    });
  }

  // --------------------------------------------------------------------------
  // Catálogo de productos
  // --------------------------------------------------------------------------
  function renderCatalogo() {
    const cont = $("#catalogo");
    cont.innerHTML = "";

    CONFIG.categoriasProductos.forEach((cat) => {
      const productosCategoria = CONFIG.productos.filter((p) => p.categoria === cat.id && p.visible !== false);
      if (productosCategoria.length === 0) return;

      const seccion = crearEl("div", { class: "categoria-seccion", id: `categoria-${cat.id}`, "data-categoria": cat.id });
      seccion.appendChild(crearEl("h2", { class: "categoria-titulo", text: `${cat.icono} ${cat.nombre}` }));

      const grid = crearEl("div", { class: "productos-grid" });
      productosCategoria.forEach((producto) => grid.appendChild(renderTarjetaProducto(producto)));
      seccion.appendChild(grid);
      cont.appendChild(seccion);
    });
  }

  function altProducto(producto) {
    const { negocio } = CONFIG;
    const detalle = producto.categoria === "cafeteria" ? "" : " de helado artesanal";
    return `${producto.nombre}${detalle} - ${negocio.nombre} ${negocio.sucursal}, ${negocio.direccion.localidad}`;
  }

  function renderTarjetaProducto(producto) {
    const precioTexto = producto.precio === null ? "Consultar" : formatearPrecio(producto.precio);
    const tarjeta = crearEl("article", {
      class: `producto-card${producto.disponible ? "" : " producto-card--agotado"}`,
    });

    tarjeta.appendChild(
      crearEl("img", {
        class: "producto-img",
        src: producto.imagen,
        alt: altProducto(producto),
        loading: "lazy",
        width: "160",
        height: "160",
        onError: (e) => {
          // Si todavía no se subió la foto real, mostramos el ícono de marca
          // sobre fondo celeste en vez de dejar un hueco vacío o un ícono roto.
          e.target.onerror = null;
          e.target.src = CONFIG.negocio.imagenes.fallbackProducto;
          e.target.classList.add("producto-img--fallback");
        },
      })
    );

    const info = crearEl("div", { class: "producto-info" });
    info.appendChild(crearEl("h3", { class: "producto-nombre", text: producto.nombre }));
    if (producto.descripcion) {
      info.appendChild(crearEl("p", { class: "producto-desc", text: producto.descripcion }));
    }
    info.appendChild(crearEl("p", { class: "producto-precio", text: precioTexto }));

    const boton = crearEl("button", {
      class: "btn btn-agregar",
      type: "button",
      text: producto.disponible ? "Elegir" : "No disponible",
      "aria-label": `Elegir ${producto.nombre}`,
      disabled: !producto.disponible,
      onClick: () => abrirModalProducto(producto),
    });
    info.appendChild(boton);
    tarjeta.appendChild(info);

    return tarjeta;
  }

  // --------------------------------------------------------------------------
  // Modal de producto (elegir sabores, cantidad, aclaración)
  // --------------------------------------------------------------------------
  function abrirModalProducto(producto) {
    estado.modalProducto = {
      producto,
      sabores: new Map(),
      cantidadProducto: 1,
      aclaracion: "",
    };
    renderModalProducto();
    abrirModal();
  }

  function renderModalProducto() {
    const { producto, sabores, cantidadProducto } = estado.modalProducto;
    const root = $("#modal-root");
    root.innerHTML = "";

    const totalSeleccionado = Array.from(sabores.values()).reduce((a, b) => a + b, 0);
    const precioBase = producto.precio === null ? 0 : producto.precio;
    const precioTotal = precioBase * cantidadProducto;

    const dialogo = crearEl("div", {
      class: "modal-dialogo",
      role: "dialog",
      "aria-modal": "true",
      "aria-labelledby": "modal-titulo",
    });

    // Encabezado
    const header = crearEl("div", { class: "modal-header" });
    header.appendChild(crearEl("h2", { id: "modal-titulo", text: producto.nombre }));
    header.appendChild(
      crearEl("button", {
        class: "btn-cerrar",
        type: "button",
        "aria-label": "Cerrar",
        text: "✕",
        onClick: cerrarModal,
      })
    );
    dialogo.appendChild(header);

    const body = crearEl("div", { class: "modal-body" });

    if (producto.descripcion) {
      body.appendChild(crearEl("p", { class: "modal-desc", text: producto.descripcion }));
    }

    // Selección de sabores
    if (producto.maxSabores > 0) {
      body.appendChild(
        crearEl("p", {
          class: "sabores-contador",
          id: "sabores-contador",
          text: `Elegiste ${totalSeleccionado} de ${producto.maxSabores} sabor${producto.maxSabores > 1 ? "es" : ""}`,
        })
      );

      CONFIG.categoriasSabores.forEach((catSabor) => {
        const saboresCategoria = CONFIG.sabores.filter((s) => s.categoria === catSabor.id);
        if (saboresCategoria.length === 0) return;

        body.appendChild(crearEl("h3", { class: "sabores-categoria-titulo", text: catSabor.nombre }));
        const grid = crearEl("div", { class: "sabores-grid" });
        saboresCategoria.forEach((sabor) => grid.appendChild(renderFilaSabor(sabor, producto.maxSabores)));
        body.appendChild(grid);
      });

      body.appendChild(crearEl("p", { class: "campo-error", id: "error-sabores" }));
    }

    // Cantidad de producto
    const filaCantidad = crearEl("div", { class: "campo-cantidad" });
    filaCantidad.appendChild(crearEl("span", { text: "Cantidad" }));
    const stepperProducto = crearEl("div", { class: "stepper" });
    stepperProducto.appendChild(
      crearEl("button", {
        type: "button",
        class: "stepper-btn",
        "aria-label": "Restar cantidad",
        text: "−",
        onClick: () => cambiarCantidadProducto(-1),
      })
    );
    stepperProducto.appendChild(crearEl("span", { class: "stepper-valor", id: "cantidad-producto-valor", text: String(cantidadProducto) }));
    stepperProducto.appendChild(
      crearEl("button", {
        type: "button",
        class: "stepper-btn",
        "aria-label": "Sumar cantidad",
        text: "+",
        onClick: () => cambiarCantidadProducto(1),
      })
    );
    filaCantidad.appendChild(stepperProducto);
    body.appendChild(filaCantidad);

    // Aclaración
    const campoAclaracion = crearEl("div", { class: "campo" });
    campoAclaracion.appendChild(crearEl("label", { for: "aclaracion-producto", text: "Aclaración (opcional)" }));
    campoAclaracion.appendChild(
      crearEl("textarea", {
        id: "aclaracion-producto",
        rows: "2",
        placeholder: "Ej: poco dulce de leche",
        onInput: (e) => {
          estado.modalProducto.aclaracion = e.target.value;
        },
      })
    );
    body.appendChild(campoAclaracion);

    dialogo.appendChild(body);

    // Footer
    const footer = crearEl("div", { class: "modal-footer" });
    const textoBoton = producto.precio === null ? "Agregar al pedido — Consultar" : `Agregar al pedido — ${formatearPrecio(precioTotal)}`;
    footer.appendChild(
      crearEl("button", {
        class: "btn btn-primario btn-full",
        type: "button",
        id: "btn-agregar-carrito",
        text: textoBoton,
        onClick: confirmarAgregarAlCarrito,
      })
    );
    dialogo.appendChild(footer);

    root.appendChild(crearEl("div", { class: "modal-overlay", onClick: cerrarModal }));
    root.appendChild(dialogo);
    root.hidden = false;

    const primerFocable = dialogo.querySelector("button, [href], input, textarea");
    if (primerFocable) primerFocable.focus();
  }

  function renderFilaSabor(sabor, maxSabores) {
    const cantidadActual = estado.modalProducto.sabores.get(sabor.id) || 0;
    const totalSeleccionado = Array.from(estado.modalProducto.sabores.values()).reduce((a, b) => a + b, 0);
    const alcanzoMaximo = totalSeleccionado >= maxSabores;

    const fila = crearEl("div", {
      class: `sabor-fila${!sabor.disponible ? " sabor-fila--agotado" : ""}`,
    });

    const nombre = crearEl("span", { class: "sabor-nombre", text: sabor.nombre });
    if (!sabor.disponible) {
      nombre.classList.add("sabor-nombre--tachado");
    }
    fila.appendChild(nombre);

    if (sabor.destacado) {
      fila.appendChild(crearEl("span", { class: "badge-especial", text: "Especial" }));
    }
    if (!sabor.disponible) {
      fila.appendChild(crearEl("span", { class: "badge-agotado", text: "Agotado" }));
      return fila;
    }

    const stepper = crearEl("div", { class: "stepper stepper--sabor" });
    stepper.appendChild(
      crearEl("button", {
        type: "button",
        class: "stepper-btn",
        "aria-label": `Quitar ${sabor.nombre}`,
        text: "−",
        disabled: cantidadActual === 0,
        onClick: () => cambiarCantidadSabor(sabor.id, -1, maxSabores),
      })
    );
    stepper.appendChild(crearEl("span", { class: "stepper-valor", text: String(cantidadActual) }));
    stepper.appendChild(
      crearEl("button", {
        type: "button",
        class: "stepper-btn",
        "aria-label": `Agregar ${sabor.nombre}`,
        text: "+",
        disabled: alcanzoMaximo,
        onClick: () => cambiarCantidadSabor(sabor.id, 1, maxSabores),
      })
    );
    fila.appendChild(stepper);

    return fila;
  }

  function cambiarCantidadSabor(saborId, delta, maxSabores) {
    const mapa = estado.modalProducto.sabores;
    const actual = mapa.get(saborId) || 0;
    const totalActual = Array.from(mapa.values()).reduce((a, b) => a + b, 0);

    if (delta > 0 && totalActual >= maxSabores) return;

    const nuevoValor = Math.max(0, actual + delta);
    if (nuevoValor === 0) mapa.delete(saborId);
    else mapa.set(saborId, nuevoValor);

    renderModalProducto();
  }

  function cambiarCantidadProducto(delta) {
    estado.modalProducto.cantidadProducto = Math.max(1, estado.modalProducto.cantidadProducto + delta);
    renderModalProducto();
  }

  function confirmarAgregarAlCarrito() {
    const { producto, sabores, cantidadProducto, aclaracion } = estado.modalProducto;
    const totalSeleccionado = Array.from(sabores.values()).reduce((a, b) => a + b, 0);
    const minimoRequerido = producto.maxSabores > 0 ? Math.max(1, producto.minSabores || 1) : 0;

    if (producto.maxSabores > 0 && totalSeleccionado < minimoRequerido) {
      const errorEl = $("#error-sabores");
      if (errorEl) errorEl.textContent = `Elegí al menos ${minimoRequerido} sabor${minimoRequerido > 1 ? "es" : ""} para continuar.`;
      return;
    }

    const saboresElegidos = Array.from(sabores.entries()).map(([id, cantidad]) => ({
      id,
      nombre: buscarSabor(id).nombre,
      cantidad,
    }));

    Cart.agregarItem({
      productoId: producto.id,
      nombre: producto.nombre,
      precioUnitario: producto.precio,
      cantidad: cantidadProducto,
      sabores: saboresElegidos,
      aclaracion,
    });

    cerrarModal();
    renderCarritoFlotante();
    anunciar(`${producto.nombre} agregado al pedido`);
  }

  // --------------------------------------------------------------------------
  // Modal genérico: abrir / cerrar con manejo de foco y teclado
  // --------------------------------------------------------------------------
  function abrirModal() {
    estado.ultimoFocoAntesDelModal = document.activeElement;
    document.body.classList.add("bloquear-scroll");
    document.addEventListener("keydown", manejarTeclaModal);
  }

  function cerrarModal() {
    const root = $("#modal-root");
    root.innerHTML = "";
    root.hidden = true;
    document.body.classList.remove("bloquear-scroll");
    document.removeEventListener("keydown", manejarTeclaModal);
    if (estado.ultimoFocoAntesDelModal) estado.ultimoFocoAntesDelModal.focus();
  }

  function manejarTeclaModal(e) {
    if (e.key === "Escape") {
      cerrarModal();
      return;
    }
    if (e.key === "Tab") {
      const root = $("#modal-root");
      const focables = Array.from(root.querySelectorAll('button, [href], input, textarea, select, [tabindex]:not([tabindex="-1"])')).filter(
        (el) => !el.disabled
      );
      if (focables.length === 0) return;
      const primero = focables[0];
      const ultimo = focables[focables.length - 1];
      if (e.shiftKey && document.activeElement === primero) {
        e.preventDefault();
        ultimo.focus();
      } else if (!e.shiftKey && document.activeElement === ultimo) {
        e.preventDefault();
        primero.focus();
      }
    }
  }

  function anunciar(mensaje) {
    const live = $("#anunciador");
    if (live) live.textContent = mensaje;
  }

  // --------------------------------------------------------------------------
  // Carrito flotante
  // --------------------------------------------------------------------------
  function renderCarritoFlotante() {
    const barra = $("#carrito-flotante");
    const cantidad = Cart.contarItems();

    if (cantidad === 0) {
      barra.hidden = true;
      return;
    }

    barra.hidden = false;
    barra.innerHTML = "";
    const boton = crearEl("button", {
      class: "carrito-flotante-btn",
      type: "button",
      onClick: abrirCarrito,
    });
    boton.appendChild(crearEl("span", { class: "carrito-contador", text: `${cantidad}` }));
    boton.appendChild(crearEl("span", { class: "carrito-texto", text: "Ver pedido" }));
    boton.appendChild(crearEl("span", { class: "carrito-total", text: formatearPrecio(Cart.calcularTotal()) }));
    barra.appendChild(boton);
  }

  function abrirCarrito() {
    renderModalCarrito();
    abrirModal();
  }

  function renderModalCarrito() {
    const root = $("#modal-root");
    root.innerHTML = "";

    const dialogo = crearEl("div", { class: "modal-dialogo", role: "dialog", "aria-modal": "true", "aria-labelledby": "carrito-titulo" });

    const header = crearEl("div", { class: "modal-header" });
    header.appendChild(crearEl("h2", { id: "carrito-titulo", text: "Tu pedido" }));
    header.appendChild(crearEl("button", { class: "btn-cerrar", type: "button", "aria-label": "Cerrar", text: "✕", onClick: cerrarModal }));
    dialogo.appendChild(header);

    const body = crearEl("div", { class: "modal-body" });

    if (Cart.estaVacio()) {
      body.appendChild(crearEl("p", { text: "Todavía no agregaste productos." }));
    } else {
      const hayConsultar = Cart.obtenerItems().some((i) => i.precioUnitario === null);
      Cart.obtenerItems().forEach((item) => body.appendChild(renderFilaCarrito(item)));
      if (hayConsultar) {
        body.appendChild(
          crearEl("p", {
            class: "aviso-consultar",
            text: "Los productos marcados \"Consultar\" no están incluidos en el total. Te confirmamos el precio por WhatsApp.",
          })
        );
      }
      body.appendChild(crearEl("p", { class: "carrito-total-linea", text: `Total: ${formatearPrecio(Cart.calcularTotal())}` }));
    }

    dialogo.appendChild(body);

    const footer = crearEl("div", { class: "modal-footer" });
    footer.appendChild(
      crearEl("button", {
        class: "btn btn-primario btn-full",
        type: "button",
        text: "Continuar con el pedido",
        disabled: Cart.estaVacio(),
        onClick: () => {
          cerrarModal();
          abrirCheckout();
        },
      })
    );
    dialogo.appendChild(footer);

    root.appendChild(crearEl("div", { class: "modal-overlay", onClick: cerrarModal }));
    root.appendChild(dialogo);
    root.hidden = false;
  }

  function renderFilaCarrito(item) {
    const fila = crearEl("div", { class: "carrito-item" });

    const info = crearEl("div", { class: "carrito-item-info" });
    info.appendChild(crearEl("p", { class: "carrito-item-nombre", text: item.nombre }));
    if (item.sabores.length > 0) {
      const texto = item.sabores.map((s) => (s.cantidad > 1 ? `${s.nombre} x${s.cantidad}` : s.nombre)).join(", ");
      info.appendChild(crearEl("p", { class: "carrito-item-sabores", text: `Sabores: ${texto}` }));
    }
    if (item.aclaracion) {
      info.appendChild(crearEl("p", { class: "carrito-item-nota", text: `Nota: ${item.aclaracion}` }));
    }
    const precioTexto = item.precioUnitario === null ? "Consultar" : formatearPrecio(Cart.calcularSubtotal(item));
    info.appendChild(crearEl("p", { class: "carrito-item-precio", text: precioTexto }));
    fila.appendChild(info);

    const acciones = crearEl("div", { class: "carrito-item-acciones" });
    const stepper = crearEl("div", { class: "stepper" });
    stepper.appendChild(
      crearEl("button", {
        type: "button",
        class: "stepper-btn",
        "aria-label": `Restar cantidad de ${item.nombre}`,
        text: "−",
        onClick: () => {
          if (item.cantidad <= 1) {
            Cart.eliminarItem(item.uid);
          } else {
            Cart.actualizarCantidad(item.uid, item.cantidad - 1);
          }
          renderModalCarrito();
          renderCarritoFlotante();
        },
      })
    );
    stepper.appendChild(crearEl("span", { class: "stepper-valor", text: String(item.cantidad) }));
    stepper.appendChild(
      crearEl("button", {
        type: "button",
        class: "stepper-btn",
        "aria-label": `Sumar cantidad de ${item.nombre}`,
        text: "+",
        onClick: () => {
          Cart.actualizarCantidad(item.uid, item.cantidad + 1);
          renderModalCarrito();
          renderCarritoFlotante();
        },
      })
    );
    acciones.appendChild(stepper);

    acciones.appendChild(
      crearEl("button", {
        type: "button",
        class: "btn-eliminar",
        "aria-label": `Eliminar ${item.nombre} del pedido`,
        text: "Eliminar",
        onClick: () => {
          Cart.eliminarItem(item.uid);
          renderModalCarrito();
          renderCarritoFlotante();
        },
      })
    );
    fila.appendChild(acciones);

    return fila;
  }

  // --------------------------------------------------------------------------
  // Checkout
  // --------------------------------------------------------------------------
  function abrirCheckout() {
    estado.entregaTipo = "retiro";
    estado.metodoPagoSeleccionado = "efectivo";
    // Guarda lo que el usuario va tipeando para no perderlo cuando el formulario
    // se vuelve a renderizar (ej. al cambiar "Retiro/Delivery" o el método de pago)
    estado.checkoutValores = {};
    renderModalCheckout();
    abrirModal();
  }

  function renderModalCheckout() {
    const root = $("#modal-root");
    root.innerHTML = "";

    const dialogo = crearEl("div", { class: "modal-dialogo", role: "dialog", "aria-modal": "true", "aria-labelledby": "checkout-titulo" });

    const header = crearEl("div", { class: "modal-header" });
    header.appendChild(crearEl("h2", { id: "checkout-titulo", text: "Finalizar pedido" }));
    header.appendChild(crearEl("button", { class: "btn-cerrar", type: "button", "aria-label": "Cerrar", text: "✕", onClick: cerrarModal }));
    dialogo.appendChild(header);

    const body = crearEl("div", { class: "modal-body" });
    const form = crearEl("form", { id: "form-checkout", novalidate: "true" });

    // Nombre
    form.appendChild(campoTexto("nombre-cliente", "Nombre y apellido", "text", true));

    // Tipo de entrega
    const fieldsetEntrega = crearEl("fieldset", { class: "campo" });
    fieldsetEntrega.appendChild(crearEl("legend", { text: "Tipo de entrega" }));
    const opcionesEntrega = crearEl("div", { class: "opciones-entrega" });

    ["retiro", "delivery"].forEach((tipo) => {
      const id = `entrega-${tipo}`;
      const label = crearEl("label", { class: "opcion-radio", for: id });
      const input = crearEl("input", {
        type: "radio",
        id,
        name: "tipo-entrega",
        value: tipo,
        checked: estado.entregaTipo === tipo,
        onChange: () => {
          estado.entregaTipo = tipo;
          renderModalCheckout();
        },
      });
      label.appendChild(input);
      label.appendChild(document.createTextNode(tipo === "retiro" ? " Retiro en el local" : " Delivery"));
      opcionesEntrega.appendChild(label);
    });
    fieldsetEntrega.appendChild(opcionesEntrega);
    form.appendChild(fieldsetEntrega);

    if (estado.entregaTipo === "delivery") {
      form.appendChild(campoTexto("direccion-calle", "Calle y altura", "text", true));
      form.appendChild(campoTexto("direccion-piso", "Piso / depto (opcional)", "text", false));
      form.appendChild(campoTexto("direccion-entrecalles", "Entre calles", "text", true));
      form.appendChild(campoTexto("direccion-referencia", "Referencia (opcional)", "text", false));

      if (!estaEnHorario(CONFIG.horarios.delivery)) {
        form.appendChild(
          crearEl("p", {
            class: "aviso-delivery",
            text: `El delivery funciona de ${CONFIG.horarios.delivery.apertura} a ${CONFIG.horarios.delivery.cierre} hs. Podés dejar el pedido igual y te confirmamos por WhatsApp.`,
          })
        );
      }
    }

    // Método de pago
    const fieldsetPago = crearEl("fieldset", { class: "campo" });
    fieldsetPago.appendChild(crearEl("legend", { text: "Método de pago" }));
    const selectPago = crearEl("select", { id: "metodo-pago", name: "metodo-pago" });
    CONFIG.metodosPago.forEach((metodo) => {
      selectPago.appendChild(crearEl("option", { value: metodo.id, text: metodo.nombre }));
    });
    selectPago.addEventListener("change", () => renderModalCheckout());
    fieldsetPago.appendChild(selectPago);
    form.appendChild(fieldsetPago);

    if ((estado.metodoPagoSeleccionado || selectPago.value) === "efectivo") {
      form.appendChild(campoTexto("monto-abona", "¿Con cuánto abonás? (opcional)", "number", false));
    }
    selectPago.value = estado.metodoPagoSeleccionado || "efectivo";
    estado.metodoPagoSeleccionado = selectPago.value;

    // Notas generales
    const campoNotas = crearEl("div", { class: "campo" });
    campoNotas.appendChild(crearEl("label", { for: "notas-generales", text: "Notas (opcional)" }));
    const textareaNotas = crearEl("textarea", {
      id: "notas-generales",
      rows: "2",
      onInput: (e) => {
        estado.checkoutValores["notas-generales"] = e.target.value;
      },
    });
    textareaNotas.value = estado.checkoutValores["notas-generales"] || "";
    campoNotas.appendChild(textareaNotas);
    form.appendChild(campoNotas);

    // Resumen
    const resumen = crearEl("div", { class: "checkout-resumen" });
    resumen.appendChild(crearEl("p", { text: `Total: ${formatearPrecio(Cart.calcularTotal())}` }));
    form.appendChild(resumen);

    body.appendChild(form);
    dialogo.appendChild(body);

    const footer = crearEl("div", { class: "modal-footer" });
    footer.appendChild(
      crearEl("button", {
        class: "btn btn-whatsapp btn-full",
        type: "button",
        text: "Enviar pedido por WhatsApp",
        onClick: procesarEnvioPedido,
      })
    );
    dialogo.appendChild(footer);

    root.appendChild(crearEl("div", { class: "modal-overlay", onClick: cerrarModal }));
    root.appendChild(dialogo);
    root.hidden = false;

    const primerFocable = dialogo.querySelector("input, select, textarea, button");
    if (primerFocable) primerFocable.focus();
  }

  function campoTexto(id, etiqueta, tipo, requerido) {
    const cont = crearEl("div", { class: "campo" });
    cont.appendChild(crearEl("label", { for: id, text: etiqueta + (requerido ? " *" : "") }));
    const input = crearEl("input", {
      type: tipo,
      id,
      name: id,
      onInput: (e) => {
        estado.checkoutValores[id] = e.target.value;
      },
    });
    input.value = estado.checkoutValores[id] || "";
    cont.appendChild(input);
    cont.appendChild(crearEl("p", { class: "campo-error", id: `error-${id}` }));
    return cont;
  }

  function mostrarError(idCampo, mensaje) {
    const el = $(`#error-${idCampo}`);
    if (el) el.textContent = mensaje || "";
  }

  function valorCampo(id) {
    const el = $(`#${id}`);
    return el ? el.value.trim() : "";
  }

  function procesarEnvioPedido() {
    let valido = true;

    ["direccion-calle", "direccion-piso", "direccion-entrecalles", "direccion-referencia", "nombre-cliente"].forEach((id) =>
      mostrarError(id, "")
    );

    const nombre = valorCampo("nombre-cliente");
    if (!nombre) {
      mostrarError("nombre-cliente", "Ingresá tu nombre y apellido.");
      valido = false;
    }

    let direccion = { calle: "", piso: "", entreCalles: "", referencia: "" };
    if (estado.entregaTipo === "delivery") {
      direccion.calle = valorCampo("direccion-calle");
      direccion.piso = valorCampo("direccion-piso");
      direccion.entreCalles = valorCampo("direccion-entrecalles");
      direccion.referencia = valorCampo("direccion-referencia");

      if (!direccion.calle) {
        mostrarError("direccion-calle", "Ingresá la calle y altura.");
        valido = false;
      }
      if (!direccion.entreCalles) {
        mostrarError("direccion-entrecalles", "Ingresá entre qué calles está.");
        valido = false;
      }
    }

    if (Cart.estaVacio()) {
      valido = false;
    }

    if (!valido) return;

    const metodoPago = $("#metodo-pago").value;
    const montoAbona = metodoPago === "efectivo" ? valorCampo("monto-abona") : "";
    const notas = valorCampo("notas-generales");

    const pedido = {
      sucursal: CONFIG.negocio.sucursal,
      nombreCliente: nombre,
      entrega: {
        tipo: estado.entregaTipo,
        direccion,
      },
      items: Cart.obtenerItems(),
      total: Cart.calcularTotal(),
      pago: { metodo: metodoPago, montoAbona },
      notas,
      origenTexto: (CONFIG.site.indexable ? CONFIG.site.url : CONFIG.site.urlDemo).replace(/^https?:\/\/(www\.)?/, ""),
    };

    const mensaje = Whatsapp.construirMensaje(pedido);
    Whatsapp.abrirChat(mensaje, CONFIG.negocio.whatsapp.urlBase);

    Cart.vaciar();
    cerrarModal();
    renderCarritoFlotante();
  }

  // --------------------------------------------------------------------------
  // Sección de sabores navegable, filtrable por categoría
  // --------------------------------------------------------------------------
  function renderSeccionSabores() {
    const filtros = $("#sabores-filtros");
    filtros.innerHTML = "";

    const categorias = [{ id: "todos", nombre: "Todos" }, ...CONFIG.categoriasSabores];
    categorias.forEach((cat) => {
      const activo = estado.filtroSabores === cat.id;
      filtros.appendChild(
        crearEl("button", {
          type: "button",
          class: `filtro-sabor-btn${activo ? " filtro-sabor-btn--activo" : ""}`,
          "aria-pressed": activo ? "true" : "false",
          text: cat.nombre,
          onClick: () => {
            estado.filtroSabores = cat.id;
            renderSeccionSabores();
          },
        })
      );
    });

    // Lista agrupada por categoría (mismo agrupamiento que la versión estática del
    // HTML, para que no haya diferencia de contenido entre "sin JS" y "con JS").
    const cont = $("#sabores-lista");
    cont.innerHTML = "";

    const categoriasAMostrar = CONFIG.categoriasSabores.filter(
      (cat) => estado.filtroSabores === "todos" || cat.id === estado.filtroSabores
    );

    categoriasAMostrar.forEach((cat) => {
      const saboresCategoria = CONFIG.sabores.filter((s) => s.categoria === cat.id);
      if (saboresCategoria.length === 0) return;

      const grupo = crearEl("div", { class: "sabores-categoria-grupo", "data-categoria": cat.id });
      grupo.appendChild(crearEl("h3", { class: "sabores-categoria-titulo", text: cat.nombre }));

      const lista = crearEl("ul", { class: "sabores-lista-grupo" });
      saboresCategoria.forEach((sabor) => lista.appendChild(renderItemSabor(sabor)));
      grupo.appendChild(lista);

      cont.appendChild(grupo);
    });
  }

  function renderItemSabor(sabor) {
    const item = crearEl("li", {
      class: `sabor-chip${sabor.disponible ? "" : " sabor-chip--agotado"}${sabor.destacado ? " sabor-chip--especial" : ""}`,
    });
    item.appendChild(crearEl("span", { text: sabor.nombre }));
    if (sabor.destacado) item.appendChild(crearEl("span", { class: "badge-especial", text: "Especial" }));
    if (!sabor.disponible) item.appendChild(crearEl("span", { class: "badge-agotado", text: "Agotado" }));
    return item;
  }

  // --------------------------------------------------------------------------
  // Contenido SEO, mapa y footer
  // --------------------------------------------------------------------------
  function renderParrafos(contenedor, parrafos) {
    if (!contenedor) return;
    contenedor.innerHTML = "";
    parrafos.forEach((texto) => contenedor.appendChild(crearEl("p", { text: texto })));
  }

  function renderContenidoSEO() {
    const { contenidoSEO, zonasDelivery, negocio, horarios } = CONFIG;

    $("#seo-como-pedir-titulo").textContent = contenidoSEO.comoPedir.titulo;
    renderParrafos($("#seo-como-pedir-texto"), contenidoSEO.comoPedir.parrafos);

    $("#seo-zonas-titulo").textContent = contenidoSEO.zonasDelivery.titulo;
    renderParrafos($("#seo-zonas-texto"), contenidoSEO.zonasDelivery.parrafos);
    const listaZonas = $("#seo-zonas-lista");
    listaZonas.innerHTML = "";
    zonasDelivery.forEach((zona) => listaZonas.appendChild(crearEl("li", { text: zona })));

    $("#seo-cafeteria-titulo").textContent = contenidoSEO.nuestraCafeteria.titulo;
    renderParrafos($("#seo-cafeteria-texto"), contenidoSEO.nuestraCafeteria.parrafos);

    $("#seo-donde-titulo").textContent = contenidoSEO.dondeEstamos.titulo;
    renderParrafos($("#seo-donde-texto"), contenidoSEO.dondeEstamos.parrafos);
    $("#mapa-embed").src = negocio.googleMaps.embedSrc;
    $("#mapa-embed").title = `Ubicación de ${negocio.nombreCompleto} en ${negocio.direccion.textoCorto}`;
    $("#link-maps").href = negocio.googleMaps.urlCorta;

    // Footer
    $("#footer-nombre").textContent = negocio.nombreCompleto;
    $("#footer-direccion").textContent = negocio.direccion.textoCompleto;
    $("#footer-horario-local").textContent = `Local: ${horarios.local.textoLegible}`;
    $("#footer-horario-delivery").textContent = `Delivery: ${horarios.delivery.textoLegible}`;
    const linkInsta = $("#footer-instagram");
    linkInsta.href = negocio.instagram.url;
    linkInsta.textContent = negocio.instagram.usuario;
    const linkTel = $("#footer-telefono");
    linkTel.href = `tel:${negocio.telefono.replace(/[^\d+]/g, "")}`;
    linkTel.textContent = negocio.telefono;
  }

  // --------------------------------------------------------------------------
  // Botón flotante de WhatsApp para consultas generales
  // --------------------------------------------------------------------------
  function renderWhatsappFlotante() {
    const boton = $("#whatsapp-flotante");
    const mensaje = `Hola ${CONFIG.negocio.nombre}! Quería hacer una consulta.`;
    boton.href = `${CONFIG.negocio.whatsapp.urlBase}?text=${encodeURIComponent(mensaje)}`;
    boton.setAttribute("aria-label", "Consultar por WhatsApp");
  }

  // --------------------------------------------------------------------------
  // Inicialización
  // --------------------------------------------------------------------------
  function init() {
    // Marca que JS está activo: styles.css usa esta clase para ocultar
    // visualmente (nunca con display:none ni [hidden]) el contenido estático
    // que queda duplicado por el catálogo interactivo, como la tabla de precios.
    document.documentElement.classList.add("js-activo");

    renderBannerHorario();
    renderHero();
    renderCategoriasNav();
    renderCatalogo();
    renderSeccionSabores();
    renderContenidoSEO();
    renderWhatsappFlotante();
    renderCarritoFlotante();

    // Vuelve a calcular el banner de horario cada minuto
    setInterval(renderBannerHorario, 60 * 1000);
  }

  document.addEventListener("DOMContentLoaded", init);
})();
