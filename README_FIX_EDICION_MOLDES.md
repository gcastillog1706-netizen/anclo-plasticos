# Fix edición Moldes / Herramientas

- La fila permanece en modo edición mientras se modifican sus campos.
- Los cambios se mantienen en un borrador local y no disparan recarga en cada tecla.
- `Guardar` persiste todos los cambios juntos y recalcula la capacidad mostrada.
- `Cancelar` descarta el borrador.
- Se eliminó el archivo duplicado `components/PWARegister.tsx`; el canónico sigue siendo `components/PwaRegister.tsx`.
- No se modifica `supabase/schema.sql` ni se incluyen operaciones de borrado/reset de datos.
