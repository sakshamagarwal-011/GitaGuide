import http from 'node:http';
import fs from 'node:fs';
import {execFileSync} from 'node:child_process';
if(fs.existsSync('.env'))process.loadEnvFile('.env');
execFileSync(process.execPath,['build.mjs'],{stdio:'inherit'});
const {default:worker}=await import('./dist/server/index.js');
http.createServer(async(req,res)=>{try{const chunks=[];for await(const c of req)chunks.push(c);const request=new Request('http://'+(req.headers.host||'localhost')+req.url,{method:req.method,headers:req.headers,...(!['GET','HEAD'].includes(req.method)?{body:Buffer.concat(chunks)}:{})});const result=await worker.fetch(request,process.env);res.writeHead(result.status,Object.fromEntries(result.headers));res.end(Buffer.from(await result.arrayBuffer()));}catch{res.writeHead(500);res.end('Request failed');}}).listen(Number(process.env.PORT||3000),'0.0.0.0',()=>console.log('GitaGuide running on port '+(process.env.PORT||3000)));
