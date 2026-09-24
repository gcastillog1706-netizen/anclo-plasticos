# ANCLO Plásticos – Monitoreo V2

Cambios de esta revisión:
- Recupera el plano visual de las 20 máquinas con pasillo central y estado por color.
- Conserva KPI rápidos en Inicio.
- Planeación ya no usa el cuadro de pegado como captura principal.
- Captura rápida por campos para programa, OP, cantidad, molde, fecha, turno, estado y prioridad.
- Material liberado separado en virgen, reciclado y pigmento; cada uno con cantidad y lote.
- Tabla de programa editable directamente, con duplicar y eliminar.
- Carga masiva desde Excel queda como opción secundaria.
- No requiere ejecutar SQL de Supabase para revisar esta interfaz.

Nota: esta V2 mantiene edición en memoria del navegador para validar flujo/UI. El guardado definitivo a Supabase se conecta después de aprobar la pantalla.
