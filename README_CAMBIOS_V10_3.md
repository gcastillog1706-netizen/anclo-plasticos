# V10.3 — Persistencia + PWA + monitoreo visual

- Conserva exactamente la distribución física actual de las máquinas.
- Rojo = sin planeación; amarillo = programada; verde = produciendo.
- Las tarjetas programadas muestran OP/folio, producto, molde, cavidades, avance, piezas, operador (cuando ya existe captura), ciclo, capacidad y fin estimado.
- Agrega PWA instalable en celular (`manifest.webmanifest`, icono y service worker).
- Incluye el SQL faltante de V10.2 para `app_persistencia`.
- El SQL es aditivo: no usa DROP TABLE, TRUNCATE ni DELETE de datos.
- La captura queda bloqueada si Supabase persistente no está disponible.

## Antes de volver a capturar
1. Ejecutar una sola vez `supabase/2026-09-28_persistencia_permanente_v10_2.sql` en Supabase SQL Editor.
2. Desplegar esta versión.
3. Confirmar que abajo a la derecha aparece `● Supabase protegido`.
4. A partir de ahí, nuevos deployments descargan los datos desde Supabase.

IMPORTANTE: los datos que existan únicamente en localStorage de una URL preview antigua no pueden ser leídos por otra URL preview. No borrar el deployment viejo hasta comprobar que los registros ya aparecen en Supabase.
