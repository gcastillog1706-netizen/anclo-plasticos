# V10.2 — Persistencia permanente / anti-pérdida

## Objetivo
Evitar que los datos desaparezcan al cambiar de ZIP o al abrir un nuevo deployment de Vercel.

## Qué cambia
- Supabase pasa a ser el respaldo persistente de todas las claves `anclo-*` usadas por la app.
- Al abrir una versión nueva, la app descarga primero los datos de Supabase y después habilita la interfaz.
- Si Supabase está vacío y el navegador actual sí tiene datos, los migra automáticamente a Supabase.
- La app sincroniza cambios del almacenamiento local a Supabase continuamente.
- Si la tabla de persistencia no existe o Supabase no está configurado, BLOQUEA la captura para evitar volver a registrar datos que se perderían.
- No hay DROP, TRUNCATE ni DELETE en esta migración.
- La app no recibe permiso DELETE sobre `app_persistencia`.

## PASO OBLIGATORIO UNA SOLA VEZ
En Supabase > SQL Editor ejecutar:
`supabase/2026-09-28_persistencia_permanente_v10_2.sql`

Después desplegar esta versión.

## Recuperación de datos de una URL vieja
Si una URL/deployment anterior todavía muestra las OP capturadas, NO la borres. Esa información vive en el localStorage de ese origen. Para migrarla automáticamente, la versión V10.2 tendría que ejecutarse en ese mismo origen/alias estable; una URL nueva no puede leer localStorage de otra URL por seguridad del navegador.

## Regla para versiones futuras
No cambiar las claves de almacenamiento `anclo-*` sin una migración explícita. No reinicializar tablas ni almacenamiento durante despliegues.
