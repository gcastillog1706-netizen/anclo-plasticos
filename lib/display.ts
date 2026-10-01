import {processStandards} from './processCatalog';
import type {Allocation,Production} from './operations';
import type {QualityRelease} from './quality';

const norm=(v:string)=>(v||'').toUpperCase().trim().replace(/\s+/g,' ');
const cinchoProducts=new Set(processStandards.filter(s=>/CINCHO PARA CABLE/i.test(s.componente||'')||/MOLDE CINCHO/i.test(s.herramental||'')).map(s=>norm(s.producto)).filter(Boolean));
export const isCincho=(product?:string)=>cinchoProducts.has(norm(product||''))||/^(ACN|ACT)\d/i.test(norm(product||''));
export const naturalCompare=(a:string,b:string)=>a.localeCompare(b,'es',{numeric:true,sensitivity:'base'});
export const bags=(pieces:number)=>pieces/100;
export const unitLabel=(product?:string)=>isCincho(product)?'bolsas':'pzas';
export const displayQty=(pieces:number,product?:string)=>isCincho(product)?bags(pieces):pieces;
export const fmtQty=(pieces:number,product?:string)=>`${displayQty(pieces,product).toLocaleString('es-MX',{maximumFractionDigits:2})} ${unitLabel(product)}`;
// Registros históricos de cinchos (sin unidadCaptura) se capturaron en cientos/bolsas.
// Los nuevos registros guardan piezas reales y unidadCaptura='BOLSAS'.
export const releasePieces=(r:QualityRelease,value:number,product?:string)=>isCincho(product)&&!r.unidadCaptura?value*100:value;
export const productionPieces=(p:Production,value:number,product?:string)=>isCincho(product)&&!p.unidadCaptura?value*100:value;
export const inputToPieces=(value:number,product?:string)=>isCincho(product)?value*100:value;
export const targetPieces=(a:Allocation)=>a.unidadCantidad==='CIENTOS'?(a.cantidad||0)*100:(a.cantidad||0);
