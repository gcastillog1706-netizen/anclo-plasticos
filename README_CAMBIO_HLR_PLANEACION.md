# Cambio Planeación — HLR Sello / Empaque

- Conserva la validación/cola normal para máquinas ocupadas.
- HLR Sello y Empaque del mismo molde, máquina y semana se reconocen como una sola corrida física.
- Ambas partidas comienzan juntas y la máquina queda ocupada hasta que termine el componente que requiera más tiempo.
- Si solo se programa Sello o solo Empaque, funciona como una partida normal.
- Un molde diferente sigue entrando a la cola y no se traslapa.
- No se cambió el esquema de datos ni se requiere SQL.
- La excepción se limita a parejas HLR S/E; no agrupa indiscriminadamente otros productos del mismo molde.
