"use client";
import { useEffect, useState } from "react";

type Overview = { counts: { total:number; drafts:number; published:number; scheduled:number; missingMetadata:number }; runs:{id:string;workflow:string;status:string;generatedCount:number;detail:string;createdAt:number}[]; migrationRequired?:boolean };
export function PublicationOverview() {
  const [data,setData]=useState<Overview|null>(null);
  const [audit,setAudit]=useState<{checked:number;healthy:number;broken:{url:string;status:number}[]}|null>(null);
  const [auditing,setAuditing]=useState(false);
  useEffect(()=>{fetch("/api/admin/publication-overview",{cache:"no-store"}).then(r=>r.json()).then(setData).catch(()=>setData(null))},[]);
  if(!data)return <p className="admin-empty">Loading publication metrics…</p>;
  async function checkLinks(){setAuditing(true);try{const response=await fetch("/api/admin/link-audit",{cache:"no-store"});setAudit(await response.json())}finally{setAuditing(false)}}
  const indexReady=data.counts.published>0&&data.counts.missingMetadata===0;
  return <section className="publication-overview"><header className="admin-collection-head"><h2>Publication desk</h2><button onClick={()=>void checkLinks()} disabled={auditing}>{auditing?"Checking links…":"Run link audit"}</button></header>{data.migrationRequired&&<p className="admin-privacy-note">The publication database migration is ready and will be applied during deployment.</p>}<div className="admin-metrics"><article><strong>{data.counts.total}</strong><span>articles and updates</span></article><article><strong>{data.counts.drafts}</strong><span>drafts to review</span></article><article><strong>{data.counts.published}</strong><span>published</span></article><article><strong>{data.counts.scheduled}</strong><span>scheduled</span></article><article><strong>{data.counts.missingMetadata}</strong><span>missing SEO metadata</span></article><article><strong>{indexReady?"Ready":"Review"}</strong><span>indexing readiness*</span></article><article><strong>{audit?audit.broken.length:"—"}</strong><span>broken external links</span></article></div><p className="admin-privacy-note">* Readiness checks published content and metadata. Confirm actual indexing in Google Search Console or Bing Webmaster Tools.</p>{audit&&<p className="admin-privacy-note">Checked {audit.checked} external links: {audit.healthy} healthy, {audit.broken.length} unavailable.{audit.broken.map(item=><span key={item.url}><br/>{item.status||"timeout"} · {item.url}</span>)}</p>}</section>;
}
