export const generateAIResponse = async (userMessage, chatHistory = []) => {
  try {
    console.log("🚀 Generating AI response for:", userMessage);
    
    const apiKey = process.env.GEMINI_API_KEY;
    
    if (!apiKey || apiKey === 'your_actual_gemini_api_key_here') {
      console.error("❌ GEMINI_API_KEY is not properly configured");
      return getEnhancedFallback(userMessage, chatHistory);
    }

    // Use the correct REST API endpoint - this should work
    const url = `https://generativelanguage.googleapis.com/v1beta/models/gemini-pro:generateContent?key=${apiKey}`;
    
    console.log("📨 Sending request to Gemini REST API");
    
    // Create conversation context
    const context = chatHistory.slice(-6).map(msg => 
      `${msg.type === 'user' ? 'User' : 'Assistant'}: ${msg.message}`
    ).join('\n');
    
    // Professional prompt for home services
    const prompt = `You are HomeFix AI Assistant, a professional customer support agent for HomeFix home services company.

Company Services: plumbing, electrical work, cleaning, painting, AC repair, appliance repair, general maintenance.

Previous Conversation:
${context}

User's Message: "${userMessage}"

Please provide a helpful, professional response in 2-3 sentences. Be friendly and focus on home services:
- If booking/scheduling: ask for preferred date/time
- If pricing: mention free quotes
- If emergency: emphasize quick response
- Always be helpful and ask for details if needed

Assistant Response:`;

    const requestBody = {
      contents: [
        {
          parts: [
            {
              text: prompt
            }
          ]
        }
      ],
      generationConfig: {
        temperature: 0.7,
        topK: 40,
        topP: 0.95,
        maxOutputTokens: 150,
      }
    };

    console.log("🌐 Making API request to Gemini REST API");
    
    const response = await fetch(url, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(requestBody)
    });

    console.log("📊 Response status:", response.status);
    
    if (!response.ok) {
      const errorText = await response.text();
      console.error(`❌ HTTP ${response.status} Error:`, errorText);
      throw new Error(`HTTP ${response.status}: ${errorText}`);
    }

    const data = await response.json();
    console.log("📦 Raw API response received");
    
    if (!data.candidates || !data.candidates[0] || !data.candidates[0].content) {
      console.error("❌ Invalid response format:", data);
      throw new Error('Invalid response format from AI');
    }

    const text = data.candidates[0].content.parts[0].text.trim();
    console.log("✅ AI Response received:", text);
    
    return text;
    
  } catch (error) {
    console.error("❌ Gemini API Error:", error.message);
    return getEnhancedFallback(userMessage, chatHistory);
  }
};

