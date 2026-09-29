# V10.7 — Liberación + personal real + avance oficial

- Hasta 3 operadores reales por fecha/turno/máquina.
- Hasta 2 supervisores reales por fecha/turno/máquina.
- Responsable de inspección permanece independiente.
- Personal precargado cuando Producción ya lo trae.
- PDF e Historial muestran operadores y supervisores.
- Las piezas aceptadas de liberaciones PASA son la fuente del avance oficial de la partida/OP.
- Monitoreo usa acceptedForAllocation(), por lo que el avance se actualiza automáticamente al liberar.
- Cambios retrocompatibles: supervisores es opcional para registros históricos.
- No requiere SQL nuevo; PersistenceGate sincroniza las claves anclo-* existentes con app_persistencia en Supabase.
