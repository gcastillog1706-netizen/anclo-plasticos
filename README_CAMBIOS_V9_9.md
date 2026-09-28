# ANCLO Plásticos V9.9 — Liberación y reprogramación

- Botón **Liberar programa** visible cuando el programa está en BORRADOR.
- Validación antes de liberar: producto, cantidad, fecha, OP oficial cuando aplica, partidas completas y 100% de piezas asignadas.
- Al liberar se guarda una fotografía del plan original en `anclo-program-revisions-v1`.
- Un programa LIBERADO sigue siendo editable.
- Botón **Guardar reprogramación** crea una nueva revisión sin borrar el plan original.
- Monitoreo ya no toma programas BORRADOR; solo LIBERADO o EN EJECUCIÓN.
- Producción Día/Noche solo toma partidas de programas LIBERADOS o EN EJECUCIÓN.
- El primer registro real de producción cambia automáticamente LIBERADO → EN EJECUCIÓN.
- Se muestra el número de revisión del programa.
