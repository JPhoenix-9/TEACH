'use client';
import {useEffect, useState} from 'react';
import {getSupabase} from '../../lib/supabase-browser';
import s from './desk.module.css';

export default function OwnerCup() {
  const [owner, setOwner] = useState(false);
  const [waiting, setWaiting] = useState(false);

  useEffect(() => {
    const sb = getSupabase();
    let revision = 0;
    async function refresh() {
      const current = ++revision;
      const {data: {user}} = await sb.auth.getUser();
      if (current !== revision) return;
      if (!user) {
        setOwner(false);
        setWaiting(false);
        return;
      }
      const role = await sb.from('teach_administrators').select('user_id').eq('user_id', user.id).maybeSingle();
      if (current !== revision) return;
      setOwner(Boolean(role.data));
      setWaiting(false);
      if (!role.data) return;
      const pending = await sb.from('teach_owner_inbox').select('id').eq('needs_reply', true).limit(1);
      if (current === revision) setWaiting(Boolean(pending.data?.length));
    }

    refresh();
    const {data} = sb.auth.onAuthStateChange(event => {
      if (event === 'SIGNED_OUT') {
        ++revision;
        setOwner(false);
        setWaiting(false);
      }
      if (event === 'SIGNED_IN') queueMicrotask(refresh);
    });
    window.addEventListener('pageshow', refresh);
    window.addEventListener('focus', refresh);
    return () => {
      ++revision;
      data.subscription.unsubscribe();
      window.removeEventListener('pageshow', refresh);
      window.removeEventListener('focus', refresh);
    };
  }, []);

  return owner && <a className={s.ownerCup} href="/admin#messages"
    aria-label={waiting ? 'Owner Dashboard messages, replies waiting' : 'Owner Dashboard messages'}>
    {waiting && <span className={s.whippedCream} aria-hidden="true"/>}
  </a>;
}
