import { Timestamp } from "firebase/firestore";

export type Gig = {
  id: string;
  title: string;
  description: string;
  skillsRequired: string[];
  price: number;
  deadline: Timestamp;
  status: string;
  clientId: string;
  appliedFreelancers?: string[];
  createdAt: Timestamp;
};

export type User = {
  uid: string;
  name: string;
  email: string;
  profilePicture?: string;
};

export type Message = {
  senderId: string;
  receiverId: string;
  message: string;
  createdAt: Timestamp;
};

export type Chat = {
  id: string;
  participants: string[];
  createdAt: Timestamp;
  messages: Message[];
};
