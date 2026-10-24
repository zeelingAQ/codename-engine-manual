const http=require('http'), fs=require('fs'), path=require('path');
const types={
  '.html':'text/html; charset=utf-8',
  '.css':'text/css; charset=utf-8',
  '.js':'application/javascript; charset=utf-8',
  '.json':'application/json; charset=utf-8',
  '.txt':'text/plain; charset=utf-8',
  '.png':'image/png',
  '.jpg':'image/jpeg',
  '.jpeg':'image/jpeg',
  '.webp':'image/webp',
  '.svg':'image/svg+xml',
  '.ico':'image/x-icon',
  '.mp4':'video/mp4',
  '.webm':'video/webm',
  '.mp3':'audio/mpeg',
  '.ogg':'audio/ogg',
  '.wav':'audio/wav',
  '.m4a':'audio/mp4'
};
http.createServer((req,res)=>{
  let p=decodeURIComponent(req.url.split('?')[0]);
  if(p==='/')p='/index.html';
  const f=path.join(__dirname,'..',p);
  // 防目录穿越
  const root=path.resolve(__dirname,'..');
  if(!path.resolve(f).startsWith(root)){ res.writeHead(403); res.end('403'); return; }
  fs.stat(f,(se,st)=>{
    if(se || !st.isFile()){ res.writeHead(404); res.end('404'); return; }
    const head={'Content-Type':types[path.extname(f).toLowerCase()]||'application/octet-stream',
                'Content-Length':st.size,
                'Cache-Control':'no-store, must-revalidate'};
    // Range 支持：音频拖动/循环更顺
    const range=req.headers.range;
    if(range && /^bytes=\d*-\d*$/.test(range)){
      const [s,e]=range.replace('bytes=','').split('-');
      const start=s?parseInt(s,10):0;
      const end=e?parseInt(e,10):st.size-1;
      if(start>=st.size||end>=st.size){ res.writeHead(416,{'Content-Range':`bytes */${st.size}`}); res.end(); return; }
      res.writeHead(206,{...head,'Content-Range':`bytes ${start}-${end}/${st.size}`,'Content-Length':end-start+1,'Accept-Ranges':'bytes'});
      fs.createReadStream(f,{start,end}).pipe(res);
      return;
    }
    res.writeHead(200,{...head,'Accept-Ranges':'bytes'});
    fs.createReadStream(f).pipe(res);
  });
}).listen(8123,()=>console.log('http://127.0.0.1:8123'));
