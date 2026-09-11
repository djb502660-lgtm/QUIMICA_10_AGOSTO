# Ficha Técnica

**Nombre del proyecto:** Sofía — Asistente Paisa V1
**Versión:** 0.0.0
**Descripción:** Aplicación web de asistente virtual basada en Gemini 3.1 Flash Live, diseñada para ayudar a los estudiantes de la carrera de Desarrollo de Software con respuestas académicas basadas en un conocimiento estructurado de 19 asignaturas.

## Tecnologías
- **Frontend:** React 19, TypeScript, Vite 6
- **UI Icons:** Lucide‑React
- **Gestión de estado:** Hooks de React personalizados (`useGeminiLive`)
- **Estilos:** Tailwind CSS (clases utilitarias) con temática dinámica (cyan, rose, amber, violet) y soporte dark mode.
- **Integraciones:** API de Gemini para generación de respuestas de voz y texto.

## Características principales
- Selección de asistente (David, Camila, Kara, Valeria) con personalidades y voces diferentes.
- Sistema de chat con historial por asistente y detección de emociones para adaptar la UI.
- Compartir pantalla con previsualización flotante premium.
- Widgets auxiliares (reloj, tic‑tac‑toe, visualizador, etc.).
- Tema dinámico y animaciones suaves (glassmorphism, micro‑animaciones).
- Carga de contenido académico mediante imports `?raw` de archivos Markdown/JSON.

## Requisitos
- Node.js >= 18
- npm (se incluye `package.json` con scripts `dev`, `build`, `preview`).

## Instalación
```bash
git clone <repo‑url>
cd sofía---asistente-paisa-v1
npm install
```

## Ejecución en desarrollo
```bash
npm run dev
```
Visita `http://localhost:5173`.

## Build para producción
```bash
npm run build
npm run preview
```

## Notas de mantenimiento
- Los archivos de conocimiento se importan como raw text; actualizar los Markdown en `PensamientosPEA` para reflejar cambios curriculares.
- El archivo `App.tsx` contiene la configuración de asistentes y los imports de conocimiento. Mantener la consistencia de nombres de archivo.
- Se recomienda revisar los logs de Vite al cambiar rutas de importación.

---
*Generado automáticamente por Antigravity Assistant.*
