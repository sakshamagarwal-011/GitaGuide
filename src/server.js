export default {async fetch(request,env={}){
 const url=new URL(request.url);const path=url.pathname;
 const headers={'Cache-Control':'no-store','X-Content-Type-Options':'nosniff','Referrer-Policy':'strict-origin-when-cross-origin'};
 const json=(body,status=200)=>Response.json(body,{status,headers});
 if(path==='/api/status')return json({ai:!!env.GEMINI_API_KEY,provider:env.GEMINI_API_KEY?'Gemini':null});
 if(path==='/api/verses')return json(VERSES);
 if(path==='/api/chapters')return json(CHAPTERS);
 if(path==='/api/gemini/connect'){
  if(request.method!=='POST')return json({error:'Use POST'},405);
  if(request.headers.get('origin')&&request.headers.get('origin')!==url.origin)return json({error:'Origin mismatch'},403);
  const key=request.headers.get('x-gemini-api-key');
  if(!key||key.length>1024)return json({error:'Enter a Gemini API key.'},400);
  try{return json({models:await discoverModels(key,AbortSignal.timeout(12000))});}
  catch(e){return json({error:geminiErrors[e.code]||geminiErrors.unavailable},400);}
 }
 if(path==='/api/chat'){
  if(request.method!=='POST')return json({error:'Use POST'},405);
  if(request.headers.get('origin')&&request.headers.get('origin')!==url.origin)return json({error:'Origin mismatch'},403);
  if(Number(request.headers.get('content-length')||0)>40000)return json({error:'Request too large'},413);
  let body;try{const raw=await request.text();if(raw.length>40000)return json({error:'Request too large'},413);body=JSON.parse(raw)}catch{return json({error:'Invalid JSON'},400)}
  if(typeof body.query!=='string'||!body.query.trim()||body.query.length>2000)return json({error:'Enter a question of 1–2000 characters'},400);
  const crisis=safetyResponse(body.query);if(crisis)return json({text:crisis,reflection:null,verses:[],mode:'support'});
  const result=retrieve(body.query,VERSES,typeof body.previous==='string'?body.previous.slice(-4000):'');
  const basic={...fallback(result),verses:result.verses,mode:'search'};
  const key=request.headers.get('x-gemini-api-key')||env.OPENROUTER_API_KEY||env.GEMINI_API_KEY;
  if(!key)return json({...basic,notice:'Gemini connect नहीं है। नीचे तैयार की गई व्याख्या है, personalized AI उत्तर नहीं। / Connect Gemini for a personalized explanation.'});
  if(key.length>1024)return json({error:'Invalid key'},400);
  const signal=AbortSignal.timeout(45000);
  const history=Array.isArray(body.history)?body.history.slice(-8).filter(m=>m&&['user','assistant'].includes(m.role)&&typeof m.text==='string').map(m=>({role:m.role,text:m.text.slice(0,2500)})):[];
  try{
   const model=typeof body.model==='string'?body.model:env.OPENROUTER_API_KEY?'or:openrouter/free':env.GEMINI_MODEL||(await discoverModels(key,signal))[0].id;
   return json(await explainWithGemini(body,result,history,key,model,signal));
  }catch(e){return json({...basic,notice:geminiErrors[e.code]||geminiErrors.unavailable,errorCode:e.code||'unavailable'});}

 }
 if(path==='/music.mpeg'){const bytes=Uint8Array.from(atob(MUSIC),c=>c.charCodeAt(0));return new Response(bytes,{headers:{'Content-Type':'audio/mpeg','Content-Length':String(bytes.length),'Cache-Control':'public, max-age=86400'}});}
 const asset=ASSETS[path==='/'?'/index.html':path];if(asset)return new Response(asset.body,{headers:{...headers,'Content-Type':asset.type,'Content-Security-Policy':"default-src 'self'; style-src 'self' 'unsafe-inline' https://fonts.googleapis.com; font-src https://fonts.gstatic.com; script-src 'self'; connect-src 'self'; img-src 'self' data:; media-src 'self'; object-src 'none'; base-uri 'self'; form-action 'self'"}});
 return new Response('Not found',{status:404,headers});
}};
