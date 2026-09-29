'use client';
const esc=(s:string)=>s.replace(/\\/g,'\\\\').replace(/\(/g,'\\(').replace(/\)/g,'\\)').replace(/[^\x20-\x7E]/g,'?');
export function downloadSimplePdf(filename:string,title:string,lines:string[]){
 const content=['BT','/F1 16 Tf','50 790 Td',`(${esc(title)}) Tj`,'/F1 10 Tf',...lines.flatMap((x,i)=>['0 -22 Td',`(${esc(x)}) Tj`]),'ET'].join('\n');
 const objs=[`<< /Type /Catalog /Pages 2 0 R >>`,`<< /Type /Pages /Kids [3 0 R] /Count 1 >>`,`<< /Type /Page /Parent 2 0 R /MediaBox [0 0 612 842] /Resources << /Font << /F1 5 0 R >> >> /Contents 4 0 R >>`,`<< /Length ${content.length} >>\nstream\n${content}\nendstream`,`<< /Type /Font /Subtype /Type1 /BaseFont /Helvetica >>`];
 let pdf='%PDF-1.4\n',offsets=[0];objs.forEach((o,i)=>{offsets.push(pdf.length);pdf+=`${i+1} 0 obj\n${o}\nendobj\n`});const xref=pdf.length;pdf+=`xref\n0 ${objs.length+1}\n0000000000 65535 f \n`;for(let i=1;i<offsets.length;i++)pdf+=`${String(offsets[i]).padStart(10,'0')} 00000 n \n`;pdf+=`trailer\n<< /Size ${objs.length+1} /Root 1 0 R >>\nstartxref\n${xref}\n%%EOF`;
 const blob=new Blob([pdf],{type:'application/pdf'}),url=URL.createObjectURL(blob),a=document.createElement('a');a.href=url;a.download=filename;a.click();setTimeout(()=>URL.revokeObjectURL(url),1000);
}
