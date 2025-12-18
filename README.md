# 📘 És Impostor - Cheatsheet & Documentación

Este archivo contiene toda la información importante para gestionar, desplegar y entender el proyecto.

## 🚀 Despliegue (Deploy) a Cloudflare

Para subir los cambios a producción:

### ⚡ Deploy Todo (Frontend + Backend)
Sube la interfaz gráfica y la API en un solo comando.
```bash
# Desde la carpeta raíz del proyecto:
npm run deploy:all
```
*Esto ejecutará el deploy del frontend primero y luego el del worker.*

### 1. Frontend (La web / juego)
Sube la interfaz gráfica a Cloudflare Pages.
```bash
# Desde la carpeta raíz del proyecto:
npm run deploy
```
*Esto ejecutará el build (`vite build`) y subirá la carpeta `dist`.*

### 2. Backend (API / Worker)
Sube el código del servidor (API y WebSockets) a Cloudflare Workers.
```bash
# Desde la carpeta raíz:
cd worker
npm run deploy
```
*URL API:* `https://es-impostor-api.maxsm.workers.dev`

---

## 🤖 Inteligencia Artificial (Gemini Flash)

El juego utiliza **Google Gemini 1.5 Flash** para generar palabras secretas en los temas personalizados.

*   **Ubicación del código:** `worker/src/index.ts`
*   **Función:** `generateWordWithGemini`
*   **Modelo:** `gemini-1.5-flash`
*   **Uso:** Cuando un usuario elige "Tema Personalizado", el frontend llama a `/api/generate-word` y el Worker consulta a Gemini.


### 🔗 Recursos del Proyecto (Google Cloud & AI Studio)

*   **Google Cloud Billing (Presupuestos):** [Control de Costes](https://console.cloud.google.com/billing/016479-E3184E-39EA21/budgets?project=gen-lang-client-0358769018)
    *   *Uso:* Monitorizar el gasto de la API y configurar alertas de presupuesto para evitar cobros inesperados.
*   **Google AI Studio:** [Gestión del Proyecto](https://aistudio.google.com/projects?project=gen-lang-client-0358769018)
    *   *Uso:* Gestionar las API Keys, probar prompts (prompts engineering) y ajustar parámetros del modelo Gemini.

## 🌐 Modo Online (Cómo funciona)

El modo online usa **Cloudflare Durable Objects** para mantener el estado de la sala en tiempo real y **WebSockets** para la comunicación instantánea.

*   **WebSockets:** Permiten que todos los jugadores vean los cambios al instante (votos, pistas, unirse).
*   **Durable Objects:** `ROOMS` (definido en `worker/src/index.ts`). Cada sala es un "objeto" persistente en el borde (edge) de Cloudflare.
*   **API Endpoints:**
    *   `POST /api/rooms`: Crea una sala.
    *   `POST /api/rooms/:code/join`: Unirse a una sala.
    *   `WS /api/rooms/:code/ws`: Conexión en tiempo real.

## 💰 Publicidad (Google AdSense)

La configuración de anuncios está centralizada.

*   **Archivo de configuración:** `src/config.ts`
*   **Cliente (Pub ID):** `ca-pub-7845247617561167`
*   **Tipos de anuncios:**
    *   **Sidebar:** Bloques laterales en escritorio.
    *   **Sticky Mobile:** Anuncio fijo abajo en móviles.
    *   **Interstitial:** Anuncio a pantalla completa al crear tema personalizado.

## 🔑 Claves y Seguridad

*   **Variables de Entorno (Secrets):**
    *   `gemini_key`: La API Key de Google AI Studio (configurada en Cloudflare Dashboard o `.dev.vars` para local).

## 🛠️ Comandos Útiles

| Acción | Comando |
| :--- | :--- |
| **Iniciar todo (Dev)** | `npm run dev` (Frontend en 4173) |
| **Deploy completo** | `npm run deploy:all` (Frontend + API) |
| **Ver logs del Worker** | `cd worker && npx wrangler tail` |
| **Check API status** | `curl https://es-impostor-api.maxsm.workers.dev/api/health` |
