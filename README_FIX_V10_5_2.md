# V10.5.2 – Fix Vercel casing

- Se mantiene `components/PwaRegister.tsx` como componente PWA canónico.
- `tsconfig.json` excluye explícitamente el archivo legado `components/PWARegister.tsx` para evitar el conflicto de casing en Vercel/Linux si ese archivo todavía permanece en GitHub.
- `app/layout.tsx` continúa importando `@/components/PwaRegister`.
- Se reemplaza `align-items:end` por `align-items:flex-end` para eliminar el warning de Autoprefixer.
- No modifica SQL ni datos operativos.

## Recomendado en GitHub
Eliminar definitivamente `components/PWARegister.tsx` si todavía aparece en el repositorio. El archivo correcto es `components/PwaRegister.tsx`.
