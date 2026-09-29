# V10.5.1

Corrección de compilación de Calidad:
- `app/calidad/page.tsx`: la liberación ahora guarda `operadores: operators`.
- No modifica ni elimina datos de Supabase.
- Conserva la integración de Calidad/Tensión de V10.5 y sus migraciones SQL.

Nota: el entorno de empaquetado no terminó `npm install` dentro del límite disponible, por lo que el build completo debe validarse en Vercel.
