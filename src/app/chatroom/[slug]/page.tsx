"use client";

import { useState, useEffect } from "react";
import Image from "next/image";
import { useForm } from "react-hook-form";
import { fetchChatUsingId, sendMessage } from "@/app/utils/actions/chatActions";
import { onSnapshot, query, collection, orderBy } from "firebase/firestore";
import { firestore } from "@/app/utils/firebase";
import { fetchUser } from "@/app/utils/actions/authActions";
import { useParams } from "next/navigation";
import { Send } from 'lucide-react';
import { Chat,Message } from "@/app/utils/types"; 
import  Spinner  from "@/components/ui/spinner"

type FormData = {
  message: string;
};

const ChatRoom = () => {

  const { slug } = useParams() as { slug: string }; 
  const [chat, setChat] = useState<Chat | null>(null);
  const [messages, setMessages] = useState<Message[]>([]);
  const [receiver, setReceiver] = useState<any | null>(null);
  const [loggedInUserId, setLoggedInUserId] = useState<string | null>(null);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string>("");
  const { register, handleSubmit, reset } = useForm<FormData>();
  
  // Fetch logged-in user ID from localStorage in useEffect
  useEffect(() => {
    if (typeof window !== "undefined") {
      const uid = localStorage.getItem("uid");
      setLoggedInUserId(uid);
    }
  }, []);

  useEffect(() => {    
    const loadChat = async () => {
      if (!slug || !loggedInUserId) return; // Ensure both are available before fetching

      try {
        // Fetch chat details
        const fetchedChat = await fetchChatUsingId(slug);
        setChat(fetchedChat);

        // Determine the receiver ID from participants array
        if (fetchedChat?.participants) {
          const receiverId = fetchedChat.participants.find((id: string) => id !== loggedInUserId);
          
          if (receiverId) {
            const fetchedReceiver = await fetchUser(receiverId);
            setReceiver(fetchedReceiver);
          }
        }

        // Set up the Firestore real-time listener for messages
        const messagesQuery = query(collection(firestore, `chats/${slug}/messages`), orderBy("createdAt"));
        const unsubscribe = onSnapshot(messagesQuery, (snapshot) => {
          let updatedMessages: any[] = [];
          snapshot.forEach((doc) => {
            updatedMessages.push({ ...doc.data(), id: doc.id });
          });
          setMessages(updatedMessages);
        });

        // Cleanup the listener when component unmounts or chat ID changes
        return () => unsubscribe();

      } catch (error) {
        setError("Failed to load chat data.");
        console.error(error);
      } finally {
        setLoading(false);
      }
    };

    loadChat();
  }, [slug, loggedInUserId]); // Runs when slug or loggedInUserId changes

  // Handle message submission
  const onSubmit = async (data: FormData) => {
    if (!loggedInUserId || !receiver || !slug || !chat) return;
    
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
      <div className="flex justify-center items-center min-h-screen bg-gray-50">
        <div className="text-center">
          <Spinner />
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex justify-center items-center min-h-screen">
        <p className="text-red-500 font-medium">{error}</p>
      </div>
    );
  }

  return (
    <div className="py-10 max-w-4xl mx-auto my-8 h-[80vh] rounded-2xl overflow-hidden border border-gray-200 shadow-lg bg-white">
      {/* Chat Header */}
      <div className="flex items-center justify-between bg-white px-6 py-4 border-b border-gray-200">
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
                <div className="absolute bottom-0 right-0 w-3 h-3 bg-green-500 rounded-full border-2 border-white"></div>
              </div>
              <div>
                <h2 className="text-lg font-semibold text-gray-900">{receiver.name}</h2>
                <p className="text-sm text-gray-500">Online</p>
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
      </div>

      {/* Chat Messages */}
      <div className="flex-1 overflow-y-auto p-6 h-[calc(80vh-160px)] bg-gray-50">
        <div className="space-y-4">
          {messages.length > 0 ? (
            messages.map((msg: Message, index: number) => (
              <div
                key={index}
                className={`flex ${msg.senderId === loggedInUserId ? "justify-end" : "justify-start"}`}
              >
                <div
                  className={`max-w-[70%] rounded-2xl px-4 py-2 ${
                    msg.senderId === loggedInUserId
                      ? "bg-black text-white rounded-br-none"
                      : "bg-gray-200 text-gray-900 rounded-bl-none"
                  }`}
                >
                  <p className="text-sm">{msg.message}</p>
                  <p className="text-[10px] mt-1 opacity-70">
                    {msg.createdAt?.toDate().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                  </p>
                </div>
              </div>
            ))
          ) : (
            <div className="flex items-center justify-center h-full">
              <p className="text-gray-500 text-sm">No messages yet. Start the conversation!</p>
            </div>
          )}
        </div>
      </div>

      {/* Message Input */}
      <div className="p-4 bg-white border-t border-gray-200">
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
              transition-colors duration-200 flex items-center gap-2 text-sm font-medium"
          >
            Send
            <Send className="w-4 h-4" />
          </button>
        </form>
      </div>
    </div>
  );
};

export default ChatRoom;
