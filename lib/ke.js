const url = require('url');
const fs = require('fs')
const mime = require('mime')
const path = require('path')

function ke(){
    let tasks = [];
    let app = function(req, res){
        makeQuery(req)
        makeResponse(res)
        let i = 0;
        function next(){
            let task = tasks[i++];
            if(!task){
                return;
            }
            if(task.routePath === null || url.parse(req.url).pathname === task.routePath){
                task.middleWare(req, res, next);
            }else{
                next()
            }
        }
        next()
    }
    app.use = function(routePath, middleWare){
        if(typeof routePath === 'function'){
            middleWare = routePath;
            routePath = null;
        }
        tasks.push({
            routePath: routePath,
            middleWare: middleWare
        })
    }

    return app;
}

function makeQuery(req){
    req.query = url.parse(req.url).query;
    let body = '';
    req.on('data', function(chunck){
        body+=chunck;
    }).on('end', function(){
        req.body = parseBody(body);
    })
}
function makeResponse(res){
    res.send = function(data){
        console.log(123,data)
        switch(typeof data){
            case 'string': res.end(data);
            break;
            case 'object': res.end(JSON.stringify(data));
            break;
            case 'number': res.writeHead(data), res.end(arguments[1]);
            break;
            default: res.setHead(500, 'server error'), res.end('server error');
        }
    }
}
function parseBody(bodyData){
    let param = {};
    bodyData.split('&').forEach(item => {
        let temp = item.split('=');
        param[temp[0]] = temp[1];
    })
    return param;
}
ke.static = function(rootpath){
    return function(req, res, next) {
        console.log(url.parse(req.url, true))
        const filePath = path.resolve(rootpath, url.parse(req.url, true).pathname.substr(1))
        let mimeType = mime.getType(url.parse(req.url).pathname.substr(1))
        fs.readFile(filePath, 'binary', (err, data) => {
            if(err) {
                next();
            }else{
                res.writeHead(200, 'ok', {
                    'Content-Type': mimeType
                })
                res.write(data)
                res.end();
            }
        })
    }
}
module.exports = ke