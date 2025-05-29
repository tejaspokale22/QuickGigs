"use client";

import { useEffect, useState } from "react";
import { useParams } from "next/navigation";
import { User } from "@/app/utils/types";
import { fetchUserChats } from "@/app/utils/actions/chatActions";
import { fetchUser } from "@/app/utils/actions/authActions";
import CreateChatDialog from "@/components/chat/CreateChatDialog";
import ChatRoom from "@/components/chat/ChatRoom";
import { Plus } from "lucide-react";
import Image from 'next/image';
import { firestore } from "@/app/utils/firebase";
import { onSnapshot, query, collection, orderBy } from "firebase/firestore";
import Spinner from "@/components/ui/spinner";

const MessagingPage = () => {
  const { slug } = useParams() as { slug: string };
  const [chats, setChats] = useState<any[]>([]);
  const [participantsDetails, setParticipantsDetails] = useState<User[]>([]);
  const [loading, setLoading] = useState(true);
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [selectedChatId, setSelectedChatId] = useState<string | null>(null);

  useEffect(() => {
    if (!slug) return;

    const chatsQuery = query(
      collection(firestore, "chats"),
      orderBy("createdAt")
    );
    
    const unsubscribe = onSnapshot(chatsQuery, async (snapshot) => {
      let updatedChats: any[] = [];
      snapshot.forEach((doc) => {
        const chatData = doc.data();
        if (chatData.participants.includes(slug)) {
          updatedChats.push({ ...chatData, id: doc.id });
        }
      });
      
      setChats(updatedChats);
      
      const details = await Promise.all(
        updatedChats.map(async (chat) => {
          const otherUserId = chat.participants.find(
            (id: string) => id !== slug
          );
          if (otherUserId) {
            const userDetails = await fetchUser(otherUserId);
            return userDetails;
          }
          return null;
        })
      );
      
      setParticipantsDetails(details.filter(Boolean) as User[]);
      setLoading(false);
    });

    return () => unsubscribe();
  }, [slug]);

  if (loading) {
    return (
      <div className="flex justify-center items-center min-h-screen bg-gray-50">
        <div className="text-center space-y-4">
          <Spinner />
          <p className="text-gray-600 animate-pulse">Loading your conversations...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="h-[calc(100vh-4rem)] mt-16">
      <div className="h-full bg-white">
        <div className="flex h-full">
          {/* Left Sidebar - Chat List */}
          <div className="w-96 border-r border-gray-200 flex flex-col">
            {/* Header */}
            <div className="p-4 border-b border-gray-200 bg-white">
              <div className="flex items-center justify-between">
                <h1 className="text-xl font-semibold text-gray-900">Messages</h1>
                <button
                  onClick={() => setIsDialogOpen(true)}
                  className="p-2 bg-black text-white rounded-full hover:bg-gray-800 
                    transition-all duration-200"
                  aria-label="New chat"
                  title="New chat"
                >
                  <Plus className="h-5 w-5" />
                </button>
              </div>
            </div>

            {/* Chat List */}
            <div className="flex-1 overflow-y-auto">
              {chats.length === 0 ? (
                <div className="flex flex-col items-center justify-center h-full p-6 text-center">
                  <div className="w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center mb-4">
                    <svg className="w-8 h-8 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z" />
                    </svg>
                  </div>
                  <h3 className="text-lg font-semibold text-gray-900 mb-2">No conversations yet</h3>
                  <p className="text-gray-500 mb-6">Start a new chat to connect with others</p>
                  <button
                    onClick={() => setIsDialogOpen(true)}
                    className="px-4 py-2 bg-gray-100 text-gray-700 rounded hover:bg-gray-200 
                      transition-colors duration-200"
                  >
                    Start a Conversation
                  </button>
                </div>
              ) : (
                <div className="divide-y divide-gray-100">
                  {chats.map((chat) => (
                    <button
                      key={chat.id}
                      onClick={() => setSelectedChatId(chat.id)}
                      className={`w-full p-3 hover:bg-gray-100 transition-colors duration-200
                        ${selectedChatId === chat.id ? 'bg-gray-100' : ''}`}
                    >
                      {chat.participants.map((participantId: string) => {
                        const user = participantsDetails.find((user) => user.uid === participantId);
                        return user ? (
                          <div 
                            key={participantId} 
                            className="flex items-center space-x-3"
                          >
                            <div className="relative flex-shrink-0">
                              <Image
                                src={user.profilePicture || '/default-avatar.png'}
                                alt={user.name}
                                width={40}
                                height={40}
                                className="rounded-full object-cover ring-2 ring-gray-100"
                              />
                            </div>
                            <span className="font-medium text-gray-900 truncate">{user.name}</span>
                          </div>
                        ) : null;
                      })}
                    </button>
                  ))}
                </div>
              )}
            </div>
          </div>

          {/* Right Side - Chat Room */}
          <div className="flex-1">
            {selectedChatId ? (
              <ChatRoom chatId={selectedChatId} loggedInUserId={slug} />
            ) : (
              <div className="h-full flex flex-col items-center justify-center bg-gray-50 p-8">
                <div className="max-w-md text-center">
                  <div className="w-24 h-24 mx-auto mb-6 bg-gradient-to-br from-blue-100 to-purple-100 rounded-full flex items-center justify-center">
                    <svg className="w-12 h-12 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.5" d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z" />
                    </svg>
                  </div>
                  <h2 className="text-2xl font-bold text-gray-900 mb-3">Welcome to QuickGigs Chat</h2>
                  <p className="text-gray-600 mb-6">
                    Select a conversation from the list or start a new one to begin chatting with other users.
                  </p>
                  <div className="space-y-4">
                    <button
                      onClick={() => setIsDialogOpen(true)}
                      className="w-full px-6 py-3 bg-black text-white rounded hover:bg-gray-800 
                        transition-all duration-200 flex items-center justify-center space-x-2"
                    >
                      <Plus className="h-5 w-5" />
                      <span>Start New Conversation</span>
                    </button>
                    <div className="text-sm text-gray-500">
                      <p>Connect with other professionals and discuss opportunities</p>
                    </div>
                  </div>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
      
      <CreateChatDialog isOpen={isDialogOpen} onClose={() => setIsDialogOpen(false)} />
    </div>
  );
};

export default MessagingPage;
