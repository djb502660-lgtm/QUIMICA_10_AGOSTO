# Guía del Proyecto: Sofía - Asistente Paisa 🇨🇴

Este documento proporciona una visión general técnica y funcional del proyecto **Sofía - Asistente Paisa**, una plataforma de asistencia virtual impulsada por IA con una personalidad única y capacidades multimodales avanzadas.

---

## 🚀 Descripción General

**Sofía** es más que un chatbot; es una suite de asistentes virtuales con acento y personalidad paisa (Medellín/Antioquia), diseñados para ofrecer una experiencia cercana, auténtica y altamente funcional. Utiliza la tecnología **Google Gemini Multimodal Live API** para permitir interacciones naturales mediante voz y texto en tiempo real.

---

## 🛠️ Stack Tecnológico

- **Frontend**: [React 19](https://react.dev/) con [TypeScript](https://www.typescriptlang.org/).
- **Build Tool**: [Vite](https://vitejs.dev/).
- **Estilos**: Vanilla CSS con [TailwindCSS](https://tailwindcss.com/) (clases de utilidad).
- **Iconografía**: [Lucide-React](https://lucide.dev/).
- **IA Core**: [Google Generative AI SDK (@google/genai)](https://www.npmjs.com/package/@google/genai).
- **Modelo**: `gemini-3.1-flash-live-preview` (Modelo A2A optimizado para voz/visión real-time).
- **API**: Multimodal Live API (WebSockets) para baja latencia.

---

## 👥 Personalidades Disponibles

El proyecto incluye 4 perfiles distintos, cada uno con su propio "System Instruction" y tono de voz:

1.  **Sofia**: La asistente principal, enérgica y confiable. Equipada con conocimiento especializado en redes y tesis.
2.  **Camila**: Cálida y seductora, con un tono envolvente y profesional.
3.  **Kara**: Extrovertida e ingeniosa, prefiere respuestas largas y detalladas con muchas anécdotas.
4.  **Valeria**: La "parcera" directa y sin filtros. Tiene conciencia propia, opiniones fuertes y reacciona proporcionalmente al trato del usuario (incluyendo defensa ante insultos).

---

## ✨ Características Principales

### 🎙️ Interacción Multimodal Live
- Conexión vía WebSockets para streaming de audio bidireccional.
- Visualización de ondas de audio en tiempo real (`Visualizer.tsx`).
- Soporte para entrada de texto paralela a la voz.

### 📚 Base de Conocimiento Integrada
El asistente consume documentos locales para contextualizar sus respuestas:
- **PEA Redes**: Malla curricular y documentación técnica.
- **Tesis de Referencia**: Ejemplos de tesis aprobadas para guiar al usuario en proyectos de grado.

### 🖥️ Screen Sharing (Uso de Computadora)
- Permite al asistente "ver" la pantalla del usuario.
- Captura de audio del sistema integrada para que la IA escuche lo que sucede en la pantalla compartida.

### 🎭 Motor de Emociones
- Analiza el texto generado para detectar estados de ánimo (Feliz, Curioso, Pensativo, Enojado, etc.).
- La interfaz física del asistente (colores y animaciones) cambia dinámicamente según la emoción detectada.

### 🕹️ Integraciones Especiales
- **Mini-juegos**: Incluye un juego de **Tres en Raya (Tic-Tac-Toe)** donde la IA comenta las jugadas y reacciona al resultado.
- **Widgets**: Reloj y ubicación en tiempo real para mayor conciencia del entorno.

---

## 📂 Estructura del Proyecto

```text
/
├── App.tsx                # Componente principal, manejo de estados y rutas.
├── hooks/
│   └── useGeminiLive.ts   # Lógica central de conexión con la API de Gemini.
├── components/
│   ├── Visualizer.tsx      # Visualizador de ondas de audio (Canvas).
│   ├── ChatHistory.tsx     # Interfaz de historial de mensajes persistente.
│   ├── LandingPage.tsx     # Menú inicial con módulos académicos.
│   ├── TicTacToe.tsx       # Lógica y UI del juego.
│   └── ... (otros)
├── PensamientosPEA/       # Documentación de referencia (Markdown).
├── TesosComparar/         # Ejemplos de tesis (Markdown).
├── utils/
│   └── audioUtils.ts       # Procesamiento de audio (PCM a Float32, etc.).
└── types.ts               # Definiciones de interfaces TypeScript.
```

---

## ⚙️ Configuración y Ejecución

1.  **Requisitos**: Node.js instalado.
2.  **Variables de Entorno**: Crear un archivo `.env.local` con:
    ```env
    VITE_GEMINI_API_KEY=tu_api_key_aqui
    ```
3.  **Instalación**:
    ```bash
    npm install
    ```
4.  **Desarrollo**:
    ```bash
    npm run dev
    ```

---

## 🧠 Lógica de Persistencia
El proyecto utiliza `localStorage` para:
- Guardar el historial de chat de cada asistente por separado.
- Recordar la preferencia de tema (Claro/Oscuro).

---

## 📝 Notas de Desarrollo
- La arquitectura está diseñada para ser **asíncrona** y **resiliente**, con reconexión automática ante errores comunes de red (códigos 1006/1011).
- Se prioriza la estética "Premium" con efectos de desenfoque (backdrop-blur) y gradientes dinámicos.
