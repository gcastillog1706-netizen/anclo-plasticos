# ANCLO Plásticos — Monitoreo operativo

Esta versión agrega una primera capa visual para empezar a adaptar la operación real:

- Inicio / Monitoreo con las 20 máquinas y el programa actual de ejemplo.
- Planeación / Carga rápida: permite pegar columnas desde Excel (Máquina, Producto, OP/Cantidad, Estatus).
- Gantt inicial por máquina/producto.
- Incidencias / Paros con el catálogo del formato oficial.
- KPIs / Informes.
- Reportes / Descargas por periodo (interfaz) y descarga CSV del programa de ejemplo.
- Material liberado, Producción Día/Noche y Concentrado existentes se conservan.
- EP-048 se usa como identificación correcta y EP-041 representa la Nissei.

## Supabase

`supabase/migracion_monitoreo.sql` es ADITIVO y no borra las tablas existentes. Crea `programa_operativo` y `eventos_maquina` para la siguiente conexión de persistencia.

Las políticas incluidas son de desarrollo. Antes de operación formal se deben sustituir por autenticación y roles.

## Nota

La interfaz de esta entrega usa los datos operativos compartidos como semilla visual para poder revisar formato y flujo de inmediato. La siguiente iteración conecta la captura rápida, Gantt, incidencias y reportes directamente a las tablas nuevas de Supabase y al catálogo producto-molde-máquina-material.
