'use client';
import {useState} from 'react';
import {BLUEPRINT_SALES_VIDEO} from '../lib/blueprint-catalog.mjs';
import s from './page.module.css';

export default function SalesVideo(){
  const [failed,setFailed]=useState(false);
  return <div className={s.salesVideo}>
    <video controls playsInline preload="none" width="1920" height="1080"
      poster={BLUEPRINT_SALES_VIDEO.poster} aria-label="Homeschool Success Blueprint introduction by Jana Sheridan"
      onError={()=>setFailed(true)}>
      <source src={BLUEPRINT_SALES_VIDEO.src} type="video/mp4"/>
      Your browser does not support video playback. <a href={BLUEPRINT_SALES_VIDEO.src}>Open the introduction video</a>.
    </video>
    {failed&&<p role="alert">The introduction couldn’t play. Please try again, or <a href={BLUEPRINT_SALES_VIDEO.src}>open the video directly</a>.</p>}
    <p className={s.videoNote}>An introduction to the Blueprint · About 4 minutes</p>
  </div>;
}
