"use client";

import { useEffect, useState } from "react";
import { useParams } from "next/navigation";
import { User } from "@/app/utils/types";
import { fetchUserChats } from "@/app/utils/actions/chatActions";
import { fetchUser } from "@/app/utils/actions/authActions";
import CreateChatDialog from "@/components/chat/CreateChatDialog";
import { Plus } from "lucide-react";
import Image from 'next/image';
import Link from "next/link";
import { firestore } from "@/app/utils/firebase";
import { onSnapshot, query, collection, orderBy } from "firebase/firestore";
import Spinner from "@/components/ui/spinner";

const MessagingPage = () => {
  const { slug } = useParams() as { slug: string };
  const [chats, setChats] = useState<any[]>([]);
  const [participantsDetails, setParticipantsDetails] = useState<User[]>([]);
  const [loading, setLoading] = useState(true);
  const [isDialogOpen, setIsDialogOpen] = useState(false);

  const handleOpenDialog = () => {
    setIsDialogOpen(true);
  };

  const handleCloseDialog = () => {
    setIsDialogOpen(false);
  };

  useEffect(() => {
    const getChats = async () => {
      if (!slug) return;

      try {
        // Fetch chats for the current user using their UID
        const userChats = await fetchUserChats(slug);
        setChats(userChats);

        // For each chat, fetch details of participants (excluding the logged-in user)
        const details = await Promise.all(
          userChats.map(async (chat) => {
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

        // Set participants' details
        setParticipantsDetails(details.filter(Boolean) as User[]);
      } catch (error) {
        console.error("Error fetching chats or participants:", error);
      } finally {
        setLoading(false);
      }
    };

    // Real-time listener for chat updates
    const chatsQuery = query(collection(firestore, "chats"), orderBy("createdAt"));
    const unsubscribe = onSnapshot(chatsQuery, (snapshot) => {
      let updatedChats: any[] = [];
      snapshot.forEach((doc) => {
        updatedChats.push({ ...doc.data(), id: doc.id });
      });
      setChats(updatedChats); // Update the chats state in real-time
    });

    // Initial fetch of chats
    getChats();

    // Cleanup the listener when the component is unmounted
    return () => unsubscribe();
  }, [slug, isDialogOpen]); // Re-run the effect whenever slug or dialog changes

  if (loading) {
    return (
      <div className="flex justify-center items-center min-h-screen bg-gray-50">
        <div className="text-center">
          <Spinner />
        </div>
      </div>
    );
  }

  return (
    <div className="pt-24 max-w-6xl mx-auto">
      <div className="flex items-center justify-between mb-8">
        <h1 className="text-2xl font-bold text-gray-900">Messages</h1>
        <button
          onClick={() => setIsDialogOpen(true)}
          className="px-4 py-2 bg-black text-white rounded-xl flex items-center gap-2 
            hover:bg-gray-900 transition-all duration-200"
        >
          <Plus className="h-5 w-5" />
          <span className="font-medium">New Chat</span>
        </button>
      </div>

      <div className="grid gap-4">
        {chats.length === 0 ? (
          <div className="text-center py-12 bg-gray-50 rounded-xl border border-gray-200">
            <p className="text-gray-600">No chats available.</p>
          </div>
        ) : (
          chats.map((chat) => (
            <Link key={chat.id} href={`/chatroom/${chat.id}`}>
              {chat.participants.map((participantId: any) => {
                const user = participantsDetails.find((user) => user.uid === participantId);
                return user ? (
                  <div 
                    key={participantId} 
                    className="flex items-center p-4 bg-white rounded-xl border border-gray-200 
                      hover:border-gray-300 hover:shadow-sm transition-all duration-200"
                  >
                    <div className="relative">
                      <Image
                        src={user.profilePicture || '/default-avatar.png'}
                        alt={user.name}
                        width={48}
                        height={48}
                        className="rounded-full object-cover ring-2 ring-gray-100"
                      />
                      <div className="absolute bottom-0 right-0 w-3 h-3 bg-green-500 
                        rounded-full border-2 border-white"></div>
                    </div>
                    <div className="ml-4">
                      <h3 className="font-semibold text-gray-900">{user.name}</h3>
                      <p className="text-sm text-gray-500 mt-0.5">Click to view chat</p>
                    </div>
                  </div>
                ) : null;
              })}
            </Link>
          ))
        )}
      </div>
      
      <CreateChatDialog isOpen={isDialogOpen} onClose={() => setIsDialogOpen(false)} />
    </div>
  );
};

export default MessagingPage;
