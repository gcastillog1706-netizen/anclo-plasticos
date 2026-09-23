'use client';

import { useMemo, useState } from 'react';

type Machine = {
  id: string;
  numero_maquina: string;
  marca: string | null;
  modelo: string | null;
  tonelaje: number | null;
  estado: string;
  posicion_x: number | null;
  posicion_y: number | null;
  rotacion: number | null;
};

const statusLabel: Record<string,string> = {
  PRODUCIENDO:'Produciendo', CAMBIO_PREPARACION:'Cambio / preparación', PARADA:'Parada',
  SIN_PROGRAMA:'Sin programa', MANTENIMIENTO:'Mantenimiento'
};

function MachineCard({m,onClick}:{m:Machine,onClick:()=>void}){
  const state = (m.estado || 'SIN_PROGRAMA').toLowerCase().replaceAll('_','-');
  return <button className={`machine machine-${state}`} onClick={onClick} title={`Abrir ${m.numero_maquina}`}>
    <span className="machine-top"><b>{m.numero_maquina}</b><i /></span>
    <span className="machine-body">
      <span className="machine-brand">{m.marca || 'Sin marca'}</span>
      <span className="machine-state">{statusLabel[m.estado] || m.estado}</span>
    </span>
    <span className="machine-base" />
  </button>
}

export default function PlantFloor({machines}:{machines:Machine[]}){
  const [selected,setSelected] = useState<Machine|null>(null);
  const left = useMemo(()=>machines.filter(m=>(m.posicion_x ?? 50)<25).sort((a,b)=>(a.posicion_y??0)-(b.posicion_y??0)),[machines]);
  const bottom = useMemo(()=>machines.filter(m=>(m.posicion_x ?? 50)>=25 && (m.posicion_x ?? 50)<75).sort((a,b)=>(a.posicion_x??0)-(b.posicion_x??0)),[machines]);
  const right = useMemo(()=>machines.filter(m=>(m.posicion_x ?? 50)>=75).sort((a,b)=>(a.posicion_y??0)-(b.posicion_y??0)),[machines]);

  return <>
    <div className="plant-card">
      <div className="plant-head">
        <div><div className="eyebrow">ÁREA DE INYECCIÓN</div><h2>Plano de máquinas</h2><p>Selecciona una inyectora para consultar su ficha.</p></div>
        <div className="legend"><span><i className="dot prod"/>Produciendo</span><span><i className="dot prep"/>Preparación</span><span><i className="dot stop"/>Parada</span><span><i className="dot idle"/>Sin programa</span><span><i className="dot maint"/>Mantenimiento</span></div>
      </div>
      <div className="floor">
        <div className="entrance">ENTRADA</div>
        <div className="bank bank-left">{left.map(m=><MachineCard key={m.id} m={m} onClick={()=>setSelected(m)}/>)}</div>
        <div className="aisle"><div className="aisle-line"/><span>FLUJO / PASILLO CENTRAL</span><div className="arrow">↓</div></div>
        <div className="bank bank-right">{right.map(m=><MachineCard key={m.id} m={m} onClick={()=>setSelected(m)}/>)}</div>
        <div className="bank bank-bottom">{bottom.map(m=><MachineCard key={m.id} m={m} onClick={()=>setSelected(m)}/>)}</div>
      </div>
    </div>

    {selected && <div className="modal-backdrop" onClick={()=>setSelected(null)}>
      <div className="machine-detail" onClick={e=>e.stopPropagation()}>
        <button className="close" onClick={()=>setSelected(null)}>×</button>
        <div className="eyebrow">FICHA DE MÁQUINA</div>
        <h2>{selected.numero_maquina} · {selected.marca}</h2>
        <div className={`status-banner machine-${selected.estado.toLowerCase().replaceAll('_','-')}`}>{statusLabel[selected.estado] || selected.estado}</div>
        <div className="detail-grid">
          <div><small>Producto</small><b>Sin producto asignado</b></div>
          <div><small>Clave</small><b>—</b></div>
          <div><small>No. molde / herramienta</small><b>Sin molde asignado</b></div>
          <div><small>OP</small><b>Sin OP</b></div>
          <div><small>Turno</small><b>—</b></div>
          <div><small>Operadores</small><b>—</b></div>
          <div><small>Lotes de material</small><b>—</b></div>
          <div><small>Producción hoy</small><b>0 kg · 0 pzas</b></div>
          <div><small>Acumulado OP</small><b>0 pzas</b></div>
          <div><small>Faltan</small><b>—</b></div>
        </div>
        <p className="detail-note">Cuando asignemos una OP desde Planeación, esta ficha se llenará automáticamente con producto, molde, operadores, lotes y avance.</p>
      </div>
    </div>}
  </>
}
