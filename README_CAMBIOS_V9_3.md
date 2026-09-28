# V9.3 — Maestro técnico corregido

- Pz/h oficial se recalcula siempre como `floor((3600 / ciclo_s) * pz_ciclo)`.
- Planeación usa la misma regla, sin redondear hacia arriba.
- El valor Pz/h anterior queda solo como referencia de auditoría.
- M-207 se corrige a 40 cavidades y 40 pz/ciclo según la corrección confirmada.
- Se incluye `supabase/2026-09-28_maestro_tecnico_correcto.sql` para reemplazar el maestro técnico anterior en una tabla dedicada `estandares_proceso`, sin borrar producción histórica.
