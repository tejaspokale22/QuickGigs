"use client";

import { useState, useEffect } from "react";
import Image from "next/image";
import { useForm } from "react-hook-form";
import { fetchMessages, fetchChatUsingId, sendMessage } from "@/app/utils/actions/chatActions";
import { fetchUser } from "@/app/utils/actions/authActions";
import { useParams } from "next/navigation";
import { Send } from 'lucide-react';
import { Chat } from "@/app/utils/types";  // Import the Chat type

type FormData = {
  message: string;
};

const ChatRoom = () => {
  const { slug } = useParams() as { slug: string }; // Chat ID from URL params
  const [chat, setChat] = useState<Chat | null>(null);
  const [messages, setMessages] = useState<any[]>([]);
  const [receiver, setReceiver] = useState<any | null>(null);
  const [loggedInUserId, setLoggedInUserId] = useState<string | null>(null);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string>("");

  // React Hook Form setup
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

        // Fetch messages
        const fetchedMessages = await fetchMessages(slug);
        setMessages(fetchedMessages);

        // Determine the receiver ID from participants array
        if (fetchedChat?.participants) {
          const receiverId = fetchedChat.participants.find((id: string) => id !== loggedInUserId);
          
          if (receiverId) {
            const fetchedReceiver = await fetchUser(receiverId);
            setReceiver(fetchedReceiver);
          }
        }
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
      const newMessage = await sendMessage(chat.id, loggedInUserId, receiver.uid, data.message);
      setMessages((prevMessages) => [...prevMessages, newMessage]);
      reset();
    } catch (error) {
      console.error("Message sending failed", error);
      setError("Failed to send message.");
    }
  };

  if (loading) {
    return <p className="text-center">Loading messages...</p>;
  }

  if (error) {
    return <p className="text-center text-red-500">{error}</p>;
  }

  return (
    <div className="h-[650px] flex flex-col bg-gray-100">
      {/* Chat Header */}
      <div className="flex items-center bg-gray-200 text-black p-3">
        {receiver ? (
          <>
            <Image
              src={receiver.profilePicture}
              alt={receiver.name}
              width={40}
              height={40}
              className="rounded-full mr-3"
            />
            <span className="text-xl font-semibold">{receiver.name}</span>
          </>
        ) : (
          <span className="text-xl font-semibold">Loading...</span>
        )}
      </div>

      {/* Chat Messages */}
      <div className="flex-1 overflow-y-auto p-4">
        {messages.length > 0 ? (
          messages.map((msg, index) => (
            <div
              key={index}
              className={`mb-4 p-3 rounded-lg ${
                msg.senderId === loggedInUserId
                  ? "self-end text-right" // Align sender's message to the right
                  : "self-start text-left" // Align receiver's message to the left
              } bg-gray-200 rounded`}
            >
              <p>{msg.message}</p>
            </div>
          ))
        ) : (
          <p className="text-center text-gray-500">No messages yet</p>
        )}
      </div>

      {/* Message Input */}
      <div className="p-4 bg-white border-t border-gray-300">
        <form onSubmit={handleSubmit(onSubmit)} className="flex items-center">
          <input
            {...register("message", { required: true })}
            type="text"
            placeholder="Type your message..."
            className="flex-1 p-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
          <button
            type="submit"
            className="ml-4 px-6 py-2 bg-black text-white rounded hover:bg-gray-700 flex items-center justify-center"
          >
            <Send className="w-5 h-5 mr-2" /> Send
          </button>
        </form>
      </div>
    </div>
  );
};

export default ChatRoom;
