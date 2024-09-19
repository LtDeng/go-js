const localText = document.getElementById('localText');
const sendButton = document.getElementById('sendButton');
const messages = document.getElementById('messages');

let localConnection;
let remoteConnection;
let sendChannel;
let receiveChannel;

// Create local and remote peer connections
localConnection = new RTCPeerConnection();
remoteConnection = new RTCPeerConnection();

// Create a data channel
sendChannel = localConnection.createDataChannel('sendChannel');
sendChannel.onopen = () => console.log('Send channel opened');
sendChannel.onclose = () => console.log('Send channel closed');
sendChannel.onmessage = (event) => {
  messages.textContent += `Remote: ${event.data}\n`;
};

// Set up the remote connection to receive the data channel
remoteConnection.ondatachannel = (event) => {
  receiveChannel = event.channel;
  receiveChannel.onopen = () => console.log('Receive channel opened');
  receiveChannel.onclose = () => console.log('Receive channel closed');
  receiveChannel.onmessage = (event) => {
    messages.textContent += `Local: ${event.data}\n`;
  };
};

// Handle ICE candidates
localConnection.onicecandidate = (event) => {
  if (event.candidate) {
    remoteConnection
      .addIceCandidate(event.candidate)
      .then(() => console.log('Local ICE candidate added'))
      .catch((e) => console.error('Error adding local ICE candidate:', e));
  }
};

remoteConnection.onicecandidate = (event) => {
  if (event.candidate) {
    localConnection
      .addIceCandidate(event.candidate)
      .then(() => console.log('Remote ICE candidate added'))
      .catch((e) => console.error('Error adding remote ICE candidate:', e));
  }
};

// Create an offer and set local and remote descriptions
localConnection
  .createOffer()
  .then((offer) => localConnection.setLocalDescription(offer))
  .then(() =>
    remoteConnection.setRemoteDescription(localConnection.localDescription)
  )
  .then(() => remoteConnection.createAnswer())
  .then((answer) => remoteConnection.setLocalDescription(answer))
  .then(() =>
    localConnection.setRemoteDescription(remoteConnection.localDescription)
  )
  .catch((e) => console.error('Error during offer/answer exchange:', e));

// Send message on button click
sendButton.addEventListener('click', () => {
  const message = localText.value;
  sendChannel.send(message);
  messages.textContent += `You: ${message}\n`;
  localText.value = '';
});
