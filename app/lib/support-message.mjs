export async function withDeadline(operation, milliseconds=15000){
 let timer;
 try{return await Promise.race([Promise.resolve().then(operation),new Promise((_,reject)=>{timer=setTimeout(()=>reject(new Error('SUPPORT_TIMEOUT')),milliseconds);})]);}
 finally{clearTimeout(timer);}
}
export async function saveSupportMessage(sb,record){
 const result=await withDeadline(()=>sb.from('family_support_messages').insert(record));
 if(result.error?.code==='23505'){
  const receipt=await withDeadline(()=>sb.from('family_support_messages').select('id,subject,message').eq('id',record.id).eq('user_id',record.user_id).single());
  if(!receipt.error&&receipt.data?.subject===record.subject&&receipt.data?.message===record.message)return;
 }
 if(result.error)throw result.error;
}
export function supportError(error){
 if(error?.code==='23503')return 'Please complete your family profile in My Account, then return to send your message. Your text is still here.';
 if(error?.code==='42501'||error?.status===401)return 'Please log in again before sending your message. Your text is still here.';
 return 'We couldn’t confirm that your message was saved. Your text is still here. Try Send message again, or email support@teachforlove.com.';
}
