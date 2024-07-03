import React from 'react';
import { motion } from 'framer-motion';
import { Trash2 } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Message } from '@/model/User';

interface MessageCardProps {
  message: Message;
  onMessageDelete: (id: string) => void;
  darkMode: boolean;
}

export const MessageCard: React.FC<MessageCardProps> = ({ message, onMessageDelete, darkMode }) => {
  return (
    <motion.div
      className={`p-6 rounded-lg shadow-md ${
        darkMode ? 'bg-gray-700 text-white' : 'bg-white text-gray-800'
      } transition-colors duration-300`}
      whileHover={{ scale: 1.02 }}
      transition={{ type: 'spring', stiffness: 300 }}
    >
      <div className="flex justify-between items-start mb-4">
        <h3 className="text-xl font-semibold">{message.title}</h3>
        <Button
          onClick={() => onMessageDelete(message._id)}
          variant="ghost"
          size="sm"
          className={`text-gray-500 hover:text-gray-700 ${
            darkMode ? 'hover:bg-gray-600' : 'hover:bg-gray-200'
          }`}
        >
          <Trash2 className="h-4 w-4" />
        </Button>
      </div>
      <p className={`mb-4 ${darkMode ? 'text-gray-300' : 'text-gray-600'}`}>{message.content}</p>
      <div className="flex justify-between items-center text-sm">
        <span className={`${darkMode ? 'text-gray-400' : 'text-gray-500'}`}>
          {new Date(message.createdAt).toLocaleDateString()}
        </span>
        <span className={`px-2 py-1 rounded-full ${
          darkMode ? 'bg-gray-600 text-gray-200' : 'bg-gray-200 text-gray-800'
        }`}>
          {message.category}
        </span>
      </div>
    </motion.div>
  );
};