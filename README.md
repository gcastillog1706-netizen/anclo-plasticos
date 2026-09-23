# ANCLO Plásticos · Control de producción

Aplicación Next.js + Supabase para control de inyección.

## Flujo
Solicitud / liberación → Planeación → Máquina / molde → Producción Día-Noche → Concentrado diario → Validación → Cierre de OP.

## Variables Vercel
- NEXT_PUBLIC_SUPABASE_URL
- NEXT_PUBLIC_SUPABASE_ANON_KEY (Publishable key)

## Después de subir esta versión
En Supabase > SQL Editor ejecuta `supabase/politicas_lectura.sql` una sola vez. Esto permite que Inicio/Plano lea los catálogos con RLS activo, pero no abre escritura pública.

## Inicio / Plano
Lee `public.maquinas` en tiempo real al cargar la página. Cada máquina puede seleccionarse y abre su ficha. Mientras no tenga planeación, muestra "Sin OP / Sin producto / Sin molde".

## Seguridad
La captura/escritura quedará protegida con Supabase Auth y políticas por rol antes de habilitar formularios productivos.
