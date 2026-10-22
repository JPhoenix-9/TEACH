import {attendanceMonths,buildPrintReport} from "./model.mjs";

const titles={attendance:"Attendance record","attendance-notes":"Attendance and notes",notes:"Notes record"};
const xml=value=>String(value).replace(/[\x00-\x08\x0b\x0c\x0e-\x1f]/g,"").replace(/[&<>"']/g,char=>({"&":"&amp;","<":"&lt;",">":"&gt;",'"':"&quot;","'":"&apos;"}[char]));
const copyright=()=>`© ${new Date().getFullYear()} TEACH · Higher Ground Publishing`;
export function selectedRecordExport(records,children,report,preview=true){
  return {preview,format:"TEACH Planner records",version:1,copyright:copyright(),dateRange:{from:report.start,through:report.end},content:report.content,scope:report.scope,...buildPrintReport(records,children,report.scope,report.start,report.end,report.content)};
}
export function exportFilename(report,extension){return `TEACH-${report.content}-${report.scope}-${report.start}-to-${report.end}.${extension}`;}

// Uncompressed ZIP packages keep document creation local, without sending family records elsewhere.
function zip(files){
  const encode=new TextEncoder(),chunks=[],directory=[];let offset=0;
  const crc=bytes=>{let n=0xffffffff;for(const b of bytes){n^=b;for(let i=0;i<8;i++)n=(n>>>1)^((n&1)?0xedb88320:0);}return (n^0xffffffff)>>>0;};
  const header=(size,write)=>{const bytes=new Uint8Array(size);write(new DataView(bytes.buffer));return bytes;};
  for(const [path,text] of Object.entries(files)){
    const name=encode.encode(path),body=encode.encode(text),checksum=crc(body);
    const local=header(30,v=>{v.setUint32(0,0x04034b50,true);v.setUint16(4,20,true);v.setUint16(10,0,true);v.setUint16(12,33,true);v.setUint32(14,checksum,true);v.setUint32(18,body.length,true);v.setUint32(22,body.length,true);v.setUint16(26,name.length,true);});
    const central=header(46,v=>{v.setUint32(0,0x02014b50,true);v.setUint16(4,20,true);v.setUint16(6,20,true);v.setUint16(14,33,true);v.setUint32(16,checksum,true);v.setUint32(20,body.length,true);v.setUint32(24,body.length,true);v.setUint16(28,name.length,true);v.setUint32(42,offset,true);});
    chunks.push(local,name,body);directory.push(central,name);offset+=local.length+name.length+body.length;
  }
  const directoryLength=directory.reduce((n,b)=>n+b.length,0),count=Object.keys(files).length;
  const end=header(22,v=>{v.setUint32(0,0x06054b50,true);v.setUint16(8,count,true);v.setUint16(10,count,true);v.setUint32(12,directoryLength,true);v.setUint32(16,offset,true);});
  const all=[...chunks,...directory,end],result=new Uint8Array(offset+directoryLength+end.length);let at=0;for(const bytes of all){result.set(bytes,at);at+=bytes.length;}return result;
}

export function wordDocument(data){
  const run=(text,bold=false,size=20)=>`<w:r><w:rPr><w:rFonts w:ascii="Arial" w:hAnsi="Arial"/><w:color w:val="000000"/>${bold?"<w:b/>":""}<w:sz w:val="${size}"/></w:rPr><w:t xml:space="preserve">${xml(text)}</w:t></w:r>`;
  const paragraph=(text,{bold=false,size=20,keep=false}={})=>`<w:p><w:pPr><w:spacing w:after="65"/>${keep?"<w:keepNext/>":""}</w:pPr>${String(text).split("\n").map((line,i)=>(i?"<w:r><w:br/></w:r>":"")+run(line,bold,size)).join("")}</w:p>`;
  const date=key=>new Date(`${key}T12:00:00`).toLocaleDateString("en-US",{month:"long",day:"numeric",year:"numeric"});
  let body=paragraph("TEACH · FAMILY LEARNING RECORD",{bold:true,size:18})+paragraph(titles[data.content],{bold:true,size:26})+paragraph(data.scope==="family"?`Whole family · ${data.children.map(c=>c.name).join(", ")}`:data.children[0]?.name||"")+paragraph(`${date(data.dateRange.from)} – ${date(data.dateRange.through)}`)+(data.preview?paragraph("Design preview · fictional sample records",{size:16}):"");
  if(data.hasAttendance){
    const months=attendanceMonths(data.attendanceRows,data.dateRange.from,data.dateRange.through);
    const cell=(text,width,bold=false)=>`<w:tc><w:tcPr><w:tcW w:w="${width}" w:type="dxa"/></w:tcPr><w:p><w:pPr><w:spacing w:after="0"/><w:jc w:val="center"/></w:pPr>${run(text,bold,16)}</w:p></w:tc>`;
    for(const child of data.children){
      body+=paragraph(`${child.name} · Attendance`,{bold:true,keep:true});
      body+='<w:tbl><w:tblPr><w:tblW w:w="10512" w:type="dxa"/><w:tblLayout w:type="fixed"/><w:tblCellMar><w:top w:w="20" w:type="dxa"/><w:left w:w="0" w:type="dxa"/><w:bottom w:w="20" w:type="dxa"/><w:right w:w="0" w:type="dxa"/></w:tblCellMar><w:tblBorders>'+["top","left","bottom","right","insideH","insideV"].map(edge=>`<w:${edge} w:val="single" w:sz="4" w:color="BBBBBB"/>`).join("")+'</w:tblBorders></w:tblPr><w:tblGrid><w:gridCol w:w="900"/>'+Array(31).fill('<w:gridCol w:w="295"/>').join("")+'<w:gridCol w:w="467"/></w:tblGrid>';
      body+='<w:tr><w:trPr><w:tblHeader/><w:cantSplit/></w:trPr>'+cell("Month",900,true)+Array.from({length:31},(_,i)=>cell(i+1,295,true)).join("")+cell("Total",467,true)+'</w:tr>';
      body+=months.map(month=>'<w:tr><w:trPr><w:cantSplit/></w:trPr>'+cell(new Date(`${month.month}T12:00:00`).toLocaleDateString("en-US",{month:"short",year:"numeric"}),900)+month.days.map(day=>cell(day?.[child.id]?"✓":"",295)).join("")+cell(month.days.filter(day=>day?.[child.id]).length,467,true)+'</w:tr>').join("");
      body+='</w:tbl>'+paragraph(`Total school days · ${child.name}: ${data.totals.find(c=>c.id===child.id)?.days||0}`,{bold:true,size:18});
    }
    body+=paragraph("✓ Schooled. Blank cells are unmarked or outside the selected period.",{size:16});
  }
  if(data.hasNotes){body+=paragraph("Notes",{bold:true,keep:true});if(!data.notesRows.length)body+=paragraph("No notes recorded in this period.");for(const row of data.notesRows){body+=paragraph(date(row.day),{bold:true,keep:true});if(row.event)body+=paragraph(`Calendar: ${row.event}`);if(row.familyNote)body+=paragraph(`Family notes: ${row.familyNote}`);for(const child of row.children)body+=paragraph(`${child.name}’s notes: ${child.note}`);}}
  const declaration='<?xml version="1.0" encoding="UTF-8" standalone="yes"?>';
  return zip({
    "[Content_Types].xml":declaration+'<Types xmlns="http://schemas.openxmlformats.org/package/2006/content-types"><Default Extension="rels" ContentType="application/vnd.openxmlformats-package.relationships+xml"/><Default Extension="xml" ContentType="application/xml"/><Override PartName="/word/document.xml" ContentType="application/vnd.openxmlformats-officedocument.wordprocessingml.document.main+xml"/><Override PartName="/word/footer.xml" ContentType="application/vnd.openxmlformats-officedocument.wordprocessingml.footer+xml"/></Types>',
    "_rels/.rels":declaration+'<Relationships xmlns="http://schemas.openxmlformats.org/package/2006/relationships"><Relationship Id="document" Type="http://schemas.openxmlformats.org/officeDocument/2006/relationships/officeDocument" Target="word/document.xml"/></Relationships>',
    "word/_rels/document.xml.rels":declaration+'<Relationships xmlns="http://schemas.openxmlformats.org/package/2006/relationships"><Relationship Id="copyright" Type="http://schemas.openxmlformats.org/officeDocument/2006/relationships/footer" Target="footer.xml"/></Relationships>',
    "word/document.xml":declaration+'<w:document xmlns:w="http://schemas.openxmlformats.org/wordprocessingml/2006/main" xmlns:r="http://schemas.openxmlformats.org/officeDocument/2006/relationships"><w:body>'+body+'<w:sectPr><w:footerReference w:type="default" r:id="copyright"/><w:pgSz w:w="12240" w:h="15840"/><w:pgMar w:top="864" w:right="864" w:bottom="1008" w:left="864" w:header="360" w:footer="432"/></w:sectPr></w:body></w:document>',
    "word/footer.xml":declaration+'<w:ftr xmlns:w="http://schemas.openxmlformats.org/wordprocessingml/2006/main"><w:p><w:pPr><w:jc w:val="center"/></w:pPr>'+run(data.copyright,false,16)+'</w:p></w:ftr>'
  });
}

export function downloadRecord(bytes,type,filename){
  const url=URL.createObjectURL(new Blob([bytes],{type})),link=document.createElement("a");link.href=url;link.download=filename;document.body.append(link);link.click();link.remove();setTimeout(()=>URL.revokeObjectURL(url),1000);
}
