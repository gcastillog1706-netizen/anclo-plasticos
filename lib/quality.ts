export type QualityResult='PASA'|'NO PASA';
export type QualityRelease={
 id:string;productionId:string;allocationId:string;orderId:string;fecha:string;fechaProduccion?:string;horaProduccion?:string;turno?:'DÍA'|'NOCHE';resultado:QualityResult;
 piezasReportadas:number;piezasAceptadas:number;piezasRechazadas:number;operadores:string[];supervisores?:string[];responsable:string;observaciones:string;pdfFolio:string;
 maquinaPlaneada?:string;moldePlaneado?:string;maquinaReal?:string;moldeReal?:string;cavidadesReales?:number|null;cicloReal?:number|null;lote?:string;
 estado?:'ACTIVA'|'ANULADA';revision?:number;actualizadoAt?:string;motivoAnulacion?:string
};
export type TensionSample={numero:number;fuerzaN:number;resultado:'PASA'|'NO PASA';cavidad?:number;observaciones?:string};
export type TensionStudy={id:string;allocationId?:string;orderId?:string;productionId?:string;folio:string;producto:string;productoVercel?:string;destino?:'SUCURSAL'|'HOME DEPOT';color?:'Transparente'|'Negro';lote:string;maquina:string;molde:string;cavidades:number;cantidad:number;virgenPct:number;molidoPct:number;operadores:string[];coordinador:string;fecha:string;fechaFabricacion?:string;semanaProduccion?:number;fuerzaMinN:number;fuerzaKgf?:number;tamanoNominalMm?:number;largoAMm?:number;anchoBMm?:number;espesorCMm?:number;diametroAtadoEMm?:number;codigoMuestreo?:string;tamanoMuestra?:number;aceptar?:number;rechazar?:number;bolsas?:string;muestras:TensionSample[];estado:'EN CAPTURA'|'TERMINADO';observaciones:string};
export const QUALITY_KEYS={releases:'anclo-quality-releases-v1',tension:'anclo-tension-studies-v1'};
export const qread=<T,>(key:string,fallback:T):T=>{if(typeof window==='undefined')return fallback;try{return JSON.parse(localStorage.getItem(key)||'') as T}catch{return fallback}};
export const qwrite=(key:string,value:unknown)=>{localStorage.setItem(key,JSON.stringify(value));window.dispatchEvent(new Event('anclo-operations-updated'))};
export const acceptedForAllocation=(allocationId:string,releases:QualityRelease[])=>releases.filter(r=>r.allocationId===allocationId&&r.resultado==='PASA'&&r.estado!=='ANULADA').reduce((n,r)=>n+(r.piezasAceptadas||0),0);
export const qualityPdfLines=(r:QualityRelease,ctx?:{producto?:string;op?:string})=>[
 `Folio: ${r.pdfFolio}${(r.revision||0)>0?` · Rev. ${String(r.revision).padStart(2,'0')}`:''}`,
 `Fecha liberación: ${new Date(r.fecha).toLocaleString('es-MX')}`,
 `Fecha producción: ${r.fechaProduccion||'--'} ${r.horaProduccion||'--'} · Turno: ${r.turno||'--'}`,
 `Resultado: ${r.estado==='ANULADA'?'ANULADA':r.resultado}`,
 `OP / Folio: ${ctx?.op||'--'}`,
 `Producto: ${ctx?.producto||'--'}`,
 `Máquina planeada: ${r.maquinaPlaneada||'--'} · Máquina real: ${r.maquinaReal||r.maquinaPlaneada||'--'}`,
 `Molde planeado: ${r.moldePlaneado||'--'} · Molde real: ${r.moldeReal||r.moldePlaneado||'--'}`,
 `Cavidades reales: ${r.cavidadesReales??'--'} · Ciclo real: ${r.cicloReal??'--'} s`,
 `Lote: ${r.lote||'--'}`,
 `Piezas reportadas: ${r.piezasReportadas}`,
 `Piezas aceptadas: ${r.piezasAceptadas}`,
 `Piezas rechazadas: ${r.piezasRechazadas}`,
 `Operadores: ${r.operadores.join(', ')||'--'}`,
 `Supervisores: ${(r.supervisores||[]).join(', ')||'--'}`,
 `Responsable: ${r.responsable}`,
 `Observaciones: ${r.observaciones||'--'}`,
 ...(r.estado==='ANULADA'?[`Motivo anulación: ${r.motivoAnulacion||'--'}`]:[])
];

export const TENSION_SPECS:Record<string,{nominal:number;largo:number;ancho:number;espesor:number;diametro:number;kgf:number;n:number}>={
 '100':{nominal:100,largo:102,ancho:3.6,espesor:1.2,diametro:22,kgf:18,n:176.52},'140':{nominal:140,largo:152,ancho:3.6,espesor:1.2,diametro:32,kgf:18,n:176.52},'200':{nominal:200,largo:203,ancho:3.6,espesor:1.2,diametro:51,kgf:18,n:176.52},'180':{nominal:180,largo:178,ancho:4.8,espesor:1.4,diametro:44,kgf:22.5,n:220.65},'300':{nominal:300,largo:292,ancho:4.8,espesor:1.4,diametro:76,kgf:22.5,n:220.65},'370':{nominal:370,largo:368,ancho:4.8,espesor:1.4,diametro:102,kgf:22.5,n:220.65},};
export const tensionIdentity=(key:string)=>{const k=(key||'').trim().toUpperCase().replace(/\s+/g,' ');const size=(k.match(/(?:ACT|ACN)\s*([0-9]{3})/)||[])[1]||'';const destino:'SUCURSAL'|'HOME DEPOT'= /\bPRO\s*A\s*$/.test(k)?'HOME DEPOT':'SUCURSAL';const color:'Transparente'|'Negro'=k.includes('ACT')?'Transparente':'Negro';return {size,destino,color,spec:TENSION_SPECS[size],familia:size?`ACT/ACN ${size} PRO`:k};};
export const samplingPlan=(qty:number)=>{const plans=[{min:1000,max:1200,codigo:'J',muestra:80,bolsas:'1 bolsa (100 pzas)',aceptar:5,rechazar:6},{min:1201,max:3200,codigo:'K',muestra:125,bolsas:'1–2 bolsas',aceptar:7,rechazar:8},{min:3201,max:8000,codigo:'L',muestra:200,bolsas:'2 bolsas',aceptar:10,rechazar:11},{min:8001,max:15000,codigo:'M',muestra:315,bolsas:'3–4 bolsas',aceptar:14,rechazar:15},{min:15001,max:20000,codigo:'N',muestra:500,bolsas:'5 bolsas',aceptar:21,rechazar:22}];if(qty<1000)return plans[0];if(qty>20000)return plans[plans.length-1];return plans.find(p=>qty>=p.min&&qty<=p.max)||plans[0];};
