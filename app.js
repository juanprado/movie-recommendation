var express = require("express")
var express = require('express');
var favicon = require('serve-favicon');
var logger = require('morgan');
var methodOverride = require('method-override');
var session = require('express-session');
var bodyParser = require('body-parser');
var multer = require('multer');
var errorHandler = require('errorhandler');
var path = require('path');

var http = require('http'),
app = express(),
server = http.createServer(app),
io = require("socket.io").listen(server);

app.set('port', process.env.PORT || 3000);
app.use(methodOverride());
app.use(session({ resave: true, saveUninitialized: true, 
                      secret: 'uwotm8' }));

// parse application/json
app.use(bodyParser.json());                        

// parse application/x-www-form-urlencoded
app.use(bodyParser.urlencoded({ extended: true }));

// parse multipart/form-data
app.use(multer());

app.use(express.static(path.join(__dirname, 'public')));

app.get("/", function(req, res, next) {
    res.send(__dirname + "/index.html", "utf8");
});

app.put("/movie", function(req, res, next) {
    console.log(req.body);
    io.sockets.emit("newMovie", {data: req.body});
    res.send({"foo": true});
});

app.put("/accept", function(req, res, next) {
    console.log(req.body);
    io.sockets.emit("accepted", {data: req.body});
    res.send({"foo": true});
});

server.listen(app.get('port'), function(){
    console.log('Express server on port ' + app.get('port'));
});