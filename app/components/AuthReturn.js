"use client";
import {useEffect} from "react";
export default function AuthReturn(){useEffect(()=>{const hash=new URLSearchParams(window.location.hash.slice(1));if(window.location.pathname!=="/auth/callback"&&(hash.has("access_token")||hash.has("error_description")))window.location.replace(`/auth/callback${window.location.hash}`);},[]);return null;}
