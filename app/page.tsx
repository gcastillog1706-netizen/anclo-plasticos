import PlantFloor from '@/components/PlantFloor';
import { supabaseClient } from '@/lib/supabase';

export const dynamic = 'force-dynamic';

export default async function Home(){
  const supabase = supabaseClient();
  let machines:any[] = [];
  let errorMessage = '';
  if (supabase) {
    const { data, error } = await supabase.from('maquinas').select('*').eq('activa', true).order('numero_maquina');
    machines = data ?? [];
    if (error) errorMessage = error.message;
  } else errorMessage = 'Faltan las variables de Supabase.';

  const producing = machines.filter(m=>m.estado==='PRODUCIENDO').length;
  const idle = machines.filter(m=>m.estado==='SIN_PROGRAMA').length;
  const stopped = machines.filter(m=>['PARADA','MANTENIMIENTO'].includes(m.estado)).length;

  return <>
    <div className="top"><div><div className="title">Control de producción</div><div className="muted">Vista general de inyección · operación en planta</div></div><div className="live-badge">● DATOS SUPABASE</div></div>
    <div className="grid">
      <div className="card"><div className="muted">Máquinas registradas</div><div className="kpi">{machines.length}</div></div>
      <div className="card"><div className="muted">Produciendo</div><div className="kpi green">{producing}</div></div>
      <div className="card"><div className="muted">Sin programa</div><div className="kpi amber">{idle}</div></div>
      <div className="card"><div className="muted">Parada / mantenimiento</div><div className="kpi red">{stopped}</div></div>
    </div>
    {errorMessage ? <div className="warning"><b>No fue posible leer las máquinas.</b> {errorMessage}<br/>Ejecuta la política de lectura incluida en <code>supabase/politicas_lectura.sql</code>.</div> : null}
    <section className="section"><PlantFloor machines={machines}/></section>
  </>
}
