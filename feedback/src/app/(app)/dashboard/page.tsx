'use client'

import React, { useCallback, useEffect, useState } from 'react';
import { useSession } from 'next-auth/react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import axios, { AxiosError } from 'axios';
import { motion, AnimatePresence } from 'framer-motion';
import { Loader2, RefreshCcw, Copy, Moon, Sun, MessageSquare } from 'lucide-react';
import { User } from 'next-auth';

import { MessageCard } from '@/components/MessageCard';
import { Button } from '@/components/ui/button';
import { Switch } from '@/components/ui/switch';
import { useToast } from '@/components/ui/use-toast';
import { Message } from '@/model/User';
import { ApiResponse } from '@/types/ApiResponse';
import { AcceptMessageSchema } from '@/schemas/acceptMessageSchema';

function WhisperBoxDashboard() {
  const [messages, setMessages] = useState<Message[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [isSwitchLoading, setIsSwitchLoading] = useState(false);
  const [darkMode, setDarkMode] = useState(false);

  const { toast } = useToast();
  const { data: session } = useSession();

  const form = useForm({
    resolver: zodResolver(AcceptMessageSchema),
  });

  const { register, watch, setValue } = form;
  const acceptMessages = watch('acceptMessages');

  const fetchAcceptMessages = useCallback(async () => {
    setIsSwitchLoading(true);
    try {
      const response = await axios.get<ApiResponse>('/api/accept-messages');
      setValue('acceptMessages', response.data.isAcceptingMessages);
    } catch (error) {
      const axiosError = error as AxiosError<ApiResponse>;
      toast({
        title: 'Whisper Error',
        description: axiosError.response?.data.message ?? 'Failed to fetch whisper settings.',
        variant: 'destructive',
      });
    } finally {
      setIsSwitchLoading(false);
    }
  }, [setValue, toast]);

  const fetchMessages = useCallback(async (refresh: boolean = false) => {
    setIsLoading(true);
    try {
      const response = await axios.get<ApiResponse>('/api/get-messages');
      setMessages(response.data.messages || []);
      if (refresh) {
        toast({
          title: 'Whispers Refreshed',
          description: 'Displaying the latest whispers.',
        });
      }
    } catch (error) {
      const axiosError = error as AxiosError<ApiResponse>;
      toast({
        title: 'Whisper Error',
        description: axiosError.response?.data.message ?? 'Failed to fetch whispers.',
        variant: 'destructive',
      });
    } finally {
      setIsLoading(false);
    }
  }, [toast]);



  useEffect(() => {
    if (!session || !session.user) return;
    fetchMessages();
    fetchAcceptMessages();
  }, [session, fetchAcceptMessages, fetchMessages]);

  const handleSwitchChange = async () => {
    try {
      const response = await axios.post<ApiResponse>('/api/accept-messages', {
        acceptMessages: !acceptMessages,
      });
      setValue('acceptMessages', !acceptMessages);
      toast({
        title: response.data.message,
        variant: 'default',
      });
    } catch (error) {
      const axiosError = error as AxiosError<ApiResponse>;
      toast({
        title: 'Whisper Error',
        description: axiosError.response?.data.message ?? 'Failed to update whisper settings.',
        variant: 'destructive',
      });
    }
  };

  if (!session || !session.user) {
    return null;
  }

  const { username } = session.user as User;
  const baseUrl = `${window.location.protocol}//${window.location.host}`;
  const profileUrl = `${baseUrl}/u/${username}`;

  const copyToClipboard = () => {
    navigator.clipboard.writeText(profileUrl);
    toast({
      title: 'Whisper Link Copied!',
      description: 'Your WhisperBox link has been copied.',
    });
  };

  
  return (
    <div className={`min-h-screen ${darkMode ? 'bg-gray-900 text-white' : 'bg-gray-100 text-gray-800'} transition-colors duration-300`}>
      <div className="container mx-auto py-8 px-4">
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className={`p-8 rounded-xl shadow-lg ${darkMode ? 'bg-gray-800' : 'bg-white'}`}
        >
          <div className="flex justify-between items-center mb-8">
            <h1 className="text-4xl font-bold">WhisperBox Dashboard</h1>
            <Button
              onClick={() => setDarkMode(!darkMode)}
              variant="outline"
              size="icon"
              className={`rounded-full ${darkMode ? 'bg-gray-700 text-gray-300' : 'bg-gray-200 text-gray-800'} transition-all duration-300`}
            >
              {darkMode ? <Sun className="h-5 w-5" /> : <Moon className="h-5 w-5" />}
            </Button>
          </div>

          <motion.div 
            className={`mb-8 p-6 rounded-lg ${darkMode ? 'bg-gray-700' : 'bg-gray-200'}`}
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.5 }}
          >
            <h2 className="text-xl font-semibold mb-4">Your Unique Whisper Link</h2>
            <div className="flex items-center">
              <input
                type="text"
                value={profileUrl}
                readOnly
                className={`flex-grow p-3 rounded-l-md ${darkMode ? 'bg-gray-600 text-white' : 'bg-white text-gray-800'} focus:outline-none`}
              />
              <Button onClick={copyToClipboard} className={`rounded-l-none ${darkMode ? 'bg-gray-600 hover:bg-gray-500' : 'bg-gray-300 hover:bg-gray-400'} transition-colors duration-300`}>
                <Copy className="h-4 w-4 mr-2" /> Copy
              </Button>
            </div>
          </motion.div>

          <motion.div 
            className={`flex items-center justify-between mb-8 p-6 rounded-lg ${darkMode ? 'bg-gray-700' : 'bg-gray-200'}`}
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.5, delay: 0.2 }}
          >
            <div className="flex items-center">
              <Switch
                {...register('acceptMessages')}
                checked={acceptMessages}
                onCheckedChange={handleSwitchChange}
                disabled={isSwitchLoading}
                className={`${acceptMessages ? 'bg-gray-400' : 'bg-gray-600'} relative inline-flex h-6 w-11 items-center rounded-full transition-colors focus:outline-none focus:ring-2 focus:ring-gray-500 focus:ring-offset-2`}
              />
              <span className="ml-3 text-lg font-medium">
                Accept Whispers: {acceptMessages ? 'On' : 'Off'}
              </span>
            </div>
            <MessageSquare className={`h-8 w-8 ${acceptMessages ? 'text-gray-600' : 'text-gray-400'}`} />
          </motion.div>

          <div className="flex justify-between items-center mb-6">
            <h2 className="text-3xl font-semibold">Your Whispers</h2>
            <Button
              onClick={() => fetchMessages(true)}
              variant="outline"
              className={`${darkMode ? 'bg-gray-700 hover:bg-gray-600' : 'bg-gray-200 hover:bg-gray-300'} transition-all duration-300`}
            >
              {isLoading ? (
                <Loader2 className="h-4 w-4 animate-spin" />
              ) : (
                <RefreshCcw className="h-4 w-4" />
              )}
              <span className="ml-2">Refresh</span>
            </Button>
          </div>

          <motion.div layout className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <AnimatePresence>
              {messages.length > 0 ? (
                messages.map((message) => (
                  <motion.div
                    key={message._id}
                    initial={{ opacity: 0, scale: 0.9 }}
                    animate={{ opacity: 1, scale: 1 }}
                    exit={{ opacity: 0, scale: 0.9 }}
                    transition={{ duration: 0.3 }}
                    className="transform hover:scale-105 transition-transform duration-300"
                  >
                    <MessageCard
                      message={message}
                      onMessageDelete={(id) => setMessages(messages.filter((m) => m._id !== id))}
                      darkMode={darkMode}
                    />
                  </motion.div>
                ))
              ) : (
                <motion.div
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  className="col-span-2 text-center py-12"
                >
                  <MessageSquare className="h-16 w-16 mx-auto mb-4 text-gray-400" />
                  <p className="text-xl text-gray-500">No whispers to display.</p>
                </motion.div>
              )}
            </AnimatePresence>
          </motion.div>
        </motion.div>
      </div>
    </div>
  );
}

export default WhisperBoxDashboard;