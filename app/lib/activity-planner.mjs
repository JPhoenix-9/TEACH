const uuid=/^[0-9a-f]{8}-[0-9a-f]{4}-[1-8][0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$/i;
export function activityArchivePath(id){
 if(!uuid.test(id||''))throw new Error('Save the activity before adding it to your Planner.');
 return `/generators/activity?plan=${id}`;
}
export function hasActivePlanner(subscription,now=Date.now()){
 return !!subscription&&!subscription.revoked_at&&Date.parse(subscription.starts_at)<=now&&Date.parse(subscription.ends_at)>now;
}
export function briefActivityOverview(value){
 const text=String(value||'').replace(/\s+/g,' ').trim();
 const sentence=text.match(/^.*?[.!?](?:\s|$)/)?.[0]?.trim()||text;
 if(sentence.length<=140)return sentence;
 return sentence.slice(0,137).replace(/\s+\S*$/,'').trimEnd()+'…';
}
export function activityPlannerNote({title,overview,archiveId}){
 const name=String(title||'').replace(/\s+/g,' ').trim().slice(0,200);
 if(!name)throw new Error('An activity title is required.');
 return `${name}\n${briefActivityOverview(overview)}\nSaved activity: https://teachforlove.com${activityArchivePath(archiveId)}`;
}
// Only TEACH archive paths become clickable. Arbitrary note text remains plain text.
export function activityArchiveLinks(note){
 const source=String(note||'').replace(/\\n/g,'\n');
 const ids=[...source.matchAll(/(?:^|\s)(?:https:\/\/teachforlove\.com)?\/generators\/activity\?plan=([0-9a-f-]+)(?=$|[\s.,;)])/gi)].map(m=>m[1]);
 return [...new Set(ids)].filter(id=>uuid.test(id)).map(id=>({id,href:activityArchivePath(id)}));
}
