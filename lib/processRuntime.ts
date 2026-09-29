import {processStandards,ProcessStandard as BaseProcessStandard} from './processCatalog';
export type ProcessStandard=BaseProcessStandard & {activo?:boolean;custom?:boolean;__sourceKey?:string};
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
  return [...processStandards.map(r=>{const sourceKey=processKey(r);return applyMold({...r,...overrides[sourceKey],__sourceKey:sourceKey})}),...additions.map(r=>applyMold({...r,__sourceKey:processKey(r)}))].filter(r=>r.activo!==false) as ProcessStandard[];
 }catch{return processStandards as ProcessStandard[]}
}
export function saveMoldMasterOverride(originalId:string,next:MoldMasterOverride){
 const all=JSON.parse(localStorage.getItem('anclo-mold-master-overrides-v1')||'{}');
 all[originalId]={...(all[originalId]||{}),...next};
 localStorage.setItem('anclo-mold-master-overrides-v1',JSON.stringify(all));
 window.dispatchEvent(new Event('anclo-process-updated'));
}
export function saveProcessOverride(original:ProcessStandard,next:Partial<ProcessStandard>){
 // IMPORTANTE: nunca usamos campos editables como identidad persistente.
 // Los registros base conservan su clave de origen; los personalizados se reemplazan
 // dentro de additions. Así cambiar máquina/producto no rompe el guardado.
 if(original.custom){
  const additions=JSON.parse(localStorage.getItem('anclo-process-additions-v1')||'[]') as ProcessStandard[];
  const originalKey=original.__sourceKey||processKey(original);
  const idx=additions.findIndex(x=>processKey(x)===originalKey);
  if(idx>=0){
   additions[idx]={...additions[idx],...next,custom:true,activo:next.activo===undefined?additions[idx].activo:next.activo};
   localStorage.setItem('anclo-process-additions-v1',JSON.stringify(additions));
  }else{
   // Compatibilidad con registros personalizados antiguos que no tenían identidad estable.
   const fallback=additions.findIndex(x=>x.herramental===original.herramental&&x.maquina===original.maquina&&x.producto===original.producto);
   if(fallback>=0){additions[fallback]={...additions[fallback],...next,custom:true};localStorage.setItem('anclo-process-additions-v1',JSON.stringify(additions));}
   else throw new Error('No se encontró el proceso personalizado original para actualizarlo.');
  }
 }else{
  const all=JSON.parse(localStorage.getItem('anclo-process-overrides-v1')||'{}');
  const sourceKey=original.__sourceKey||processKey(original);
  all[sourceKey]={...(all[sourceKey]||{}),...next};
  localStorage.setItem('anclo-process-overrides-v1',JSON.stringify(all));
 }
 window.dispatchEvent(new Event('anclo-process-updated'));
}
export function addProcessStandard(row:ProcessStandard){
 const all=JSON.parse(localStorage.getItem('anclo-process-additions-v1')||'[]') as ProcessStandard[];
 all.push({...row,custom:true,activo:true});
 localStorage.setItem('anclo-process-additions-v1',JSON.stringify(all));
 window.dispatchEvent(new Event('anclo-process-updated'));
}

export function deleteProcessStandard(row:ProcessStandard){
 if(row.custom){
  const all=JSON.parse(localStorage.getItem('anclo-process-additions-v1')||'[]') as ProcessStandard[];
  localStorage.setItem('anclo-process-additions-v1',JSON.stringify(all.filter(x=>processKey(x)!==processKey(row))));
 }else saveProcessOverride(row,{activo:false});
 window.dispatchEvent(new Event('anclo-process-updated'));
}
