let http = require('http');

let path = require('path');

let fs = require('fs');

let querystring = require('querystring');

let mime = require('mime');

let rootPath = path.join(__dirname,'www');
console.log('根目录是:'+rootPath);

let server = http.createServer((request,response)=>{
    // let filePath = path.join(rootPath,querystring.request.url);
    let filePath = path.join(rootPath,querystring.unescape(request.url));
    // console.log(filePath);
    // console.log(request.url);

    let isExist = fs.existsSync(filePath);

    if(isExist){
        fs.readdir(filePath,(err,files)=>{
            if(err){
                fs.readFile(filePath,(err,data)=>{
                    if(err){
                        // 能进入这里说明是文件
                    }else {
                        response.writeHead(200,{
                            'content-type':mime.getType(filePath)
                        })
                        response.end(data);
                    }
                })
            }else {
                //  能进入这里说明是文件夹
              console.log(files);
              if(files.indexOf('index.html') != -1){
                fs.readFile(path.join(filePath,'index.html'),(err,data)=>{
                    if(err){
                        console.log(err);
                    }else {
                        response.end(data);
                    }
                })
              }else {
                var backdata = '';
                for(let i=0;i<files.length;i++){
                    backdata +=` <h2><a href="${  
                      request.url == '/' ? '' : request.url
                  }/${files[i]}">${files[i]}</a></h2>`
                }
                response.writeHead(200,{
                  'content-type':'text/html;charset=utf-8'
                });
                response.end(backdata);
              }
            }
        })
    }else {
        response.writeHead(404,{
            'content-type':'text/html;charset=utf-8'
        });
        response.end(`
            <!DOCTYPE HTML PUBLIC "-//IETF//DTD HTML 2.0//EN">
            <html><head>
            <title>404 Not Found</title>
            </head><body>
            <h1>Not Found</h1>
            <p>The requested URL /index.hththt was not found on this server.</p>
            </body></html>
        `);
    }


    

})

server.listen(8899,'127.0.0.1',function(){
    console.log('开始监听 127.0.0.1:8899 success!');
})