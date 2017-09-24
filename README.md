** Establishing a P2P connection between device_A and device_B to send video streaming from webcam (video chat). **

First let's install dependencies and build the bundle:

```npm install```

```npm run build```

Start the signaling server:

```node server.js```

note: Server.js use the socket.io to extange IDs between two peer devices. See the code to understand how is implemented. The video-chat only works in local lan.
If you want to work over internet you need a STUN server.
Change the peer config...

```config: { iceServers: [ ] }```

to:

```config: { iceServers: [ { url: 'stun:stun.l.google.com:19302' } ] }```

Open the browser on "device_A":

```firefox <ip_server>:3000```

Open the browser on devide_B in same url but add the location hash "#init"

```firefox <ip_server>:3000/#init```

Wait a few seconds until the device_A get the ID from devide_B.
Press the "connect" button once it is activated.

Then, press the button "connect" on device_B after get the ID of device_A.

If everthing is ok it will be establish a connection P2P between the 2 devices. The device_B will send the audio and video from webcam to device_A and Vice-versa.

note: We need to enable https to getUserMedia work in Chrome browser.
See in "server.js" comments how to enable https in express js.

To create a self-signed certificate with openssl run the following commands:

```openssl req -newkey rsa:2048 -new -nodes -keyout key.pem -out csr.pem```

```openssl req -newkey rsa:2048 -new -nodes -x509 -days 3650 -keyout key.pem -out cert.pem```



** Portuguese readme **


Primeiro instalamos as dependências e criamos o bundle:

```npm install```

```npm run build```

Iniciar servidor:

```node server.js```

O "server.js" é o signaling server. Ou seja envia a ID para os devices que tentam estabelecer uma ligação P2P.
Neste caso foi utilizado o socket.io para estabelecer essa "ligação" enter os dois peer's.
Após essa ligação ser estabelecida não é mais necessário o server.js.

Nota: O video-chat está configurado para funcinar apenas entre dois peers na mesma rede local.
Se quiser que funcione atraves da internet é preciso usar um STUN server.
Basta editar a configuração do peer de...

```config: { iceServers: [ ] }```

para:

```config: { iceServers: [ { url: 'stun:stun.l.google.com:19302' } ] }```

No exemplo em cima é utilizado um servidor stun do google.


Agora é só abrir o browser no "device_A" que vai ficar à "escuta" pelo socket.io:

```firefox <ip_server>:3000```

Abrir o browser no "device_B" que vai iniciar o P2P:

```firefox <ip_server>:3000/#init```

Aguarde alguns segundos até o browser do "device_A" receba o ID do "device_B".
Prima o botão "connect" assim que este estiver ativado.

No browser do "device_B" prima o botão "connect" assim que receba o ID do outro device.

Se tudo correr como previsto será estabelecida uma ligação P2P entre os dois devices. Neste caso o device_B envia um streaming de som e imagem da webcam para o device_A.

nota: Para funcionar no Chrome é preciso usar o https, veja nos comentarios do server.js como ativar o https.

Para criar um certificado auto-assinado com openssl, execute os seguintes comandos:

```openssl req -newkey rsa:2048 -new -nodes -keyout key.pem -out csr.pem```

```openssl req -newkey rsa:2048 -new -nodes -x509 -days 3650 -keyout key.pem -out cert.pem```
