# 🎭 És Impostor - Juego Social de Deducciones

Versión: **1.0.0**

> **Un juego de deducciones sociales donde los civiles deben descubrir al impostor antes de que sea demasiado tarde.**

[![Cloudflare Pages](https://img.shields.io/badge/Cloudflare-Pages-F38020?logo=cloudflare&logoColor=white)](https://esimpostor.com)
[![TypeScript](https://img.shields.io/badge/TypeScript-5.6-3178C6?logo=typescript&logoColor=white)](https://www.typescriptlang.org/)
[![React](https://img.shields.io/badge/React-18.3-61DAFB?logo=react&logoColor=black)](https://reactjs.org/)
[![Vite](https://img.shields.io/badge/Vite-6.0-646CFF?logo=vite&logoColor=white)](https://vitejs.dev/)

---

## 🌐 Dominios del Proyecto

| Dominio | Idioma por Defecto | URLs |
|---------|-------------------|------|
| **[esimpostor.com](https://esimpostor.com)** | Español | `?lang=es` · `?lang=ca` · `?lang=en` |
| **[isimpostor.com](https://isimpostor.com)** | Inglés | `?lang=en` · `?lang=es` · `?lang=ca` |

Ambos dominios comparten el mismo código y se despliegan desde el mismo proyecto de Cloudflare Pages.

---

## � Arquitectura del Proyecto

```
es-impostor/
├── 📁 src/                    # Código fuente del frontend
│   ├── 📁 ui/                 # Componentes principales de la app
│   │   ├── App.tsx            # Aplicación principal (React)
│   │   ├── EmojiIcon.tsx      # Componente de iconos Fluent Emoji
│   │   ├── FlipCard.tsx       # Tarjetas animadas flip
│   │   └── Confetti.tsx       # Efectos de confetti
│   ├── 📁 components/         # Componentes reutilizables
│   │   ├── Footer.tsx         # Pie de página
│   │   ├── ContactForm.tsx    # Formulario de contacto
│   │   ├── ConsentBanner.tsx  # Banner de cookies GDPR
│   │   ├── LegalPage.tsx      # Páginas legales
│   │   └── RulesPage.tsx      # Página de reglas
│   ├── i18n.ts                # Sistema de internacionalización (ES/CA/EN)
│   ├── wordData.ts            # Base de datos de palabras secretas
│   ├── types.ts               # Tipos TypeScript compartidos
│   ├── config.ts              # Configuración (AdSense, etc.)
│   ├── styles.css             # Estilos principales
│   ├── animations.css         # Animaciones CSS
│   └── styles-footer.css      # Estilos del footer y páginas legales
├── 📁 worker/                 # Backend (Cloudflare Worker)
│   ├── src/index.ts           # API, WebSockets, Durable Objects
│   └── wrangler.toml          # Configuración del Worker (es-impostor-api)
├── 📁 public/                 # Archivos estáticos
│   ├── 📁 icons/              # Iconos del juego
│   │   └── 📁 animated/       # Fluent Emojis animados
│   ├── manifest.json          # Configuración PWA
│   ├── sw.js                  # Service Worker
│   ├── robots.txt             # SEO
│   └── sitemap.xml            # Mapa del sitio
├── index.html                 # HTML principal con meta tags SEO
├── wrangler.toml              # Configuración Pages (es-impostor-pages)
├── vite.config.ts             # Configuración de Vite
└── package.json               # Dependencias y scripts
```

---

## 🚀 Despliegue a Cloudflare

### ⚠️ Requisitos Previos

- **Node.js:** ≥20.18.1
- **Wrangler:** tenerlo disponible (el proyecto ya lo incluye como dependencia)

### ⚡ Deploy Todo (Frontend + Backend)

```bash
# Un solo comando para desplegar Pages + Worker:
npm run deploy:all
```

### 🎨 Solo Frontend (`es-impostor-pages`)

```bash
npm run deploy
```

### ⚙️ Solo Backend (`es-impostor-api`)

```bash
npm run deploy --prefix worker
```

> 💡 **Nota:** dentro de `worker/` se recomienda actualizar Wrangler a la v4 para evitar avisos:
> ```bash
> cd worker
> npm install --save-dev wrangler@4
> cd ..
> ```

### 🧩 Errores comunes al desplegar

- **`Authentication error [code: 10000]` (Cloudflare API)**
  1. Cierra sesiones antiguas de Wrangler:
     ```bash
     npx wrangler logout
     ```
  2. Vuelve a iniciar sesión y autoriza en el navegador:
     ```bash
     npx wrangler login
     ```
  3. Comprueba que Wrangler ve tu cuenta y proyecto:
     ```bash
     npx wrangler whoami
     npx wrangler pages project list
     ```
  4. Si el error persiste, configura un **API Token** en Cloudflare con permisos de *Pages* y *Workers* y expórtalo antes de desplegar:
     ```bash
     # En PowerShell
     $Env:CLOUDFLARE_API_TOKEN = 'TU_TOKEN_AQUI'
     npm run deploy:all
     ```
  5. Asegúrate de que exista el proyecto `es-impostor-pages` en Cloudflare Pages; si no, créalo:
     ```bash
     npx wrangler pages project create es-impostor-pages
     ```

**URL API:** `https://es-impostor-api.maxsm.workers.dev`

---

## 🛠️ Desarrollo Local

```bash
# Instalar dependencias
npm install
cd worker && npm install && cd ..

# Iniciar servidor de desarrollo
npm run dev
```

El frontend estará disponible en `http://localhost:5173`

---

## ✨ Características Principales

### 🎮 Modos de Juego

| Modo | Descripción |
|------|-------------|
| **Local** | Juega en el mismo dispositivo, pasándolo entre jugadores |
| **Online** | Salas en tiempo real con WebSockets |

### 🎯 Configuración de Partida

- **Categorías:** Animales, Comida, Profesiones, Lugares, Objetos, y más
- **Tema Personalizado:** Genera palabras con IA (Gemini Flash)
- **Impostores:** 1-3 impostores por partida
- **Rondas:** 1-5 rondas por partida
- **Pista para Impostor:** Opción de dar una pista al impostor

### 🌍 Internacionalización

- **Español (ES)** - Idioma principal
- **Catalán (CA)** - Soporte completo
- **English (EN)** - Soporte completo

### 📱 PWA (Progressive Web App)

- Instalable en dispositivos móviles y escritorio
- Funciona offline (Service Worker)
- Shortcuts en el icono de la app

---

## 🤖 Inteligencia Artificial (Gemini Flash)

El juego usa **Google Gemini 2.0 Flash** para generar palabras secretas personalizadas.

| Propiedad | Valor |
|-----------|-------|
| **Modelo** | `gemini-2.0-flash` |
| **Endpoint** | `POST /api/generate-word` |
| **Límite diario** | Configurable via `GEMINI_DAILY_LIMIT` |

### 🔗 Recursos de Google Cloud

- **[Billing/Presupuestos](https://console.cloud.google.com/billing)** - Control de costes
- **[AI Studio](https://aistudio.google.com)** - Gestión de API Keys y prompts

---

## 🌐 Modo Online (Arquitectura)

```
┌─────────────┐     WebSocket      ┌─────────────────┐
│   Cliente   │◄──────────────────►│  Durable Object │
│   (React)   │                    │     (ROOMS)     │
└─────────────┘                    └─────────────────┘
       │                                   │
       │  REST API                         │
       ▼                                   ▼
┌─────────────────────────────────────────────────────┐
│            Cloudflare Worker (es-impostor-api)      │
│  • POST /api/rooms          - Crear sala            │
│  • POST /api/rooms/:code/join - Unirse a sala       │
│  • GET  /api/rooms/public   - Listar salas públicas │
│  • WS   /api/rooms/:code/ws - Conexión tiempo real  │
│  • POST /api/generate-word  - Generar palabra (IA)  │
│  • POST /api/contact        - Formulario contacto   │
│  • GET  /api/health         - Estado del servicio   │
└─────────────────────────────────────────────────────┘
```

### Durable Objects

| Objeto | Función |
|--------|---------|
| **ROOMS** | Estado de cada sala de juego (jugadores, votos, fase) |
| **LOBBY** | Lista de salas públicas activas |

---

## 💰 Publicidad (Google AdSense)

| Configuración | Valor |
|--------------|-------|
| **Cliente (Pub ID)** | `ca-pub-7845247617561167` |
| **Archivo config** | `src/config.ts` |

### Tipos de Anuncios

- **Sidebar:** Bloques laterales en escritorio
- **Sticky Mobile:** Anuncio fijo inferior en móviles
- **Interstitial:** Pantalla completa al crear tema personalizado

---

## 🔑 Variables de Entorno (Secrets)

| Variable | Descripción | Configuración |
|----------|-------------|---------------|
| `gemini_key` | API Key de Google AI Studio | `npx wrangler secret put gemini_key` |
| `GEMINI_DAILY_LIMIT` | Límite de peticiones diarias a Gemini | Variable en `wrangler.toml` |

### 📧 Email Routing

Los emails del formulario de contacto se envían via Cloudflare Workers:

| Idioma | Remitente | Destino |
|--------|-----------|---------|
| ES/CA | `formulario@esimpostor.com` | `hola@esimpostor.com` |
| EN | `formulario@isimpostor.com` | `hello@isimpostor.com` |

Para revisar logs: `cd worker && npx wrangler tail`

---

## 🛠️ Comandos Útiles

| Acción | Comando |
|--------|---------|
| **Desarrollo** | `npm run dev` |
| **Build** | `npm run build` |
| **Deploy Frontend** | `npm run deploy` |
| **Deploy Backend** | `npm run deploy --prefix worker` |
| **Deploy Todo** | `npm run deploy:all` |
| **Ver logs Worker** | `cd worker && npx wrangler tail` |
| **Check API** | `curl https://es-impostor-api.maxsm.workers.dev/api/health` |

---

## 🔍 SEO y Optimización

### ✅ Implementado

- **Structured Data:** WebApplication, VideoGame, Organization, WebSite, FAQPage, HowTo, Review, BreadcrumbList
- **Resource Hints:** DNS-prefetch, preconnect, preload
- **Meta Tags:** Open Graph, Twitter Cards, PWA
- **Hreflang:** Soporte multiidioma (ES, CA, EN)
- **Sitemap XML:** Con imágenes, hreflang y metadatos
- **Robots.txt:** Optimizado para buscadores
- **Manifest.json:** PWA completo con shortcuts y screenshots
- **Security.txt:** Archivo de verificación de seguridad
- **Humans.txt:** Información del equipo

### 📈 Próximos Pasos

1. Verificar dominios en Google Search Console y Bing Webmaster
2. Crear imágenes Open Graph específicas (1200x630px)
3. Monitorear Core Web Vitals con PageSpeed Insights

---

## 🎨 Stack Tecnológico

| Categoría | Tecnología |
|-----------|------------|
| **Frontend** | React 18, TypeScript, Vite 6 |
| **Estilos** | CSS3, Animaciones personalizadas |
| **Iconos** | Fluent Emoji (Microsoft) |
| **Animaciones** | Motion (Framer Motion) |
| **Backend** | Cloudflare Workers, Durable Objects |
| **Base de datos** | SQLite (Durable Objects) |
| **IA** | Google Gemini 2.0 Flash |
| **Hosting** | Cloudflare Pages + Workers |

---

## 📄 Licencia

Este proyecto es software privado. Todos los derechos reservados.

---

<p align="center">
  <strong>👺 És Impostor</strong><br>
  <em>¿Quién es el impostor?</em>
</p>
