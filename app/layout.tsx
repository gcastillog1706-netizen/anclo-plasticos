import './globals.css'; import Sidebar from '@/components/Sidebar'; import PersistenceGate from '@/components/PersistenceGate'; import PwaRegister from '@/components/PwaRegister';
export const metadata={title:'ANCLO Plásticos',description:'Producción y Calidad de inyección',manifest:'/manifest.webmanifest',themeColor:'#173b4d'};
export default function RootLayout({children}:{children:React.ReactNode}){return <html lang="es"><body><PersistenceGate><div className="shell"><PwaRegister/><Sidebar/><main className="main">{children}</main></div></PersistenceGate></body></html>}
