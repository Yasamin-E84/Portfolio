import { requireMobile } from "@/lib/mobile-auth";

type EventRow={id:string;eventType:string;path:string;target:string;createdAt:number;country:string;region:string;city:string};
type MessageRow={id:string;name:string;email:string;message:string;createdAt:number};
type ListStatement={all<T=Record<string,unknown>>():Promise<{results:T[]}>};

function eventCopy(row: EventRow) {
  const location=[row.city,row.region,row.country].filter(Boolean).join(", ");
  const names:Record<string,string>={page_view:"New portfolio visit",project_view:"Project opened",artwork_view:"Artwork opened",video_view:"Video opened",contact_click:"Contact link used",contact_copy:"Contact detail copied"};
  return { id:`event:${row.id}`,kind:row.eventType,title:names[row.eventType]||"Portfolio activity",body:[row.target||row.path,location].filter(Boolean).join(" · "),createdAt:row.createdAt };
}

export async function GET(request: Request) {
  const auth=await requireMobile(request);if(auth.response)return auth.response;
  const now=Math.floor(Date.now()/1000);const raw=Number(new URL(request.url).searchParams.get("after")||now);
  const after=Number.isFinite(raw)?Math.max(now-7*86400,Math.min(Math.floor(raw),now)):now;
  const events=await (auth.db.prepare("SELECT ae.id,ae.event_type AS eventType,ae.path,ae.target,ae.created_at AS createdAt,s.country,s.region,s.city FROM analytics_events ae LEFT JOIN analytics_sessions s ON s.session_id=ae.session_id WHERE ae.created_at>? ORDER BY ae.created_at ASC LIMIT 200").bind(after) as unknown as ListStatement).all<EventRow>();
  const messages=await (auth.db.prepare("SELECT id,name,email,message,created_at AS createdAt FROM contact_messages WHERE created_at>? ORDER BY created_at ASC LIMIT 50").bind(after) as unknown as ListStatement).all<MessageRow>();
  const items=[...events.results.map(eventCopy),...messages.results.map(row=>({id:`message:${row.id}`,kind:"message",title:`Message from ${row.name}`,body:`${row.email} · ${row.message.slice(0,160)}`,createdAt:row.createdAt}))].sort((a,b)=>a.createdAt-b.createdAt);
  return Response.json({items,serverTime:now},{headers:{"Cache-Control":"no-store"}});
}

export async function DELETE(request: Request) {
  const auth=await requireMobile(request);if(auth.response)return auth.response;
  await auth.db.prepare("UPDATE admin_mobile_tokens SET revoked_at=? WHERE id=?").bind(Math.floor(Date.now()/1000),auth.device.id).run();
  return new Response(null,{status:204});
}
