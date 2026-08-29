# Sei Tu Don Orione — Plataforma de pedidos

Sitio web de pedidos para **Sei Tu Heladería - Cafetería (sucursal Don Orione)**. El cliente arma su
pedido en la web y lo envía directamente por WhatsApp, ya redactado. No usa ningún servidor: es HTML,
CSS y JavaScript puro, así que se puede abrir haciendo doble clic en `index.html`.

Esta guía está pensada para alguien **sin conocimientos técnicos** que necesite actualizar precios,
sabores o datos de contacto.

## Lo más importante: todo se edita en un solo archivo

Todo el contenido del negocio (precios, productos, sabores, horarios, dirección, WhatsApp, Instagram)
vive en un único archivo:

```
js/config.js
```

No hay que tocar ningún otro archivo para cambiar esos datos. Abrilo con el Bloc de notas, con
Notepad++, o con cualquier editor de texto (recomendado: [Visual Studio Code](https://code.visualstudio.com/),
que es gratis).

Después de guardar los cambios en `config.js`, solo hay que volver a abrir (o refrescar) `index.html`
en el navegador para ver los cambios.

---

## Cómo cambiar un precio

1. Abrí `js/config.js`.
2. Buscá la sección `productos:` (usá Ctrl+F y buscá el nombre del producto, por ejemplo
   `"Cucurucho 2 bochas"`).
3. Vas a ver algo así:

   ```js
   {
     id: "cucurucho-2-bochas",
     categoria: "cucuruchos",
     nombre: "Cucurucho 2 bochas",
     descripcion: "Cucurucho con hasta 2 sabores a combinar.",
     precio: 3800,          // <-- este es el número que hay que cambiar
     maxSabores: 2,
     ...
   }
   ```

4. Cambiá el número de `precio` (sin puntos ni el signo `$`, solo el número, por ejemplo `4200`).
5. Guardá el archivo.

Si un producto todavía no tiene precio confirmado, se escribe `precio: null` (así, sin comillas) y en
la web va a aparecer como **"Consultar"** hasta que se cargue el precio real.

---

## Cómo marcar un sabor como no disponible (se terminó el gusto)

1. Abrí `js/config.js` y buscá la sección `sabores:`.
2. Buscá el sabor por nombre, por ejemplo `"Pistacho"`:

   ```js
   { id: "pistacho", nombre: "Pistacho", categoria: "cremas", destacado: false, disponible: true },
   ```

3. Cambiá `disponible: true` por `disponible: false`.
4. Guardá el archivo.

El sabor va a aparecer tachado, en gris, y el cliente **no va a poder elegirlo**. Cuando vuelva a
haber stock, volvé a poner `disponible: true`.

---

## Cómo agregar un producto nuevo

1. Abrí `js/config.js` y buscá la sección `productos:`.
2. Copiá un producto parecido al que querés agregar (por ejemplo, si es un pote nuevo, copiá el
   bloque de otro pote) y pegalo como un nuevo elemento de la lista, con una coma `,` antes.
3. Completá cada campo:

   ```js
   {
     id: "pote-3-kilos",              // identificador único, sin espacios ni tildes
     categoria: "potes",              // "cucuruchos", "potes" o "cafeteria"
     nombre: "Pote 3 kilos",          // nombre que ve el cliente
     descripcion: "Pote de tres kilos con hasta 6 sabores.",
     precio: 42000,                   // o `null` si todavía no está confirmado
     maxSabores: 6,                   // cantidad máxima de sabores que puede elegir
     minSabores: 1,                   // cantidad mínima obligatoria
     disponible: true,                // false = no se puede pedir
     destacado: false,                // true = se resalta en el catálogo
     imagen: "assets/productos/pote-3-kilos.webp",
   },
   ```

4. Guardá el archivo. El producto va a aparecer automáticamente en su categoría.

> Para productos sin sabores (como los de cafetería), usá `maxSabores: 0` y `minSabores: 0`.

**Sobre las fotos:** si el archivo de imagen que pusiste en `imagen` no existe todavía, no pasa nada:
la web no se rompe, simplemente no muestra foto para ese producto hasta que subas la imagen real a la
carpeta `assets/productos/`.

---

## Cómo cambiar el número de WhatsApp

1. Abrí `js/config.js` y buscá `whatsapp:` dentro de `negocio`.
2. Vas a ver:

   ```js
   whatsapp: {
     numero: "5491136085617",                    // número sin "+", sin espacios ni guiones
     urlBase: "https://wa.me/5491136085617",      // el mismo número acá también
   },
   ```

3. Cambiá el número en **ambos** lugares (`numero` y dentro de `urlBase`), siempre en formato
   internacional: `54` (Argentina) + `9` + código de área + número, todo junto y sin espacios.
4. Guardá el archivo.

Este número es al que van a llegar tanto los pedidos como los mensajes del botón flotante de
"Consultar por WhatsApp".

---

## Otras cosas que se pueden cambiar en `config.js`

- **Horarios** (`horarios`): horario del local y del delivery. El sitio calcula solo si está
  "Abierto ahora" o "Cerrado" según estos horarios, usando siempre la hora de Argentina.
- **Dirección e Instagram** (`negocio`): se actualizan automáticamente en el pie de página, el mapa y
  el mensaje de WhatsApp.
- **Zonas de delivery** (`zonasDelivery`): lista de barrios/zonas que se muestran en la web.
- **Métodos de pago** (`metodosPago`): agregar o sacar formas de pago.

---

## Clonar el proyecto para otra sucursal (La Droguería, Burzaco)

1. Copiá toda la carpeta del proyecto.
2. Abrí `js/config.js` y en la parte de arriba del archivo hay un comentario que lista, en orden,
   todo lo que hay que cambiar para adaptar el sitio a la sucursal nueva: dirección, horarios, SEO,
   zonas de delivery, precios, sabores y las fotos de `/assets`.
3. En `index.html`, actualizá el `<link rel="canonical">` y las etiquetas de Open Graph si la
   sucursal nueva va a tener su propio dominio o subcarpeta.
4. Actualizá `sitemap.xml` con la URL final del sitio de esa sucursal.

No hace falta tocar `app.js`, `cart.js`, `whatsapp.js` ni `styles.css`: esos archivos funcionan igual
para cualquier sucursal, toda la diferencia está en `config.js`.

---

## Estructura del proyecto

```
index.html          → la página, arma su contenido a partir de config.js
css/styles.css       → estilos visuales (colores, tipografías, diseño mobile)
js/config.js         → TODOS los datos del negocio (editar acá)
js/cart.js           → maneja el carrito de compras
js/whatsapp.js        → arma el mensaje final y abre WhatsApp
js/app.js            → dibuja la página y maneja los clics/formularios
assets/              → logo, foto de portada y fotos de productos
robots.txt            → indica a Google que puede indexar el sitio
sitemap.xml           → mapa del sitio para buscadores
```

## Cómo probar el sitio

Simplemente hacé doble clic en `index.html`. No hace falta instalar nada ni tener internet, salvo
para que carguen el mapa de Google Maps y, al confirmar un pedido, para que se abra WhatsApp.
