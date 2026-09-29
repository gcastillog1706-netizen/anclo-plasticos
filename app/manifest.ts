import type { MetadataRoute } from 'next';
export default function manifest(): MetadataRoute.Manifest {
  return {
    name:'ANCLO Plásticos - Control de producción', short_name:'ANCLO Plásticos',
    description:'Planeación, monitoreo y producción de ANCLO Plásticos',
    start_url:'/', display:'standalone', background_color:'#f2f0e9', theme_color:'#243237',
    orientation:'any',
    icons:[{src:'/icon.svg',sizes:'any',type:'image/svg+xml',purpose:'any'}]
  };
}
