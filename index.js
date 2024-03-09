const express = require('express');
const app = express();
const http = require('http');
const server = http.createServer(app);

app.use(express.urlencoded({extended:true}))
app.set('view engine','ejs')

function randomString(length) {
    var chars = '0123456789ABCDEFGHIJKLMNOPQRSTUVWXTZabcdefghiklmnopqrstuvwxyz'.split('');

    if (! length) {
        length = Math.floor(Math.random() * chars.length);
    }

    var str = '';
    for (var i = 0; i < length; i++) {
        str += chars[Math.floor(Math.random() * chars.length)];
    }
    return str;
}
app.get('/',(req,res)=>{res.render('index',{short:''})})

var urls = []

app.get('/admin',(req,res)=>{
    res.send(urls)
})

app.post('/shortURL',async(req,res)=>{

    const long_url = req.body.url
    const shortkey = randomString(8)
    urls.push({
        target:long_url,
        shortkey:shortkey
    })
    await res.render('index',{short:`localhost:3000/${shortkey}`})
})

app.get('/:id',async(req,res)=>{
    const shortkey = req.params.id
    try{
        var selectedData = urls[urls.map(function (item) { return item.shortkey; }).indexOf(shortkey)];
        await res.redirect(selectedData.target)
    }catch{
        res.send('url does not exist')
    }
})

server.listen(3000)