

'use client';

import React, { useState } from 'react';
import axios, { AxiosError } from 'axios';
import { zodResolver } from '@hookform/resolvers/zod';
import { useForm } from 'react-hook-form';
import { Loader2 } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Separator } from '@/components/ui/separator';
import { CardHeader, CardContent, Card } from '@/components/ui/card';
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from '@/components/ui/form';
import { Textarea } from '@/components/ui/textarea';
import * as z from 'zod';
import { ApiResponse } from '@/types/ApiResponse';
import Link from 'next/link';
import { useParams } from 'next/navigation';
import { messageSchema } from '@/schema/messageSchema';
import { toast } from '@/hooks/use-toast';

const specialChar = '||';

const parseStringMessages = (messageString:string) => {
  return messageString.split(specialChar);
};

export default function SendMessage() {
  const params = useParams<{ username: string }>();
  const username = params.username;

  const form = useForm<z.infer<typeof messageSchema>>({
    resolver: zodResolver(messageSchema),
  });

  const messageContent = form.watch('content');

  const handleMessageClick = (message: string) => {
    form.setValue('content', message);
  };

  const [isLoading, setIsLoading] = useState(false);
  const [suggestedMessages, setSuggestedMessages] = useState<string[]>([]);
  const [isSuggestLoading, setIsSuggestLoading] = useState(false);
  const [messageIndex, setMessageIndex] = useState(0); // Keeps track of the current index

  const onSubmit = async (data: z.infer<typeof messageSchema>) => {
    setIsLoading(true);
    try {
      const response = await axios.post<ApiResponse>('/api/sendMsg', {
        ...data,
        username,
      });

      toast({
        title: response.data.message,
        variant: 'default',
      });
      form.reset({ ...form.getValues(), content: '' });
    } catch (error) {
      const axiosError = error as AxiosError<ApiResponse>;
      toast({
        title: 'Error',
        description:
          axiosError.response?.data.message ?? 'Failed to sent message',
        variant: 'destructive',
      });
    } finally {
      setIsLoading(false);
    }
  };

  const fetchSuggestedMessages = async () => {
    setIsSuggestLoading(true);
    try {
      const response = await fetch('/SuggestMsg.json');
      const data = await response.json();

      
      const shuffledMessages = data.sort(() => Math.random() - 0.5);
      
    
      const newMessages = shuffledMessages.slice(messageIndex, messageIndex + 3);
      setSuggestedMessages(newMessages);

      setMessageIndex((prevIndex) => (prevIndex + 3) % shuffledMessages.length);
    } catch (error) {
      console.error('Error fetching messages:', error);
      toast({
        title: 'Error',
        description: 'Failed to fetch suggested messages.',
        variant: 'destructive',
      });
    } finally {
      setIsSuggestLoading(false);
    }
  };

  return (
    <div className="container mx-auto my-8 p-8 bg-white rounded-xl shadow-lg max-w-4xl">
      <h1 className="text-3xl font-bold  text-center text-gray-900">
        Public Profile Link
      </h1>
      <p className='text-center mb-8 text-gray-500'>Your identity is safe with WhisperLink. Send message to anyone without hesitation </p>
      <Form {...form}>
        <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8">
          <FormField
            control={form.control}
            name="content"
            render={({ field }) => (
              <FormItem>
                <FormLabel className="text-lg font-semibold text-gray-700"> <span className='text-gray-700 font-medium'> Sending Message to </span>@{username[0].toUpperCase()}{username.slice(1)}
                </FormLabel>
                <FormControl>
                  <Textarea
                    placeholder="Write your anonymous message here"
                    className="resize-none border border-gray-300 focus:ring-2 focus:ring-blue-500 rounded-lg p-3 w-full"
                    {...field}
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          <div className="flex justify-center">
            {isLoading ? (
              <Button disabled className="bg-gray-300 text-gray-500">
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                Please wait
              </Button>
            ) : (
              <Button
                type="submit"
                disabled={isLoading || !messageContent}
                className="bg-blue-500 text-white hover:bg-blue-600 focus:ring-4 focus:ring-blue-300"
              >
                Send It
              </Button>
            )}
          </div>
        </form>
      </Form>

        <Separator className="my-8" />
  
      <div className="space-y-8 mt-12">
        <div className="space-y-4">
          <Button
            onClick={fetchSuggestedMessages}
            className=" py-3 bg-green-500 text-white hover:bg-green-600 disabled:bg-gray-300"
            disabled={isSuggestLoading}
          >
            {isSuggestLoading ? (
              <Loader2 className="mr-2 h-4 w-4 animate-spin" />
            ) : (
              'Suggest Messages'
            )}
          </Button>
          <p className="text-center text-sm text-gray-600">Click on any message below to select it.</p>
        </div>
        <Card className="bg-gray-50 shadow-lg rounded-lg p-4">
          <CardHeader className="border-b border-gray-200 pb-4">
            <h3 className="text-xl font-semibold text-gray-800">Messages</h3>
          </CardHeader>
          <CardContent className="flex flex-col space-y-4 mt-4">
            {suggestedMessages.length === 0 ? (
              <p className="text-center text-gray-500">Click "Suggest Messages" to load Messages.</p>
            ) : (
              suggestedMessages.map((message, index) => (
                <Button
                  key={index}
                  variant="outline"
                  className="border-2 border-gray-300 hover:bg-gray-100 hover:border-gray-400 rounded-lg py-2"
                  onClick={() => handleMessageClick(message)}
                >
                  {message}
                </Button>
              ))
            )}
          </CardContent>
        </Card>
      </div>
      <Separator className="my-8" />
      <div className="text-center mt-10">
        <div className="mb-6 text-xl font-medium text-gray-700">Get Your Message Board</div>
        <Link href={'/signup'}>
          <Button className="bg-blue-600 text-white hover:bg-blue-700 py-3 px-6 rounded-lg">
            Create Your Account
          </Button>
        </Link>
      </div>
    </div>
  );
  
}
