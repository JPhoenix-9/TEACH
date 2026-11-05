'use client';
import {useState} from 'react';
import styles from '../../components/page-frame.module.css';
export default function EmailContact(){
 const [notice,setNotice]=useState('');
 async function copy(){try{await navigator.clipboard.writeText('support@teachforlove.com');setNotice('Email address copied. Paste it into a new email.');}catch{setNotice('Select and copy this address: support@teachforlove.com');}}
 return <><p>For help with the Transcript Generator, your TEACH account, or a purchase, email <a className={styles.textLink} href="mailto:support@teachforlove.com" onClick={()=>setNotice('This link opens your email app. If no app opens, copy the address or use the private message form below.')}>support@teachforlove.com</a>.</p><button type="button" className={styles.primary} onClick={copy}>Copy email address</button><p role="status">{notice}</p></>;
}
