-- ANCLO PLÁSTICOS - esquema inicial
create extension if not exists pgcrypto;

create table if not exists productos (
 id uuid primary key default gen_random_uuid(), clave text unique not null, nombre text not null,
 peso_100_piezas_kg numeric(12,4), materia_prima_base text, pigmento_base text,
 created_at timestamptz default now()
);
create table if not exists maquinas (
 id uuid primary key default gen_random_uuid(), codigo text unique not null, marca_modelo text,
 estado text default 'Sin programa', activa boolean default true, created_at timestamptz default now()
);
create table if not exists moldes (
 id uuid primary key default gen_random_uuid(), numero text unique not null, descripcion text,
 producto_id uuid references productos(id), cavidades_estandar int, created_at timestamptz default now()
);
create table if not exists molde_maquina (
 molde_id uuid references moldes(id) on delete cascade, maquina_id uuid references maquinas(id) on delete cascade,
 primary key(molde_id,maquina_id)
);
create table if not exists ordenes_produccion (
 id uuid primary key default gen_random_uuid(), folio text unique not null, producto_id uuid references productos(id),
 cantidad_meta_pzas bigint not null, fecha_requerida date, prioridad text default 'Media', estado text default 'Pendiente', created_at timestamptz default now()
);
create table if not exists liberaciones_material (
 id uuid primary key default gen_random_uuid(), op_id uuid references ordenes_produccion(id),
 mp_virgen text, kg_virgen numeric(12,3) default 0, lote_virgen text,
 kg_reciclado numeric(12,3) default 0, lote_reciclado text,
 pigmento text, kg_pigmento numeric(12,3) default 0, lote_pigmento text,
 observaciones text, created_at timestamptz default now()
);
create table if not exists planeacion (
 id uuid primary key default gen_random_uuid(), op_id uuid references ordenes_produccion(id),
 maquina_propuesta_id uuid references maquinas(id), maquina_real_id uuid references maquinas(id),
 molde_id uuid references moldes(id), fecha_montaje date, turnos text, estado text default 'Programada', created_at timestamptz default now()
);
create table if not exists operadores (
 id uuid primary key default gen_random_uuid(), numero text unique, nombre text not null, activo boolean default true
);
create table if not exists produccion_turno (
 id uuid primary key default gen_random_uuid(), fecha date not null default current_date,
 turno text not null check (turno in ('Día','Noche')), maquina_id uuid references maquinas(id), op_id uuid references ordenes_produccion(id),
 molde_id uuid references moldes(id), kg_producidos numeric(12,3) default 0, piezas_producidas bigint default 0,
 ciclo_real_seg numeric(10,2), cavidades_reales int, merma_kg numeric(12,3) default 0,
 purga_kg numeric(12,3) default 0, horas_trabajadas numeric(6,2) default 0,
 lote_virgen text, lote_reciclado text, lote_pigmento text, comentarios text,
 estado_registro text default 'Pendiente', capturado_por uuid, validado_por uuid,
 cerrado_at timestamptz, validado_at timestamptz, created_at timestamptz default now()
);
create table if not exists produccion_operadores (
 produccion_id uuid references produccion_turno(id) on delete cascade,
 operador_id uuid references operadores(id), primary key(produccion_id,operador_id)
);
create table if not exists paros (
 id uuid primary key default gen_random_uuid(), produccion_id uuid references produccion_turno(id) on delete cascade,
 codigo int, motivo text not null, inicio timestamptz, fin timestamptz, minutos int, comentario text
);

-- Vista para el concentrado diario
create or replace view vw_concentrado_diario as
select pt.fecha, m.codigo maquina, op.folio op, p.clave clave_producto, p.nombre producto,
 mo.numero molde, op.cantidad_meta_pzas meta_op,
 sum(case when pt.turno='Día' then pt.kg_producidos else 0 end) dia_kg,
 sum(case when pt.turno='Día' then pt.piezas_producidas else 0 end) dia_pzas,
 sum(case when pt.turno='Noche' then pt.kg_producidos else 0 end) noche_kg,
 sum(case when pt.turno='Noche' then pt.piezas_producidas else 0 end) noche_pzas,
 sum(pt.piezas_producidas) total_dia_pzas, sum(pt.merma_kg) merma_kg, sum(pt.purga_kg) purga_kg,
 sum(pt.horas_trabajadas) horas_trabajadas
from produccion_turno pt
join maquinas m on m.id=pt.maquina_id
join ordenes_produccion op on op.id=pt.op_id
join productos p on p.id=op.producto_id
left join moldes mo on mo.id=pt.molde_id
group by pt.fecha,m.codigo,op.folio,p.clave,p.nombre,mo.numero,op.cantidad_meta_pzas;

-- Datos iniciales de máquinas (editables)
insert into maquinas(codigo,marca_modelo) values
('IP-003','Toshiba'),('IP-004','Toshiba'),('IP-002','Toshiba'),('IP-005','Toshiba'),('IP-006','Stokes'),
('EP-010','Boy'),('EP-011','Toshiba'),('EP-008','Engel 80'),('EP-007','Battenfeld'),('EP-040','Nissei'),
('IP-001','Toshiba'),('IP-032','Bole 166'),('IP-035','Bole 200'),('IP-039','LS Eco'),('EP-038','Bole 330'),
('EO-048','Bole 200'),('IP-040','Yizumi 160'),('IP-034','Bole 300')
on conflict(codigo) do nothing;
