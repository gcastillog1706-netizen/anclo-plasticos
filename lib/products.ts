import {loadProcessStandards} from './processRuntime';
export type ProductMaster={clave:string;descripcion:string;familia:string;unidad:string;requiereTension:boolean;activo:boolean;custom?:boolean};
const KEY='anclo-product-master-v1';
const norm=(s:string)=>(s||'').trim().toUpperCase().replace(/\s+/g,' ');
const family=(k:string)=>{const x=norm(k);if(x.startsWith('HLR'))return 'HLR';if(/ACN|ACT|PCC|CGN/.test(x))return 'CINCHO / COMPONENTE';return 'GENERAL'};
export function loadProducts():ProductMaster[]{
 const base=new Map<string,ProductMaster>();
 for(const r of loadProcessStandards()){
  const clave=norm(r.producto); if(!clave)continue;
  const old=base.get(clave); const desc=norm(r.componente)||clave;
  base.set(clave,old||{clave,descripcion:desc,familia:family(clave),unidad:'PZA',requiereTension:/ACN|ACT|PCC|CGN/.test(clave),activo:true});
 }
 if(typeof window==='undefined')return [...base.values()].sort((a,b)=>a.clave.localeCompare(b.clave,'es',{numeric:true}));
 try{const saved=JSON.parse(localStorage.getItem(KEY)||'[]') as ProductMaster[];for(const p of saved)base.set(norm(p.clave),{...p,clave:norm(p.clave)});}catch{}
 return [...base.values()].sort((a,b)=>a.clave.localeCompare(b.clave,'es',{numeric:true}));
}
export function saveProduct(p:ProductMaster,originalKey?:string){
 const all=loadProducts(); const old=norm(originalKey||p.clave); const next={...p,clave:norm(p.clave),descripcion:norm(p.descripcion)};
 const clean=all.filter(x=>norm(x.clave)!==old&&norm(x.clave)!==next.clave); clean.push(next);
 localStorage.setItem(KEY,JSON.stringify(clean)); window.dispatchEvent(new Event('anclo-products-updated'));
}
export function activeProducts(){return loadProducts().filter(x=>x.activo)}
