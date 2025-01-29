import { firestore } from "../firebase";
import { Chat } from "../types";
import { Message } from "../types";
import { User } from "../types";
import { Firestore } from "firebase/firestore";
import {
  collection,
  doc,
  getDoc,
  addDoc,
  getDocs,
  updateDoc,
  arrayUnion,
  query,
  where,
  Timestamp,
} from "firebase/firestore";

//Fetch all chats for a user
export const fetchUserChats = async (userId: string): Promise<Chat[]> => {
  try {
    // Query to get all chats where the user is one of the participants
    const chatsQuery = query(
      collection(firestore, "chats"),
      where("participants", "array-contains", userId)
    );

    // Get the chat documents
    const chatSnapshot = await getDocs(chatsQuery);

    // Check if no chats were found
    if (chatSnapshot.empty) {
      return [];
    }

    // Map through the chat documents and extract the necessary data
    const chats: Chat[] = chatSnapshot.docs.map((doc) => {
      return {
        id: doc.id,
        ...doc.data(),
      } as Chat;
    });

    return chats;
  } catch (error) {
    console.error("Error fetching chats:", error);
    throw new Error("Failed to fetch chats");
  }
};

//Create new Chat with a user using email
export const createNewChat = async (email: string, currentUserId: string) => {
  try {
    // Step 1: Find the user by email
    const usersRef = collection(firestore, "users");
    const q = query(usersRef, where("email", "==", email));
    const querySnapshot = await getDocs(q);

    // If user doesn't exist, return an error message
    if (querySnapshot.empty) {
      return {
        message: "No such user exists on the Platform.",
      };
    }

    // Step 2: Get the user's ID (assuming email is unique)
    const userDoc = querySnapshot.docs[0]; // Get the first match
    const recipientId = userDoc.id; // Get the document ID as user ID

    // Step 3: Check if a chat already exists between the current user and the recipient
    const chatRef = collection(firestore, "chats");
    const chatQuery = query(
      chatRef,
      where("participants", "array-contains", currentUserId) // Check for currentUserId
    );
    const existingChats = await getDocs(chatQuery);

    // Filter the results to check if recipientId is also in the participants array
    const chatExists = existingChats.docs.find((doc) =>
      (doc.data().participants as string[]).includes(recipientId)
    );

    // If a chat already exists, return it (skip creating a new one)
    if (chatExists) {
      return {
        chatId: chatExists.id,
        message: "Chat already exists.",
      };
    }

    // Step 4: Create a new chat document with only user IDs in the participants array
    const newChatRef = await addDoc(collection(firestore, "chats"), {
      participants: [currentUserId, recipientId], // Only store user IDs in the participants array
      createdAt: Timestamp.now(), // Store the current timestamp as createdAt
    });

    // Step 5: Return the newly created chat ID
    return {
      chatId: newChatRef.id,
      message: "Chat created successfully.",
    };
  } catch (error) {
    console.error("Error creating chat: ", error);
    throw new Error("Failed to create chat!");
  }
};
