# Cambio - datos de molde en Pendientes de Calidad

- Las tarjetas de Pendientes muestran molde, descripción completa y cavidades.
- Si la pendiente viene de Producción, se priorizan máquina y molde reales cuando existen.
- La captura rápida conserva `maquinaReal`, `moldeReal` y `lote` en el registro de producción para que los módulos operativos puedan usar el dato real.
- Al volver a seleccionar una producción, Calidad precarga máquina/molde reales en lugar de regresar automáticamente a los planeados.
- No se modifica ni elimina información histórica de Supabase.
