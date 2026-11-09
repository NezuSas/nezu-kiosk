# Guía de operación del tótem

Cómo instalar NEZU Kiosk en un punto de venta y mantenerlo funcionando sin tocarlo. Está pensada para quien
instala y para quien atiende el local; no hace falta saber programar.

## 1. Qué necesitas

| Pieza | Para qué | Recomendación |
|---|---|---|
| Tótem o pantalla táctil vertical | Lo que ve el cliente | 1080×1920, táctil capacitiva, con un mini PC o un Android TV box |
| Un equipo que corra el servidor | Recibe las solicitudes, sirve el kiosko y la administración | Cualquier PC pequeño con Docker; puede ser el mismo mini PC del tótem |
| Una URL pública | El QR lleva al teléfono del cliente a `PUBLIC_URL/phone`, y el teléfono está en red móvil | Túnel de Cloudflare o un dominio con HTTPS apuntando al puerto 4000 |
| Correo o webhook | Para que las solicitudes lleguen a alguien | Una cuenta SMTP del negocio, o la URL de una automatización/CRM |

## 2. Instalar el servidor (una vez)

```bash
git clone https://github.com/NezuSas/nezu-kiosk.git
cd nezu-kiosk
cp .env.docker.example .env
```

Edita `.env`: `PUBLIC_URL` con tu URL pública, `ADMIN_TOKEN` con una clave larga, `CORS_ORIGIN` con la misma URL
pública y, si quieres recibir las solicitudes por correo, `SMTP_URL` y `LEADS_EMAIL_TO`. Después:

```bash
docker compose up -d --build
```

Comprueba que responde: abre `http://<equipo>:4000/health` y debería decir `{"ok":true,…}`. El kiosko queda en
`http://<equipo>:4000`, la página del teléfono en `/phone` y la administración en `/admin`.

Las solicitudes, los eventos de uso y las confirmaciones de pago se guardan en la carpeta `data/` junto al
`docker-compose.yml`, un archivo por día. Haz copia de esa carpeta como de cualquier otro dato del negocio.

### Publicar la URL

Con Cloudflare: crea un túnel que apunte a `http://localhost:4000` y asígnale el subdominio que pusiste en
`PUBLIC_URL`. Sin Cloudflare: cualquier proxy inverso con HTTPS delante del puerto 4000 sirve. La URL pública debe
abrir el kiosko en un navegador desde datos móviles antes de seguir.

## 3. Preparar la pantalla del tótem

El tótem solo necesita un navegador a pantalla completa abriendo la URL del kiosko. El kiosko pide pantalla
completa al primer toque y, si configuraste la caché, sigue mostrando el catálogo aunque se corte la red.

**Windows (mini PC).** Crea un acceso directo en la carpeta de inicio (`shell:startup`) con:

```text
"C:\Program Files\Google\Chrome\Application\chrome.exe" --kiosk --noerrdialogs --disable-infobars --disable-session-crashed-bubble --check-for-update-interval=31536000 --overscroll-history-navigation=0 http://localhost:4000
```

En Opciones de energía, pantalla y suspensión en «Nunca»; en Configuración → Cuentas, inicio de sesión automático.

**Linux (Ubuntu con escritorio).** Añade a las aplicaciones al inicio el mismo comando con `chromium-browser` o
`google-chrome`, y desactiva el salvapantallas y la suspensión en Energía. En equipos sin escritorio, un servicio
con `cage` o `openbox` que lance Chromium en modo kiosko.

**Android TV box o tablet.** Instala una app de navegador en modo kiosko (Fully Kiosk Browser o similar), pon la URL
del kiosko, activa «pantalla completa», «mantener encendida» y «volver a la URL al inactividad» con un tiempo mayor
que el reposo del kiosko (120 s por defecto).

En todos los casos, apunta el navegador a la URL **local** del servidor si está en el mismo equipo o en la misma red
(`http://<equipo>:4000`), no a la pública: así el tótem sigue funcionando si se cae internet. El QR seguirá
llevando al cliente a la URL pública porque esa se fija al construir.

## 4. Cada día

- **Al abrir:** mira que la portada se vea, toca «Explorar» y vuelve. Si la pantalla está en blanco, toca cualquier
  punto; si sigue así, reinicia el equipo del tótem.
- **Caja (solo modo pago):** deja abierta `PUBLIC_URL/admin` en el PC de caja con el token. Cada cliente que elige
  pagar aparece ahí con su importe; cuando el datáfono o el banco cobren, escribe la referencia y pulsa «Confirmar
  cobro». La pantalla del tótem avanza sola.
- **Solicitudes (modo cotización):** llegan al correo o al webhook configurado. Si un día no llega ninguna y hubo
  gente, revisa `data/leads/` del servidor: ahí están todas aunque el correo falle.
- **Al cerrar:** no hace falta apagar nada; el kiosko vuelve solo a la portada y limpia la selección.

## 5. Si algo falla

| Síntoma | Qué mirar |
|---|---|
| El QR no abre nada en el teléfono | La URL pública no responde desde datos móviles. Revisa el túnel o el dominio. |
| El teléfono envía pero el tótem no avanza | El servidor no está o el tótem no lo alcanza. `http://<equipo>:4000/health` debe responder. La solicitud se guardó igual. |
| Aparece «Sin conexión» en la pantalla | El tótem perdió la red. El catálogo sigue; lo que se envíe se entregará al volver. Revisa el cable o el Wi‑Fi del equipo. |
| «Algo no salió bien» en pantalla | Toca «Volver al inicio». Si se repite, mira los registros: `docker compose logs kiosk`. |
| La administración dice que el token es incorrecto | Compara con `ADMIN_TOKEN` del `.env`. Tras cambiarlo, `docker compose up -d`. |
| No llegan correos | Comprueba `SMTP_URL` y `LEADS_EMAIL_TO`; los registros del servidor dicen «falló email» con el motivo. |

## 6. Actualizar

```bash
git pull
docker compose up -d --build
```

La caché del tótem se renueva sola con la build nueva. Si cambiaste el catálogo o la marca, es lo mismo: edita los
archivos, vuelve a construir y listo.

## 7. Qué se guarda y qué no

Se guardan las solicitudes con los datos que el cliente escribió, las confirmaciones de pago con su referencia y
eventos de uso anónimos (qué pantallas y servicios se tocan). No se guardan imágenes, voz ni nada que el cliente no
haya escrito. El token de administración solo vive en la pestaña del navegador que lo usa.
