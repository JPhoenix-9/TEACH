"use client";
import {useId,useState} from "react";
import s from "./account.module.css";

export default function PasswordField({label,hint,...inputProps}){
 const id=useId();
 const [visible,setVisible]=useState(false);
 return <div className={s.field}>
  <label htmlFor={id}>{label}</label>
  <div className={s.passwordControl}>
   <input {...inputProps} id={id} type={visible?"text":"password"}/>
   <button type="button" className={s.passwordToggle} aria-controls={id} aria-label={`${visible?"Hide":"Show"} ${label.toLowerCase()}`} disabled={inputProps.disabled} onClick={()=>setVisible(shown=>!shown)}>{visible?"Hide":"Show"}</button>
  </div>
  {hint&&<span className={s.hint}>{hint}</span>}
 </div>;
}
