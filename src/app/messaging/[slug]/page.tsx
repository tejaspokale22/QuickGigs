"use client"
import { useEffect, useState } from "react";
import { useParams } from "next/navigation";
import { User } from "@/app/utils/types";
import { fetchUserChats,createNewChat } from "@/app/utils/actions/chatActions";
import { fetchUser } from "@/app/utils/actions/authActions";
import CreateChatDialog from "@/components/chat/CreateChatDialog";
import React from "react";
import { Plus } from "lucide-react";
import Image from 'next/image';


const MessagingPage = () => {

  const { slug } = useParams() as { slug: string };
  const [chats, setChats] = useState<any[]>([]);
  const [participantsDetails, setParticipantsDetails] = useState<User[]>([]);
  const [loading, setLoading] = useState(true);
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  console.log(participantsDetails);
  

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

    getChats();
  }, [slug,isDialogOpen]);

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
      <CreateChatDialog isOpen={isDialogOpen} onClose={handleCloseDialog}/>
      {chats.length === 0 ? (
        <p>No chats available.</p>
      ) : (
        <div>
          {participantsDetails.map((user, index) => (
            <div key={index} className="flex items-center mb-4 bg-gray-200 p-2 rounded">
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
          ))}
        </div>
      )}
    </div>
  );
};

export default MessagingPage;
