# Corrección de guardado en tablas maestras

- La identidad persistente de una fila ya no depende de Máquina o Producto, porque son campos editables.
- Los procesos base conservan una clave de origen (`__sourceKey`) al cargarse.
- Los procesos agregados por el usuario se actualizan directamente en `anclo-process-additions-v1`.
- Cambiar Máquina, Producto, Ciclo, Cavidades o Pz/ciclo ya no hace que el guardado pierda la referencia de la fila original.
- Esta regla debe mantenerse en tablas futuras: usar ID/clave estable e inmutable para UPDATE/DELETE; nunca usar como identidad campos que el usuario puede editar.
