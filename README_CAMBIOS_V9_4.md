# ANCLO Plásticos — V9.4

## Maestro técnico
- Regenerado completo desde `Texto pegado(2).txt`: 438 registros.
- Se conserva la clave de producto exacta del archivo nuevo; no se reconstruyen claves PRO/MX.
- Relación: Herramental → Clave de producto → Máquina → estándar de proceso.
- Se conserva `pz_hora_fuente` para auditoría.
- Se agrega `pz_hora_calculada = FLOOR((3600 / ciclo_s) * pz_ciclo)`.
- Para cinchos se agrega `pz_hora_cientos = pz_hora_calculada / 100`.

## Correcciones confirmadas
- M-207: 50 cavidades y 50 pz/ciclo. A 15 s = 12,000 pz/h = 120 cientos/h.
- M-208 + IP-039 + ACN300-4 PRO / PRO A: 20 cavidades, 20 pz/ciclo, 15 s = 4,800 pz/h = 48 cientos/h.
- M-213: los procesos de 15 s y 20 pz/ciclo calculan 4,800 pz/h = 48 cientos/h; el valor fuente 96 se conserva únicamente como auditoría donde venía así.
- Los procesos M-213 de 20 s y 20 pz/ciclo calculan 3,600 pz/h = 36 cientos/h.

## Datos que NO se inventaron
- La clave vacía del archivo permanece vacía.
- M-215/M215 A conserva las claves y configuraciones del archivo. No se reemplazan claves 300/370 por inferencia.
- No se normalizaron automáticamente tags de máquina que difieren del maestro de máquinas.

## Supabase
Ejecutar `supabase/2026-09-28_maestro_tecnico_v9_4.sql` en SQL Editor para reemplazar el maestro técnico. No ejecutar `supabase/schema.sql`.
