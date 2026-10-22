import {getSupabase} from './supabase-browser';
export const blankDay=()=>({attendance:{},childNotes:{},familyNote:'',event:''});
async function readPlannerRecords(){
 const rows=[];let after=null;for(;;){const {data,error}=await getSupabase().rpc('read_planner_records',{p_after:after,p_limit:1000});if(error)throw error;rows.push(...data);if(data.length<1000)return rows;after=data[data.length-1].day;}
}
export async function loadFamilyRecords(){
 const sb=getSupabase(),{data,error}=await sb.auth.getUser();if(error||!data.user){const e=new Error('Please log in to open your family records.');e.signedOut=true;throw e;}const user=data.user;
 const [p,c,s,d,a]=await Promise.all([sb.from('family_profiles').select('parent_name,marketing_opt_in').eq('user_id',user.id).maybeSingle(),sb.from('family_children').select('id,name,grade_level,age_years,archived_at').eq('user_id',user.id).order('created_at'),sb.from('planner_subscriptions').select('starts_at,ends_at,revoked_at').eq('user_id',user.id).maybeSingle(),readPlannerRecords(),sb.from('product_access').select('product_key,revoked_at').eq('user_id',user.id)]);
 for(const result of [p,c,s,a])if(result.error)throw result.error;
 const records={},revisions={};for(const row of d){const record={...blankDay(),event:row.calendar_note,familyNote:row.family_note};for(const child of row.children){record.attendance[child.child_id]=child.schooled;record.childNotes[child.child_id]=child.note;}records[row.day]=record;revisions[row.day]=Number(row.revision);}
 const children=c.data.map(child=>({...child,grade:child.grade_level||''})),subscription=s.data,now=Date.now();
 return {user,profile:p.data,children,records,revisions,subscription,canEdit:!!subscription&&!subscription.revoked_at&&Date.parse(subscription.starts_at)<=now&&Date.parse(subscription.ends_at)>now,products:(a.data||[]).filter(row=>!row.revoked_at).map(row=>row.product_key)};
}
