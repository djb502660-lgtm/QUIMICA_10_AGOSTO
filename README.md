<div align="center">
<img width="1200" height="475" alt="GHBanner" src="https://github.com/user-attachments/assets/0aa67016-6eaf-458a-adb2-6e31a0763ed6" />
</div>

# Run and deploy your AI Studio app

This contains everything you need to run your app locally.

View your app in AI Studio: https://ai.studio/apps/temp/3

## Run Locally

**Prerequisites:**  Node.js


1. Install dependencies:
   `npm install`
2. Set the `GEMINI_API_KEY` in [.env.local](.env.local) to your Gemini API key
3. Run the app:
   `npm run dev`
## Historia de correcciones

- **Corrección de ruta de importación**: Se corrigió la ruta del archivo `2.do.Realidad_socio_economica_cultural_ambiental1.md` que estaba apuntando a un nombre inexistente.
- **Eliminación de imports no existentes**: Se removieron los imports de `Conocimiento_Programacion_web1` y `Conocimiento_Diseño_de_interfaz1` que no tenían archivos correspondentes.
- **Ajustes de contenido académico**: Se actualizó la sección de conocimiento académico para remover la referencia a `Conocimiento_realidad_socioeconomica1` y se reorganizó el orden de los conocimientos.
- **Validación del servidor**: Después de los cambios, se reinició el servidor de desarrollo y la aplicación se ejecutó correctamente en `http://localhost:5173`.

Esta versión ha sido probada y funciona sin errores de importación.
