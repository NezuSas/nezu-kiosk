# 🚀 Nezu Kiosk

Nezu Kiosk es una aplicación de kiosko empresarial desarrollada con **React**, **Vite** y **TypeScript**, diseñada para gestionar pedidos, generar códigos QR y conectarse con impresoras térmicas.

---

## 📖 Características Principales
- 🛒 **Carrito de Compras** con actualización en tiempo real.
- 📲 **Generación de Códigos QR** para pagos.
- 🖨 **Conexión con Impresoras Térmicas** utilizando `escpos` y `escpos-usb`.
- 🔗 **Integración con APIs** para pagos y gestión de pedidos.
- ⚡ **Rendimiento optimizado** con **Vite** y **Zustand** para manejo de estado.

---

## 📂 Estructura del Proyecto

```
📦 nezu-kiosk
├── 📂 public/              # Archivos estáticos
├── 📂 server/              # Backend con Express
├── 📂 src/                 # Código fuente principal
│   ├── 📂 assets/          # Imágenes y recursos estáticos
│   ├── 📂 components/      # Componentes reutilizables
│   ├── 📂 config/         # Configuración del proyecto
│   ├── 📂 integrations/    # Integraciones externas (ej. impresoras)
│   ├── 📂 pages/          # Vistas principales (Cart, Home, PaymentOptions, etc.)
│   ├── 📂 routes/         # Definición de rutas con react-router-dom
│   ├── 📂 store/          # Manejo de estado con Zustand
│   ├── 📂 styles/         # Archivos de estilos globales y modulares
│   ├── 📂 utils/          # Funciones auxiliares
│   ├── App.tsx           # Componente raíz
│   ├── main.tsx          # Punto de entrada de la aplicación
└── ...
```

---

## 🔧 Instalación y Configuración

### 1️⃣ **Clonar el Repositorio**
```sh
git clone https://github.com/NezuSas/nezu-kiosk.git
cd nezu-kiosk
```

### 2️⃣ **Instalar Dependencias**
```sh
npm install
```

### 3️⃣ **Configurar Variables de Entorno**
Crear un archivo `.env.development` o `.env.production` con las siguientes variables:
```env
VITE_API_URL=https://api.nezu.com
VITE_PAYMENT_GATEWAY=https://payments.nezu.com
```

### 4️⃣ **Ejecutar en Desarrollo**
```sh
npm run dev
```

### 5️⃣ **Construir para Producción**
```sh
npm run build
```

---

## 🛠 Tecnologías Utilizadas
- ⚛ **React + Vite** - Framework y Bundler rápido.
- 📦 **Zustand** - Manejo eficiente de estado global.
- 📡 **Express** - Backend ligero.
- 🖨 **escpos + escpos-usb** - Impresión térmica.
- 🎨 **CSS Modules** - Estilos modulares.
- 🛒 **react-router-dom** - Navegación entre páginas.

---

## 🚀 Rutas Disponibles

| Ruta | Página |
|------------|----------------|
| `/` | Inicio |
| `/categories` | Categorías |
| `/categories/:category` | Subcategorías |
| `/categories/:category/:subCategory` | Detalles del producto |
| `/cart` | Carrito de compras |
| `/form` | Formulario de usuario |
| `/payment-options` | Opciones de pago |
| `/datafast-instructions` | Instrucciones de pago con Datafast |

---

## 🤝 Contribuciones
¡Las contribuciones son bienvenidas! Para colaborar:
1. Haz un **fork** del repositorio.
2. Crea una **rama** (`git checkout -b feature-nueva`).
3. Haz un **commit** (`git commit -m 'Agrega nueva funcionalidad'`).
4. Haz un **push** (`git push origin feature-nueva`).
5. Abre un **Pull Request**.

---

## 📜 Licencia
Este proyecto está bajo la licencia **MIT**.

---

🚀 **Desarrollado por NezuSas con tecnología de vanguardia.**

NezuSas está comprometido con la innovación y el desarrollo de soluciones tecnológicas para optimizar procesos empresariales. Con un enfoque en eficiencia y facilidad de uso, **Nezu Kiosk** ha sido diseñado para brindar una experiencia fluida, segura y adaptada a las necesidades del negocio moderno. Gracias a nuestra experiencia en software y hardware, aseguramos una integración confiable con sistemas de pago y dispositivos de impresión. ¡Optimiza tu flujo de trabajo con Nezu Kiosk!

