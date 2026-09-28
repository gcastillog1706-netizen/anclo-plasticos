# ANCLO Plásticos V9

- Semana nueva inicia sin partidas demo.
- Planeación: OP → Producto → Molde (descripción + cavidades) → Máquina (ID + nombre) → piezas → materiales.
- Moldes y máquinas son desplegables dependientes del maestro técnico.
- Moldes/Herramientas permite alta de un nuevo molde con primer producto, máquina, ciclo, cavidades y pz/ciclo; también agregar procesos/compatibilidades y editar estándares.
- Planeación agrega etapa Personal / Turnos con hasta 3 personas por partida, día y turno, permitiendo rotaciones semanales.
- Producción consume exclusivamente partidas de Planeación V9. Si no hay planeación, queda vacía.
- Producción precarga personal planeado y permite confirmar/cambiar hasta 3 personas como personal real.
- Gantt pasa a etapa 4 y sigue calculándose con ciclo teórico + piezas/ciclo.

Persistencia actual: navegador/localStorage para validar flujo antes de migrar cambios a Supabase.
