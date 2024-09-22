let connectedRef = null;
let connection;
let channel;
let messagesRef = {};
const usersRef = [];
let connectedTo;

webSocket = new WebSocket(
  process.env.REACT_APP_WEBSOCKET_URL || 'ws://localhost:9000'
);

webSocket.onmessage = (message) => {
  const data = JSON.parse(message.data);

  switch (data.type) {
    case 'login':
      onLogin(data);
      break;
    case 'updateUsers':
      updateUsersList(data);
      break;
    case 'removeUser':
      removeUser(data);
      break;
    case 'offer':
      onOffer(data);
      break;
    case 'answer':
      onAnswer(data);
      break;
    case 'candidate':
      onCandidate(data);
      break;
    default:
      break;
  }
};

webSocket.onclose = () => {
  webSocket.close();
};

function send(message) {
  webSocket.send(JSON.stringify(message));
}

function onLogin({ success, message, users: loggedIn }) {
  if (success) {
    setUsers(loggedIn);
    let localConnection = new RTCPeerConnection(configuration);
    //when the browser finds an ice candidate we send it to another peer
    localConnection.onicecandidate = ({ candidate }) => {
      let connectedTo = connectedRef;

      if (candidate && !!connectedTo) {
        send({
          name: connectedTo,
          type: 'candidate',
          candidate,
        });
      }
    };
    localConnection.ondatachannel = (event) => {
      console.log('Data channel is created!');
      let receiveChannel = event.channel;
      receiveChannel.onopen = () => {
        console.log('Data channel is open and ready to be used.');
      };
      receiveChannel.onmessage = handleDataChannelMessageReceived;
      channel = receiveChannel;
    };
    connection = localConnection;
  } else {
  }
}

function handleDataChannelMessageReceived({ data }) {
  console.log('Received message from data channel', data);
  const message = JSON.parse(data);
  const { name: user } = message;
  let messages = messagesRef.current;
  let userMessages = messages[user];
  if (userMessages) {
    userMessages = [...userMessages, message];
    let newMessages = Object.assign({}, messages, { [user]: userMessages });
    messagesRef = newMessages;
  } else {
    let newMessages = Object.assign({}, messages, { [user]: [message] });
    messagesRef = newMessages;
  }
}

function updateUsersList({ user }) {
  usersRef.push(user);
}

function removeUser({ user }) {
  let index = usersRef.indexOf(user);
  if (index > -1) {
    usersRef.splice(index, 1);
  }
}

//when somebody wants to message us
function onOffer({ offer, name }) {
  connectedTo = name;
  connectedRef = name;

  connection
    .setRemoteDescription(new RTCSessionDescription(offer))
    .then(() => connection.createAnswer())
    .then((answer) => connection.setLocalDescription(answer))
    .then(() =>
      send({ type: 'answer', answer: connection.localDescription, name })
    )
    .catch((e) => {
      console.log({ e });
    });
}

//when another user answers to our offer
function onAnswer({ answer }) {
  connection.setRemoteDescription(new RTCSessionDescription(answer));
}

//when we got ice candidate from another user
function onCandidate({ candidate }) {
  connection.addIceCandidate(new RTCIceCandidate(candidate));
}

function toggleConnection(userName) {
  if (connectedRef === userName) {
    connectedTo = '';
    connectedRef = '';
  } else {
    connectedTo = userName;
    connectedRef = userName;
    handleConnection(userName);
  }
}

function handleConnection(name) {
  var dataChannelOptions = {
    reliable: true,
  };

  let dataChannel = connection.createDataChannel(
    'messenger',
    dataChannelOptions
  );

  dataChannel.onerror = (error) => {
    console.log('Data Channel Error:', error);
  };

  dataChannel.onmessage = handleDataChannelMessageReceived;
  channel = dataChannel;

  connection
    .createOffer()
    .then((offer) => connection.setLocalDescription(offer))
    .then(() =>
      send({ type: 'offer', offer: connection.localDescription, name })
    )
    .catch((e) => {
      console.log({ e });
    });
}
