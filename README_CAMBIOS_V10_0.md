# ANCLO Plásticos V10.0

- Gantt temporal visual real por máquina, con eje de días, barras escaladas por duración, línea de ahora y detalle de partida.
- La longitud y posición de cada barra dependen de inicio/fin calculados; una partida de 0.7 h ya no se dibuja igual que una de 48 h.
- Cola automática por máquina: una partida no inicia antes de que termine la anterior.
- Campo opcional `Fecha de inicio` por partida. Si queda vacío, se propone el primer espacio disponible desde el inicio del programa. Si se solicita una fecha ocupada, la programación la desplaza al siguiente hueco disponible.
- El Gantt muestra Folio/OP, producto, molde, descripción, cavidades, máquina, piezas, capacidad, duración, inicio y fin estimado.
- Vista Semana / Quincena.
- Se mantiene liberación/reprogramación y snapshots del plan.

Nota: el cálculo de fin sigue usando operación continua 24 h hasta configurar el calendario productivo real de turnos.
