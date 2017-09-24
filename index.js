var getUserMedia = require('getusermedia') // dosen't work in IE

document.getElementById("connect").disabled = true;
document.getElementById("disconnect").disabled = true;
var init;

//enable https in client connections
var io = require('socket.io-client')();

// send and recibe perr IDs from signaling server
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

  var peer = new Peer({
    initiator: location.hash === '#init',
    trickle: false,
    stream: stream,
    config: { iceServers: [ ] } // work on local lan no need STUN server
    // config: { iceServers: [ { url: 'stun:stun.l.google.com:19302' } ] } //simple-peer default 
  })


  peer.on('signal', function (data) {
    document.getElementById('yourId').value = JSON.stringify(data)


    //envia data
    if (peer.initiator) {
      init = true;
      io.emit('Offer', JSON.stringify(data));
      console.log("USER 1");

    //video self
    var videoSelf = document.createElement('video')
    videoSelf.width = 150
    document.body.appendChild(videoSelf)
    videoSelf.src = window.URL.createObjectURL(stream)
    videoSelf.muted = "muted"
    videoSelf.play()


    }

    if (!peer.initiator) {
      init = false;
      io.emit('Answer', JSON.stringify(data));
      console.log("USER 2");

    //video self
    var videoSelf = document.createElement('video')
    videoSelf.width = 150
    document.body.appendChild(videoSelf)
    videoSelf.src = window.URL.createObjectURL(stream)
    videoSelf.muted = "muted"
    videoSelf.play()
    }


  })


  document.getElementById('connect').addEventListener('click', function () {
    var otherId = JSON.parse(document.getElementById('otherId').value)
    peer.signal(otherId)
    this.disabled = true;
    document.getElementById("disconnect").disabled = false;

  })

  document.getElementById('disconnect').addEventListener('click', function () {
    peer.destroy();

    this.disabled = true;
    console.log("DISCONNECTING");

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
  peer.on('close', function () {
    document.getElementById('yourId').value = "";
    document.getElementById('otherId').value = "";
    document.getElementById("connect").disabled = true;
    document.getElementById('status').innerHTML = "Chat OffLine";
    alert("Connection close. Refresh the page to establish another connection");
  })

  peer.on('connect', function () {
    document.getElementById('status').innerHTML = "Chat OnLine";
  })
})
