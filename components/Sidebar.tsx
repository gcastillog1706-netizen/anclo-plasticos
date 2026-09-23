import Link from 'next/link';
const links=[['/','Inicio / Plano'],['/solicitudes','Solicitudes / Liberación'],['/planeacion','Planeación'],['/produccion','Producción Día / Noche'],['/concentrado','Concentrado diario'],['/moldes','Moldes / Herramientas'],['/materiales','Materiales / Lotes']];
export default function Sidebar(){return <aside className="sidebar"><div className="brand">ANCLO PLÁSTICOS</div><div className="sub">Control de producción</div><nav className="nav">{links.map(([h,l])=><Link key={h} href={h}>{l}</Link>)}</nav></aside>}
