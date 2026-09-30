'use client';
import {useEffect,useMemo,useState} from 'react';
import {Allocation,KEYS,Order,Production,Program,read,realPiecesFor} from '@/lib/operations';
import {QUALITY_KEYS,QualityRelease,qread} from '@/lib/quality';

type WeekRow={key:string;label:string;start:string;end:string};
const dateOnly=(v?:string)=>{if(!v)return ''; const m=v.match(/^\d{4}-\d{2}-\d{2}/); return m?m[0]:new Date(v).toISOString().slice(0,10)};
const monday=(d:Date)=>{const x=new Date(d);x.setHours(12,0,0,0);const day=x.getDay()||7;x.setDate(x.getDate()-day+1);return x};
const addDays=(d:Date,n:number)=>{const x=new Date(d);x.setDate(x.getDate()+n);return x};
const iso=(d:Date)=>d.toISOString().slice(0,10);
const fmt=(n:number)=>Math.round(n||0).toLocaleString('es-MX');
const pct=(a:number,b:number)=>b>0?Math.min(999,(a/b)*100):0;
const shortDate=(s:string)=>new Date(`${s}T12:00:00`).toLocaleDateString('es-MX',{day:'2-digit',month:'short'});
const dayName=(s:string)=>new Date(`${s}T12:00:00`).toLocaleDateString('es-MX',{weekday:'short'}).replace('.','');

