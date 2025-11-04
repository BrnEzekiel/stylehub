// src/components/Chat.js

import React, { useState, useEffect, useRef } from 'react';
import { useSocket } from '../context/SocketContext';
import { useAuth } from '../context/AuthContext';

// --- Main Chat Container (Floating Window) ---
export const ChatContainer = () => {
  const { 
    conversations, 
    activeChatId, 
    setActiveChatId, 
    isChatOpen, 
    setIsChatOpen,
    onlineUsers
  } = useSocket();
  const { user } = useAuth();
  
  // 1. 🛑 THE FIX: Show bubble if logged in, not just if messages exist
  if (!user) {
    return null; // Not logged in, show nothing
  }
  
  if (!isChatOpen) {
    // Logged in, but window is closed. Show the bubble.
    return (
      <button onClick={() => setIsChatOpen(true)} className="chat-bubble">
        💬 Chat
      </button>
    );
  }

  // Window is open
  const activeConversation = conversations[activeChatId];
  
  return (
    <div className="chat-container">
      <div className="chat-header">
        <h3>{activeConversation ? activeConversation.user.name : "Conversations"}</h3>
        <button onClick={() => setIsChatOpen(false)}>✕</button>
      </div>

      <div className="chat-body">
        <ConversationSidebar />
        
        {activeConversation ? (
          <ChatWindow conversation={activeConversation} />
        ) : (
          <div className="chat-window-placeholder">
            <p>Select a conversation to start chatting.</p>
            {user.role === 'seller' && <p>Your conversations with clients will appear here.</p>}
          </div>
        )}
      </div>
    </div>
  );
};

// --- List of Conversations ---
const ConversationSidebar = () => {
  const { conversations, setActiveChatId, activeChatId, onlineUsers } = useSocket();
  
  return (
    <div className="chat-sidebar">
      {Object.keys(conversations).length === 0 && <p style={{padding: '10px', fontSize: '0.9em', color: '#666'}}>No conversations.</p>}
      
      {Object.values(conversations).map(convo => (
        <div 
          key={convo.user.id} 
          className={`convo-item ${convo.user.id === activeChatId ? 'active' : ''}`}
          onClick={() => setActiveChatId(convo.user.id)}
        >
          <span className={`status-dot ${onlineUsers[convo.user.id] ? 'online' : ''}`}></span>
          {convo.user.name || '...'}
        </div>
      ))}
    </div>
  );
};

// --- Active Chat Window ---
const ChatWindow = ({ conversation }) => {
  const { sendMessage } = useSocket();
  const { user } = useAuth();
  const [content, setContent] = useState('');
  const messagesEndRef = useRef(null);
  
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [conversation.messages]);

  const handleSend = (e) => {
    e.preventDefault();
    if (content.trim()) {
      sendMessage(conversation.user.id, content);
      setContent('');
    }
  };

  return (
    <div className="chat-window">
      <div className="message-list">
        {conversation.messages.map((msg, index) => (
          <div 
            key={index} 
            className={`message-bubble ${msg.from === user.userId ? 'sent' : 'received'}`}
          >
            {msg.content}
          </div>
        ))}
        <div ref={messagesEndRef} />
      </div>
      
      <form onSubmit={handleSend} className="chat-input-form">
        <input 
          type="text" 
          value={content}
          onChange={(e) => setContent(e.target.value)}
          placeholder="Type a message..."
        />
        <button type="submit">Send</button>
      </form>
    </div>
  );
};