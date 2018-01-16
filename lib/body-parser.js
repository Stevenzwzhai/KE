/*
自己实现的简答的bodyParser
*/
function bodyParser(req, res, next){
    let body = '';
    req.on('data', (chunck) => {
        body+=chunck;
    }).on('end', () => {
        req.body = parseBody(body);
        next();
    })
}

function parseBody(body){
    let param = {}
    body.split('&').forEach(item => {
        param[item.split('=')[0]] = item.split('=')[1]
    })
    return param
}

module.exports = bodyParser