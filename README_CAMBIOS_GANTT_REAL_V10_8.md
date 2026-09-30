# V10.8 — Gantt: planeado vs producción real

- Azul: cantidad planeada todavía pendiente.
- Rojo: piezas aceptadas/liberadas por Calidad.
- Verde: partida completada al 100%.
- El avance usa piezas aceptadas de liberaciones activas; las anuladas no cuentan.
- La barra muestra aceptadas / objetivo real y porcentaje.
- Si Calidad registra una máquina real distinta de la planeada, el plan original permanece en su máquina y aparece una barra roja punteada en la máquina real.
- El panel lateral muestra máquina y molde planeados frente a máquina y molde reales.
- Correcciones/anulaciones de Calidad disparan el mismo evento de actualización y el Gantt recalcula.
- Para cinchos, el objetivo usa realPiecesFor(), por lo que los cientos se convierten a piezas reales antes de calcular el porcentaje.
- Se eliminó el archivo duplicado components/PWARegister.tsx; se conserva components/PwaRegister.tsx para evitar conflicto de casing en Vercel/Linux.

No incluye cambios destructivos de Supabase ni reinicia datos.
