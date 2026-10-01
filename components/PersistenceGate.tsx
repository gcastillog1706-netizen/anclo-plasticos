'use client';
import {useEffect,useRef,useState} from 'react';
import {supabaseBrowser} from '@/lib/supabase';

const PREFIXES=['anclo-'];
const DEVICE_ID_KEY='anclo-device-id-v1';
const LAST_SYNC_KEY='anclo-last-cloud-sync-v1';

type CloudRow={clave:string;valor:any;updated_at?:string};
const isManaged=(k:string)=>PREFIXES.some(p=>k.startsWith(p))&&k!==LAST_SYNC_KEY;

export default function PersistenceGate({children}:{children:React.ReactNode}){
 const [state,setState]=useState<'loading'|'ready'|'error'>('loading');
 const [msg,setMsg]=useState('Conectando almacenamiento permanente…');
 const snapshot=useRef<Record<string,string>>({});
 useEffect(()=>{
  let stopped=false; let timer:any;
  const sb=supabaseBrowser();
  if(!sb){setState('error');setMsg('Faltan NEXT_PUBLIC_SUPABASE_URL o NEXT_PUBLIC_SUPABASE_ANON_KEY. No se habilita captura para evitar pérdida de datos.');return}
  const device=localStorage.getItem(DEVICE_ID_KEY)||crypto.randomUUID();localStorage.setItem(DEVICE_ID_KEY,device);
  const managed=()=>Object.keys(localStorage).filter(isManaged);
  const localMap=()=>Object.fromEntries(managed().map(k=>[k,localStorage.getItem(k)||'']));
  const upsert=async(k:string,raw:string)=>{let value:any;try{value=JSON.parse(raw)}catch{value=raw}const {error}=await sb.from('app_persistencia').upsert({clave:k,valor:value,origen:device,updated_at:new Date().toISOString()},{onConflict:'clave'});if(error)throw error};
  const boot=async()=>{
   const {data,error}=await sb.from('app_persistencia').select('clave,valor,updated_at');
   if(error)throw error;
   const cloud=(data||[]) as CloudRow[];
   const meaningful=(raw:string|null)=>{if(!raw)return false;try{const v=JSON.parse(raw);if(Array.isArray(v))return v.length>0;if(v&&typeof v==='object')return Object.keys(v).length>0;return v!==null&&v!==''}catch{return raw.trim().length>0}};
   if(cloud.length){
    // NUBE AUTORITATIVA EN ARRANQUE. Un navegador parcial JAMÁS sobrescribe la copia de Supabase.
    // Antes de restaurar guardamos una copia local de emergencia por si se requiere auditoría manual.
    const byKey=new Map(cloud.filter(r=>isManaged(r.clave)).map(r=>[r.clave,r]));
    const keys=new Set([...managed(),...byKey.keys()]);
    for(const k of keys){
     const local=localStorage.getItem(k),remote=byKey.get(k);
     if(remote){
      if(meaningful(local)&&local!==JSON.stringify(remote.valor)){
       try{localStorage.setItem(`anclo-recovery-backup-${Date.now()}-${k}`,local!)}catch{}
      }
      localStorage.setItem(k,JSON.stringify(remote.valor));
     }else if(meaningful(local)){
      // Sólo se crea en nube cuando esa clave todavía no existe allí.
      await upsert(k,local!);
     }
    }
   }else{
    // Primera activación: migra automáticamente todo lo que exista en ESTE navegador a Supabase.
    for(const [k,v] of Object.entries(localMap()))if(meaningful(v))await upsert(k,v);
   }
   localStorage.setItem(LAST_SYNC_KEY,new Date().toISOString()); snapshot.current=localMap();
   if(stopped)return; setState('ready');setMsg('Datos protegidos en Supabase');
   timer=setInterval(async()=>{try{const now=localMap();for(const [k,v] of Object.entries(now)){if(snapshot.current[k]!==v)await upsert(k,v)}snapshot.current=now;localStorage.setItem(LAST_SYNC_KEY,new Date().toISOString())}catch(e:any){setMsg('⚠ Error de sincronización: '+(e?.message||'desconocido'))}},800);
  };
  boot().catch((e:any)=>{if(stopped)return;setState('error');setMsg(`Persistencia permanente no disponible: ${e?.message||e}. Ejecuta supabase/2026-09-28_persistencia_permanente_v10_2.sql antes de capturar.`)});
  return()=>{stopped=true;if(timer)clearInterval(timer)};
 },[]);
 if(state==='loading')return <div style={{padding:32,fontFamily:'sans-serif'}}><h2>ANCLO Plásticos</h2><p>{msg}</p><p>No captures datos hasta terminar esta comprobación.</p></div>;
 if(state==='error')return <div style={{padding:32,fontFamily:'sans-serif',maxWidth:900}}><h2>Protección de datos activa</h2><p><b>La aplicación bloqueó la captura para no volver a guardar información únicamente en el navegador.</b></p><p>{msg}</p><p>Ejecuta una sola vez el SQL incluido en el ZIP y vuelve a cargar la página. Este SQL crea una tabla nueva y no borra tablas existentes.</p></div>;
 return <>{children}<div title={msg} style={{position:'fixed',right:10,bottom:8,zIndex:9999,fontSize:11,padding:'5px 8px',borderRadius:12,background:'#e7f4ed',color:'#17643b',border:'1px solid #bddfcb'}}>● Supabase protegido</div></>;
}
