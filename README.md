<div align="center">
  <img src=".github/banner.svg" alt="NEZU Kiosk · autoservicio para puntos de venta" width="100%">
</div>

# NEZU Kiosk

> **In English.** A self-service kiosk for vertical touch totems (1080×1920), built as a template. The shopper browses categories → lines → services, builds a selection and hands it over to their phone through a QR code. Two modes: `quote` (no prices; the phone offers WhatsApp or a contact form) and `payment` (prices, cart, bank QR or card terminal, thermal receipt). Layered architecture (domain · infrastructure · state · UI · features), one config file for the brand, one for the catalog, tokens-based design system, 33 tests. The demo runs NEZU's real catalog from nezuecuador.com. React, Vite, TypeScript, Zustand, Socket.IO.

Plantilla de **autoservicio para tótems táctiles verticales**. El cliente recorre categorías, líneas y servicios, arma su selección en la pantalla y termina en su propio teléfono: el kiosko muestra un código QR que abre su selección en el móvil, donde deja sus datos, escribe por WhatsApp o paga.

Dos modos, una sola línea de configuración:

| Modo | Para quién | Qué pasa al final |
|---|---|---|
| `quote` | Negocios que cotizan cada proyecto (es el modo de la demo: NEZU no publica precios) | El teléfono muestra la selección y ofrece **WhatsApp con el mensaje escrito** o un formulario; el kiosko confirma «Recibimos tu solicitud». |
| `payment` | Negocios con precios fijos | Carrito con cantidades y total, razón social y RUC en el teléfono, **QR bancario o tarjeta en el datáfono**, comprobante térmico opcional. |

