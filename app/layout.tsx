import './globals.css'; import Sidebar from '@/components/Sidebar';
export const metadata={title:'ANCLO Plásticos',description:'Control de producción de inyección'};
export default function RootLayout({children}:{children:React.ReactNode}){return <html lang="es"><body><div className="shell"><Sidebar/><main className="main">{children}</main></div></body></html>}
