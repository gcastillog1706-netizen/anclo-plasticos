'use client';
import {useEffect,useMemo,useState} from 'react';
import {seedPrograma,estadoClase} from '@/lib/programa';

type Zone='left'|'right'|'bottom';
type Layout={left:string[];right:string[];bottom:string[]};
type Plan={id?:string;semana?:number;maquina:string;op:string;producto:string;cantidad:number|null;estatus:string;ciclo?:number|null;pz_ciclo?:number|null;fecha_fin_planeada_actual?:string;fecha_fin_planeada_original?:string};
type Prod={partidaId:string;semana:number;fecha:string;turno:string;piezas:number|null;ciclo:number|null;operadores?:string};
const defaultLayout:Layout={left:['IP-003','IP-004','IP-002','IP-005','IP-006','EP-010','EP-011','EP-008','EP-007'],bottom:['EP-040','IP-001','ARBURG'],right:['IP-032','IP-035','IP-039','EP-038','EP-048','IP-040','IP-034','EP-041']};
const currentFor=(m:string,rows:Plan[])=>rows.find(x=>x.maquina===m&&x.estatus==='EN PROCESO')||rows.find(x=>x.maquina===m&&x.estatus.includes('INCIDENCIA'))||rows.find(x=>x.maquina===m&&x.estatus==='SIN MATERIAL')||rows.find(x=>x.maquina===m&&x.estatus==='SE MONTA HOY');
const fmtCycle=(v?:number|null)=>v?`${v.toFixed(1)} s`:'—';
function Machine({m,rows,prod,edit,onDragStart}:{m:string;rows:Plan[];prod:Prod[];edit:boolean;onDragStart:(m:string)=>void}){
 const r=currentFor(m,rows); const pendientes=rows.filter(x=>x.maquina===m&&x.estatus==='PENDIENTE').length;
 const pr=r?.id?prod.filter(x=>x.partidaId===r.id):[]; const piezas=pr.reduce((a,x)=>a+(x.piezas||0),0); const real=[...pr].reverse().find(x=>x.ciclo)?.ciclo||null;
 const avance=r?.cantidad?Math.min(100,(piezas/r.cantidad)*100):null; const faltan=r?.cantidad?Math.max(0,r.cantidad-piezas):null;
 const theoretical=r?.ciclo||null; const dev=theoretical&&real?((real-theoretical)/theoretical)*100:null;
 const planned=r?.fecha_fin_planeada_actual||r?.fecha_fin_planeada_original; const delayed=planned?new Date(planned).getTime()<Date.now()&&(faltan??1)>0:false;
 const ops=[...pr].reverse().find(x=>x.operadores)?.operadores;
 return <button draggable={edit} onDragStart={()=>onDragStart(m)} className={'machine-unit '+estadoClase(r?.estatus||'')+(edit?' editing':'')} title={edit?'Arrastra para mover la máquina':`${m} · ${r?.producto||'Sin programa'}`}>
  <div className="machine-art"><span className="hopper"/><span className="body"/><span className="base"/></div>
  <div className="machine-info"><div className="machine-title"><b>{m}</b>{edit&&<span className="drag-handle">↕ MOVER</span>}</div><span>{r?.estatus||'SIN PROGRAMA'}</span><strong>{r?.producto||'—'}{r?.op?` · OP ${r.op}`:''}</strong>
  {r?.cantidad?<small><b>{piezas.toLocaleString()}</b> / {r.cantidad.toLocaleString()} pzas{avance!==null?` · ${avance.toFixed(0)}%`:''}{faltan!==null?` · faltan ${faltan.toLocaleString()}`:''}</small>:<small>Sin OP registrada</small>}
  {r?.estatus==='EN PROCESO'&&<><small>⏱ Ciclo T: {fmtCycle(theoretical)} · R: <b>{fmtCycle(real)}</b>{dev!==null?` · ${dev>=0?'+':''}${dev.toFixed(1)}%`:''}</small><small>{ops?`👷 ${ops}`:'👷 Sin personal registrado'}</small><span className={'timing '+(delayed?'late':'ontime')}>{planned?(delayed?'● CON RETRASO':'● EN TIEMPO'):'○ FIN PENDIENTE'}</span></>}
  {pendientes>0&&<em>+ {pendientes} pendiente(s) en cola</em>}</div></button>
}
export default function OperationsDashboard(){
 const [layout,setLayout]=useState<Layout>(defaultLayout),[edit,setEdit]=useState(false),[drag,setDrag]=useState<string|null>(null),[rows,setRows]=useState<Plan[]>(seedPrograma as Plan[]),[prod,setProd]=useState<Prod[]>([]);
 useEffect(()=>{try{const l=localStorage.getItem('anclo-layout-v1');if(l)setLayout(JSON.parse(l));const p=JSON.parse(localStorage.getItem('anclo-planeacion-v4')||'[]');if(p.length)setRows(p);setProd(JSON.parse(localStorage.getItem('anclo-produccion-v1')||'[]'))}catch{}},[]);
 const saveLayout=(l:Layout)=>{setLayout(l);localStorage.setItem('anclo-layout-v1',JSON.stringify(l))};
 const drop=(zone:Zone,before?:string)=>{if(!drag)return;const next:{left:string[];right:string[];bottom:string[]}={left:layout.left.filter(x=>x!==drag),right:layout.right.filter(x=>x!==drag),bottom:layout.bottom.filter(x=>x!==drag)};const a=next[zone];const i=before?a.indexOf(before):-1;i>=0?a.splice(i,0,drag):a.push(drag);saveLayout(next);setDrag(null)};
 const all=[...layout.left,...layout.bottom,...layout.right]; const current=all.map(m=>({m,r:currentFor(m,rows)})); const prodN=current.filter(x=>x.r?.estatus==='EN PROCESO').length,par=current.filter(x=>x.r&&(x.r.estatus.includes('INCIDENCIA')||x.r.estatus==='SIN MATERIAL')).length,prep=current.filter(x=>x.r?.estatus==='SE MONTA HOY').length;
 const zone=(z:Zone,cls:string)=><div className={'bank '+cls+(edit?' drop-zone':'')} onDragOver={e=>edit&&e.preventDefault()} onDrop={()=>drop(z)}>{layout[z].map(m=><div key={m} onDragOver={e=>edit&&e.preventDefault()} onDrop={e=>{if(edit){e.stopPropagation();drop(z,m)}}}><Machine m={m} rows={rows} prod={prod} edit={edit} onDragStart={setDrag}/></div>)}</div>;
 return <><div className="top"><div><div className="title">Monitoreo de planta</div><div className="muted">Estado, avance, ciclos, retrasos y cola de trabajo</div></div><div className="actions"><button className={'btn '+(edit?'edit-active':'secondary')} onClick={()=>setEdit(v=>!v)}>{edit?'✓ Terminar edición':'✏ Editar planta'}</button><span className="live">● OPERACIÓN</span></div></div>
 <div className="grid"><div className="card"><div className="muted">Produciendo</div><div className="kpi green">{prodN}</div></div><div className="card"><div className="muted">Paradas / sin material</div><div className="kpi red">{par}</div></div><div className="card"><div className="muted">Preparación / montaje</div><div className="kpi amber">{prep}</div></div><div className="card"><div className="muted">Sin programa visible</div><div className="kpi">{20-prodN-par-prep}</div></div></div>
 <section className="section"><div className="section-title-row"><div><h2>Plano operativo</h2>{edit&&<div className="muted small">Arrastra una máquina a cualquier posición de las zonas izquierda, derecha o inferior. La distribución queda guardada.</div>}</div><div className="legend"><span className="lg ok">Produciendo</span><span className="lg warn">Preparación</span><span className="lg bad">Paro / sin material</span><span className="lg neutral">Sin programa</span></div></div>
 <div className="plant-floor">{zone('left','left-bank')}<div className="aisle"><div className="aisle-label">PASILLO CENTRAL</div><div className="entrance">ENTRADA</div></div>{zone('right','right-bank')}<div className="bottom-bank drop-zone" onDragOver={e=>edit&&e.preventDefault()} onDrop={()=>drop('bottom')}>{layout.bottom.map(m=><div key={m} onDragOver={e=>edit&&e.preventDefault()} onDrop={e=>{if(edit){e.stopPropagation();drop('bottom',m)}}}><Machine m={m} rows={rows} prod={prod} edit={edit} onDragStart={setDrag}/></div>)}</div></div></section></>}
