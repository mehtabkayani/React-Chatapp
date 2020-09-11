import React, { useState, useEffect, useRef } from "react";
import io from "socket.io-client";
import styles from './styles.css'
import styled from "styled-components";
import { makeStyles } from '@material-ui/core/styles';
import Avatar from '@material-ui/core/Avatar';
import { deepOrange, deepPurple } from '@material-ui/core/colors';
import { SketchPicker } from 'react-color'

const useStyles = makeStyles((theme) => ({
    root: {
      display: 'flex',
      '& > *': {
        margin: theme.spacing(1),
      },
    },
    orange: {
      color: theme.palette.getContrastText(deepOrange[500]),
      backgroundColor: deepOrange[500],
    },
    purple: {
      color: theme.palette.getContrastText(deepPurple[500]),
      backgroundColor: deepPurple[500],
    },
  }));


const Chat = ({ email , handleLogout}) => {
    const classes = useStyles();
    const [yourID, setYourID] = useState();
    const [messages, setMessages] = useState([]);
    const [emails, setEmails] = useState([]);
    const [name, setName] = useState("");
    const [names, setNames] = useState([]);
    const [message, setMessage] = useState("");
    const [currentTyping, setCurrentTyping] = useState("");
    const [hasName, setHasName] = useState(false);
    const [fellowUser, setFellowUser] = useState("");

    const socketRef = useRef();
   
    useEffect(() => {
        
        socketRef.current = io("http://localhost:8000", {
            transports: ["websocket", "polling"] 
        });
        
        //Emit events sends to server
        if (email != '') {
            socketRef.current.emit('userEmail', email);   
        }     
        
        //Listen for events from server
        socketRef.current.on('userEmail', function (data) {
            //console.log(data);
            setEmails(oldEmails => [...oldEmails, data])
        })

    

        socketRef.current.on('typing', function (data) {
            setCurrentTyping(data + ' is typing a message..');
            setFellowUser(data);

        })

        socketRef.current.on('name', name => {
            receivedNames(name)

        })

        socketRef.current.on("your id", id => {
            setYourID(id);
        })

        socketRef.current.on("message", (message) => {
            receivedMessage(message);
        })
  return () => {
      socketRef.current.disconnect()
  }
    }, []);


    function handleKeyPress() {
        socketRef.current.emit('typing', name)
    }
  


    function receivedMessage(message) {
        setCurrentTyping('');
        setMessages(oldMsgs => [...oldMsgs, message]);
    }
    function receivedNames(name) {
        
        setNames(name);
    }


    function sendMessage(e) {
        e.preventDefault();
        const messageObject = {
            body: message,
            id: yourID,
            mail: email
        };
        setMessage("");
        socketRef.current.emit("send message", messageObject);
    }


    function handleChange(e) {
        setMessage(e.target.value);
    }

    function sendName(e) {
        e.preventDefault();

        socketRef.current.emit('name', name)
        setHasName(true)
        //setName("");
    }

    function handleName(e) {
        setName(e.target.value);
    }
function logout(){
    socketRef.current.emit('logout', name)
    handleLogout();
}

    return (
        <div className="chat-container">
            <header className="chat-header">
                <h1><i className="fas fa-smile"></i> Chat Dashboard</h1>
            </header>
             <button  onClick={logout}>Leave room</button>

            <main className="chat-main">
                <div className="chat-sidebar">

                    <h3><i className="fas fa-users"></i> Users</h3>

                    <ul id="users">
                    
                    
                     {names.map((name, index) => { return <li key={index}>{name}</li> })}
                     
                    </ul>
                </div>

                <div className="chat-messages">
                    {messages.map((message, index) => {
                        if (message.id === yourID) {
                            return (
                                <MyRow key={index}>
                                    <MyMessage>
                                    <strong>YOU:</strong>
                            <Avatar alt={name} className={classes.purple}></Avatar>
                                        {message.body}

                                    </MyMessage>
                                </MyRow>

                            )
                        }
                        return (
                            <PartnerRow key={index}>
                                <PartnerMessage>
                                <Avatar alt={name} className={classes.purple}></Avatar>
                                    <strong>{fellowUser}:</strong>
                                    <br />
                                    {message.body}
                                </PartnerMessage>
                            </PartnerRow>
                        )
                    })}
                    <p><em>{currentTyping}</em></p>

                </div>
            </main>
            <div className="chat-form-container">

                {hasName ?  
                  <form id="chat-form" onSubmit={sendMessage}>
                  <input
                      id="msg"
                      type="text"
                      required
                      onKeyPress={handleKeyPress}
                      value={message}
                      onChange={handleChange}
                      placeholder="Say something..."
                  />
                  <button className="btn"><i className="fas fa-paper-plane"></i> Send</button>
                  <SketchPicker />
              </form>
            :
            
            <form id="chat-form" onSubmit={sendName}>
                    <input
                        id="msg2"
                        type="text"
                        required
                        value={name}
                        onChange={handleName}
                        placeholder="Enter your name to join..."
                    />
                    <button className="btn"><i className="fas fa-paper-plane"></i> Join chat</button>
                </form>
            }
                
              
            </div>
        </div>
    );
}

const MyRow = styled.div`
  width: 100%;
  display: flex;
  justify-content: flex-end;
  margin-top: 10px;
`;

const MyMessage = styled.div`
  width: 45%;
  background-color: pink;
  color: #46516e;
  padding: 10px;
  margin-right: 5px;
  text-align: center;
  border-top-right-radius: 10%;
  border-bottom-right-radius: 10%;
`;

const PartnerRow = styled(MyRow)`
  justify-content: flex-start;
`;

const PartnerMessage = styled.div`
  width: 45%;
  background-color: yellow;
  color: black;
  border: 1px solid lightgray;
  padding: 10px;
  margin-left: 5px;
  text-align: center;
  border-top-left-radius: 10%;
  border-bottom-left-radius: 10%;
`;

export default Chat;
