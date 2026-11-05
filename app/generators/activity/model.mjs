import {z} from 'zod';
export const profileFields=[['interests','What do they love or get curious about?'],['strengths','What comes naturally to them?'],['reading','How comfortable are they with reading?'],['learning','Learning disabilities or learning considerations'],['sensory','Sensory needs or sensitivities'],['mobility','Mobility or physical considerations'],['frustrations','Dislikes or activities that frustrate them'],['considerations','Other considerations, including allergies or safety needs']];
export const profileComplete=p=>profileFields.every(([key])=>typeof p?.[key]==='string'&&p[key].trim());
const text=z.string().trim().min(1).max(1000);
const requestFields=z.object({action:z.enum(['materials','ideas','plan','revise','trips']),children:z.array(z.uuid()).min(1).max(30),adults:z.number().int().min(0).max(50),guests:z.array(z.object({age:z.number().int().min(0).max(120),considerations:z.string().trim().max(1000).default('')})).max(30),topic:text,duration:z.enum(['Quick','Half Day','All Day','A Week']),budget:z.number().min(0).max(100000),materials:z.array(z.string().max(100)).max(40).default([]),otherMaterials:z.string().max(1000).default(''),buy:z.boolean().default(false),direction:z.string().max(1000).default(''),previous:z.array(z.string().max(200)).max(60).default([]),idea:z.object({title:z.string().max(200),summary:z.string().max(2000),kind:z.enum(['activity','trip']).optional(),url:z.string().max(2000).optional(),evidence:z.string().max(4000).optional()}).optional(),plan:z.unknown().optional(),trip:z.object({location:text,radius:z.number().positive().max(24901),start:z.iso.date(),end:z.iso.date(),budget:z.number().min(0).max(100000)}).optional()});
export function needsTrip(request){return request?.action==='trips'||(['plan','revise'].includes(request?.action)&&request?.idea?.kind==='trip');}
export function buildActivityRequest(input,action,{trip,previous=[],...overrides}={}){
 const {trip:unused,...activity}=input;
 const request={...activity,action,previous,...overrides};
 if(needsTrip(request))request.trip=trip;
 return request;
}
export const requestSchema=z.preprocess(value=>{
 if(value&&typeof value==='object'&&!Array.isArray(value)&&!needsTrip(value)){
  const {trip,...activity}=value;
  return activity;
 }
 return value;
},requestFields.superRefine((value,ctx)=>{
 if(needsTrip(value)&&!value.trip)ctx.addIssue({code:'custom',path:['trip'],message:'Field trip details are required.'});
 if(value.trip&&value.trip.end<value.trip.start)ctx.addIssue({code:'custom',path:['trip','end'],message:'End date must be on or after the start date.'});
}));
export function activityValidationMessage(error){
 const issue=error.issues?.[0],field=issue?.path?.[0];
 if(field==='guests')return issue.path.includes('age')?'Enter an age for each guest child.':'Check the guest children’s details.';
 if(field==='children')return 'Select at least one child from your family profile.';
 if(field==='topic')return 'Enter a topic for your activity.';
 if(field==='duration')return 'Choose an activity duration.';
 if(field==='budget')return 'Enter a budget of $0 or more, or choose “Use what we have”.';
 if(field==='trip')return 'Check the field trip location, radius, dates, and budget.';
 return 'Please check your activity details and try again.';
}
export const ideaSchema=z.object({title:z.string(),summary:z.string()});
export const planSchema=z.object({title:z.string().max(200),summary:z.string(),duration:z.string(),estimatedCost:z.number().nonnegative(),supplies:z.array(z.string()),preparation:z.array(z.string()),sessions:z.array(z.object({title:z.string(),minutes:z.number().positive().max(120),steps:z.array(z.string())})),adaptations:z.array(z.object({child:z.string(),role:z.string()})),discussion:z.array(z.string()),safety:z.array(z.string())});
export const safeUrl=value=>{try{const u=new URL(value);return u.protocol==='https:'?u.href:null;}catch{return null;}};
export function sourceUrls(value,out=new Set()){if(Array.isArray(value))for(const v of value)sourceUrls(v,out);else if(value&&typeof value==='object')for(const [k,v] of Object.entries(value)){if(k==='url'&&typeof v==='string'&&safeUrl(v))out.add(safeUrl(v));else sourceUrls(v,out);}return out;}
