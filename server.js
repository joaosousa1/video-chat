var express = require('express')
var app = express()

//with https. note: https requied to "getUserMedia" work in chrome browser.

var fs = require('fs')
var https = require('https')

//change to your key and cert
var options = {
  key: fs.readFileSync('key.pem'),
  cert: fs.readFileSync('cert.pem')
};

var serverPort = 55555;
var server = https.createServer(options, app);


//without https
//var server = require('http').createServer(app);

var io = require('socket.io')(server);

//app.disable('x-powered-by')
var totalUsers = 0;

app.use(express.static('public'))

io.on('connection', function(socket){
        console.log("client id = " + socket.id);
        totalUsers++;
        console.log("total users: " + totalUsers);

        socket.on('Offer', function(data){
                io.emit('Offer', data);
                console.log("server user1 XXXXX " + data);
        });
        socket.on('Answer', function(data){
                io.emit('Answer', data);
                console.log("server user2 XXXXX " + data);
        });

        socket.on('disconnect', function() {
                console.log("client disconected");
                totalUsers--;
                console.log("total users: " + totalUsers);
        });

});

//without https
//server.listen(3000);

//with https

  server.listen(serverPort, function() {
  console.log('server up and running at %s port', serverPort);
});
