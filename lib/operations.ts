export type ProgramType='SEMANAL'|'QUINCENAL';
export type Program={id:string;nombre:string;tipo:ProgramType;fechaRecibido:string;fechaInicio:string;fechaFin:string;estado:'BORRADOR'|'LIBERADO'|'EN EJECUCIÓN'|'CERRADO';liberadoAt?:string;actualizadoAt?:string;revision?:number};
export type ProgramRevision={id:string;programId:string;numero:number;tipo:'LIBERACION'|'REPROGRAMACION';fecha:string;orders:Order[];allocations:Allocation[]};
export type OrderType='OFICIAL'|'INTERNA';
export type Order={id:string;programId:string;folioInterno:string;tipoOrden:OrderType;op:string;motivoSinOp:string;producto:string;cantidad:number|null;fechaCompromiso:string;virgenKg:number|null;loteVirgen:string;recicladoKg:number|null;loteReciclado:string;pigmento:string;pigmentoKg:number|null;lotePigmento:string};
export type Allocation={id:string;orderId:string;semana:number;producto:string;molde:string;moldeDescripcion:string;maquina:string;cantidad:number|null;ciclo:number|null;cavidades:number|null;pzCiclo:number|null;secuencia:number;inicioDeseado?:string;unidadCantidad?:'PIEZAS'|'CIENTOS'};
export type Production={id:string;allocationId:string;orderId:string;fecha:string;turno:'DÍA'|'NOCHE';operadores:string;supervisores?:string;kg:number|null;piezas:number|null;ciclo:number|null;cavidades:number|null;merma:number|null;purga:number|null;horas:number|null;resultado:'PRODUJO'|'NO PRODUJO';motivo:string;comentario:string;maquinaReal?:string;moldeReal?:string;lote?:string};
export const KEYS={programs:'anclo-programs-v10',orders:'anclo-orders-v10',allocations:'anclo-allocations-v10',production:'anclo-production-v10',revisions:'anclo-program-revisions-v1'};
export const read=<T,>(key:string,fallback:T):T=>{if(typeof window==='undefined')return fallback;try{return JSON.parse(localStorage.getItem(key)||'') as T}catch{return fallback}};
export const write=(key:string,value:unknown)=>{localStorage.setItem(key,JSON.stringify(value));window.dispatchEvent(new Event('anclo-operations-updated'))};
export const isoWeek=(date:string)=>{const d=new Date(`${date}T12:00:00Z`);const day=d.getUTCDay()||7;d.setUTCDate(d.getUTCDate()+4-day);const y0=new Date(Date.UTC(d.getUTCFullYear(),0,1));return Math.ceil((((d.getTime()-y0.getTime())/86400000)+1)/7)};

export const nextInternalFolio=(orders:Order[],year=new Date().getFullYear())=>{const prefix=`INT-${year}-`;const nums=orders.map(o=>o.folioInterno||'').filter(x=>x.startsWith(prefix)).map(x=>Number(x.slice(prefix.length))).filter(Number.isFinite);return `${prefix}${String((nums.length?Math.max(...nums):0)+1).padStart(4,'0')}`};
export const orderDisplay=(o:Order)=>o.op?.trim()?`${o.folioInterno} · ${o.op.trim()}`:o.folioInterno;

export type ScheduleRow={allocationId:string;machine:string;start:string;end:string;hours:number;pzh:number;requestedStart?:string;adjusted:boolean;sharedRun?:boolean;runKey?:string};
export const capacityFor=(a:Allocation)=>a.ciclo&&a.pzCiclo?Math.floor((3600/a.ciclo)*a.pzCiclo):0;
// En Planeación, los cinchos se capturan en cientos. La cantidad almacenada se
// conserva tal como la captura el usuario; para capacidad/tiempo se convierte a piezas reales.
export const realPiecesFor=(a:Allocation)=>{const qty=a.cantidad||0;return a.unidadCantidad==='CIENTOS'?qty*100:qty};

// Los HLR pueden tener dos componentes del mismo molde (Sello / Empaque) que se
// producen en el mismo ciclo. Esta función identifica únicamente parejas HLR S/E;
// no convierte automáticamente cualquier producto del mismo molde en una corrida compartida.
const hlrComponent=(producto:string)=>{
 const raw=(producto||'').toUpperCase().trim().replace(/\s+/g,' ');
 if(!raw.startsWith('HLR'))return null;
 if(/(?:-|\s)S$/.test(raw)||/S$/.test(raw))return {base:raw.replace(/(?:-|\s)?S$/,'').replace(/[\s-]+$/,''),component:'S'};
 if(/(?:-|\s)E$/.test(raw)||/E$/.test(raw))return {base:raw.replace(/(?:-|\s)?E$/,'').replace(/[\s-]+$/,''),component:'E'};
 return null;
};
const sharedHlrKey=(a:Allocation)=>{const h=hlrComponent(a.producto);return h&&a.maquina&&a.molde?`${a.maquina}||${a.molde}||${h.base}||${a.semana}`:null};

export const scheduleAllocations=(allocations:Allocation[],program?:Program|null):ScheduleRow[]=>{
 const base=new Date(`${program?.fechaInicio||new Date().toISOString().slice(0,10)}T00:00:00`);
 const queues=new Map<string,Date>(); const out:ScheduleRow[]=[];
 const sorted=[...allocations].sort((a,b)=>(a.semana-b.semana)||(a.secuencia-b.secuencia));
 const handled=new Set<string>();
 for(const a of sorted){
  if(handled.has(a.id)||!a.maquina)continue;
  const pzh=capacityFor(a); if(!pzh||!a.cantidad)continue;
  const weekOffset=Math.max(0,(a.semana-isoWeek(program?.fechaInicio||new Date().toISOString().slice(0,10)))*7);
  const desired=a.inicioDeseado?new Date(a.inicioDeseado):new Date(base); if(!a.inicioDeseado) desired.setDate(desired.getDate()+weekOffset);
  const key=sharedHlrKey(a);
  const h=hlrComponent(a.producto);
  const partners=key&&h?sorted.filter(x=>x.id!==a.id&&!handled.has(x.id)&&sharedHlrKey(x)===key&&hlrComponent(x.producto)?.component!==h.component&&capacityFor(x)>0&&!!x.cantidad):[];
  const group=[a,...partners];
  const q=queues.get(a.maquina); const start=q&&q>desired?new Date(q):desired;
  let machineEnd=start;
  for(const g of group){
   const gpzh=capacityFor(g); if(!gpzh||!g.cantidad)continue;
   const hours=realPiecesFor(g)/gpzh;
   const end=new Date(start.getTime()+hours*3600000);
   if(end>machineEnd)machineEnd=end;
   out.push({allocationId:g.id,machine:g.maquina,start:start.toISOString(),end:end.toISOString(),hours,pzh:gpzh,requestedStart:g.inicioDeseado,adjusted:!!(g.inicioDeseado&&start.getTime()>new Date(g.inicioDeseado).getTime()),sharedRun:group.length>1,runKey:key||undefined});
   handled.add(g.id);
  }
  queues.set(a.maquina,machineEnd);
 }
 return out;
};
