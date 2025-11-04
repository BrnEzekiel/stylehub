// src/context/SocketContext.js

import React, { createContext, useContext, useState, useEffect, useRef } from 'react';
import { io } from 'socket.io-client';
import { useAuth } from './AuthContext';
import { getUserById } from '../api/userService';

const SocketContext = createContext();

export const useSocket = () => {
  return useContext(SocketContext);
};

export const SocketProvider = ({ children }) => {
  const { token, user } = useAuth();
  const socketRef = useRef(null);

  const [conversations, setConversations] = useState({});
  const [activeChatId, setActiveChatId] = useState(null);
  const [isChatOpen, setIsChatOpen] = useState(false);
  const [onlineUsers, setOnlineUsers] = useState({});

  useEffect(() => {
    if (token) {
      const socket = io('http://localhost:3001', {
        auth: {
          token: token,
        },
      });
      socketRef.current = socket;

      // Listen for incoming messages
      socket.on('receiveMessage', (message) => {
        const fromUserId = message.from;
        setConversations((prev) => {
          const chat = prev[fromUserId] || { user: { id: fromUserId, name: 'Loading...' }, messages: [] };
          return {
            ...prev,
            [fromUserId]: {
              ...chat,
              messages: [...chat.messages, message],
            },
          };
        });
        setIsChatOpen(true); 
      });

      // 1. 🛑 THE FIX: Listen for your own sent messages
      socket.on('messageSent', (message) => {
        const toUserId = message.to;
        setConversations((prev) => {
          const chat = prev[toUserId] || { user: { id: toUserId, name: 'Loading...' }, messages: [] };
          return {
            ...prev,
            [toUserId]: {
              ...chat,
              messages: [...chat.messages, message],
            },
          };
        });
      });

      // Listen for online status
      socket.on('clientStatus', ({ clientId, isOnline }) => {
        setOnlineUsers(prev => ({ ...prev, [clientId]: isOnline }));
      });
      socket.on('sellerStatus', ({ sellerId, isOnline }) => {
        setOnlineUsers(prev => ({ ...prev, [sellerId]: isOnline }));
      });

      return () => {
        socket.disconnect();
        socketRef.current = null;
      };
    } else {
      if (socketRef.current) {
        socketRef.current.disconnect();
        socketRef.current = null;
      }
      setConversations({});
      setActiveChatId(null);
      setIsChatOpen(false);
      setOnlineUsers({});
    }
  }, [token]);

  const sendMessage = (toUserId, content) => {
    if (socketRef.current) {
      socketRef.current.emit('sendMessage', { toUserId, content });
    }
  };

  const openChatWithUser = async (userId, userName) => {
    if (!conversations[userId]) {
      let name = userName;
      if (!name) {
        try {
          const user = await getUserById(userId);
          name = user.name;
        } catch (e) { name = 'Unknown User'; }
      }
      
      setConversations(prev => ({
        ...prev,
        [userId]: { user: { id: userId, name }, messages: [] }
      }));
    }
    setActiveChatId(userId);
    setIsChatOpen(true);
  };

  const value = {
    sendMessage,
    openChatWithUser,
    conversations,
    activeChatId,
    setActiveChatId,
    isChatOpen,
    setIsChatOpen,
    onlineUsers,
  };

  return (
    <SocketContext.Provider value={value}>
      {children}
    </SocketContext.Provider>
  );
};