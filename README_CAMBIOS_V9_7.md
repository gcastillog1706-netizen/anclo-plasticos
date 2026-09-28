# ANCLO Plásticos V9.7

- Planeación: cada partida muestra y selecciona Producto/Clave antes del herramental.
- Flujo obligatorio: Producto/Clave -> Molde/Herramental compatible -> Máquina compatible.
- El selector de molde muestra número + descripción + cavidades.
- La tabla muestra columnas separadas: No. molde, Descripción del molde/herramental y Cavidades.
- Al seleccionar Producto + Molde + Máquina se cargan ciclo, cavidades, pz/ciclo y capacidad calculada.
- Una OP mantiene múltiples partidas mediante + Agregar partida.
- KPIs: eliminada la dependencia de seedPrograma/datos demostrativos. Los contadores leen programas, órdenes, partidas y producción real almacenada por la aplicación.
- Los datos existentes de V9.6 siguen siendo compatibles: partidas antiguas sin producto propio heredan temporalmente la clave de la OP.
