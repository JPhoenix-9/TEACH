import {createClient} from '@supabase/supabase-js';
import {supabaseProjectUrl, supabasePublishableKey} from '../../../lib/supabase-config.mjs';

const sender = {email: 'support@teachforlove.com', name: 'TEACH'};
const response = (status, error) => Response.json(error ? {error} : {sent: true}, {status});

export async function POST(request) {
  const token = request.headers.get('authorization')?.match(/^Bearer ([^\s]+)$/i)?.[1];
  if (!token) return response(401, 'Sign in to send a reply.');
  const sb = createClient(supabaseProjectUrl, supabasePublishableKey, {
    auth: {persistSession: false, autoRefreshToken: false},
    global: {headers: {Authorization: `Bearer ${token}`}},
  });
  const {data: {user}} = await sb.auth.getUser(token);
  if (!user) return response(401, 'Sign in again to send a reply.');
  const role = await sb.from('teach_administrators').select('user_id').eq('user_id', user.id).maybeSingle();
  if (role.error) return response(503, 'Administrator access could not be checked.');
  if (!role.data) return response(403, 'Administrator access is required.');

  const input = await request.json().catch(() => null);
  const id = input?.id;
  const body = typeof input?.body === 'string' ? input.body.trim() : '';
  if (typeof id !== 'string' || !/^[a-f\d]{8}(?:-[a-f\d]{4}){3}-[a-f\d]{12}$/i.test(id) || !body || body.length > 6000) {
    return response(400, 'Enter a reply of 1 to 6,000 characters.');
  }
  const key = process.env.TEACH_BREVO_API_KEY;
  if (!key) return response(503, 'Support email sending is awaiting setup.');

  const message = await sb.from('family_support_messages').select('subject,reply_email').eq('id', id).maybeSingle();
  if (message.error) return response(503, 'The original support message could not be loaded.');
  if (!message.data?.reply_email) return response(404, 'This message has no reply address.');

  const claim = await sb.from('teach_support_replies').insert({message_id: id, body, state: 'sending'});
  if (claim.error) {
    if (claim.error.code !== '23505') return response(503, 'The reply could not be saved for sending.');
    const previous = await sb.from('teach_support_replies').select('state').eq('message_id', id).maybeSingle();
    return previous.data?.state === 'sent'
      ? response(200)
      : response(409, 'A reply is already being sent or its delivery needs checking in Brevo.');
  }

  const delivery = await fetch('https://api.brevo.com/v3/smtp/email', {
    method: 'POST',
    headers: {'api-key': key, 'content-type': 'application/json'},
    body: JSON.stringify({
      sender,
      replyTo: sender,
      to: [{email: message.data.reply_email}],
      subject: `Re: ${message.data.subject.replace(/[\r\n]+/g, ' ')}`,
      textContent: body,
    }),
    signal: AbortSignal.timeout(10000),
  }).catch(() => null);
  if (!delivery?.ok) {
    if (delivery && [400, 401, 402, 403, 404, 422, 429].includes(delivery.status)) {
      const release = await sb.from('teach_support_replies').delete().eq('message_id', id).eq('state', 'sending');
      if (!release.error) return response(502, 'Brevo rejected the email. Check the sending setup and try again.');
    }
    return response(502, 'Email delivery could not be confirmed. Check Brevo before trying to send it again.');
  }
  const saved = await sb.from('teach_support_replies').update({state: 'sent'}).eq('message_id', id).eq('state', 'sending').select('message_id').single();
  return saved.error
    ? response(502, 'Brevo accepted the email, but TEACH could not update the inbox. Check Brevo before sending again.')
    : response(200);
}
