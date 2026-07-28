# Guía de Contribución

Gracias por colaborar con **Dor L'Dor**.

## Flujo recomendado

1. Crear rama desde `main`:
   ```bash
   git checkout -b feature/tu-cambio
   ```
2. Hacer cambios pequeños y enfocados.
3. Probar manualmente el flujo afectado.
4. Commit con mensaje claro:
   ```bash
   git commit -m "feat: breve descripción"
   ```
5. Abrir Pull Request con contexto funcional.

## Convenciones mínimas

- Mantener nombres claros de variables y funciones.
- Evitar mezclar refactor grande con feature nueva en el mismo PR.
- Si tocas un flujo visible, incluir pasos de prueba manual en la descripción del PR.

## Checklist antes de abrir PR

- [ ] El cambio cumple el objetivo del issue/tarea.
- [ ] Probé el flujo manualmente en local.
- [ ] No rompí funcionalidades existentes relacionadas.
- [ ] Actualicé documentación si aplica.

## Sugerencias técnicas para este repo

- Priorizar modularización de `app.js` por dominios.
- Agregar pruebas para utilidades de `db.js` y funciones críticas.
- Mantener la experiencia offline estable al modificar `sw.js`.
