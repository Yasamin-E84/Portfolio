"use client";
import { useEffect, useState, type FormEvent } from "react";
import { useRouter } from "next/navigation";

export function AdminLogin() {
  const [error,setError]=useState(""); const [busy,setBusy]=useState(false);
  const router=useRouter();
  useEffect(()=>{
    if(process.env.NEXT_PUBLIC_STATIC_SITE==="1" && process.env.NEXT_PUBLIC_ADMIN_ORIGIN) window.location.replace(`${process.env.NEXT_PUBLIC_ADMIN_ORIGIN}/login`);
  },[]);
  async function submit(event:FormEvent<HTMLFormElement>){
    event.preventDefault(); setBusy(true); setError("");
    const form=new FormData(event.currentTarget);
    const response=await fetch("/api/auth/login",{method:"POST",headers:{"Content-Type":"application/json"},body:JSON.stringify({email:form.get("email"),password:form.get("password")})}).catch(()=>null);
    if(response?.ok){router.push("/admin");return;}
    const data=await response?.json().catch(()=>null); setError(data?.error||"Unable to sign in"); setBusy(false);
  }
  return <main className="admin-auth-shell">
    <section className="admin-auth-card">
      <span className="admin-kicker">PRIVATE NOTEBOOK / Yasamin only</span>
      <h1>Open the control room</h1>
      <p>Manage the work visitors see without touching the repository.</p>
      <form onSubmit={submit}>
        <label>Email<input name="email" type="email" autoComplete="username" required /></label>
        <label>Password<input name="password" type="password" autoComplete="current-password" minLength={14} required /></label>
        {error&&<p className="admin-error" role="alert">{error}</p>}
        <button className="button button-dark" disabled={busy}>{busy?"Opening…":"Enter admin"}</button>
      </form>
    </section>
  </main>;
}
