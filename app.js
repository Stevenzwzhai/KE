const ke = require('./lib/ke')
const path = require('path')
const bodyParse = require('./lib/body-parse')
const app = ke();
app.use(bodyParse)
app.use(ke.static(path.join(__dirname, 'static')))
app.use(function(req, res, next){
    console.log('middle ware')
    next()
})

app.use('/user', function (req, res, next){
    console.log('middle 1')
    next();
})

app.use('/hello', function (req, res){
    console.log('res hello')
    res.send('hello')
})

app.use('/query', function (req, res){
    console.log('res query')
    res.send('query:'+req.query)
})

app.use(function(req, res){
    res.send(404, 'not found')
})

module.exports = app