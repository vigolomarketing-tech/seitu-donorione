/**
 * ============================================================================
 * CONFIG.JS — Sei Tu Heladería · Sucursal Don Orione
 * ============================================================================
 *
 * ESTE ARCHIVO ES EL ÚNICO LUGAR DONDE VIVE LA INFORMACIÓN DEL NEGOCIO.
 * Todo el sitio (index.html, app.js, cart.js, whatsapp.js) LEE de acá.
 * No hay precios, textos ni datos de contacto escritos en otro lado.
 *
 * ----------------------------------------------------------------------------
 * ¿QUÉ EDITAR PARA CLONAR ESTE PROYECTO A OTRA SUCURSAL (La Droguería / Burzaco)?
 * ----------------------------------------------------------------------------
 *   1. CONFIG.negocio          → nombre de sucursal, dirección, teléfono, redes, mapa
 *   2. CONFIG.horarios         → horario del local y del delivery de esa sucursal
 *   3. CONFIG.seo              → título, descripción y keywords con la localidad nueva
 *   4. CONFIG.zonasDelivery    → barrios/zonas que cubre esa sucursal
 *   5. CONFIG.productos        → precios y disponibilidad (pueden variar por local)
 *   6. CONFIG.sabores          → gustos disponibles en esa sucursal
 *   7. /assets/                → logo, foto de portada (hero) y foto para redes (og-image)
 *   8. index.html              → cambiar el <link rel="canonical"> y el dominio del sitemap.xml
 *
 * El resto del sitio (HTML, CSS, JS de la app) no necesita tocarse.
 * ============================================================================
 */

