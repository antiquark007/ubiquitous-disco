import React from 'react';
import ChatBot from '../pages/ChatBot';

const ChatbotWrapper: React.FC = () => {
  return (
    <div className="fixed bottom-4 right-4 z-50">
      <ChatBot />
    </div>
  );
};

export default ChatbotWrapper; 