// Enhanced fallback function with better context awareness
function getEnhancedFallback(userMessage, chatHistory = []) {
  const lowerMessage = userMessage.toLowerCase();
  const lastUserMessages = chatHistory
    .filter(msg => msg.type === 'user')
    .slice(-3)
    .map(msg => msg.message.toLowerCase());

  // Check conversation context
  const hasMentionedPlumbing = lastUserMessages.some(msg => 
    msg.includes('plumb') || msg.includes('pipe') || msg.includes('leak') || msg.includes('water') || msg.includes('drain')
  );
  const hasMentionedElectrical = lastUserMessages.some(msg => 
    msg.includes('electr') || msg.includes('wire') || msg.includes('light') || msg.includes('outlet') || msg.includes('switch')
  );
  const hasMentionedCleaning = lastUserMessages.some(msg => 
    msg.includes('clean') || msg.includes('dust') || msg.includes('mop') || msg.includes('vacuum')
  );
  const hasMentionedPricing = lastUserMessages.some(msg => 
    msg.includes('price') || msg.includes('cost') || msg.includes('how much') || msg.includes('quote')
  );
  const hasMentionedBooking = lastUserMessages.some(msg => 
    msg.includes('book') || msg.includes('schedule') || msg.includes('appointment') || msg.includes('available')
  );

  // Context-aware responses
  if (lowerMessage.includes('plumb') || hasMentionedPlumbing) {
    return "I'd be happy to help with plumbing services! 🚰 We handle everything from leak repairs and clogged drains to fixture installations and pipe replacements. Could you describe the specific plumbing issue you're experiencing? For urgent matters, we offer 24/7 emergency service with rapid response.";
  }
  else if (lowerMessage.includes('electr') || hasMentionedElectrical) {
    return "For electrical services, we provide safe, certified solutions with licensed electricians. ⚡ We handle installations, repairs, troubleshooting, panel upgrades, and safety inspections. What specific electrical issue are you experiencing? Safety is our top priority.";
  }
  else if (lowerMessage.includes('clean') || hasMentionedCleaning) {
    return "We offer comprehensive cleaning services! 🧹 This includes deep cleaning, regular maintenance, move-in/move-out cleaning, carpet cleaning, and specialized services. What type of cleaning service are you looking for, and what's the size of the area?";
  }
  else if (lowerMessage.includes('paint')) {
    return "Our professional painting services cover interior and exterior projects with proper preparation and finishing. 🎨 We provide color consultation, surface preparation, and quality materials. Are you looking to paint a specific room, your home's exterior, or need color advice?";
  }
  else if (lowerMessage.includes('ac') || lowerMessage.includes('air') || lowerMessage.includes('heat') || lowerMessage.includes('cool')) {
    return "We provide complete HVAC services including AC repair, maintenance, installation, and heating system services. ❄️ Our certified technicians can handle all major brands. What specific issue are you having with your cooling or heating system?";
  }
  else if (lowerMessage.includes('appliance')) {
    return "We offer appliance repair services for refrigerators, ovens, washers, dryers, and dishwashers. 🛠️ Our technicians are trained on all major brands. Which appliance is having issues, and what symptoms are you noticing?";
  }
  else if (lowerMessage.includes('price') || lowerMessage.includes('cost') || lowerMessage.includes('how much') || hasMentionedPricing) {
    return "We provide free, detailed quotes for all services! 💰 Pricing depends on the service type, materials needed, and project scope. Could you share specific details about what you need so I can provide accurate cost information and help you schedule a free estimate?";
  }
  else if (lowerMessage.includes('book') || lowerMessage.includes('schedule') || lowerMessage.includes('appointment') || hasMentionedBooking) {
    return "I'd be happy to schedule a service for you! 📅 We have flexible availability throughout the week. What's your preferred date and time, which service do you need, and could you share your location for technician dispatch? We'll confirm the appointment details shortly.";
  }
  else if (lowerMessage.includes('emergency') || lowerMessage.includes('urgent') || lowerMessage.includes('asap') || lowerMessage.includes('now')) {
    return "🚨 I understand this is urgent! For emergency services, we prioritize your request with 24/7 rapid response. Please call our emergency hotline at **1-800-HOMEFIX** immediately for fastest assistance, or provide your location and issue details so I can alert our nearest emergency team.";
  }
  else if (lowerMessage.includes('thank') || lowerMessage.includes('thanks')) {
    return "You're welcome! 😊 I'm happy to help. Is there anything else you'd like to know about our services, or would you like me to help you schedule an appointment with one of our specialists?";
  }
  else if (lowerMessage.includes('hello') || lowerMessage.includes('hi') || lowerMessage.includes('hey') || lowerMessage.includes('good morning') || lowerMessage.includes('good afternoon')) {
    return "Hello! 👋 Welcome to HomeFix Support. I'm your AI assistant specializing in home services including plumbing, electrical, cleaning, painting, AC repair, and appliance services. How can I help you with your home today?";
  }
  else if (lowerMessage.includes('bye') || lowerMessage.includes('goodbye') || lowerMessage.includes('see you')) {
    return "Thank you for contacting HomeFix! 👋 If you need any home services in the future, don't hesitate to reach out. Have a great day!";
  }
  else if (chatHistory.length > 2) {
    // Conversational follow-up based on context
    const lastAssistantMessage = chatHistory.filter(msg => msg.type === 'support').pop()?.message || '';
    
    if (lastAssistantMessage.includes('plumb') || hasMentionedPlumbing) {
      return "To help with your plumbing needs, could you tell me more about the specific issue? For example: leaking pipes, clogged drains, low water pressure, or fixture installation?";
    }
    else if (lastAssistantMessage.includes('electr') || hasMentionedElectrical) {
      return "For electrical assistance, could you provide more details? Such as: power outages, flickering lights, outlet issues, wiring problems, or new installations?";
    }
    else {
      return "Thanks for your message! To help you better, could you provide a bit more detail about what home service you need assistance with? The more specific you are, the better I can assist!";
    }
  }
  else {
    return "Thank you for contacting HomeFix! 🏠 I specialize in helping with home services including plumbing, electrical work, cleaning, painting, AC repair, appliance repair, and general maintenance. What specific service can I assist you with today?";
  }
}