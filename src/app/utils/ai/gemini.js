"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __generator = (this && this.__generator) || function (thisArg, body) {
    var _ = { label: 0, sent: function() { if (t[0] & 1) throw t[1]; return t[1]; }, trys: [], ops: [] }, f, y, t, g = Object.create((typeof Iterator === "function" ? Iterator : Object).prototype);
    return g.next = verb(0), g["throw"] = verb(1), g["return"] = verb(2), typeof Symbol === "function" && (g[Symbol.iterator] = function() { return this; }), g;
    function verb(n) { return function (v) { return step([n, v]); }; }
    function step(op) {
        if (f) throw new TypeError("Generator is already executing.");
        while (g && (g = 0, op[0] && (_ = 0)), _) try {
            if (f = 1, y && (t = op[0] & 2 ? y["return"] : op[0] ? y["throw"] || ((t = y["return"]) && t.call(y), 0) : y.next) && !(t = t.call(y, op[1])).done) return t;
            if (y = 0, t) op = [op[0] & 2, t.value];
            switch (op[0]) {
                case 0: case 1: t = op; break;
                case 4: _.label++; return { value: op[1], done: false };
                case 5: _.label++; y = op[1]; op = [0]; continue;
                case 7: op = _.ops.pop(); _.trys.pop(); continue;
                default:
                    if (!(t = _.trys, t = t.length > 0 && t[t.length - 1]) && (op[0] === 6 || op[0] === 2)) { _ = 0; continue; }
                    if (op[0] === 3 && (!t || (op[1] > t[0] && op[1] < t[3]))) { _.label = op[1]; break; }
                    if (op[0] === 6 && _.label < t[1]) { _.label = t[1]; t = op; break; }
                    if (t && _.label < t[2]) { _.label = t[2]; _.ops.push(op); break; }
                    if (t[2]) _.ops.pop();
                    _.trys.pop(); continue;
            }
            op = body.call(thisArg, _);
        } catch (e) { op = [6, e]; y = 0; } finally { f = t = 0; }
        if (op[0] & 5) throw op[1]; return { value: op[0] ? op[1] : void 0, done: true };
    }
};
Object.defineProperty(exports, "__esModule", { value: true });
var generative_ai_1 = require("@google/generative-ai");
// API Key for Gemini
var apiKey = "AIzaSyD7XVTOfXnzU6s4DNOz1OA4u7E9bRhcafs";
if (!apiKey) {
    throw new Error("GEMINI_API_KEY is missing from environment variables.");
}
var genAI = new generative_ai_1.GoogleGenerativeAI(apiKey);
// Specify the model version
var model = genAI.getGenerativeModel({
    model: "gemini-2.0-flash-exp",
});
// Configuration for generating responses
var generationConfig = {
    temperature: 1,
    topP: 0.95,
    topK: 40,
    maxOutputTokens: 8192,
    responseMimeType: "text/plain",
};
// Function to construct the dynamic prompt based on gig and freelancers data
function constructPrompt(gig, freelancers) {
    var gigDetails = "\n    Gig Title: ".concat(gig.title, "\n    Job Description: ").concat(gig.description, "\n    Skills Required: ").concat(gig.skillsRequired.join(", "), "\n  ");
    var freelancerDetails = freelancers
        .map(function (freelancer, index) {
        return "\n      Freelancer ".concat(index + 1, " - **").concat(freelancer.name, "**:\n        - Skills: ").concat(freelancer.skills.join(", "), "\n        - Rating: ").concat(freelancer.rating, "\n        - Experience: ").concat(freelancer.experience, " years\n        - Bio: ").concat(freelancer.bio, "\n    ");
    })
        .join("\n");
    return "\n    I have a job posting for a \"".concat(gig.title, "\". The gig requires the following:\n    ").concat(gigDetails, "\n\n    Here are the freelancers who have applied for this job:\n    ").concat(freelancerDetails, "\n\n    Please review the freelancers and tell me which one is the best fit for this job. Provide the freelancer's name and reason for your recommendation in an object format like this:\n    {\n      \"freelancerName\": \"Alice\",\n      \"reason\": \"Alice is the best fit because of her 4+ years of experience with React and JavaScript, and her high rating.\"\n    }\n  ");
}
// Async function to run the chat session
function run(gig, freelancers) {
    return __awaiter(this, void 0, void 0, function () {
        var prompt_1, chatSession, result, responseText, cleanResponseText, responseObject, error_1;
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0:
                    _a.trys.push([0, 2, , 3]);
                    prompt_1 = constructPrompt(gig, freelancers);
                    chatSession = model.startChat({
                        generationConfig: generationConfig,
                        history: [],
                    });
                    return [4 /*yield*/, chatSession.sendMessage(prompt_1)];
                case 1:
                    result = _a.sent();
                    responseText = result.response.text();
                    cleanResponseText = responseText.replace(/```json|```/g, "").trim();
                    responseObject = JSON.parse(cleanResponseText);
                    // Output the object with freelancer name and reason
                    console.log(responseObject);
                    return [3 /*break*/, 3];
                case 2:
                    error_1 = _a.sent();
                    console.error("Error occurred while running the Gemini chat:", error_1);
                    return [3 /*break*/, 3];
                case 3: return [2 /*return*/];
            }
        });
    });
}
// Example gig data
var gig = {
    title: "Frontend Developer",
    description: "Looking for an experienced Frontend Developer with expertise in React, CSS, and JavaScript.",
    skillsRequired: ["React", "CSS", "JavaScript"],
};
// Example freelancers data
var freelancers = [
    {
        name: "Alice",
        skills: ["React", "JavaScript", "Node.js"],
        rating: 4.9,
        bio: "Experienced developer with 4+ years in frontend development.",
        experience: 4,
    },
    {
        name: "Bob",
        skills: ["Vue", "CSS", "JavaScript"],
        rating: 4.5,
        bio: "Frontend developer with 2 years of experience in Vue.js and JavaScript.",
        experience: 2,
    },
];
// Run the function with dynamic input
run(gig, freelancers);
