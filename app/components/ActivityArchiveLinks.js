import {activityArchiveLinks} from '../lib/activity-planner.mjs';

export default function ActivityArchiveLinks({note}){
 const links=activityArchiveLinks(note);
 if(!links.length)return null;
 return <ul aria-label="Saved activity instructions">{links.map((link,i)=><li key={link.id}><a href={link.href} target="_blank" rel="noopener noreferrer">Open saved activity{links.length>1?` ${i+1}`:''} →</a></li>)}</ul>;
}