const CONFIG = {

  // ==========================================================================
  // 1. DATOS DEL NEGOCIO — nombre, sucursal, contacto, redes, ubicación
  // ==========================================================================
  negocio: {
    nombre: "Sei Tu",
    nombreCompleto: "Sei Tu Heladería - Cafetería",
    sucursal: "Don Orione",
    eslogan: "Heladería y cafetería en Don Orione, Claypole",

    direccion: {
      calle: "Av. Eva Perón",
      numero: "2680",
      barrio: "Don Orione",
      localidad: "Claypole",
      partido: "Almirante Brown",
      provincia: "Buenos Aires",
      pais: "Argentina",
      codigoPostal: "1888",
      // Texto ya armado para mostrar en el sitio y para el mensaje de WhatsApp
      textoCorto: "Av. Eva Perón 2680, Don Orione",
      textoCompleto: "Av. Eva Perón 2680, Don Orione, Claypole, Almirante Brown, Buenos Aires",
    },

    // TODO: ajustar lat/lng exactos con Google Maps (clic derecho > "¿Qué hay aquí?")
    // Coordenadas aproximadas de Don Orione, Claypole, Almirante Brown.
    geo: {
      lat: -34.8817,
      lng: -58.3958,
    },

    telefono: "+54 9 11 3608-5617",
    whatsapp: {
      numero: "5491136085617", // formato internacional sin "+" ni espacios, para wa.me
      urlBase: "https://wa.me/5491136085617",
    },

    instagram: {
      usuario: "@seitu_donorione",
      url: "https://www.instagram.com/seitu_donorione",
    },

    googleMaps: {
      urlCorta: "https://maps.app.goo.gl/zoP78fGRDsccdYRg6",
      // src del iframe embebido (se arma con las coordenadas de arriba)
      embedSrc: "https://www.google.com/maps?q=-34.8817,-58.3958&z=16&output=embed",
    },

    dominio: "https://www.seitudonorione.com.ar",

    // Colores de marca (se usan como variables CSS en styles.css)
    colores: {
      celestePrincipal: "#29ABE2",
      azulOscuro: "#2B2E83",
      blanco: "#FFFFFF",
      marronCafeteria: "#6F4E37",
    },

    // Imágenes — reemplazar por fotos reales del local en /assets (formato WebP)
    imagenes: {
      logo: "assets/logo.svg",
      favicon: "assets/favicon.svg",
      hero: "assets/hero.svg",
      ogImage: "assets/og-image.svg", // ideal 1200x630 real en WebP/JPG para redes
    },
  },

  // ==========================================================================
  // 2. HORARIOS — se usan para calcular en vivo si está "abierto" o "cerrado"
  //    Formato 24hs "HH:MM". "dias": 0=domingo … 6=sábado. Todos los días = [0,1,2,3,4,5,6]
  // ==========================================================================
  horarios: {
    local: {
      dias: [0, 1, 2, 3, 4, 5, 6],
      apertura: "11:00",
      cierre: "22:00",
      textoLegible: "Lunes a domingo de 11:00 a 22:00 hs",
    },
    delivery: {
      dias: [0, 1, 2, 3, 4, 5, 6],
      apertura: "19:00",
      cierre: "00:00", // "todos los días de 19 a 00hs" (medianoche)
      textoLegible: "Todos los días de 19:00 a 00:00 hs",
    },
    // Zona horaria usada para calcular abierto/cerrado, NO la del navegador del cliente
    zonaHoraria: "America/Argentina/Buenos_Aires",
  },

  // ==========================================================================
  // 3. SEO — título, descripción y keywords principales
  // ==========================================================================
  seo: {
    title: "Heladería en Don Orione | Sei Tu — Delivery de helado en Claypole",
    description:
      "Sei Tu Don Orione: heladería y cafetería en Av. Eva Perón 2680, Don Orione, Claypole. Pedí tu helado con delivery de 19 a 00hs o retiralo en el local. Abierto todos los días de 11 a 22hs.",
    keywords: [
      "heladería Don Orione",
      "helado Don Orione",
      "heladería Claypole",
      "delivery de helado Don Orione",
      "Sei Tu Don Orione",
      "heladería Almirante Brown",
    ],
  },

  // ==========================================================================
  // 4. ZONAS DE DELIVERY — barrios/localidades que cubre esta sucursal
  //    (Contenido indexable, se muestra en la sección "Zonas de delivery")
  // ==========================================================================
  zonasDelivery: [
    "Don Orione",
    "Claypole",
    "Burzaco (zona límite)",
    "Longchamps (zona límite)",
    "Almirante Brown (radio cercano al local)",
  ],

  // ==========================================================================
  // 5. CATEGORÍAS DE PRODUCTOS — el orden acá define el orden en la página
  // ==========================================================================
  categoriasProductos: [
    { id: "cucuruchos", nombre: "Cucuruchos", icono: "🍦" },
    { id: "potes", nombre: "Potes", icono: "🍨" },
    { id: "cafeteria", nombre: "Cafetería", icono: "☕" },
  ],

  // ==========================================================================
  // 6. PRODUCTOS
  //    - precio: número en pesos. Si todavía no está confirmado, usar `null`
  //      (se muestra como "Consultar" hasta que se cargue el precio real).
  //    - maxSabores: cantidad máxima de sabores que se pueden elegir (0 = no aplica,
  //      por ejemplo un café no tiene "sabores de helado").
  //    - minSabores: cantidad mínima obligatoria (normalmente 1 si maxSabores > 0).
  //    - disponible: false = el producto no se puede pedir (se muestra atenuado).
  // ==========================================================================
  productos: [
    // ---- CUCURUCHOS ----
    {
      id: "cucurucho-1-bocha",
      categoria: "cucuruchos",
      nombre: "Cucurucho 1 bocha",
      descripcion: "Un cucurucho crocante con el sabor que elijas.",
      precio: 3000,
      maxSabores: 1,
      minSabores: 1,
      disponible: true,
      destacado: false,
      imagen: "assets/productos/cucurucho-1-bocha.webp",
    },
    {
      id: "cucurucho-2-bochas",
      categoria: "cucuruchos",
      nombre: "Cucurucho 2 bochas",
      descripcion: "Cucurucho con hasta 2 sabores a combinar.",
      precio: 3800,
      maxSabores: 2,
      minSabores: 1,
      disponible: true,
      destacado: true,
      imagen: "assets/productos/cucurucho-2-bochas.webp",
    },
    {
      id: "cucurucho-3-bochas",
      categoria: "cucuruchos",
      nombre: "Cucurucho 3 bochas",
      descripcion: "Cucurucho con hasta 3 sabores a combinar.",
      precio: 5000,
      maxSabores: 3,
      minSabores: 1,
      disponible: true,
      destacado: false,
      imagen: "assets/productos/cucurucho-3-bochas.webp",
    },

    // ---- POTES ----
    {
      id: "pote-1-4-kilo",
      categoria: "potes",
      nombre: "Pote ¼ kilo",
      descripcion: "Pote de cuarto kilo con hasta 2 sabores.",
      precio: 6000,
      maxSabores: 2,
      minSabores: 1,
      disponible: true,
      destacado: false,
      imagen: "assets/productos/pote-cuarto-kilo.webp",
    },
    {
      id: "pote-1-2-kilo",
      categoria: "potes",
      nombre: "Pote ½ kilo",
      descripcion: "Pote de medio kilo con hasta 3 sabores.",
      precio: 10000,
      maxSabores: 3,
      minSabores: 1,
      disponible: true,
      destacado: true,
      imagen: "assets/productos/pote-medio-kilo.webp",
    },
    {
      id: "pote-1-kilo",
      categoria: "potes",
      nombre: "Pote 1 kilo",
      descripcion: "Pote de un kilo con hasta 4 sabores.",
      precio: 16000,
      maxSabores: 4,
      minSabores: 1,
      disponible: true,
      destacado: false,
      imagen: "assets/productos/pote-un-kilo.webp",
    },
    {
      id: "pote-2-kilos",
      categoria: "potes",
      nombre: "Pote 2 kilos",
      descripcion: "Pote de dos kilos con hasta 5 sabores. Ideal para compartir.",
      precio: 30000,
      maxSabores: 5,
      minSabores: 1,
      disponible: true,
      destacado: false,
      imagen: "assets/productos/pote-dos-kilos.webp",
    },

    // ---- CAFETERÍA ----
    // Los que dicen "// TODO: confirmar precio con el local" van con precio: null
    // y se muestran como "Consultar" hasta que se cargue el precio real.
    {
      id: "promo-cafe-tostados",
      categoria: "cafeteria",
      nombre: "Promo Café + Tostados",
      descripcion: "Un café y una porción de tostados.",
      precio: 8000,
      maxSabores: 0,
      minSabores: 0,
      disponible: true,
      destacado: true,
      imagen: "assets/productos/promo-cafe-tostados.webp",
    },
    {
      id: "promo-cafe-medialunas",
      categoria: "cafeteria",
      nombre: "Promo Café + Medialunas",
      descripcion: "Un café y dos medialunas.",
      precio: 6000,
      maxSabores: 0,
      minSabores: 0,
      disponible: true,
      destacado: true,
      imagen: "assets/productos/promo-cafe-medialunas.webp",
    },
    {
      id: "cafe",
      categoria: "cafeteria",
      nombre: "Café / Café con leche",
      descripcion: "Café solo, cortado o con leche.",
      precio: null, // TODO: confirmar precio con el local
      maxSabores: 0,
      minSabores: 0,
      disponible: true,
      destacado: false,
      imagen: "assets/productos/cafe.webp",
    },
    {
      id: "capuccino",
      categoria: "cafeteria",
      nombre: "Capuccino",
      descripcion: "Capuccino clásico con espuma de leche.",
      precio: null, // TODO: confirmar precio con el local
      maxSabores: 0,
      minSabores: 0,
      disponible: true,
      destacado: false,
      imagen: "assets/productos/capuccino.webp",
    },
    {
      id: "tostado-jamon-queso",
      categoria: "cafeteria",
      nombre: "Tostado de jamón y queso",
      descripcion: "Tostado clásico de jamón y queso.",
      precio: null, // TODO: confirmar precio con el local
      maxSabores: 0,
      minSabores: 0,
      disponible: true,
      destacado: false,
      imagen: "assets/productos/tostado-jamon-queso.webp",
    },
    {
      id: "jugo-naranja",
      categoria: "cafeteria",
      nombre: "Jugo de naranja exprimido",
      descripcion: "Jugo de naranja exprimido en el momento.",
      precio: null, // TODO: confirmar precio con el local
      maxSabores: 0,
      minSabores: 0,
      disponible: true,
      destacado: false,
      imagen: "assets/productos/jugo-naranja.webp",
    },
    {
      id: "brownie",
      categoria: "cafeteria",
      nombre: "Brownie",
      descripcion: "Brownie de chocolate.",
      precio: null, // TODO: confirmar precio con el local
      maxSabores: 0,
      minSabores: 0,
      disponible: true,
      destacado: false,
      imagen: "assets/productos/brownie.webp",
    },
    {
      id: "medialunas",
      categoria: "cafeteria",
      nombre: "Medialunas",
      descripcion: "Medialunas de manteca, la unidad.",
      precio: null, // TODO: confirmar precio con el local
      maxSabores: 0,
      minSabores: 0,
      disponible: true,
      destacado: false,
      imagen: "assets/productos/medialunas.webp",
    },
  ],

  // ==========================================================================
  // 7. CATEGORÍAS DE SABORES — define el orden de las columnas/secciones
  // ==========================================================================
  categoriasSabores: [
    { id: "cremas", nombre: "Cremas" },
    { id: "chocolates", nombre: "Chocolates" },
    { id: "dulce-de-leche", nombre: "Dulce de leche" },
    { id: "al-agua", nombre: "Al agua" },
  ],

  // ==========================================================================
  // 8. SABORES DE HELADO
  //    - destacado: true → se muestra con badge "Especial" (ej. Chocolate Dubai)
  //    - disponible: false → aparece en gris, tachado, y no se puede seleccionar.
  //      Usar esto cuando se termina un gusto en el local.
  // ==========================================================================
  sabores: [
    // ---- CREMAS ----
    { id: "pistacho", nombre: "Pistacho", categoria: "cremas", destacado: false, disponible: true },
    { id: "americana", nombre: "Americana", categoria: "cremas", destacado: false, disponible: true },
    { id: "vainilla", nombre: "Vainilla", categoria: "cremas", destacado: false, disponible: true },
    { id: "crema-del-cielo", nombre: "Crema del cielo", categoria: "cremas", destacado: false, disponible: true },
    { id: "granizado", nombre: "Granizado", categoria: "cremas", destacado: false, disponible: true },
    { id: "menta-granizada", nombre: "Menta granizada", categoria: "cremas", destacado: false, disponible: true },
    { id: "crema-flan", nombre: "Crema flan", categoria: "cremas", destacado: false, disponible: true },
    { id: "sambayon", nombre: "Sambayón", categoria: "cremas", destacado: false, disponible: true },
    { id: "tramontana", nombre: "Tramontana", categoria: "cremas", destacado: false, disponible: true },
    { id: "tiramisu", nombre: "Tiramisú", categoria: "cremas", destacado: false, disponible: true },
    { id: "mantecol", nombre: "Mantecol", categoria: "cremas", destacado: false, disponible: true },
    { id: "mascarpone", nombre: "Mascarpone", categoria: "cremas", destacado: false, disponible: true },
    { id: "crema-oreo", nombre: "Crema Oreo", categoria: "cremas", destacado: false, disponible: true },
    { id: "multisabor", nombre: "Multisabor", categoria: "cremas", destacado: false, disponible: true },
    { id: "frutilla-a-la-crema", nombre: "Frutilla a la crema", categoria: "cremas", destacado: false, disponible: true },
    { id: "banana", nombre: "Banana", categoria: "cremas", destacado: false, disponible: true },
    { id: "banana-split", nombre: "Banana Split", categoria: "cremas", destacado: false, disponible: true },
    { id: "bananita-dolca", nombre: "Bananita Dolca", categoria: "cremas", destacado: false, disponible: true },
    { id: "cereza-a-la-crema", nombre: "Cereza a la crema", categoria: "cremas", destacado: false, disponible: true },
    { id: "frutos-patagonicos", nombre: "Frutos patagónicos", categoria: "cremas", destacado: false, disponible: true },

    // ---- CHOCOLATES ----
    { id: "chocolate", nombre: "Chocolate", categoria: "chocolates", destacado: false, disponible: true },
    { id: "chocolate-blanco", nombre: "Chocolate blanco", categoria: "chocolates", destacado: false, disponible: true },
    { id: "chocolate-con-almendras", nombre: "Chocolate con almendras", categoria: "chocolates", destacado: false, disponible: true },
    { id: "chocolate-marroc", nombre: "Chocolate marroc", categoria: "chocolates", destacado: false, disponible: true },
    { id: "super-choco-sei-tu", nombre: "Super choco Sei Tu", categoria: "chocolates", destacado: false, disponible: true },

    // ---- DULCE DE LECHE ----
    { id: "dulce-de-leche", nombre: "Dulce de leche", categoria: "dulce-de-leche", destacado: false, disponible: true },
    { id: "dulce-de-leche-granizado", nombre: "Dulce de leche granizado", categoria: "dulce-de-leche", destacado: false, disponible: true },
    { id: "dulce-de-leche-sei-tu", nombre: "Dulce de leche Sei Tu", categoria: "dulce-de-leche", destacado: false, disponible: true },
    { id: "dulce-de-leche-con-nuez", nombre: "Dulce de leche con nuez", categoria: "dulce-de-leche", destacado: false, disponible: true },
    { id: "super-dulce-de-leche", nombre: "Super dulce de leche", categoria: "dulce-de-leche", destacado: false, disponible: true },

    // ---- AL AGUA ----
    { id: "limon", nombre: "Limón", categoria: "al-agua", destacado: false, disponible: true },
    { id: "anana", nombre: "Ananá", categoria: "al-agua", destacado: false, disponible: true },
    { id: "frutilla-agua", nombre: "Frutilla", categoria: "al-agua", destacado: false, disponible: true },
    { id: "durazno", nombre: "Durazno", categoria: "al-agua", destacado: false, disponible: true },
    { id: "limon-a-la-reina", nombre: "Limón a la reina", categoria: "al-agua", destacado: false, disponible: true },

    // ---- ESPECIALES (destacado: true → aparecen con badge) ----
    { id: "chocolate-dubai", nombre: "Chocolate Dubai", categoria: "chocolates", destacado: true, disponible: true },
    { id: "chocolate-shot", nombre: "Chocolate Shot", categoria: "chocolates", destacado: true, disponible: true },
    { id: "chocolate-mousse-milka", nombre: "Chocolate Mousse Milka", categoria: "chocolates", destacado: true, disponible: true },
    { id: "dulce-de-leche-oreo", nombre: "Dulce de leche Oreo", categoria: "dulce-de-leche", destacado: true, disponible: true },
    { id: "frutilla-cadbury", nombre: "Frutilla Cadbury", categoria: "al-agua", destacado: true, disponible: true },
  ],

  // ==========================================================================
  // 9. MÉTODOS DE PAGO
  // ==========================================================================
  metodosPago: [
    { id: "efectivo", nombre: "Efectivo" },
    { id: "transferencia", nombre: "Transferencia" },
    { id: "mercadopago", nombre: "Mercado Pago" },
  ],

  // ==========================================================================
  // 10. CONTENIDO SEO — textos indexables que se muestran debajo del catálogo
  // ==========================================================================
  contenidoSEO: {
    comoPedir: {
      titulo: "Cómo pedir helado en Don Orione",
      texto:
        "Pedir helado en Sei Tu Don Orione es simple: elegí tus productos del catálogo, armá tus sabores favoritos, completá tus datos y confirmá el pedido por WhatsApp. Podés retirarlo en el local, en Av. Eva Perón 2680, Don Orione, o pedirlo por delivery todos los días de 19 a 00hs.",
    },
    zonasDelivery: {
      titulo: "Zonas de delivery",
      texto:
        "Hacemos delivery de helado en Don Orione, Claypole y alrededores de Almirante Brown. Si no estás seguro de si llegamos a tu zona, escribinos por WhatsApp y te confirmamos al toque.",
    },
    nuestrosSabores: {
      titulo: "Nuestros sabores",
      texto:
        "Tenemos más de 30 sabores de helado artesanal: cremas clásicas, chocolates, dulce de leche y helados al agua, además de sabores especiales como Chocolate Dubai y Dulce de leche Oreo.",
    },
    dondeEstamos: {
      titulo: "Dónde estamos",
      texto:
        "Encontranos en Av. Eva Perón 2680, Don Orione, Claypole, partido de Almirante Brown, Provincia de Buenos Aires. Abierto todos los días de 11 a 22hs.",
    },
  },
};

// El objeto queda disponible globalmente para el resto de los scripts (app.js, cart.js, whatsapp.js)
// No se usa `export` para poder abrir el sitio con doble clic, sin servidor ni build step.
