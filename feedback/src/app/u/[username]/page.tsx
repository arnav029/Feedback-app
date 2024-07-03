'use client'

import React, { useState } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { useCompletion } from 'ai/react';
import { useParams } from 'next/navigation';
import Link from 'next/link';
import { Loader2, Send, Lightbulb, ChevronRight } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Separator } from '@/components/ui/separator';
import { Card, CardHeader, CardContent } from '@/components/ui/card';
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form';
import { Textarea } from '@/components/ui/textarea';
import { toast } from '@/components/ui/use-toast';
import * as z from 'zod';
import axios from 'axios';

const messageSchema = z.object({
  content: z.string().min(1, 'Message cannot be empty'),
});

const specialChar = '||';
const parseStringMessages = (messageString: string) => messageString.split(specialChar);
const initialMessageString = "What's your favorite movie?||Do you have any pets?||What's your dream job?";

export default function SendMessage() {
  const params = useParams();
  const username = params.username;
  const [isLoading, setIsLoading] = useState(false);

  const { complete, completion, isLoading: isSuggestLoading } = useCompletion({
    api: '/api/suggest-messages',
    initialCompletion: initialMessageString,
  });

  const form = useForm({
    resolver: zodResolver(messageSchema),
    defaultValues: { content: '' },
  });

  const onSubmit = async (data: any) => {
    setIsLoading(true);
    try {
      const response = await axios.post('/api/send-message', { ...data, username });
      toast({ title: response.data.message, variant: 'default' });
      form.reset({ content: '' });
    } catch (e) {
      toast({
        title: 'Error',
        description: 'Failed to send message',
        variant: 'destructive',
      });
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-b from-gray-100 to-gray-200 flex items-center justify-center p-4">
      <Card className="w-full max-w-2xl bg-white shadow-xl rounded-xl overflow-hidden">
        <CardHeader className="bg-gray-800 text-white p-6">
          <h1 className="text-3xl font-bold text-center">Send a Message to @{username}</h1>
        </CardHeader>
        <CardContent className="p-6 space-y-6">
          <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
              <FormField
                control={form.control}
                name="content"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel className="text-lg font-semibold text-gray-700">Your Anonymous Message</FormLabel>
                    <FormControl>
                      <Textarea
                        placeholder="Write your message here..."
                        className="resize-none h-32 bg-gray-50 border-gray-300 focus:border-gray-500 focus:ring-gray-500"
                        {...field}
                      />
                    </FormControl>
                    <FormMessage className="text-red-500" />
                  </FormItem>
                )}
              />
              <div className="flex justify-end">
                <Button
                  type="submit"
                  disabled={isLoading || !form.watch('content')}
                  className="bg-gray-800 hover:bg-gray-700 text-white font-bold py-2 px-4 rounded-full transition duration-300 ease-in-out transform hover:scale-105"
                >
                  {isLoading ? (
                    <>
                      <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                      Sending...
                    </>
                  ) : (
                    <>
                      <Send className="mr-2 h-4 w-4" />
                      Send Message
                    </>
                  )}
                </Button>
              </div>
            </form>
          </Form>

          <Separator className="my-6" />

          <div className="space-y-4">
            <Button
              onClick={() => complete('')}
              disabled={isSuggestLoading}
              className="w-full bg-gray-200 hover:bg-gray-300 text-gray-800 font-semibold py-2 px-4 rounded-full transition duration-300 ease-in-out"
            >
              <Lightbulb className="mr-2 h-4 w-4" />
              Get Message Suggestions
            </Button>
            <div className="grid grid-cols-1 gap-2 mt-4">
              {typeof completion === 'string' &&
                parseStringMessages(completion).map(
                  (message, index) =>
                    typeof message === 'string' && (
                      <Button
                        key={index}
                        onClick={() => form.setValue('content', message)}
                        className="text-left bg-gray-100 hover:bg-gray-200 text-gray-800 font-medium py-2 px-4 rounded-lg transition duration-300 ease-in-out"
                      >
                        {message}
                      </Button>
                    )
                )}
            </div>
          </div>

          <Separator className="my-6" />

          <div className="text-center">
            <p className="text-gray-600 mb-4">Want your own Message Board?</p>
            <Link href="/sign-up">
              <Button className="bg-gray-800 hover:bg-gray-700 text-white font-bold py-2 px-6 rounded-full transition duration-300 ease-in-out transform hover:scale-105">
                Create Your Account
                <ChevronRight className="ml-2 h-4 w-4" />
              </Button>
            </Link>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
