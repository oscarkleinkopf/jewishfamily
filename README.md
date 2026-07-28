# Dor L'Dor

Diario familiar judío y asistente para el proyecto **Shorashim**.  
Aplicación web pensada para registrar eventos familiares, conservar memorias y organizar contenido relevante (personas, brajot, recordatorios, fechas hebreas y más) en una experiencia simple y offline-friendly.

---

## Tabla de contenidos

- [Visión del proyecto](#visión-del-proyecto)
- [Estado actual](#estado-actual)
- [Funcionalidades principales](#funcionalidades-principales)
- [Stack técnico](#stack-técnico)
- [Estructura del proyecto](#estructura-del-proyecto)
- [Primeros pasos (desarrollo local)](#primeros-pasos-desarrollo-local)
- [Scripts disponibles](#scripts-disponibles)
- [Modelo de datos (alto nivel)](#modelo-de-datos-alto-nivel)
- [Flujos clave](#flujos-clave)
- [Roadmap sugerido](#roadmap-sugerido)
- [Contribución](#contribución)
- [Licencia](#licencia)

---

## Visión del proyecto

**Dor L'Dor** busca centralizar la memoria familiar de forma digital:

- Registrar hitos de vida (nacimientos, bar/bat mitzvá, casamientos, aniversarios, etc.).
- Conectar cada evento con contexto familiar y espiritual.
- Facilitar el armado del proyecto **Shorashim** (raíces familiares) para estudio, impresión y legado.

El objetivo no es solo guardar datos, sino convertirlos en una narrativa familiar reutilizable en celebraciones, educación y transmisión intergeneracional.

---

## Estado actual

El proyecto está en una fase funcional temprana/intermedia:

- Existe una aplicación usable de punta a punta para gestión de eventos y miembros.
- Hay persistencia local, backup/export y soporte PWA básico.
- Faltan pruebas automatizadas y refactor de partes grandes para mejorar mantenibilidad.

---

## Funcionalidades principales

- **Eventos familiares**
  - Alta, edición y eliminación.
  - Filtros y búsqueda.
  - Asociación con categorías.

- **Miembros de la familia**
  - Alta, edición y eliminación de perfiles.
  - Visualización integrada con otras secciones.

- **Galería multimedia**
  - Álbum por evento.
  - Slideshow de imágenes.

- **Shorashim**
  - Flujo tipo asistente (wizard).
  - Vista de salida para impresión/librito.

- **Biblioteca de Brajot**
  - Consulta de textos base.
  - Vinculación con eventos cuando corresponde.

- **Recordatorios y calendario**
  - Gestión de recordatorios.
  - Exportación a `.ics`.

- **Fechas hebreas y zmanim**
  - Conversión desde fecha gregoriana.
  - Consulta de información externa (Hebcal API).

- **Persistencia y portabilidad**
  - Base local con IndexedDB.
  - Export/import JSON de datos.

- **PWA (inicial)**
  - `manifest.json`.
  - Service Worker para experiencia offline parcial.

---

## Stack técnico

- **Frontend**: HTML + CSS + JavaScript (vanilla).
- **Persistencia local**: IndexedDB.
- **PWA**: Service Worker + Web App Manifest.
- **Librerías vía CDN**:
  - Leaflet (mapas)
  - D3 (visualización de árbol)
  - html2pdf
  - Font Awesome
- **Utilidades Node.js**:
  - servidor local simple (`http-server`)
  - scripts de backup/observación

---

## Estructura del proyecto

```text
.
├── index.html          # Estructura principal de la app
├── styles.css          # Estilos globales
├── app.js              # Lógica principal de UI y flujos
├── db.js               # Capa de acceso y utilidades IndexedDB
├── sampleData.js       # Datos semilla
├── sw.js               # Service Worker
├── manifest.json       # Configuración PWA
├── backup.js           # Script de respaldo manual
├── watch-backup.js     # Observador de cambios para respaldo automático
├── package.json        # Scripts de desarrollo
└── README.md
```

---

## Primeros pasos (desarrollo local)

### 1) Requisitos

- Node.js 18+ recomendado
- npm 9+ recomendado

### 2) Instalar dependencias

```bash
npm install
```

### 3) Levantar entorno local

```bash
npm run dev
```

Luego abrir en navegador:

```text
http://localhost:8080
```

---

## Scripts disponibles

- `npm run dev`  
  Levanta servidor estático local en el puerto `8080`.

- `npm run backup`  
  Ejecuta respaldo manual según la lógica de `backup.js`.

- `npm run watch`  
  Observa cambios y dispara respaldos automáticos (`watch-backup.js`).

---

## Modelo de datos (alto nivel)

Entidades manejadas en cliente (IndexedDB):

- `members` (miembros familiares)
- `events` (eventos y ceremonias)
- `photos`/assets asociados a eventos
- `reminders`
- datos vinculados a brajot y salidas Shorashim

> Nota: el esquema exacto evoluciona con la app y hoy vive en la lógica de `db.js` y `app.js`.

---

## Flujos clave

1. Crear/editar miembros familiares.
2. Registrar eventos y relacionarlos con personas.
3. Enriquecer eventos con fotos y contenido.
4. Generar/consultar recursos Shorashim.
5. Gestionar recordatorios y exportar calendario.
6. Respaldar/exportar datos de forma periódica.

---

## Roadmap sugerido

Para pasar de prototipo funcional a producto robusto:

1. **Testing**
   - Incorporar tests unitarios e integración (al menos para `db.js` y utilidades críticas).
2. **Modularización**
   - Dividir `app.js` por dominios (eventos, miembros, galerías, shorashim, recordatorios).
3. **Calidad de datos**
   - Unificar validaciones y manejo de errores en formularios.
4. **Funciones avanzadas pendientes**
   - Árbol familiar D3 dinámico basado en datos reales.
   - Mejorar etiquetado de personas en fotos y persistencia completa.
   - Ampliar exportación `.ics` para cubrir más casos de eventos.
5. **UX y accesibilidad**
   - Navegación por teclado, contraste, mensajes de error más claros.
6. **CI/CD**
   - Pipeline de lint/test y control de calidad antes de merge.

---

## Contribución

Si quieres colaborar:

1. Crear una rama de trabajo:
   ```bash
   git checkout -b feature/nombre-corto
   ```
2. Mantener commits pequeños y descriptivos.
3. Abrir PR con contexto funcional y evidencia de prueba manual.

Guías y plantillas:

- `CONTRIBUTING.md`
- `.github/ISSUE_TEMPLATE/tarea-desarrollo.md`
- `README-RESUMEN.md` (versión corta para referencia rápida)

---

## Licencia

Actualmente figura como `ISC` en `package.json`.

Si el proyecto va a abrirse a contribuciones externas, se recomienda revisar la licencia final deseada y agregar el archivo `LICENSE` correspondiente.