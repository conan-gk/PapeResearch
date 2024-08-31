import { ReactComponent as Icon } from '../assets/icons/icon-chat.svg';
import React, { useState, useEffect } from 'react';
import './Chatbot.css'; 

function Chatbot({ id }) {
  const [isChatVisible, setIsChatVisible] = useState(false);
  const [sendMsg, setSendMsg] = useState(true);
  const [messages, setMessages] = useState([
    { id: 1, text: 'Welcome to the chat!', type: 'system' },
  ]);
  const [newMessage, setNewMessage] = useState('');
  const [paper, setPaper] = useState(null);

  const handleIconClick = () => {
    setIsChatVisible(!isChatVisible); // Show chat window
  };

  const handleSendMessage = async () => {
    if (newMessage.trim() && sendMsg) {
      const userMessage = newMessage;
      setMessages((messages) => [
        ...messages,
        { id: Date.now(), text: userMessage, type: 'user' },
      ]);
      setNewMessage('');
    }
  };

  useEffect(() => {
    fetch(`http://localhost:3001/api/papers/${id}`)
      .then((res) => res.json())
      .then((data) => {
        setPaper(data.paperContent);
      })
      .catch((err) => console.error('Error fetching paper data:', err)); // Catch and log any errors
  }, [id]);

  useEffect(() => {
    async function sendMsg() {
      if (messages[messages.length - 1].type === 'user') {
        setSendMsg(false);
        try {
          // Send messages and paper content to backend
          const response = await fetch('http://localhost:3001/api/chat', {
            method: 'POST',
            headers: {
              'Content-Type': 'application/json',
            },
            body: JSON.stringify({ messages, paper }),
          });

          const data = await response.json();
          setMessages((messages) => [
            ...messages,
            { id: Date.now(), text: data.response, type: 'system' },
          ]);
        } catch (error) {
          console.error('Error sending message:', error);
        }
        setSendMsg(true);
      }
    }
    sendMsg();
  }, [messages]);

  const handleKeyDown = (event) => {
    if (event.key === 'Enter' && !event.shiftKey) {
      event.preventDefault();
      handleSendMessage();
    }
  };

  return (
    <div className="chat-popup">
      {/* Chat Icon */}
      <div className="chat-icon" onClick={handleIconClick}>
        <Icon className="icon-chat" />
      </div>
      {/* Chat Window */}
      {isChatVisible && (
        <div className="chat-window show">
          <div className="chat-header">
            <h2>Chat</h2>
          </div>
          <div className="chat-body">
            {/* Display messages */}
            {messages.map((message) => (
              <div key={message.id} className={`chat-message ${message.type}`}>
                {message.text}
              </div>
            ))}
          </div>
          <div className="chat-footer">
            <input
              type="text"
              placeholder="Type a message..."
              value={newMessage}
              onChange={(e) => setNewMessage(e.target.value)}
              onKeyDown={handleKeyDown}
            />
            <button onClick={handleSendMessage}>Send</button>
          </div>
        </div>
      )}
    </div>
  );
}

export default Chatbot;