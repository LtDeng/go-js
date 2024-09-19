import React, { Fragment, useState, useEffect, useRef } from 'react';
import {
  Header,
  Icon,
  Input,
  Grid,
  Segment,
  Button,
  Loader,
} from 'semantic-ui-react';
import { format } from 'date-fns';
import './App.css';
import MessageBox from './MessageBox';
import UsersList from './UsersList';
import Alert from './Alert';

// Use for remote connections
// const configuration = {
//   iceServers: [{ url: 'stun:stun.1.google.com:19302' }],
// };

// Use for local connections
const configuration = null;

const Chat = ({
  connection,
  updateConnection,
  channel,
  updateChannel,
  socketMessages,
  onSend,
}) => {
  const [socketOpen, setSocketOpen] = useState(false);

  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [name, setName] = useState('');
  const [loggingIn, setLoggingIn] = useState(false);
  const [users, setUsers] = useState([]);
  const [connectedTo, setConnectedTo] = useState('');
  const [connecting, setConnecting] = useState(false);
  const [alert, setAlert] = useState(null);
  const connectedRef = useRef();
  const [message, setMessage] = useState('');
  const messagesRef = useRef({});
  const [messages, setMessages] = useState({});

  useEffect(() => {
    let data = socketMessages.pop();
    if (data) {
      console.log('Received message from websocket', data);
      switch (data.type) {
        case 'connect':
          setSocketOpen(true);
          break;
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
    }
  }, [socketMessages]);

  const closeAlert = () => {
    setAlert(null);
  };

  const send = (data) => {
    onSend(JSON.stringify(data));
  };

  const handleLogin = () => {
    setLoggingIn(true);
    send({
      type: 'login',
      name,
    });
  };

  const updateUsersList = ({ user }) => {
    setUsers((prev) => [...prev, user]);
  };

  const removeUser = ({ user }) => {
    setUsers((prev) => prev.filter((u) => u.userName !== user.userName));
  };

  const handleDataChannelMessageReceived = ({ data }) => {
    console.log('Received message from data channel', data);
    const message = JSON.parse(data);
    const { name: user } = message;
    let messages = messagesRef.current;
    let userMessages = messages[user];
    if (userMessages) {
      userMessages = [...userMessages, message];
      let newMessages = Object.assign({}, messages, { [user]: userMessages });
      messagesRef.current = newMessages;
      setMessages(newMessages);
    } else {
      let newMessages = Object.assign({}, messages, { [user]: [message] });
      messagesRef.current = newMessages;
      setMessages(newMessages);
    }
  };

  const onLogin = ({ success, message, users: loggedIn }) => {
    setLoggingIn(false);
    if (success) {
      setAlert(
        <Alert title='Success!' onClose={closeAlert}>
          Logged in successfully!
        </Alert>
      );
      setIsLoggedIn(true);
      setUsers(loggedIn);
      let localConnection = new RTCPeerConnection(configuration);
      //when the browser finds an ice candidate we send it to another peer
      localConnection.onicecandidate = ({ candidate }) => {
        let connectedTo = connectedRef.current;

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
        updateChannel(receiveChannel);
      };
      updateConnection(localConnection);
    } else {
      setAlert(
        <Alert title='Failed' onClose={closeAlert}>
          {message}
        </Alert>
      );
    }
  };

  //when somebody wants to message us
  const onOffer = ({ offer, name }) => {
    setConnectedTo(name);
    connectedRef.current = name;

    connection
      .setRemoteDescription(new RTCSessionDescription(offer))
      .then(() => connection.createAnswer())
      .then((answer) => connection.setLocalDescription(answer))
      .then(() =>
        send({ type: 'answer', answer: connection.localDescription, name })
      )
      .catch((e) => {
        console.log({ e });
        setAlert(
          <Alert title='Failed' onClose={closeAlert}>
            An error has occurred.
          </Alert>
        );
      });
  };

  //when another user answers to our offer
  const onAnswer = ({ answer }) => {
    connection.setRemoteDescription(new RTCSessionDescription(answer));
  };

  //when we got ice candidate from another user
  const onCandidate = ({ candidate }) => {
    connection.addIceCandidate(new RTCIceCandidate(candidate));
  };

  //when a user clicks the send message button
  const sendMsg = () => {
    const time = format(new Date(), "yyyy-MM-dd'T'HH:mm:ss.SSSxxx");
    let text = { time, message, name };
    let messages = messagesRef.current;
    let connectedTo = connectedRef.current;
    let userMessages = messages[connectedTo];
    if (messages[connectedTo]) {
      userMessages = [...userMessages, text];
      let newMessages = Object.assign({}, messages, {
        [connectedTo]: userMessages,
      });
      messagesRef.current = newMessages;
      setMessages(newMessages);
    } else {
      userMessages = Object.assign({}, messages, { [connectedTo]: [text] });
      messagesRef.current = userMessages;
      setMessages(userMessages);
    }
    channel.send(JSON.stringify(text));
    setMessage('');
  };

  const handleConnection = (name) => {
    var dataChannelOptions = {
      reliable: true,
    };

    let dataChannel = connection.createDataChannel(
      'messenger',
      dataChannelOptions
    );

    dataChannel.onerror = (error) => {
      setAlert(
        <Alert title='Failed' onClose={closeAlert}>
          An error has occurred.
        </Alert>
      );
    };

    dataChannel.onmessage = handleDataChannelMessageReceived;
    updateChannel(dataChannel);

    connection
      .createOffer()
      .then((offer) => connection.setLocalDescription(offer))
      .then(() =>
        send({ type: 'offer', offer: connection.localDescription, name })
      )
      .catch((e) =>
        setAlert(
          <Alert title='Failed' onClose={closeAlert}>
            An error has occurred.
          </Alert>
        )
      );
  };

  const toggleConnection = (userName) => {
    if (connectedRef.current === userName) {
      setConnecting(true);
      setConnectedTo('');
      connectedRef.current = '';
      setConnecting(false);
    } else {
      setConnecting(true);
      setConnectedTo(userName);
      connectedRef.current = userName;
      handleConnection(userName);
      setConnecting(false);
    }
  };
  return (
    <div className='App'>
      {alert}

      <Header as='h2' icon>
        <Icon name='users' />
        Simple WebRTC Chap App
      </Header>

      {(socketOpen && (
        <Fragment>
          <Grid centered columns={4}>
            <Grid.Column>
              {(!isLoggedIn && (
                <Input
                  fluid
                  disabled={loggingIn}
                  type='text'
                  onChange={(e) => setName(e.target.value)}
                  placeholder='Username...'
                  action
                >
                  <input />
                  <Button
                    color='teal'
                    disabled={!name || loggingIn}
                    onClick={handleLogin}
                  >
                    <Icon name='sign-in' />
                    Login
                  </Button>
                </Input>
              )) || (
                <Segment raised textAlign='center' color='olive'>
                  Logged In as: {name}
                </Segment>
              )}
            </Grid.Column>
          </Grid>
          <Grid>
            <UsersList
              users={users}
              toggleConnection={toggleConnection}
              connectedTo={connectedTo}
              connection={connecting}
            />
            <MessageBox
              messages={messages}
              connectedTo={connectedTo}
              message={message}
              setMessage={setMessage}
              sendMsg={sendMsg}
              name={name}
            />
          </Grid>
        </Fragment>
      )) || (
        <Loader size='massive' active inline='centered'>
          Loading
        </Loader>
      )}
    </div>
  );
};

export default Chat;
