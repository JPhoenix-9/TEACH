'use client';
import {useEffect, useState} from 'react';
import {getSupabase} from '../lib/supabase-browser';
import s from '../components/account.module.css';

const pageSize = 25;

export default function OwnerInbox({userId}) {
  const [rows, setRows] = useState([]);
  const [limit, setLimit] = useState(pageSize);
  const [revision, setRevision] = useState(0);
  const [status, setStatus] = useState('Loading messages…');

  useEffect(() => {
    let active = true;
    getSupabase().from('teach_owner_inbox')
      .select('id,source,subject,body,sender,activity_at,needs_reply')
      .order('needs_reply', {ascending: false})
      .order('activity_at', {ascending: false})
      .order('id').order('source').limit(limit + 1)
      .then(({data, error}) => {
        if (!active) return;
        if (error) {
          setStatus('The inbox could not load. Try Refresh messages.');
          return;
        }
        setRows(data);
        setStatus(data.length ? '' : 'No messages yet.');
      });
    return () => { active = false; };
  }, [limit, revision]);

  function refresh() {
    setRevision(value => value + 1);
  }

  return <section id="messages" aria-labelledby="owner-inbox-title">
    <h2 id="owner-inbox-title">Messages</h2>
    <button className={s.button} type="button" onClick={refresh}>Refresh messages</button>
    {status && <p role="status">{status}</p>}
    {rows.slice(0, limit).map(item =>
      <Message key={`${item.source}:${item.id}`} item={item} userId={userId} onReply={refresh}/>)}
    {rows.length > limit && <button className={s.button} type="button" onClick={() => setLimit(value => value + pageSize)}>Show more messages</button>}
  </section>;
}

function Message({item, userId, onReply}) {
  const [opened, setOpened] = useState(false);
  const [history, setHistory] = useState([]);
  const [draft, setDraft] = useState('');
  const [busy, setBusy] = useState(false);
  const [sent, setSent] = useState(false);
  const [error, setError] = useState('');
  const porch = item.source === 'ask-jana';

  useEffect(() => {
    if (!opened) return;
    let active = true;
    const sb = getSupabase();
    async function loadHistory() {
      const result = porch
        ? await sb.from('porch_replies').select('id,author_name,body').eq('thread_id', item.id).eq('hidden', false)
          .order('created_at', {ascending: false}).order('id', {ascending: false}).limit(50)
        : await sb.from('teach_support_replies').select('body,state').eq('message_id', item.id).maybeSingle();
      if (!active) return;
      if (result.error) {
        setError('The reply history could not be loaded.');
        return;
      }
      setHistory(porch ? result.data.reverse() : result.data?.state === 'sent' ? [{id: item.id, author_name: 'TEACH', body: result.data.body}] : []);
    }
    loadHistory();
    return () => { active = false; };
  }, [opened, porch, item.id, item.activity_at, item.needs_reply, sent]);

  async function reply(event) {
    event.preventDefault();
    if (busy || !draft.trim()) return;
    setBusy(true);
    setError('');
    try {
      const sb = getSupabase();
      const {data: {user}} = await sb.auth.getUser();
      if (user?.id !== userId) throw new Error('Sign in again to reply.');
      if (porch) {
        const result = await sb.from('porch_replies').insert({thread_id: item.id, user_id: userId, body: draft.trim()});
        if (result.error) throw new Error('The Ask Jana reply could not be saved. Your draft is still here.');
      } else {
        const {data: {session}} = await sb.auth.getSession();
        if (session?.user.id !== userId) throw new Error('Sign in again to reply.');
        const result = await fetch('/api/owner/support-reply', {
          method: 'POST',
          headers: {Authorization: `Bearer ${session.access_token}`, 'Content-Type': 'application/json'},
          body: JSON.stringify({id: item.id, body: draft}),
        });
        if (!result.ok) {
          const details = await result.json().catch(() => null);
          throw new Error(details?.error || 'The support email could not be confirmed.');
        }
      }
      setSent(true);
      setDraft('');
      onReply();
    } catch (failure) {
      setError(failure.message || 'The reply could not be sent.');
    } finally {
      setBusy(false);
    }
  }

  return <details className={s.material} onToggle={event => setOpened(event.currentTarget.open)}>
    <summary><strong>{item.subject}</strong> · {porch ? 'Ask Jana' : 'Contact & Help'}{item.needs_reply && ' · Needs reply'}</summary>
    <p>{item.sender || 'TEACH family'} · {new Date(item.activity_at).toLocaleString()}</p>
    <p style={{whiteSpace: 'pre-wrap'}}>{item.body}</p>
    {opened && history.map(entry => <div key={entry.id}><strong>{entry.author_name}</strong><p style={{whiteSpace: 'pre-wrap'}}>{entry.body}</p></div>)}
    {(porch || (item.needs_reply && !sent && item.sender)) && <form className={s.form} onSubmit={reply}>
      <label className={s.field}>Reply<textarea required rows={4} maxLength={porch ? 3000 : 6000} value={draft} disabled={busy}
        onChange={event => {setDraft(event.target.value); setSent(false);}}/></label>
      <button type="submit" className={s.button} disabled={busy || !draft.trim()}>{busy ? 'Sending…' : porch ? 'Post reply' : 'Send email reply'}</button>
    </form>}
    {sent && <p role="status">{porch ? 'Reply posted.' : 'Reply submitted to Brevo for delivery.'}</p>}
    {error && <p role="alert">{error}</p>}
  </details>;
}
