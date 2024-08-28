import { ReactComponent as Icon } from '../assets/icons/icon-chat.svg';
import React, { useState, useEffect } from 'react';
import './Chatbot.css'; // Import CSS
import OpenAI from "openai";

const openai = new OpenAI({
  apiKey: "sk-WUeixmPs4vpTx27GAlCzHMdWfIyjmw2-uDaRU9oUUrT3BlbkFJZYIPAH_rbvw2A6tUk0J-c4HWR0gTX-CAcI0WnpA-kA",
  dangerouslyAllowBrowser: true
});

function Chatbot({ id }) {
    const [isChatVisible, setIsChatVisible] = useState(false);
    const [sendMsg, setSendMsg] = useState(true)
    const [messages, setMessages] = useState([
      { id: 1, text: "Welcome to the chat!", type: "system" },
    ]);
    const [newMessage, setNewMessage] = useState("");
    
    const[paper, setPaper] = useState(null)
  
    const handleIconClick = () => {
      setIsChatVisible(!isChatVisible); // Show the chat window
    };
  
    const handleSendMessage = async () => {
        if (newMessage.trim() && sendMsg) {
          const userMessage = newMessage;
          setMessages(messages => [...messages, { id: Date.now(), text: userMessage, type: "user" }]);
          setNewMessage("");
        }
      };

    useEffect(() => {
      fetch(`http://localhost:3001/api/papers/${id}`)
        .then(res => res.json()) // Parse response as JSON
        .then(data => {
          setPaper(data.paperContent)
        })
        .catch(err => console.error('Error fetching paper data:', err)); // Catch and log any errors
    }, [id]);

    useEffect( () => {
        console.log(messages);
        async function sendMsg() {
        if (messages[messages.length - 1].type === "user") {
            setSendMsg(false);
            try {

              const completion = await openai.chat.completions.create({
                model: "gpt-4o-mini",
                messages: [
                    { role: "system", 
                      content: "This GPT is designed to assist researchers by reading and analyzing a given scientific paper. It will provide expert-level answers to questions about the content in the paper. It should focus on clarity and accuracy, ensuring that responses are well-informed and aligned with the context of the given paper. The GPT will summarize complex information, clarify difficult concepts, and help users understand the material in depth. If the information in the paper is insufficient or unclear, it will suggest potential avenues for further research or interpretation based on the existing data. It should avoid making assumptions beyond what is presented in the paper, and instead focus on providing fact-based insights." },
                    {
                        role: "user",
                        content: "Here is the content of the paper: " + paper + ". Based on the conversation history where you are the system and the user is user: " + JSON.stringify(messages) + ", give a response to the following query: " + messages[messages.length - 1].text,
                    },
                ],
              });
              setMessages(messages => [...messages, { id: Date.now(), text: completion.choices[0].message.content, type: "system" }]);            
            } catch (error) {
              console.error("Error sending message:", error);
            }
            setSendMsg(true);
          }
        }
        sendMsg()
    }, [messages]); // This effect runs whenever the `messages` state changes

    const handleKeyDown = (event) => {
        if (event.key === 'Enter' && !event.shiftKey) {
          event.preventDefault(); // Prevent default behavior (new line)
          handleSendMessage(); // Call the send message function
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
              {messages.map(message => (
                <div 
                  key={message.id} 
                  className={`chat-message ${message.type}`}
                >
                  {message.text}
                </div>
              ))}
            </div>
            <div className="chat-footer">
              <input 
                type="text" 
                placeholder="Type a message..." 
                value={newMessage} 
                onChange={e => setNewMessage(e.target.value)}
                onKeyDown={handleKeyDown}
              />
              <button onClick={handleSendMessage}>Send</button>
            </div>
          </div>
        )}
      </div>
    );
  };
  
export default Chatbot;