"use client";

import { useEffect, useState } from "react";
import { useParams } from "next/navigation";
import { User } from "@/app/utils/types";
import { fetchUserChats } from "@/app/utils/actions/chatActions";
import { fetchUser } from "@/app/utils/actions/authActions";
import CreateChatDialog from "@/components/chat/CreateChatDialog";
import React from "react";
import { Plus } from "lucide-react";
import Image from 'next/image';
import Link from "next/link";
import { firestore } from "@/app/utils/firebase";
import { onSnapshot, query, collection, orderBy } from "firebase/firestore";

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

  if (loading) return <div>Loading chats...</div>;

  return (
    <div className="p-4">
      <h1 className="text-2xl font-bold mb-4">Chats</h1>
      <button
        onClick={handleOpenDialog}
        className="mb-4 p-2 bg-black text-white rounded flex items-center"
      >
        <Plus className="mr-2" />
        Add User
      </button>
      <CreateChatDialog isOpen={isDialogOpen} onClose={handleCloseDialog} />
      {chats.length === 0 ? (
        <p>No chats available.</p>
      ) : (
        chats.map((chat) => (
          <Link key={chat.id} href={`/chatroom/${chat.id}`}>
            {chat.participants.map((participantId: any) => {
              const user = participantsDetails.find((user) => user.uid === participantId);
              return user ? (
                <div key={participantId} className="flex items-center mb-4 bg-gray-200 p-2 rounded cursor-pointer">
                  <Image
                    src={user.profilePicture || '/default-avatar.png'}
                    alt={user.name}
                    width={36}
                    height={36}
                    className="rounded-full mr-2"
                  />
                  <div>
                    <p className="font-semibold">{user.name}</p>
                  </div>
                </div>
              ) : null;
            })}
          </Link>
        ))
      )}
    </div>
  );
};

export default MessagingPage;