export default function Page(){
 const [programs,setPrograms]=useState<Program[]>([]),[orders,setOrders]=useState<Order[]>([]),[allocs,setAllocs]=useState<Allocation[]>([]),[prod,setProd]=useState<Production[]>([]),[rels,setRels]=useState<QualityRelease[]>([]);
 const [pid,setPid]=useState(''),[weekKey,setWeekKey]=useState(''),[product,setProduct]=useState('TODOS'),[machine,setMachine]=useState('TODAS'),[op,setOp]=useState('TODAS'),[shift,setShift]=useState('AMBOS');
 const load=()=>{const ps=read<Program[]>(KEYS.programs,[]);setPrograms(ps);setOrders(read(KEYS.orders,[]));setAllocs(read(KEYS.allocations,[]));setProd(read(KEYS.production,[]));setRels(qread<QualityRelease[]>(QUALITY_KEYS.releases,[]));setPid(p=>p||ps[0]?.id||'')};
 useEffect(()=>{load();window.addEventListener('anclo-operations-updated',load);return()=>window.removeEventListener('anclo-operations-updated',load)},[]);
 const po=useMemo(()=>orders.filter(o=>!pid||o.programId===pid),[orders,pid]);
 const orderIds=useMemo(()=>new Set(po.map(o=>o.id)),[po]);
 const pa=useMemo(()=>allocs.filter(a=>orderIds.has(a.orderId)),[allocs,orderIds]);
 const allocIds=useMemo(()=>new Set(pa.map(a=>a.id)),[pa]);
 const validRels=useMemo(()=>rels.filter(r=>allocIds.has(r.allocationId)&&r.estado!=='ANULADA'&&r.resultado==='PASA'),[rels,allocIds]);
 const allDates=useMemo(()=>validRels.map(r=>dateOnly(r.fechaProduccion||r.fecha)).filter(Boolean),[validRels]);
 const weeks=useMemo<WeekRow[]>(()=>{const keys=new Map<string,WeekRow>(); for(const s of allDates){const m=monday(new Date(`${s}T12:00:00`)),e=addDays(m,6),key=iso(m);keys.set(key,{key,label:`${shortDate(key)} – ${shortDate(iso(e))}`,start:key,end:iso(e)})} const arr=[...keys.values()].sort((a,b)=>b.key.localeCompare(a.key)); if(!arr.length){const m=monday(new Date()),e=addDays(m,6),key=iso(m);arr.push({key,label:`${shortDate(key)} – ${shortDate(iso(e))}`,start:key,end:iso(e)})} return arr},[allDates]);
 useEffect(()=>{if(!weekKey&&weeks[0])setWeekKey(weeks[0].key)},[weeks,weekKey]);
 const selectedWeek=weeks.find(w=>w.key===weekKey)||weeks[0];
 const ctx=useMemo(()=>{const om=new Map(po.map(o=>[o.id,o])),am=new Map(pa.map(a=>[a.id,a]));return {om,am}},[po,pa]);
 const weekRels=useMemo(()=>validRels.filter(r=>{const d=dateOnly(r.fechaProduccion||r.fecha);return selectedWeek&&d>=selectedWeek.start&&d<=selectedWeek.end}),[validRels,selectedWeek]);
 const products=useMemo(()=>[...new Set(weekRels.map(r=>ctx.am.get(r.allocationId)?.producto||ctx.om.get(r.orderId)?.producto||'').filter(Boolean))].sort((a,b)=>a.localeCompare(b,'es')),[weekRels,ctx]);
 const machines=useMemo(()=>[...new Set(weekRels.map(r=>r.maquinaReal||ctx.am.get(r.allocationId)?.maquina||'').filter(Boolean))].sort((a,b)=>a.localeCompare(b,'es')),[weekRels,ctx]);
 const ops=useMemo(()=>[...new Set(weekRels.map(r=>ctx.om.get(r.orderId)?.op||ctx.om.get(r.orderId)?.folioInterno||'').filter(Boolean))].sort((a,b)=>a.localeCompare(b,'es')),[weekRels,ctx]);
 const filtered=useMemo(()=>weekRels.filter(r=>{const a=ctx.am.get(r.allocationId),o=ctx.om.get(r.orderId),p=a?.producto||o?.producto||'',m=r.maquinaReal||a?.maquina||'',oo=o?.op||o?.folioInterno||'';return(product==='TODOS'||p===product)&&(machine==='TODAS'||m===machine)&&(op==='TODAS'||oo===op)&&(shift==='AMBOS'||r.turno===shift)}),[weekRels,ctx,product,machine,op,shift]);
 const summary=useMemo(()=>{const accepted=filtered.reduce((n,r)=>n+(r.piezasAceptadas||0),0),reported=filtered.reduce((n,r)=>n+(r.piezasReportadas||0),0),rejected=filtered.reduce((n,r)=>n+(r.piezasRechazadas||0),0);const ids=new Set(filtered.map(r=>r.allocationId));const target=pa.filter(a=>ids.has(a.id)).reduce((n,a)=>n+realPiecesFor(a),0);const day=filtered.filter(r=>r.turno==='DÍA').reduce((n,r)=>n+(r.piezasAceptadas||0),0),night=filtered.filter(r=>r.turno==='NOCHE').reduce((n,r)=>n+(r.piezasAceptadas||0),0);return {accepted,reported,rejected,target,day,night,compliance:pct(accepted,target),rejectRate:pct(rejected,reported),finished:[...ids].filter(id=>{const a=ctx.am.get(id);return a&&validRels.filter(r=>r.allocationId===id&&dateOnly(r.fechaProduccion||r.fecha)<=selectedWeek.end).reduce((n,r)=>n+(r.piezasAceptadas||0),0)>=realPiecesFor(a)}).length}},[filtered,pa,ctx,validRels,selectedWeek]);
 const daily=useMemo(()=>selectedWeek?Array.from({length:7},(_,i)=>{const d=iso(addDays(new Date(`${selectedWeek.start}T12:00:00`),i));const rr=filtered.filter(r=>dateOnly(r.fechaProduccion||r.fecha)===d);return {d,label:`${dayName(d)} ${shortDate(d)}`,day:rr.filter(r=>r.turno==='DÍA').reduce((n,r)=>n+(r.piezasAceptadas||0),0),night:rr.filter(r=>r.turno==='NOCHE').reduce((n,r)=>n+(r.piezasAceptadas||0),0)}}):[],[selectedWeek,filtered]);
 const byProduct=useMemo(()=>{const m=new Map<string,{product:string,day:number,night:number,accepted:number,rejected:number,target:number}>();for(const r of filtered){const a=ctx.am.get(r.allocationId),o=ctx.om.get(r.orderId),p=a?.producto||o?.producto||'SIN PRODUCTO';const x=m.get(p)||{product:p,day:0,night:0,accepted:0,rejected:0,target:0};x.accepted+=r.piezasAceptadas||0;x.rejected+=r.piezasRechazadas||0;if(r.turno==='DÍA')x.day+=r.piezasAceptadas||0;else x.night+=r.piezasAceptadas||0;m.set(p,x)}for(const x of m.values()){const ids=new Set(filtered.filter(r=>(ctx.am.get(r.allocationId)?.producto||ctx.om.get(r.orderId)?.producto||'SIN PRODUCTO')===x.product).map(r=>r.allocationId));x.target=pa.filter(a=>ids.has(a.id)).reduce((n,a)=>n+realPiecesFor(a),0)}return [...m.values()].sort((a,b)=>b.accepted-a.accepted)},[filtered,ctx,pa]);
 const byMachine=useMemo(()=>{const m=new Map<string,number>();for(const r of filtered){const a=ctx.am.get(r.allocationId),k=r.maquinaReal||a?.maquina||'SIN MÁQUINA';m.set(k,(m.get(k)||0)+(r.piezasAceptadas||0))}return [...m].sort((a,b)=>b[1]-a[1])},[filtered,ctx]);
 const maxDaily=Math.max(1,...daily.flatMap(x=>[x.day,x.night])),maxProd=Math.max(1,...byProduct.map(x=>Math.max(x.day,x.night))),maxMachine=Math.max(1,...byMachine.map(x=>x[1]));
 return <>
  <div className="top"><div><div className="title">KPIs / Informes</div><div className="muted">Producción real liberada por Calidad · comparación semanal por turno, producto y máquina</div></div></div>
  <div className="kpi-filters">
   <label>Programa<select value={pid} onChange={e=>{setPid(e.target.value);setWeekKey('')}}><option value="">Todos</option>{programs.map(p=><option key={p.id} value={p.id}>{p.nombre}</option>)}</select></label>
   <label>Semana<select value={weekKey} onChange={e=>setWeekKey(e.target.value)}>{weeks.map(w=><option key={w.key} value={w.key}>{w.label}</option>)}</select></label>
   <label>Producto<select value={product} onChange={e=>setProduct(e.target.value)}><option>TODOS</option>{products.map(x=><option key={x}>{x}</option>)}</select></label>
   <label>Máquina<select value={machine} onChange={e=>setMachine(e.target.value)}><option>TODAS</option>{machines.map(x=><option key={x}>{x}</option>)}</select></label>
   <label>OP<select value={op} onChange={e=>setOp(e.target.value)}><option>TODAS</option>{ops.map(x=><option key={x}>{x}</option>)}</select></label>
   <label>Turno<select value={shift} onChange={e=>setShift(e.target.value)}><option>AMBOS</option><option>DÍA</option><option>NOCHE</option></select></label>
  </div>
  <div className="kpi-grid-6">
   <div className="card"><div className="muted">Aceptadas semana</div><div className="kpi green">{fmt(summary.accepted)}</div></div>
   <div className="card"><div className="muted">Cumplimiento partidas</div><div className="kpi">{summary.compliance.toFixed(1)}%</div><small>{fmt(summary.accepted)} / {fmt(summary.target)}</small></div>
   <div className="card"><div className="muted">Rechazadas</div><div className="kpi red">{fmt(summary.rejected)}</div><small>{summary.rejectRate.toFixed(2)}% de reportadas</small></div>
   <div className="card"><div className="muted">Turno Día</div><div className="kpi">{fmt(summary.day)}</div></div>
   <div className="card"><div className="muted">Turno Noche</div><div className="kpi">{fmt(summary.night)}</div></div>
   <div className="card"><div className="muted">Partidas terminadas</div><div className="kpi">{summary.finished}</div></div>
  </div>
  {!filtered.length?<div className="empty-state"><b>Sin producción liberada para estos filtros</b><span>Los KPIs se alimentan de las liberaciones válidas de Calidad; no se generan datos ficticios.</span></div>:<>
   <div className="section kpi-two"><div className="card"><h2>Producción diaria · Día vs Noche</h2><div className="legend-inline"><i className="day-dot"/>Día <i className="night-dot"/>Noche</div><div className="week-chart">{daily.map(x=><div className="week-col" key={x.d}><div className="bars"><div className="bar day" style={{height:`${Math.max(x.day?5:0,x.day/maxDaily*150)}px`}} title={`Día: ${fmt(x.day)}`}><span>{x.day?fmt(x.day):''}</span></div><div className="bar night" style={{height:`${Math.max(x.night?5:0,x.night/maxDaily*150)}px`}} title={`Noche: ${fmt(x.night)}`}><span>{x.night?fmt(x.night):''}</span></div></div><small>{x.label}</small></div>)}</div></div>
   <div className="card"><h2>Producción por máquina</h2><div className="hbars">{byMachine.map(([m,v])=><div className="hbar-row" key={m}><b>{m}</b><div><i style={{width:`${v/maxMachine*100}%`}}/></div><span>{fmt(v)}</span></div>)}</div></div></div>
   <div className="section card"><div className="section-title-row"><div><h2>Todos los productos de la semana</h2><div className="muted small">Comparación de piezas aceptadas por turno. Haz clic en un producto para filtrar el tablero.</div></div></div><div className="product-chart">{byProduct.map(x=><button key={x.product} onClick={()=>setProduct(x.product)} className="product-row"><b title={x.product}>{x.product}</b><div className="product-bars"><div><span>Día</span><i className="day" style={{width:`${x.day/maxProd*100}%`}}/><em>{fmt(x.day)}</em></div><div><span>Noche</span><i className="night" style={{width:`${x.night/maxProd*100}%`}}/><em>{fmt(x.night)}</em></div></div><strong>{fmt(x.accepted)} pzas</strong></button>)}</div></div>
   <div className="section card"><h2>Detalle semanal por producto</h2><div className="table-wrap"><table className="compact kpi-table"><thead><tr><th>Producto</th><th>Día</th><th>Noche</th><th>Aceptadas</th><th>Rechazadas</th><th>Meta de partidas</th><th>Cumplimiento</th></tr></thead><tbody>{byProduct.map(x=><tr key={x.product}><td><b>{x.product}</b></td><td>{fmt(x.day)}</td><td>{fmt(x.night)}</td><td>{fmt(x.accepted)}</td><td>{fmt(x.rejected)}</td><td>{fmt(x.target)}</td><td><b>{pct(x.accepted,x.target).toFixed(1)}%</b></td></tr>)}</tbody></table></div></div>
  </>}
  <div className="section card"><h2>OEE</h2><p className="muted">Se mantiene pendiente hasta contar de forma consistente con tiempo programado, paros, ciclo estándar y clasificación de piezas buenas/rechazadas. No se calcula con datos incompletos.</p></div>
 </>
}
