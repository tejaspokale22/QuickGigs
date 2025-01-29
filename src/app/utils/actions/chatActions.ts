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
  orderBy,
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

//Fetch chat messages between two users
export const fetchMessages = async (chatId: string) => {
  try {
    // Reference to the messages subcollection of the specific chat
    const messagesRef = collection(firestore, "chats", chatId, "messages");

    // Query to order messages by createdAt
    const q = query(messagesRef, orderBy("createdAt", "asc"));

    // Fetch the documents from the messages subcollection
    const querySnapshot = await getDocs(q);

    // Check if there are any documents in the querySnapshot
    if (querySnapshot.empty) {
      return [];
    }

    // Map through the documents to get the data
    const messagesData = querySnapshot.docs.map((doc) => ({
      id: doc.id,
      ...doc.data(),
    }));

    console.log("Fetched messages: ", messagesData);

    return messagesData;
  } catch (error) {
    console.error("Error fetching messages: ", error);
    throw new Error("Failed to fetch messages");
  }
};

//Send a Message
export const sendMessage = async (
  chatId: string,
  senderId: string,
  receiverId: string,
  message: string
) => {
  try {
    // Reference to the messages subcollection within the specific chat
    const messagesRef = collection(firestore, "chats", chatId, "messages");

    // Create a new message object
    const newMessage = {
      senderId,
      receiverId,
      message,
      createdAt: Timestamp.now(),
    };

    // Add the message to Firestore
    const docRef = await addDoc(messagesRef, newMessage);

    // Return the newly created message with its ID
    return { id: docRef.id, ...newMessage };
  } catch (error) {
    console.error("Error sending message: ", error);
    throw new Error("Failed to send message");
  }
};

export const fetchChatUsingId = async (chatId: string): Promise<Chat> => {
  try {
    const chatDocRef = doc(firestore, "chats", chatId);
    const chatDocSnap = await getDoc(chatDocRef);

    if (!chatDocSnap.exists()) {
      throw new Error("Chat not found");
    }

    return {
      id: chatDocSnap.id,
      participants: chatDocSnap.data().participants,
      createdAt: chatDocSnap.data().createdAt,
      messages: chatDocSnap.data().messages || [],
    } as Chat;
  } catch (error) {
    console.error("Error fetching chat: ", error);
    throw new Error("Failed to fetch chat");
  }
};
