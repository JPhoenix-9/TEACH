import {PDFDocument,rgb} from 'pdf-lib';
import fontkit from '@pdf-lib/fontkit';
import {SUBJECTS,transcriptGroups,totals,isCertified,reportMatches,safeFilename} from './model.mjs';
export async function buildDocument(project,kind='transcript',report=null,fontBytes=null){
 if(kind==='transcript'&&!isCertified(project))throw new Error('Review and certify your transcript before downloading.');
 if(kind==='transcript'&&report&&!reportMatches(report,project))throw new Error('Your record has changed. Recheck this school before downloading its version.');
 const pdf=await PDFDocument.create();pdf.registerFontkit(fontkit);
 if(!fontBytes){const response=await fetch('/fonts/transcript-sans.ttf');if(!response.ok)throw new Error('The document font could not be loaded. Please try again.');fontBytes=await response.arrayBuffer();}
 const font=await pdf.embedFont(fontBytes,{subset:true});
 let page,y;const width=612,height=792,left=46,right=566,bottom=64;
 function addPage(){page=pdf.addPage([width,height]);y=height-48;page.drawText(`© ${new Date().getFullYear()} TEACH · Higher Ground Publishing`,{x:left,y:30,size:8,font,color:rgb(.35,.35,.35)});page.drawText(String(pdf.getPageCount()),{x:right-12,y:30,size:8,font});}
 function line(text,size=10,indent=0){const max=right-left-indent;const words=String(text||'').replace(/\r/g,'').split(/\s+/);let row='';const rows=[];
 for(const word of words){if(font.widthOfTextAtSize(row+(row?' ':'')+word,size)>max&&row){rows.push(row);row='';}let segment=word;while(font.widthOfTextAtSize(segment,size)>max){let n=segment.length;while(n>1&&font.widthOfTextAtSize(segment.slice(0,n),size)>max)n--;if(row){rows.push(row);row='';}rows.push(segment.slice(0,n));segment=segment.slice(n);}row+=(row?' ':'')+segment;}if(row||!rows.length)rows.push(row);
 for(const r of rows){if(y<bottom+size*1.5)addPage();page.drawText(r,{x:left+indent,y,size,font,color:rgb(.13,.17,.15)});y-=size*1.55;}}
 function gap(n=10){y-=n;}
 function rule(){if(y<bottom+25)addPage();page.drawLine({start:{x:left,y},end:{x:right,y},thickness:.6,color:rgb(.6,.65,.6)});gap(14);}
 function heading(text,size=14){if(y<bottom+70)addPage();gap(8);line(text,size);gap(4);}
 addPage();pdf.setTitle(kind==='requirements'?`${report?.institution?.name} Requirements Report`:`${project.student.name} — ${kind==='addendum'?'Course Descriptions':'Transcript'}`);pdf.setAuthor(project.school.name);
 if(kind==='requirements'){
  heading('School Requirements Report',18);line(report.institution.name,14);line(`Requirements checked: ${new Date(report.checkedAt).toLocaleDateString('en-US')}`);line(`Student: ${project.student.name}`);rule();
  line(report.summary);for(const item of report.items){heading(item.area);line(`Published requirement: ${item.requirement}`);line(`Comparison: ${item.finding}`);line(`Status: ${item.status}`);if(item.nextStep)line(`Next step: ${item.nextStep}`);if(item.question)line(`Ask admissions: ${item.question}`);line(`Official source: ${item.source}`,8);}
  heading('Official sources consulted');for(const url of report.sources)line(url,8);heading('Review limits');line(`This review compares the entered record with published requirements as of ${new Date(report.checkedAt).toLocaleDateString('en-US')}. It does not guarantee admission or acceptance of coursework. Confirm current requirements with the institution before submitting an application.`);if(!reportMatches(report,project))line('The student record has changed since this report. Recheck the school for an updated comparison.');
 }else{
  line(project.school.name,21);for(const v of [project.school.address,[project.school.email,project.school.phone].filter(Boolean).join(' · ')])if(v)line(v,9);rule();
  heading(kind==='addendum'?'Course Description Addendum':'High School Transcript',17);line(`Student: ${project.student.name}`,12);line(`${project.student.status==='graduated'?'Graduation date':'Expected graduation'}: ${project.student.graduation}`);line(project.student.status==='graduated'?'Graduated':'Currently enrolled');if(report)line(`Prepared for ${report.institution.name}`);gap();
  if(kind==='addendum'){
   for(const subject of SUBJECTS){const courses=project.courses.filter(c=>c.subject===subject&&c.description.trim());if(!courses.length)continue;heading(subject);for(const c of courses){heading(`${c.title} — ${c.credit} credit${c.credit===1?'':'s'}`,11);line(c.description);}}
  }else{
   const t=totals(project.courses,project.settings);line(`Credits earned: ${t.earned.toFixed(2)}${t.planned?` · In progress: ${t.planned.toFixed(2)}`:''}`,11);line(`Unweighted GPA: ${t.unweighted===null?'Not applicable':t.unweighted.toFixed(3)}${project.settings.weighted?` · Weighted GPA: ${t.weighted===null?'Not applicable':t.weighted.toFixed(3)}`:''}`,11);
   for(const {label,courses} of transcriptGroups(project,report?.layout)){
    function tableHeader(){heading(label,11);for(const [text,x] of [['Course',left],['Credit',390],['Grade',435],['Year / level',485]])page.drawText(text,{x,y,size:8,font});y-=12;rule();}
    if(y<bottom+100)addPage();tableHeader();for(const c of courses){if(y<bottom+50){addPage();tableHeader();}const title=`${c.title}${c.level==='Standard'?'':` (${c.level})`}`;const words=title.split(/\s+/);let row='',rows=[];for(const word of words){if(font.widthOfTextAtSize(row+(row?' ':'')+word,9)>330&&row){rows.push(row);row='';}row+=(row?' ':'')+word;}if(row)rows.push(row);
     // Reserve a whole course row; credits and grades remain beside its first line.
     if(y<bottom+rows.length*14+20){addPage();tableHeader();}
     for(const [text,x] of [[Number(c.credit).toFixed(2),390],[c.grade,435],[c.year,485]]){const allowed=x===485?81:40;let value=text;while(value.length&&font.widthOfTextAtSize(value,8)>allowed)value=value.slice(0,-1);page.drawText(value,{x,y,size:8,font});}
     for(const row of rows){page.drawText(row,{x:left,y,size:9,font});y-=14;}
     if(font.widthOfTextAtSize(c.year,8)>81)line(`Academic year / grade level: ${c.year}`,8,12);
     if(c.level==='Dual Enrollment')line(`${c.college} — ${c.collegeCourse}${c.collegeNumber?` (${c.collegeNumber})`:''}`,8,12);
    }}
   heading('Grading and GPA scale');line(project.settings.scale,9);line(Object.entries(project.settings.points).map(([g,v])=>`${g}: ${v}`).join('; '),8);if(project.settings.weighted)line(`Weighted additions: ${Object.entries(project.settings.weights).map(([g,v])=>`${g}: +${v}`).join('; ')}. Failed courses receive no weighting bonus.`,8);line('SC = Satisfactory Completion: earns credit, excluded from GPA. IP = In Progress: excluded from earned credit and GPA. F earns no credit and is included in GPA. GPA is weighted by attempted course credit.',8);
   if(report?.layout?.includeDescriptions)for(const c of project.courses.filter(c=>c.description.trim())){heading(c.title,11);line(c.description,9);}
  }
  heading('Administrator certification');line('I certify that, to the best of my knowledge, the information contained in this transcript is complete and accurate and truthfully represents this student’s academic record.',9);line(`${project.school.administrator} · ${project.school.title}`);line(`Certified: ${project.certification?new Date(project.certification.date).toLocaleDateString('en-US'):'Not yet certified'}`,9);gap(18);line('Signature: __________________________________   Date: __________________',9);
 }
 return pdf.save();
}
export async function downloadDocument(project,kind='transcript',report=null){
 const bytes=await buildDocument(project,kind,report);const blob=new Blob([bytes],{type:'application/pdf'});const url=URL.createObjectURL(blob);const a=document.createElement('a');a.href=url;a.download=`${safeFilename(project.student.name)}-${kind}${report?`-${safeFilename(report.institution.name)}`:''}.pdf`;a.click();setTimeout(()=>URL.revokeObjectURL(url),30000);
}
