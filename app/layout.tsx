import './globals.css'; import Sidebar from '@/components/Sidebar'; import PersistenceGate from '@/components/PersistenceGate';
export const metadata={title:'ANCLO Plásticos',description:'Control de producción de inyección'};
export default function RootLayout({children}:{children:React.ReactNode}){return <html lang="es"><body><PersistenceGate><div className="shell"><Sidebar/><main className="main">{children}</main></div></PersistenceGate></body></html>}
