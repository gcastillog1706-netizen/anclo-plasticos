# ANCLO Plásticos V8

- Planeación semanal reordenada: OP → Producto → Molde → Máquina → Pzas → materiales.
- Producto, molde y máquina son desplegables dependientes del catálogo de procesos.
- Si solo existe un molde o una máquina compatible, se selecciona automáticamente.
- Semana nueva inicia en cero; si existen pendientes, pregunta si se desean arrastrar.
- Monitoreo usa únicamente la semana activa y muestra ID + nombre/modelo de máquina.
- Historial semanal calcula Cumplida / Parcial / No cumplida / Arrastrada y KPIs de cumplimiento.
- Moldes/Herramientas permite editar ciclo teórico, cavidades, piezas/ciclo, producto y máquina.
- Capacidad teórica se recalcula automáticamente; Pz/h fuente se conserva como referencia.
- Los cambios de estándares se guardan localmente en esta fase y alimentan nuevas planeaciones/Gantt.

No incluye migración SQL nueva. Persistencia definitiva en Supabase queda para la siguiente fase.

## V8.1 - Corrección de compilación Vercel
- Tipado explícito `string[]` para productos, moldes y máquinas compatibles en Planeación.
- Corrige el error TypeScript `unknown is not assignable to string` reportado por Vercel en `app/planeacion/page.tsx`.
