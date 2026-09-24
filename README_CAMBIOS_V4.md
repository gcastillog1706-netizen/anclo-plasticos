# ANCLO Plásticos — V4

Cambios incluidos:
- Planeación unificada en tres pestañas: 1) Material / Programa recibido, 2) Programación rápida, 3) Gantt preliminar.
- Se conserva la tabla semanal de material: virgen, reciclado y pigmento con kg y lote.
- Nueva semana funcional en navegador: crea/abre la siguiente semana vacía y conserva las anteriores en almacenamiento local para validar el flujo.
- Programación rápida usa las mismas partidas, sin recaptura. Permite completar ciclo y piezas/ciclo; calcula pz/h y horas estimadas cuando existen datos suficientes.
- No se inventan estándares faltantes: se muestran como Pendiente estándar.
- Gantt preliminar integrado dentro de Planeación; se quitó Gantt del menú lateral.
- Se quitó Material liberado del menú lateral.
- Materiales / Lotes se reemplazó por Personal.
- Nuevo catálogo visual de Personal.
- Concentrado diario incluye descarga CSV compatible con Excel y opción Guardar PDF / Imprimir.

Importante: esta V4 conserva la validación visual/local. No ejecutar migraciones SQL nuevas todavía. La persistencia definitiva se conectará a Supabase después de validar el flujo y los campos.