[**Probar la demo**](https://nezusas.github.io/nezu-kiosk/) · ábrela en una ventana alta y estrecha, o en el modo de dispositivo del navegador a 1080×1920, para verla como en el tótem. El catálogo es el real de NEZU: Living, Elevate y Core.

## Capturas

| Portada | Categorías | Líneas de Living | Servicios |
|---|---|---|---|
| ![Portada](.github/screenshots/inicio.jpg) | ![Categorías](.github/screenshots/categorias.jpg) | ![Líneas de Living](.github/screenshots/living.jpg) | ![Servicios de una línea, dos elegidos](.github/screenshots/linea.jpg) |

| Mi solicitud | Traspaso al teléfono | Teléfono del cliente | Confirmación |
|---|---|---|---|
| ![Mi solicitud](.github/screenshots/solicitud.jpg) | ![Código QR](.github/screenshots/qr.jpg) | ![Página del teléfono](.github/screenshots/telefono.jpg) | ![Confirmación](.github/screenshots/gracias.jpg) |

## Hazlo tuyo en 10 minutos

1. **Modo, marca y contacto** · [`src/config/kiosk.config.ts`](src/config/kiosk.config.ts): `mode`, nombre, titular de portada, logotipos, WhatsApp, correo, dirección, horario, moneda, colores, tiempo de reposo y la línea de crédito. Los seis colores de marca se vuelven variables CSS al arrancar; todo lo demás se deriva de ellos.
2. **Textos** · los de [`src/config/texts.es.ts`](src/config/texts.es.ts) cambian solos con el modo; sobrescribe cualquiera desde `texts` en la configuración.
3. **Catálogo** · [`src/content/catalog.ts`](src/content/catalog.ts): categorías → líneas → servicios. Añade `price` a los servicios para el modo `payment`. Los tipos viven en [`src/domain/catalog/types.ts`](src/domain/catalog/types.ts) y `npm test` comprueba que no haya identificadores repetidos ni imágenes que falten.
4. **Imágenes** · pon las tuyas en `public/images/` y referencia la ruta desde el catálogo. Las de ejemplo (`public/images/demo/`, ver [`SOURCES.md`](public/images/demo/SOURCES.md)) son ilustraciones generadas para la demo: bórralas cuando tengas las propias. Formato recomendado: WebP 16:9 de 1400 px.
5. **Integraciones** · copia [`.env.example`](.env.example) a `.env.production`: la URL pública de la página del teléfono y, si aplica, el servidor en tiempo real y la impresora.
6. **Publica** · `npm run build` y sirve `dist/` donde prefieras; para GitHub Pages, `npm run build -- --base=/<repo>/`.

La línea «Kiosko creado con NEZU Kiosk» del pie se configura en `credit`; agradecemos que se quede, pero la decisión es tuya.

## Cómo está hecho

```text
src/
  domain/          reglas puras, sin React ni navegador
    catalog/       tipos, índice de consulta, validación, formato de precios
    selection/     la selección del cliente: añadir, quitar, cantidades, total
    request/       traspaso al teléfono: resumen en la URL, mensaje de WhatsApp, puertos
  infrastructure/  adaptadores de los puertos: Socket.IO (teléfono ↔ kiosko), impresora HTTP, render del comprobante
  state/           stores de Zustand construidos sobre el dominio (selección persistida, sesión de traspaso)
  config/          kiosk.config.ts (marca y modo), texts.es.ts (textos por modo), env.ts (variables con defecto)
  content/         el catálogo
  ui/              sistema de diseño: tokens.css, base.css, primitivas (Button, Modal, Stepper), iconos, Screen y Footer
  features/        pantallas por caso de uso: home, catalog, selection, handoff, phone
  app/             composición: KioskProvider (inyecta config, catálogo y adaptadores), router, tema, reposo
server/
  src/             servidor Socket.IO en módulos: config, registro de sesiones, protocolo, Express y arranque
  test/            pruebas con node:test, incluida una de extremo a extremo kiosko ↔ teléfono
```

- **El dominio no sabe de React.** `addService`, `totalOf`, `whatsAppMessage` o `validateCatalog` son funciones puras con pruebas propias.
- **Los adaptadores se inyectan.** Las pantallas piden `useKiosk()` y reciben catálogo, textos, `formatPrice`, el canal con el teléfono y la impresora; las pruebas montan las mismas pantallas con un canal falso.
- **El modo manda.** `quote` o `payment` decide textos, si el botón alterna o suma unidades, qué pide el formulario del teléfono y a qué pantalla vuelve el kiosko.
- **Diseño por tokens.** Rubik para todo, la fuente de marca Disket Mono solo para cifras, naranja NEZU como primario y lima únicamente para «elegido». Objetivos táctiles de 76 px, tipografía que escala con el ancho (20 px en 1080) y una sola animación por pantalla.

## Flujo completo

1. Portada → **categorías** (bandas a sangre) → **líneas** de una categoría → **servicios** de una línea, con «Añadir a mi solicitud».
2. **Mi solicitud** muestra lo elegido (y el total en modo pago). «Solicitar evaluación» abre el **QR**.
3. El QR lleva al teléfono a `/phone?session=…&s=…`: la selección viaja dentro del enlace, así la página funciona aunque el servidor en tiempo real no esté.
4. En el teléfono, el cliente escribe por **WhatsApp** (mensaje precargado con lo elegido) o envía sus datos; el servidor Socket.IO (`server/`) los reenvía al kiosko de esa sesión.
5. El kiosko salta a **Recibimos tu solicitud** (o a **pago por QR / tarjeta** en modo pago) y, tras dos minutos sin tocar la pantalla, vuelve limpio a la portada.

## Ejecutar en desarrollo

```bash
npm install
npm run dev
```

Servidor en tiempo real, en otra terminal (une el teléfono con el kiosko; Vite lo proxea en desarrollo; detalles en [`server/README.md`](server/README.md)):

```bash
cd server
npm install
npm run dev
```

Sin el servidor, todo el recorrido del tótem funciona igual; solo falta el salto automático a la pantalla final cuando el teléfono envía. En modo pago, la impresión espera un servicio en `VITE_PRINTER_URL` que reciba `POST { image }`; si no está, la pantalla lo indica y el pedido continúa.

## Calidad

```bash
npm run lint    # ESLint, sin errores
npm test        # Vitest: dominio, configuración, catálogo publicado y pantallas
npm run build   # tsc -b && vite build
npm test --prefix server   # node:test: registro de sesiones y protocolo en tiempo real
```

La demo pública se construye con `npm run build -- --base=/nezu-kiosk/` y se publica en GitHub Pages desde la rama `gh-pages`.

## Tecnología

React 18 · Vite 6 · TypeScript · Zustand · react-router-dom 7 · Socket.IO · qrcode.react · html2canvas · Vitest · Testing Library · Express

## ¿Lo necesitas en tu negocio?

Este kiosko es gratuito: lo publicamos porque lo usamos en nuestros propios proyectos. Si quieres un punto de venta o de captación con traspaso al teléfono, pago por QR e impresión térmica, instalado y adaptado a tu caso, [cuéntanos qué necesitas](https://nezuecuador.com/es/contacto) y te respondemos con una propuesta concreta. Aquí está [lo que hacemos](https://nezuecuador.com/es/servicios).

## Licencia

Licencia NEZU de uso para clientes e integradores: puedes leer, instalar y operar el código y proponer mejoras; no puedes redistribuirlo, venderlo ni usarlo para construir un producto o servicio competidor. Texto completo en [LICENSE.md](LICENSE.md). Las imágenes de ejemplo son ilustraciones generadas por NEZU para la demo y se publican bajo la misma licencia ([`public/images/demo/SOURCES.md`](public/images/demo/SOURCES.md)).

---

<div align="center">
  <sub>Parte del ecosistema <a href="https://github.com/NezuSas">NEZU</a> · <a href="https://nezuecuador.com">nezuecuador.com</a> · © NEZU S.A.S. Publicado para clientes e integradores de NEZU.</sub>
</div>
