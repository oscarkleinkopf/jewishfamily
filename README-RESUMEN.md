# Dor L'Dor (Resumen)

Aplicación web para documentar memoria familiar judía y apoyar el proyecto Shorashim.

## Qué hace

- Registra eventos familiares (alta, edición, eliminación).
- Administra miembros de la familia.
- Asocia fotos y muestra slideshow.
- Gestiona recordatorios y exporta calendario `.ics`.
- Permite exportar/importar datos locales (IndexedDB).
- Incluye base PWA (manifest + service worker).

## Stack

- HTML, CSS, JavaScript (vanilla)
- IndexedDB
- Leaflet, D3, html2pdf (CDN)
- Node.js scripts para desarrollo/backup

## Arranque rápido

```bash
npm install
npm run dev
```

Abrir: `http://localhost:8080`

Versión lite (widget para Shabatin): `http://localhost:8080/lite.html`

## Estado actual

Proyecto funcional en fase temprana/intermedia.  
Próximos focos: pruebas automatizadas, modularización y completar funcionalidades avanzadas.

## Documentación extendida

Ver `README.md` para detalles completos (arquitectura, roadmap, contribución y flujos).
