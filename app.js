const ke = require('./lib/ke')
const path = require('path')
//第三方解析，有json, file等各种情况，待研究。。。。。。。。。
const bodyParser = require('body-parser')
const urlencodeParser = bodyParser.urlencoded({extended: true})
const app = ke();
app.use(urlencodeParser)
app.use(ke.static(path.join(__dirname, 'static')))
app.set('views', path.join(__dirname, 'views'));
app.use(function(req, res, next){
    console.log('middle ware')
    next()
})

app.use('/user', function (req, res, next){
    console.log('middle 1')
    next();
})

app.use('/hello', function (req, res){
    console.log('res hello:'+req.query)
    res.send('hello')
})

app.use('/query', function (req, res){
    console.log('res query')
    res.render('query', {
        title: 'query-html',
        name: 'KE',
        content: 'this is node frame KE, like express, this page is use ejs to render.'
    })
    // res.send('query:'+JSON.stringify(req.body))
})

app.use(function(req, res){
    res.send(404, 'not found')
})

module.exports = app