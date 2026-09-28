import {processStandards,ProcessStandard as BaseProcessStandard} from './processCatalog';
export type ProcessStandard=BaseProcessStandard & {activo?:boolean;custom?:boolean};
export const processKey=(r:{herramental:string;maquina:string;producto:string})=>`${r.herramental}||${r.maquina}||${r.producto}`;
const shortMoldId=(s:string)=>s.split('-MOLDE')[0].split('-ESQUINERO')[0].trim();
export type MoldMasterOverride={codigo?:string;descripcion?:string;cavidades?:number|null;activo?:boolean};
export function loadProcessStandards():ProcessStandard[]{
 if(typeof window==='undefined') return processStandards as ProcessStandard[];
 try{
  const overrides=JSON.parse(localStorage.getItem('anclo-process-overrides-v1')||'{}');
  const additions=JSON.parse(localStorage.getItem('anclo-process-additions-v1')||'[]') as ProcessStandard[];
  const moldOverrides=JSON.parse(localStorage.getItem('anclo-mold-master-overrides-v1')||'{}') as Record<string,MoldMasterOverride>;
  const applyMold=(r:ProcessStandard):ProcessStandard=>{
   const originalId=shortMoldId(r.herramental),m=moldOverrides[originalId]; if(!m)return r;
   const codigo=(m.codigo||originalId).trim().toUpperCase();
   const baseDesc=r.herramental.replace(new RegExp(`^${originalId.replace(/[.*+?^${}()|[\]\\]/g,'\\$&')}-?`),'' ).trim().replace(/\s+DE\s+\d+\s+CAVIDADES\s*$/i,'');
   const desc=(m.descripcion??baseDesc).trim();
   const cav=m.cavidades===undefined?r.cavidades:m.cavidades;
   return {...r,herramental:`${codigo}-${desc}${cav?` DE ${cav} CAVIDADES`:''}`,cavidades:cav,activo:m.activo===undefined?r.activo:m.activo};
  };
  return [...processStandards.map(r=>applyMold({...r,...overrides[processKey(r)]})),...additions.map(applyMold)].filter(r=>r.activo!==false) as ProcessStandard[];
 }catch{return processStandards as ProcessStandard[]}
}
export function saveMoldMasterOverride(originalId:string,next:MoldMasterOverride){
 const all=JSON.parse(localStorage.getItem('anclo-mold-master-overrides-v1')||'{}');
 all[originalId]={...(all[originalId]||{}),...next};
 localStorage.setItem('anclo-mold-master-overrides-v1',JSON.stringify(all));
 window.dispatchEvent(new Event('anclo-process-updated'));
}
export function saveProcessOverride(original:ProcessStandard,next:Partial<ProcessStandard>){
 const all=JSON.parse(localStorage.getItem('anclo-process-overrides-v1')||'{}');
 all[processKey(original)]={...(all[processKey(original)]||{}),...next};
 localStorage.setItem('anclo-process-overrides-v1',JSON.stringify(all));
 window.dispatchEvent(new Event('anclo-process-updated'));
}
export function addProcessStandard(row:ProcessStandard){
 const all=JSON.parse(localStorage.getItem('anclo-process-additions-v1')||'[]') as ProcessStandard[];
 all.push({...row,custom:true,activo:true});
 localStorage.setItem('anclo-process-additions-v1',JSON.stringify(all));
 window.dispatchEvent(new Event('anclo-process-updated'));
}
