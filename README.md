# Dor L'Dor - Diario Familiar Judío y Proyecto Shorashim

Aplicación web para registrar acontecimientos de la vida judía familiar, biblioteca de Brajot, calendario de aniversarios y generador de libros de Shorashim.

## Repositorio Oficial
https://github.com/oscarkleinkopf/jewishfamily.git

## Sistema de Respaldo Local
`backup.js` y `watch-backup.js` copian el proyecto a una carpeta scratch local. **Ya no hacen `git add`, commit ni push.** El push automático a `main` se eliminó para evitar publicar secretos (por ejemplo `.env.local`).

Archivos ignorados en el respaldo local incluyen `.env`, `.env.*`, `.netlify`, `node_modules`, `.git` y claves (`.pem` / `.key`).

Para versionar cambios, crea commits y pushes de forma manual.

## Licencia

Código bajo licencia [MIT](LICENSE). Copyright (c) 2026 Osias Kleinkopf.
