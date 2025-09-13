// Varying greetings and response templates for dynamic conversation

export const GREETING_VARIATIONS = [
  "Hello! I'm Jal-Mitra, your groundwater guardian. I can help you understand your local water situation and provide conservation tips. Click 'Check My Location' to get started!",
  
  "नमस्ते! I'm Jal-Mitra, here to help you with groundwater management. Let's explore your local water resources together!",
  
  "Welcome to Jal-Mitra! 🌊 I'm your AI assistant for groundwater insights. Ready to dive into water conservation strategies?",
  
  "Hi there! I'm Jal-Mitra, specializing in groundwater health and conservation. How can I assist you with your water management needs today?",
  
  "Greetings! Jal-Mitra at your service. I provide personalized groundwater insights and conservation guidance. What would you like to know?",
  
  "Hello, water guardian! 💧 I'm Jal-Mitra, your intelligent companion for sustainable groundwater management. Let's start protecting our precious water resources!",
  
  "Welcome! I'm Jal-Mitra, combining AI with traditional water wisdom. Ready to explore smart groundwater solutions for your area?",
  
  "Hi! Jal-Mitra here - your digital water advisor. I'm equipped with local data and conservation expertise. How can I help you today?",
  
  "नमस्कार! I'm Jal-Mitra, bridging technology and water stewardship. Let's work together towards sustainable groundwater management!",
  
  "Salutations, earth's guardian! 🌍 I'm Jal-Mitra, helping communities make informed decisions about their precious groundwater resources."
];

export const RESPONSE_TEMPLATES = {
  conservation: [
    "Here are some effective water conservation strategies for your region:",
    "Let me share proven conservation techniques that work well in your area:",
    "Based on local conditions, here are my top conservation recommendations:",
    "For sustainable water management in your region, consider these approaches:",
  ],
  
  crops: [
    "For water-efficient farming in your area, I recommend:",
    "Smart crop selection for your region includes:",
    "To optimize water usage for agriculture, consider:",
    "Here are drought-resistant farming strategies for your location:",
  ],
  
  status: [
    "Let me analyze your groundwater status based on the latest data:",
    "Here's what the current data tells us about your local groundwater:",
    "Based on regional monitoring, your groundwater situation shows:",
    "The latest groundwater assessment for your area indicates:",
  ],
  
  trends: [
    "Looking at long-term patterns, here's what I observe:",
    "The groundwater trends in your region show:",
    "Based on historical data analysis:",
    "Monitoring trends reveal the following patterns:",
  ]
};

export const CONTEXTUAL_RESPONSES = {
  location_request: [
    "To provide accurate local insights, I need to know your location. This helps me access relevant groundwater data for your specific area.",
    "Location access allows me to give you precise, location-based groundwater analysis and conservation recommendations.",
    "By knowing your location, I can compare your area's data with regional patterns and provide targeted advice.",
  ],
  
  no_data: [
    "I don't have specific data for your exact location, but I can provide general guidance based on regional patterns.",
    "While precise local data isn't available, I can offer insights based on similar geographical conditions.",
    "Let me share relevant information based on the nearest available monitoring points.",
  ],
  
  critical_status: [
    "⚠️ The data indicates critical groundwater levels in your area. Immediate conservation measures are recommended.",
    "🚨 Critical groundwater status detected. Let me provide emergency conservation strategies for your situation.",
    "⛔ Your area shows critically low groundwater levels. Here are urgent steps you can take:",
  ],
  
  good_status: [
    "✅ Great news! Your area shows healthy groundwater levels. Here's how to maintain this positive status:",
    "🌊 Your groundwater situation looks good! Let's explore ways to keep it that way:",
    "💚 Excellent groundwater health in your region. Here are best practices to sustain it:",
  ]
};

export const MULTILINGUAL_RESPONSES = {
  hindi: {
    greeting: "नमस्ते! मैं जल-मित्र हूं, आपका भूजल संरक्षक। मैं आपकी स्थानीय जल स्थिति को समझने में मदद कर सकता हूं।",
    conservation: "आपके क्षेत्र के लिए जल संरक्षण की तकनीकें:",
    location: "सटीक स्थानीय जानकारी के लिए, कृपया अपना स्थान साझा करें।",
    critical: "⚠️ आपके क्षेत्र में भूजल का स्तर गंभीर है। तुरंत संरक्षण उपाय की सलाह दी जाती है।"
  },
  
  english: {
    greeting: "Hello! I'm Jal-Mitra, your groundwater guardian.",
    conservation: "Water conservation techniques for your region:",
    location: "For accurate local insights, please share your location.",
    critical: "⚠️ Critical groundwater levels detected in your area. Immediate action recommended."
  }
};

// Function to get random greeting
export const getRandomGreeting = (): string => {
  return GREETING_VARIATIONS[Math.floor(Math.random() * GREETING_VARIATIONS.length)];
};

// Function to get contextual response template
export const getResponseTemplate = (category: keyof typeof RESPONSE_TEMPLATES): string => {
  const templates = RESPONSE_TEMPLATES[category];
  return templates[Math.floor(Math.random() * templates.length)];
};

// Function to get contextual response
export const getContextualResponse = (context: keyof typeof CONTEXTUAL_RESPONSES): string => {
  const responses = CONTEXTUAL_RESPONSES[context];
  return responses[Math.floor(Math.random() * responses.length)];
};