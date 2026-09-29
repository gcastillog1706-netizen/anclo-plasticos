# V10.4 · Producción + Calidad integrada

## Monitoreo
- Se conserva exactamente el orden real de las 20 máquinas.
- ENTRADA arriba del pasillo central.
- Pasillo más corto para dar más espacio a EP-040, IP-001 y ARBURG.
- Máquinas sin planeación en rojo; programadas amarillo; produciendo verde.
- Tarjetas con OP/Folio, producto, molde, descripción/cavidades, operador, avance, ciclo, capacidad y fin estimado.

## Calidad
- Nueva sección Calidad / Liberaciones.
- La producción de Día/Noche llega a Calidad como pendiente de validar.
- Si Producción ya tiene operadores, se precargan. Si no, Calidad puede seleccionarlos al liberar.
- PASA: registra piezas aceptadas y el avance oficial usa las piezas liberadas.
- NO PASA: retiene y obliga a registrar observación.
- Historial y descarga PDF de liberación.

## Tensión
- Nueva sección Estudios de tensión basada en el flujo del módulo Streamlit.
- Producto, lote, mezcla virgen/molido, cantidad, plan de muestreo, molde, cavidades, máquina, operadores y coordinador.
- Historial inicial de estudios. La captura completa de muestras/cavidades se seguirá migrando sobre esta base.

## Persistencia
Ejecutar una sola vez `supabase/2026-09-29_v10_4_persistencia_calidad.sql`.
La migración es incremental: no contiene DROP, TRUNCATE ni DELETE.
`app_persistencia` protege los datos operativos existentes entre deployments. También deja preparadas tablas normalizadas para Calidad/Tensión.

## PWA
Incluye manifest y service worker para instalación como aplicación móvil.
