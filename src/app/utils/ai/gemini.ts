// import dotenv from "dotenv";
import {
  GoogleGenerativeAI,
  HarmCategory,
  HarmBlockThreshold,
} from "@google/generative-ai";

// Load environment variables from .env file
// dotenv.config();

const apiKey = "AIzaSyD7XVTOfXnzU6s4DNOz1OA4u7E9bRhcafs";

if (!apiKey) {
  throw new Error("GEMINI_API_KEY is missing from environment variables.");
}

const genAI = new GoogleGenerativeAI(apiKey);

// Specify the model version
const model = genAI.getGenerativeModel({
  model: "gemini-2.0-flash-exp",
});

// Configuration for generating responses
const generationConfig = {
  temperature: 1,
  topP: 0.95,
  topK: 40,
  maxOutputTokens: 8192,
  responseMimeType: "text/plain",
};

// Async function to run the chat session
async function run() {
  try {
    // Start a new chat session
    const chatSession = model.startChat({
      generationConfig,
      history: [],
    });

    // Send a message (replace "INSERT_INPUT_HERE" with the desired input)
    const result = await chatSession.sendMessage(
      "what is meaning of freelancer?"
    );

    // Output the response
    console.log(result.response.text());
  } catch (error) {
    console.error("Error occurred while running the Gemini chat:", error);
  }
}

// Run the function
run();
