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
  freelancerId?: string;
  appliedFreelancers?: string[];
  paymentStatus: boolean;
  workStatus: boolean;
  createdAt: Timestamp;
};

export type User = {
  uid: string;
  name: string;
  email: string;
  contact?: string;
  location?: string;
  profilePicture?: string;
  bio?: string;
  skills?: string[];
  experience?: string;
  socials?: object;
};

export type Message = {
  id: string;
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

export type PaymentInfo = {
  upiId?: string;
  bankDetails?: {
    accountHolder: string;
    accountNo: string;
    ifsc: string;
  };
};
