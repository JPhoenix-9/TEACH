"use client";
import {useEffect} from "react";

// Keep artwork from becoming a draggable download target; links remain normal links.
export default function ImageInteractionPolicy(){
  useEffect(()=>{
    const prepare=root=>root.querySelectorAll("img").forEach(img=>{img.draggable=false;img.setAttribute("data-pin-nopin","true");});
    prepare(document);
    const observer=new MutationObserver(changes=>{for(const change of changes)for(const node of change.addedNodes){if(!(node instanceof Element))continue;if(node.tagName==="IMG"){node.draggable=false;node.setAttribute("data-pin-nopin","true");}prepare(node);}});
    observer.observe(document.body,{childList:true,subtree:true});
    const suppress=e=>{if(e.target instanceof Element&&e.target.closest("img"))e.preventDefault();};
    document.addEventListener("contextmenu",suppress);document.addEventListener("dragstart",suppress);
    return()=>{observer.disconnect();document.removeEventListener("contextmenu",suppress);document.removeEventListener("dragstart",suppress);};
  },[]);
  return null;
}
