export type ProgramaRow={
 id?:string; maquina:string; producto:string; op:string; cantidad:number|null; estatus:string;
 molde?:string; fecha?:string; turno?:string; prioridad?:string; observaciones?:string;
 material_virgen?:string; virgen_kg?:number|null; lote_virgen?:string;
 reciclado?:string; reciclado_kg?:number|null; lote_reciclado?:string;
 pigmento?:string; pigmento_kg?:number|null; lote_pigmento?:string;
};
export const seedPrograma:ProgramaRow[]=[
{maquina:'IP-035',producto:'HS01',op:'',cantidad:900,estatus:'TERMINADO'},{maquina:'IP-035',producto:'PCC01-PCC04',op:'',cantidad:null,estatus:'SE MONTA HOY'},{maquina:'IP-035',producto:'PCC01-PCC04 UL',op:'',cantidad:null,estatus:'EN PROCESO'},{maquina:'IP-035',producto:'GRAPA',op:'',cantidad:null,estatus:'TERMINADO'},
{maquina:'IP-039',producto:'ACT370-4PRO',op:'',cantidad:360,estatus:'EN PROCESO'},{maquina:'IP-039',producto:'ACN370-4PRO',op:'',cantidad:460,estatus:'PENDIENTE'},{maquina:'IP-039',producto:'SACN370-4PROA',op:'',cantidad:180,estatus:'PENDIENTE'},
{maquina:'EP-038',producto:'CGN34T',op:'',cantidad:6450,estatus:'INCIDENCIA / REPARACION'},{maquina:'EP-038',producto:'CGN12T',op:'',cantidad:4400,estatus:'INCIDENCIA / REPARACION'},
{maquina:'EP-048',producto:'AG14',op:'',cantidad:1570000,estatus:'EN PROCESO'},{maquina:'EP-041',producto:'FD1A',op:'',cantidad:4800,estatus:'TERMINADO'},
{maquina:'IP-002',producto:'DE10',op:'',cantidad:null,estatus:'SIN MATERIAL'},{maquina:'IP-002',producto:'DE23',op:'',cantidad:null,estatus:'SE MONTA HOY'},
{maquina:'IP-005',producto:'HLR34S',op:'',cantidad:null,estatus:'TERMINADO'},{maquina:'IP-005',producto:'HLR34E',op:'',cantidad:null,estatus:'SIN MATERIAL'},
{maquina:'IP-006',producto:'CTH',op:'',cantidad:20000,estatus:'EN PROCESO'},{maquina:'EP-007',producto:'HLR200E',op:'',cantidad:1000,estatus:'PENDIENTE'},
{maquina:'EP-010',producto:'HLR114',op:'',cantidad:10000,estatus:'TERMINADO'},{maquina:'EP-011',producto:'HLR100 S Y E',op:'',cantidad:15000,estatus:'EN PROCESO'},
{maquina:'EP-008',producto:'HLR400 S',op:'',cantidad:200,estatus:'TERMINADO'},{maquina:'IP-032',producto:'AG14',op:'',cantidad:500000,estatus:'EN PROCESO'},{maquina:'IP-001',producto:'FE3412',op:'',cantidad:200,estatus:'SE MONTA HOY'}];
export const estadoClase=(e:string)=>{e=e.toUpperCase();if(e.includes('PROCESO'))return 'ok';if(e.includes('INCID')||e.includes('REPAR')||e.includes('SIN MATERIAL'))return 'bad';if(e.includes('MONTA')||e.includes('PEND'))return 'warn';if(e.includes('TERMIN'))return 'done';return 'neutral'};
