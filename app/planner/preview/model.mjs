export function dateKey(d) { return `${d.getFullYear()}-${String(d.getMonth()+1).padStart(2,"0")}-${String(d.getDate()).padStart(2,"0")}`; }
export function monthCells(year, month) {
  const offset=new Date(year,month,1).getDay(),count=new Date(year,month+1,0).getDate();
  return Array.from({length:Math.ceil((offset+count)/7)*7},(_,i)=>i>=offset&&i<offset+count?dateKey(new Date(year,month,i-offset+1)):null);
}
export function makeReport(records,children,scope,start,end) {
  const selected=scope==="family"?children:children.filter(c=>c.id===scope);
  return Object.entries(records).filter(([day])=>day>=start&&day<=end).sort(([a],[b])=>a.localeCompare(b)).map(([day,r])=>({day,familyNote:r.familyNote||"",event:r.event||"",children:selected.map(c=>({...c,present:!!r.attendance?.[c.id],note:r.childNotes?.[c.id]||""}))})).filter(r=>r.familyNote||r.event||r.children.some(c=>c.present||c.note));
}
