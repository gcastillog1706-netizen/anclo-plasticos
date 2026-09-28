# ANCLO Plásticos V7 — Maestro técnico + Gantt por ciclo

- Se cargaron 262 relaciones de proceso del archivo de moldes/máquinas proporcionado.
- Moldes/Herramientas ahora muestra máquinas compatibles, productos, ciclo teórico, cavidades y piezas/ciclo.
- Máquinas ahora muestra catálogo real y un panel de herramientas/ciclos compatibles por máquina.
- Se corrigieron en el catálogo base los modelos indicados por la fuente: IP-032 Bole 160, EP-038 Bole 230, IP-040 Yizumi 260.
- Planeación rápida intenta cargar automáticamente ciclo teórico y piezas/ciclo cuando coinciden Producto + Molde + Máquina.
- El Gantt calcula duración usando (cantidad / ((3600/ciclo_s)*pz_ciclo)).
- Se conserva Pz/h de la fuente para auditoría; el Gantt usa la capacidad calculada desde ciclo y piezas/ciclo.
- No se agregó SQL nuevo ni se modificó Supabase todavía.
