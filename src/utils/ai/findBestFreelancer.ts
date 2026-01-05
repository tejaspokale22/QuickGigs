import { GoogleGenerativeAI } from '@google/generative-ai'

// Lazy-init Gemini so we don't throw on import if env is missing
let model: ReturnType<GoogleGenerativeAI['getGenerativeModel']> | null = null

function ensureModel() {
  if (model) return model
  const apiKey = process.env.NEXT_PUBLIC_GEMINI_API_KEY
  if (!apiKey) {
    throw new Error('Gemini API key is missing from environment variables.')
  }
  const genAI = new GoogleGenerativeAI(apiKey)
  model = genAI.getGenerativeModel({
    model: 'gemini-2.0-flash-exp',
  })
  return model
}

// Configuration for generating responses
const generationConfig = {
  temperature: 0.8,
  topP: 0.95,
  topK: 40,
  maxOutputTokens: 2048,
  responseMimeType: 'text/plain',
}

function constructPrompt(gig: any, freelancers: any[]) {
  const gigDetails = `
    Gig Title: ${gig.title}
    Job Description: ${gig.description}
    Skills Required: ${(gig.skillsRequired || []).join(', ')}
  `

  const freelancerDetails = (freelancers || [])
    .map((freelancer, index) => {
      if (!freelancer || !freelancer.name || !freelancer.skills) {
        return '' // Skip if freelancer data is incomplete
      }
      return `
      Freelancer ${index + 1} - **${freelancer.name}**:
        - Skills: ${freelancer.skills.join(', ') || 'N/A'}
        - Rating: ${freelancer.rating || 'N/A'}
        - Experience: ${freelancer.experience || 'N/A'} years
        - Bio: ${freelancer.bio || 'N/A'}
        - ProfilePicture: ${freelancer.profilePicture || 'N/A'}
    `
    })
    .filter((detail) => detail) // Remove any empty strings
    .join('\n')
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
  `
}

export async function findBestFreelancer(gig: any, freelancers: any[]) {
  try {
    const activeModel = ensureModel()
    // Construct dynamic prompt based on the gig and freelancers data
    const prompt = constructPrompt(gig, freelancers)

    // Start a new chat session
    const chatSession = activeModel.startChat({
      generationConfig,
      history: [],
    })

    // Send the constructed message to the Gemini model
    const result = await chatSession.sendMessage(prompt)

    // Output the response
    const responseText = result.response.text()

    // Clean the response text (remove code block markers or other unwanted characters)
    const cleanResponseText = responseText.replace(/```json|```/g, '').trim()

    // Check if the cleaned response is valid JSON
    try {
      const responseObject = JSON.parse(cleanResponseText)
      console.log(responseObject)

      return responseObject
    } catch (jsonError) {
      return {
        reason: 'The AI model could not provide a valid response.',
      }
    }
  } catch (error) {
    console.error('Error occurred while running the Gemini chat:', error)
    return {
      reason:
        error instanceof Error
          ? error.message
          : 'An error occurred while processing the request.',
    }
  }
}
