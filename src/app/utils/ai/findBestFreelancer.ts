import { GoogleGenerativeAI } from "@google/generative-ai";

// API Key for Gemini
const apiKey = process.env.NEXT_PUBLIC_GEMINI_API_KEY;

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

function constructPrompt(gig: any, freelancers: any[]) {
  const gigDetails = `
    Gig Title: ${gig.title}
    Job Description: ${gig.description}
    Skills Required: ${(gig.skillsRequired || []).join(", ")}
  `;

  const freelancerDetails = (freelancers || [])
    .map((freelancer, index) => {
      if (!freelancer || !freelancer.name || !freelancer.skills) {
        return ""; // Skip if freelancer data is incomplete
      }
      return `
      Freelancer ${index + 1} - **${freelancer.name}**:
        - Skills: ${freelancer.skills.join(", ") || "N/A"}
        - Rating: ${freelancer.rating || "N/A"}
        - Experience: ${freelancer.experience || "N/A"} years
        - Bio: ${freelancer.bio || "N/A"}
        - ProfilePicture: ${freelancer.profilePicture || "N/A"}
    `;
    })
    .filter((detail) => detail) // Remove any empty strings
    .join("\n");
  return `
    I have a job posting for a "${gig.title}". The gig requires the following:
    ${gigDetails}

    Here are the freelancers who have applied for this job:
    ${freelancerDetails}

    Please review the freelancers and tell me which one is the best fit for this job. Provide the freelancer's name and reason for your recommendation in an object format like this:
    {
      "name": "Alice",
      "profilePicture": "",
      "reason": "Alice is the best fit because of her 4+ years of experience with React and JavaScript, and her high rating."
    }
  `;
}

export async function findBestFreelancer(gig: any, freelancers: any[]) {
  try {
    // Construct dynamic prompt based on the gig and freelancers data
    const prompt = constructPrompt(gig, freelancers);

    // Start a new chat session
    const chatSession = model.startChat({
      generationConfig,
      history: [],
    });

    // Send the constructed message to the Gemini model
    const result = await chatSession.sendMessage(prompt);

    // Output the response
    const responseText = result.response.text();

    // Clean the response text (remove code block markers or other unwanted characters)
    const cleanResponseText = responseText.replace(/```json|```/g, "").trim();

    // Check if the cleaned response is valid JSON
    try {
      const responseObject = JSON.parse(cleanResponseText);
      console.log(responseObject);

      return responseObject;
    } catch (jsonError) {
      return {
        reason: "The AI model could not provide a valid response.",
      };
    }
  } catch (error) {
    console.error("Error occurred while running the Gemini chat:", error);
    return {
      reason: "An error occurred while processing the request.",
    };
  }
}
