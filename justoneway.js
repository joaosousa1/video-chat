/*
This code is the same as index.js file but the streaming only works in one direction.
The device_A recive the stream and devide_B only send the stream. 
In this case, it's no longer a "chat" :P
*/

var getUserMedia = require('getusermedia') // não funciona no chrome esta cheio de bugs

document.getElementById("connect").disabled = true;
var init;

//https enable
var io = require('socket.io-client')();

io.on('connect', function(){})

io.on('Offer', function(x){
  if (!init){
    document.getElementById('otherId').value = x;
    console.log("========SIGNAL-offer=========");
    document.getElementById("connect").disabled = false;
  }
});
io.on('Answer', function(x){
  if (init){
    document.getElementById('otherId').value = x;
    console.log("========SIGNAL-answer=========");
    document.getElementById("connect").disabled = false;
  }
});
io.on('disconnect', function(){});


getUserMedia({ video: true, audio: true }, function (err, stream) {
  if (err) return console.error(err)


  var Peer = require('simple-peer')

  if (location.hash === '#init'){ // peer envia imagens (com stream)

  var peer = new Peer({
    initiator: location.hash === '#init',
    trickle: false,
    stream: stream,
    config: { iceServers: [ ] }
  })

  }

  if (location.hash != '#init') { // peer recebe imagens (sem stream)

  var peer = new Peer({
    initiator: location.hash === '#init',
    trickle: false
  })
  }

  peer.on('signal', function (data) {
    document.getElementById('yourId').value = JSON.stringify(data)


    //send data
    if (peer.initiator) {
      init = true;
      io.emit('Offer', JSON.stringify(data));
      console.log("USER 1");

    //see selfie camera	
    var video = document.createElement('video')
    document.body.appendChild(video)
    video.src = window.URL.createObjectURL(stream)
    video.play()

    }


    if (!peer.initiator) {
      init = false;
      io.emit('Answer', JSON.stringify(data));
      console.log("USER 2");
    }
  })


  document.getElementById('connect').addEventListener('click', function () {
    var otherId = JSON.parse(document.getElementById('otherId').value)
    peer.signal(otherId)
  })


  document.getElementById('send').addEventListener('click', function () {
    var yourMessage = document.getElementById('yourMessage').value
    peer.send(yourMessage)
  })

  peer.on('data', function (data) {
    document.getElementById('messages').textContent += data + '\n'
  })

  peer.on('stream', function (stream) {

    var video = document.createElement('video')
    document.body.appendChild(video)

    video.src = window.URL.createObjectURL(stream)
    video.play()
  })
})
