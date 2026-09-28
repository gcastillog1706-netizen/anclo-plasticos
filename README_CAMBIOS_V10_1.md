# ANCLO Plásticos V10.1 — Cola automática por máquina

- Conserva las mismas claves de localStorage de V10; no reinicializa programas, OP, partidas ni producción capturada.
- Inicio programado se calcula desde el inicio del periodo y la cola real de la máquina.
- Una partida posterior en la misma máquina se desplaza automáticamente hasta el fin de la anterior.
- Planeación muestra Inicio programado, Fin estimado y Duración por partida.
- Si el usuario propone una fecha que invade una reserva previa, la app muestra el inicio efectivo ajustado y una advertencia.
- El Gantt usa la misma función de programación, por lo que Planeación y Gantt comparten fechas.
- Capacidad sigue calculándose con FLOOR((3600/ciclo_s)*pz_ciclo).
- Calendario temporal: 24 h continuas, pendiente de configurar turnos productivos reales.
