"use client";

import { useState, useEffect, useRef } from "react";
import Image from "next/image";
import { useForm } from "react-hook-form";
import { fetchChatUsingId, sendMessage } from "@/app/utils/actions/chatActions";
import { onSnapshot, query, collection, orderBy } from "firebase/firestore";
import { firestore } from "@/app/utils/firebase";
import { fetchUser } from "@/app/utils/actions/authActions";
import { Send, MoreVertical, Phone, Video, Info, MessageSquare } from 'lucide-react';
import { Chat, Message } from "@/app/utils/types"; 
import Spinner from "@/components/ui/spinner";

type FormData = {
  message: string;
};

interface ChatRoomProps {
  chatId: string;
  loggedInUserId: string;
}

const ChatRoom = ({ chatId, loggedInUserId }: ChatRoomProps) => {
  const [chat, setChat] = useState<Chat | null>(null);
  const [messages, setMessages] = useState<Message[]>([]);
  const [receiver, setReceiver] = useState<any | null>(null);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string>("");
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const { register, handleSubmit, reset } = useForm<FormData>();

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  useEffect(() => {    
    const loadChat = async () => {
      if (!chatId || !loggedInUserId) return;

      try {
        const fetchedChat = await fetchChatUsingId(chatId);
        setChat(fetchedChat);

        if (fetchedChat?.participants) {
          const receiverId = fetchedChat.participants.find((id: string) => id !== loggedInUserId);
          
          if (receiverId) {
            const fetchedReceiver = await fetchUser(receiverId);
            setReceiver(fetchedReceiver);
          }
        }

        const messagesQuery = query(collection(firestore, `chats/${chatId}/messages`), orderBy("createdAt"));
        const unsubscribe = onSnapshot(messagesQuery, (snapshot) => {
          let updatedMessages: any[] = [];
          snapshot.forEach((doc) => {
            updatedMessages.push({ ...doc.data(), id: doc.id });
          });
          setMessages(updatedMessages);
          setLoading(false);
        });

        return () => unsubscribe();

      } catch (error) {
        setError("Failed to load chat data.");
        console.error(error);
        setLoading(false);
      }
    };

    loadChat();
  }, [chatId, loggedInUserId]);

  const onSubmit = async (data: FormData) => {
    if (!loggedInUserId || !receiver || !chatId || !chat) return;
    
    try {
      await sendMessage(chat.id, loggedInUserId, receiver.uid, data.message);
      reset(); 
    } catch (error) {
      console.error("Message sending failed", error);
      setError("Failed to send message.");
    }
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center h-full bg-gray-50">
        <div className="text-center">
          <Spinner />
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex justify-center items-center h-full">
        <p className="text-red-500 font-medium">{error}</p>
      </div>
    );
  }

  if (!chatId) {
    return (
      <div className="flex flex-col items-center justify-center h-full bg-gray-50">
        <div className="w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center mb-4">
          <MessageSquare className="w-8 h-8 text-gray-400" />
        </div>
        <p className="text-gray-500 text-sm">Select a conversation to start chatting</p>
      </div>
    );
  }

  return (
    <div className="flex flex-col h-full bg-white border-l border-gray-200">
      {/* Chat Header */}
      <div className="flex items-center justify-between bg-white px-6 py-4 border-b border-gray-200 shadow-sm">
        <div className="flex items-center space-x-4">
          {receiver ? (
            <>
              <div className="relative">
                <Image
                  src={receiver.profilePicture}
                  alt={receiver.name}
                  width={48}
                  height={48}
                  className="rounded-full object-cover ring-2 ring-gray-100"
                />
              </div>
              <div>
                <h2 className="text-lg font-semibold text-gray-900">{receiver.name}</h2>
              </div>
            </>
          ) : (
            <div className="animate-pulse flex items-center space-x-4">
              <div className="w-12 h-12 bg-gray-200 rounded-full"></div>
              <div className="space-y-2">
                <div className="h-4 w-24 bg-gray-200 rounded"></div>
                <div className="h-3 w-16 bg-gray-200 rounded"></div>
              </div>
            </div>
          )}
        </div>
        
        {/* Header Actions */}
        <div className="flex items-center space-x-4">
          <button 
            className="p-2 hover:bg-gray-100 rounded-full transition-colors"
            aria-label="Start voice call"
            title="Voice call"
          >
            <Phone className="w-5 h-5 text-gray-600" />
          </button>
          <button 
            className="p-2 hover:bg-gray-100 rounded-full transition-colors"
            aria-label="Start video call"
            title="Video call"
          >
            <Video className="w-5 h-5 text-gray-600" />
          </button>
          <button 
            className="p-2 hover:bg-gray-100 rounded-full transition-colors"
            aria-label="View chat info"
            title="Chat info"
          >
            <Info className="w-5 h-5 text-gray-600" />
          </button>
          <button 
            className="p-2 hover:bg-gray-100 rounded-full transition-colors"
            aria-label="More options"
            title="More options"
          >
            <MoreVertical className="w-5 h-5 text-gray-600" />
          </button>
        </div>
      </div>

      {/* Chat Messages */}
      <div className="flex-1 overflow-y-auto p-6 min-h-0">
        <div className="space-y-4">
          {messages.length > 0 ? (
            <>
              {messages.map((msg: Message, index: number) => (
                <div
                  key={index}
                  className={`flex ${msg.senderId === loggedInUserId ? "justify-end" : "justify-start"}`}
                >
                  <div className={`flex flex-col max-w-[70%] ${msg.senderId === loggedInUserId ? "items-end" : "items-start"}`}>
                    <div
                      className={`rounded-2xl px-4 py-2.5 ${
                        msg.senderId === loggedInUserId
                          ? "bg-black text-white rounded-br-none"
                          : "bg-gray-100 text-gray-900 rounded-bl-none"
                      }`}
                    >
                      <p className="text-sm leading-relaxed">{msg.message}</p>
                    </div>
                    <span className={`text-[10px] mt-1 text-gray-500 ${msg.senderId === loggedInUserId ? "text-right" : "text-left"}`}>
                      {msg.createdAt?.toDate().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                    </span>
                  </div>
                </div>
              ))}
              <div ref={messagesEndRef} />
            </>
          ) : (
            <div className="flex flex-col items-center justify-center h-full space-y-4">
              <div className="w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center">
                <MessageSquare className="w-8 h-8 text-gray-400" />
              </div>
              <p className="text-gray-500 text-sm">No messages yet. Start the conversation!</p>
            </div>
          )}
        </div>
      </div>

      {/* Message Input */}
      <div className="flex-shrink-0 p-6 border-t border-gray-200 bg-white">
        <div className="max-w-3xl mx-auto">
          <form onSubmit={handleSubmit(onSubmit)} className="flex items-center gap-4">
            <input
              {...register("message", { required: true })}
              type="text"
              placeholder="Type your message..."
              className="flex-1 px-4 py-3 bg-gray-50 border border-gray-200 rounded-xl 
                focus:outline-none focus:ring-2 focus:ring-black focus:border-transparent
                placeholder:text-gray-400 text-sm"
            />
            <button
              type="submit"
              className="px-6 py-3 bg-black text-white rounded-xl hover:bg-gray-900 
                transition-colors duration-200 flex items-center gap-2 text-sm font-medium
                disabled:opacity-50 disabled:cursor-not-allowed"
            >
              Send
              <Send className="w-4 h-4" />
            </button>
          </form>
        </div>
      </div>
    </div>
  );
};

export default ChatRoom; 