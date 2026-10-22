'use client';
import {useEffect} from 'react';
export default function SearchNavigation(){useEffect(()=>{const input=document.querySelector('input[aria-label="Search TEACH"]');if(!input)return;const search=e=>{if(e.key==='Enter'&&input.value.trim()){e.preventDefault();window.location.assign('/search?q='+encodeURIComponent(input.value.trim()));}};input.addEventListener('keydown',search);return()=>input.removeEventListener('keydown',search);},[]);return null;}
