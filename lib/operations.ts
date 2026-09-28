export type ProgramType='SEMANAL'|'QUINCENAL';
export type Program={id:string;nombre:string;tipo:ProgramType;fechaRecibido:string;fechaInicio:string;fechaFin:string;estado:'BORRADOR'|'LIBERADO'|'EN EJECUCIÓN'|'CERRADO'};
export type Order={id:string;programId:string;op:string;producto:string;cantidad:number|null;fechaCompromiso:string;virgenKg:number|null;loteVirgen:string;recicladoKg:number|null;loteReciclado:string;pigmento:string;pigmentoKg:number|null;lotePigmento:string};
export type Allocation={id:string;orderId:string;semana:number;molde:string;maquina:string;cantidad:number|null;ciclo:number|null;cavidades:number|null;pzCiclo:number|null;secuencia:number};
export type Production={id:string;allocationId:string;orderId:string;fecha:string;turno:'DÍA'|'NOCHE';operadores:string;kg:number|null;piezas:number|null;ciclo:number|null;cavidades:number|null;merma:number|null;purga:number|null;horas:number|null;resultado:'PRODUJO'|'NO PRODUJO';motivo:string;comentario:string};
export const KEYS={programs:'anclo-programs-v10',orders:'anclo-orders-v10',allocations:'anclo-allocations-v10',production:'anclo-production-v10'};
export const read=<T,>(key:string,fallback:T):T=>{if(typeof window==='undefined')return fallback;try{return JSON.parse(localStorage.getItem(key)||'') as T}catch{return fallback}};
export const write=(key:string,value:unknown)=>{localStorage.setItem(key,JSON.stringify(value));window.dispatchEvent(new Event('anclo-operations-updated'))};
export const isoWeek=(date:string)=>{const d=new Date(`${date}T12:00:00Z`);const day=d.getUTCDay()||7;d.setUTCDate(d.getUTCDate()+4-day);const y0=new Date(Date.UTC(d.getUTCFullYear(),0,1));return Math.ceil((((d.getTime()-y0.getTime())/86400000)+1)/7)};
