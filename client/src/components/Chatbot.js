import { ReactComponent as Icon } from '../assets/icons/icon-chat.svg';
import React, { useState, useEffect, useRef } from 'react';
import './Chatbot.css';
import resizeHandle from '../assets/icons/resize-handle.png';

function Chatbot({ id }) {
  const [isChatVisible, setIsChatVisible] = useState(false);
  const [sendMsg, setSendMsg] = useState(true);
  const [isTyping, setIsTyping] = useState(false);
  const [messages, setMessages] = useState([{ id: 1, text: 'Welcome to the chat!', type: 'system' }]);
  const [newMessage, setNewMessage] = useState('');
  const [paper, setPaper] = useState(null);
  const chatWindowRef = useRef(null);

  const handleIconClick = () => {
    setIsChatVisible(!isChatVisible); // Toggle chat window visibility
  };

  const handleSendMessage = async () => {
    if (newMessage.trim() && sendMsg) {
      const userMessage = newMessage;
      setMessages((messages) => [...messages, { id: Date.now(), text: userMessage, type: 'user' }]);
      setNewMessage('');
    }
  };

  useEffect(() => {
    // Fetch the paper content without images for OpenAI interaction
    fetch(`http://localhost:3001/api/papers/${id}/without-images`)
      .then((res) => res.json())
      .then((data) => {
        setPaper(data.paperContent);
      })
      .catch((err) => console.error('Error fetching paper data without images:', err));
  }, [id]);

  useEffect(() => {
    async function sendMsg() {
      if (messages[messages.length - 1].type === 'user') {
        setSendMsg(false);
        setIsTyping(true);
        try {
          const response = await fetch('http://localhost:3001/api/chat', {
            method: 'POST',
            headers: {
              'Content-Type': 'application/json',
            },
            body: JSON.stringify({ messages, paper }),
          });

          const data = await response.json();
          setMessages((messages) => [...messages, { id: Date.now(), text: data.response, type: 'system' }]);
        } catch (error) {
          console.error('Error sending message:', error);
        }
        setSendMsg(true);
        setIsTyping(false);
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

  // Resize functionality for the top left corner
  useEffect(() => {
    const chatWindow = chatWindowRef.current;
    let isResizing = false;
    let startX, startY, initialWidth, initialHeight;

    const onMouseDownResize = (e) => {
      e.preventDefault(); // Prevent default drag behavior
      isResizing = true;
      startX = e.clientX;
      startY = e.clientY;
      initialWidth = chatWindow.offsetWidth;
      initialHeight = chatWindow.offsetHeight;
      document.addEventListener('mousemove', onMouseMoveResize);
      document.addEventListener('mouseup', onMouseUpResize);
    };

    const onMouseMoveResize = (e) => {
      if (!isResizing) return;

      const dx = startX - e.clientX; // Horizontal movement
      const dy = startY - e.clientY; // Vertical movement

      // Set new dimensions with restrictions
      const newWidth = Math.min(Math.max(initialWidth + dx, 280), 405); // Restrict width between 280px and 405px
      const newHeight = Math.min(Math.max(initialHeight + dy, 300), 665); // Restrict height between 300px and 665px

      // Adjust dimensions based on boundaries
      chatWindow.style.width = `${newWidth}px`;
      chatWindow.style.height = `${newHeight}px`;
    };

    const onMouseUpResize = () => {
      isResizing = false;
      document.removeEventListener('mousemove', onMouseMoveResize);
      document.removeEventListener('mouseup', onMouseUpResize);
    };

    if (chatWindow) {
      const resizeHandle = chatWindow.querySelector('.resize-handle-top-left');
      resizeHandle.addEventListener('mousedown', onMouseDownResize);
      resizeHandle.addEventListener('dragstart', (e) => e.preventDefault()); // Prevent the image from being dragged
    }

    return () => {
      if (chatWindow) {
        const resizeHandle = chatWindow.querySelector('.resize-handle-top-left');
        resizeHandle.removeEventListener('mousedown', onMouseDownResize);
        resizeHandle.removeEventListener('dragstart', (e) => e.preventDefault());
      }
    };
  }, [isChatVisible]);

  // Function to maximize chat window
  const handleMaximize = () => {
    const chatWindow = chatWindowRef.current;
    chatWindow.style.width = '405px'; // Max width
    chatWindow.style.height = '665px'; // Max height
  };

  // Function to collapse chat window
  const handleCollapse = () => {
    setIsChatVisible(false);
  };

  return (
    <div className="chat-popup">
      <div className="chat-icon" onClick={handleIconClick}>
        <Icon className="icon-chat" />
      </div>
      {isChatVisible && (
        <div className="chat-window show" ref={chatWindowRef}>
          <div className="resize-handle-top-left">
            <img src={resizeHandle} className="resizeHandle" alt="resize handle" />
          </div> {/* Resize handle at the top left */}
          <div className="chat-header">
            <h2>Chat</h2>
            <div className="chat-controls">
              <button className="collapse-button" onClick={handleCollapse}>−</button>
              <button className="maximize-button" onClick={handleMaximize}>⤢</button>
            </div>
          </div>
          <div className="chat-body">
            {messages.map((message) => (
              <div key={message.id} className={`chat-message ${message.type}`}>
                {message.text}
              </div>
            ))}
            {isTyping && <div className="typing-indicator">Chatbot is typing...</div>} {/* Moved inside chat-body */}
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
