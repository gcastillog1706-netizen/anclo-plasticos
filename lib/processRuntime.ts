import {processStandards} from './processCatalog';
export type ProcessStandard=(typeof processStandards)[number] & {activo?:boolean};
export const processKey=(r:{herramental:string;maquina:string;producto:string})=>`${r.herramental}||${r.maquina}||${r.producto}`;
export function loadProcessStandards():ProcessStandard[]{
 if(typeof window==='undefined') return processStandards as ProcessStandard[];
 try{
  const overrides=JSON.parse(localStorage.getItem('anclo-process-overrides-v1')||'{}');
  return processStandards.map(r=>({...r,...overrides[processKey(r)]})).filter(r=>r.activo!==false) as ProcessStandard[];
 }catch{return processStandards as ProcessStandard[]}
}
export function saveProcessOverride(original:ProcessStandard,next:Partial<ProcessStandard>){
 const all=JSON.parse(localStorage.getItem('anclo-process-overrides-v1')||'{}');
 all[processKey(original)]={...(all[processKey(original)]||{}),...next};
 localStorage.setItem('anclo-process-overrides-v1',JSON.stringify(all));
 window.dispatchEvent(new Event('anclo-process-updated'));
}
