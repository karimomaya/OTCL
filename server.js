#!/usr/bin/env node
//node --inspect server.js

let express          = require('express');
let bodyParser       = require('body-parser');
let urlencodedParser = bodyParser.urlencoded({ extended: false });
let app              = express();
let port             = 3001;
let __OTCompiler     = require("./engine/__OTCompiler.js");

app.use(express.static(__dirname));
app.post('/', urlencodedParser, function(req, res){
    __OTCompiler().evaluator(b64DecodeUnicode(req.body.otcl))
});

var server = app.listen(port, () => {

    var host = server.address().address;
    var port = server.address().port;
    console.log("OTCL app listening at http://%s:%s", host, port);
});

app.get('/', function (req, res) {
    res.sendFile(__dirname + "/" + "index.html");
});

function b64DecodeUnicode(str) {
    str= str.replace(" ", "+");
    var atob = require('atob');
    return decodeURIComponent(atob(str).split('').map(function(c) {
        return '%' + ('00' + c.charCodeAt(0).toString(16)).slice(-2);
    }).join(''));
}