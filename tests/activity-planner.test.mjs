import test from 'node:test';
import assert from 'node:assert/strict';
import {hasActivePlanner,briefActivityOverview,activityPlannerNote,activityArchivePath,activityArchiveLinks} from '../app/lib/activity-planner.mjs';

const id='11111111-1111-4111-8111-111111111111';
test('Planner action requires a current, unrevoked term, with exact start/end boundaries',()=>{
 const now=Date.parse('2026-11-06T18:00:00Z'),subscription={starts_at:'2026-11-06T18:00:00Z',ends_at:'2027-11-06T18:00:00Z',revoked_at:null};
 assert.equal(hasActivePlanner(subscription,now),true);
 for(const value of [null,{...subscription,revoked_at:'2026-11-06T17:00:00Z'},{...subscription,starts_at:'2026-11-07T18:00:00Z'},{...subscription,ends_at:'2026-11-06T18:00:00Z'},{...subscription,ends_at:'invalid'}])assert.equal(hasActivePlanner(value,now),false);
});
test('Planner note includes only a short reminder and a mandatory archive link',()=>{
 const summary='Compare butterfly wing symmetry. '+ 'Detailed instructions and materials. '.repeat(200);
 const text=activityPlannerNote({title:'Wing Symmetry Challenge',overview:summary,archiveId:id});
 assert.equal(text,`Wing Symmetry Challenge\nCompare butterfly wing symmetry.\nSaved activity: https://teachforlove.com/generators/activity?plan=${id}`);
 assert.ok(briefActivityOverview('one very long sentence without punctuation '.repeat(20)).length<=140);
 assert.throws(()=>activityPlannerNote({title:'Activity',overview:'A reminder',archiveId:null}));
 assert.throws(()=>activityArchivePath('../other-account'));
});
test('only valid internal archive references become links; pasted HTML and external links stay plain text',()=>{
 const path=activityArchivePath(id);
 assert.deepEqual(activityArchiveLinks(`Saved activity: https://teachforlove.com${path}\n${path}`),[{id,href:path}]);
 assert.deepEqual(activityArchiveLinks(`Saved activity: https://teachforlove.com${path}\\n\\nAnother activity`),[{id,href:path}]);
 for(const note of [`https://evil.example${path}`,`javascript:alert(1)`,`<a href="${path}">click</a>`,`/generators/activity?plan=not-a-uuid`])assert.deepEqual(activityArchiveLinks(note),[]);
});
