import React, { useState, useRef, useEffect } from 'react';
import { Send, Image, X, Minimize2 } from 'lucide-react';

// Types
interface Message {
  role: 'user' | 'bot';
  content: string;
  image?: string; // URL to the image
}

const ChatBot: React.FC = () => {
  // State
  const [isOpen, setIsOpen] = useState(false);
  const [input, setInput] = useState('');
  const [messages, setMessages] = useState<Message[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [selectedImage, setSelectedImage] = useState<File | null>(null);
  const [imagePreview, setImagePreview] = useState<string | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const messagesEndRef = useRef<HTMLDivElement>(null);
  
  // Chat history for Gemini
  const [chatHistory, setChaptHistory] = useState<any[]>([]);

  // Handle file selection
  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      const file = e.target.files[0];
      setSelectedImage(file);
      
      // Create a preview
      const reader = new FileReader();
      reader.onload = (e) => {
        setImagePreview(e.target?.result as string);
      };
      reader.readAsDataURL(file);
    }
  };

  // Handle form submission
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!input.trim() && !selectedImage) return;
    
    // Add user message to chat
    const userMessage: Message = {
      role: 'user',
      content: input,
      ...(imagePreview && { image: imagePreview })
    };
    
    setMessages(prev => [...prev, userMessage]);
    setInput('');
    setIsLoading(true);
    
    try {
      // Call the Gemini API directly
      let response;
      if (selectedImage) {
        response = await callGeminiWithImage(input, selectedImage);
      } else {
        response = await callGeminiText(input);
      }
      
      // Add bot response to messages
      setMessages(prev => [...prev, {
        role: 'bot',
        content: response
      }]);
    } catch (error) {
      console.error("Error getting response:", error);
      setMessages(prev => [...prev, {
        role: 'bot',
        content: "Sorry, I'm having trouble processing your request right now."
      }]);
    } finally {
      setIsLoading(false);
      setSelectedImage(null);
      setImagePreview(null);
    }
  };

  // Function to call Gemini API with text input
  const callGeminiText = async (question: string): Promise<string> => {
    try {
      const GOOGLE_API_KEY = "AIzaSyBhVjgM6I3Zz-90uvu7y_dPLZ83yxLCVzA";
      if (!GOOGLE_API_KEY) {
        throw new Error("Google API key is missing");
      }

      const response = await fetch(`https://generativelanguage.googleapis.com/v1beta/models/gemini-1.5-flash-latest:generateContent?key=${GOOGLE_API_KEY}`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          contents: [
            {
              role: "user",
              parts: [{ text: `Please respond as a medical chatbot. Question: ${question}` }]
            }
          ],
          generationConfig: {
            temperature: 0.7,
            topK: 40,
            topP: 0.95,
            maxOutputTokens: 1024,
          },
          safetySettings: [
            {
              category: "HARM_CATEGORY_HARASSMENT",
              threshold: "BLOCK_MEDIUM_AND_ABOVE"
            },
            {
              category: "HARM_CATEGORY_HATE_SPEECH",
              threshold: "BLOCK_MEDIUM_AND_ABOVE"
            },
            {
              category: "HARM_CATEGORY_SEXUALLY_EXPLICIT",
              threshold: "BLOCK_MEDIUM_AND_ABOVE"
            },
            {
              category: "HARM_CATEGORY_DANGEROUS_CONTENT",
              threshold: "BLOCK_MEDIUM_AND_ABOVE"
            }
          ]
        })
      });

      const data = await response.json();
      
      if (data.error) {
        throw new Error(data.error.message || "Error calling Gemini API");
      }
      
      if (data.candidates && data.candidates[0].content.parts && data.candidates[0].content.parts[0].text) {
        return data.candidates[0].content.parts[0].text;
      } else {
        throw new Error("Unexpected response format from Gemini API");
      }
    } catch (error) {
      console.error("Error in callGeminiText:", error);
      throw error;
    }
  };

  // Function to call Gemini API with image
  const callGeminiWithImage = async (text: string, image: File): Promise<string> => {
    try {
        const GOOGLE_API_KEY = "AIzaSyBhVjgM6I3Zz-90uvu7y_dPLZ83yxLCVzA";
      if (!GOOGLE_API_KEY) {
        throw new Error("Google API key is missing");
      }
      
      // Convert image to base64
      const base64Image = await fileToBase64(image);
      const mimeType = image.type;
      
      const prompt = text 
        ? `Please analyze the following image and help a dylexia student to analyse it. Text input: ${text}`
        : "Please analyze the following image for dylexia student and help to understand it.";

      const response = await fetch(`https://generativelanguage.googleapis.com/v1beta/models/gemini-1.5-flash-latest:generateContent?key=${GOOGLE_API_KEY}`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          contents: [
            {
              role: "user",
              parts: [
                { text: prompt },
                {
                  inline_data: {
                    mime_type: mimeType,
                    data: base64Image.split(',')[1] // Remove the data:image/jpeg;base64, part
                  }
                }
              ]
            }
          ],
          generationConfig: {
            temperature: 0.7,
            topK: 40,
            topP: 0.95,
            maxOutputTokens: 1024,
          },
          safetySettings: [
            {
              category: "HARM_CATEGORY_HARASSMENT",
              threshold: "BLOCK_MEDIUM_AND_ABOVE"
            },
            {
              category: "HARM_CATEGORY_HATE_SPEECH",
              threshold: "BLOCK_MEDIUM_AND_ABOVE"
            },
            {
              category: "HARM_CATEGORY_SEXUALLY_EXPLICIT",
              threshold: "BLOCK_MEDIUM_AND_ABOVE"
            },
            {
              category: "HARM_CATEGORY_DANGEROUS_CONTENT",
              threshold: "BLOCK_MEDIUM_AND_ABOVE"
            }
          ]
        })
      });

      const data = await response.json();
      
      if (data.error) {
        throw new Error(data.error.message || "Error calling Gemini API");
      }
      
      if (data.candidates && data.candidates[0].content.parts && data.candidates[0].content.parts[0].text) {
        return data.candidates[0].content.parts[0].text;
      } else {
        throw new Error("Unexpected response format from Gemini API");
      }
    } catch (error) {
      console.error("Error in callGeminiWithImage:", error);
      throw error;
    }
  };

  // Helper function to convert File to base64
  const fileToBase64 = (file: File): Promise<string> => {
    return new Promise((resolve, reject) => {
      const reader = new FileReader();
      reader.readAsDataURL(file);
      reader.onload = () => resolve(reader.result as string);
      reader.onerror = (error) => reject(error);
    });
  };

  // Scroll to bottom of messages
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

  // Remove image
  const removeImage = () => {
    setSelectedImage(null);
    setImagePreview(null);
    if (fileInputRef.current) {
      fileInputRef.current.value = '';
    }
  };

  return (
    <div className="relative">
      {/* Toggle button */}
      {!isOpen ? (
        <button
          onClick={() => setIsOpen(true)}
          className="w-14 h-14 rounded-full bg-gradient-to-r from-green-500 to-green-700 text-white flex items-center justify-center shadow-lg hover:shadow-xl transition-all duration-300 hover:scale-105"
        >
          <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 10h.01M12 10h.01M16 10h.01M9 16H5a2 2 0 01-2-2V6a2 2 0 012-2h14a2 2 0 012 2v8a2 2 0 01-2 2h-5l-5 5v-5z" />
          </svg>
        </button>
      ) : (
        <div className="w-96 h-[600px] bg-gradient-to-br from-gray-900 via-black to-gray-900 rounded-2xl shadow-2xl flex flex-col border border-green-500/20">
          {/* Header */}
          <div className="p-4 border-b border-green-500/20 flex justify-between items-center bg-black/40">
            <h2 className="text-lg font-semibold text-green-400">AI Assistant</h2>
            <button
              onClick={() => setIsOpen(false)}
              className="p-1 hover:bg-gray-800 rounded-lg transition-colors"
            >
              <Minimize2 className="w-5 h-5 text-green-400" />
            </button>
          </div>

          {/* Messages container */}
          <div className="flex-1 overflow-y-auto p-4 space-y-4">
            {messages.map((message, index) => (
              <div
                key={index}
                className={`flex ${message.role === 'user' ? 'justify-end' : 'justify-start'}`}
              >
                <div
                  className={`max-w-[80%] p-3 rounded-xl ${
                    message.role === 'user'
                      ? 'bg-gradient-to-r from-green-500 to-green-700 text-white'
                      : 'bg-gray-800 text-gray-200'
                  }`}
                >
                  {message.image && (
                    <img
                      src={message.image}
                      alt="User upload"
                      className="max-w-full h-auto rounded-lg mb-2"
                    />
                  )}
                  <p className="whitespace-pre-wrap">{message.content}</p>
                </div>
              </div>
            ))}
            {isLoading && (
              <div className="flex justify-start">
                <div className="bg-gray-800 text-gray-200 p-3 rounded-xl">
                  <div className="flex items-center space-x-2">
                    <div className="w-2 h-2 bg-green-500 rounded-full animate-bounce" />
                    <div className="w-2 h-2 bg-green-500 rounded-full animate-bounce" style={{ animationDelay: '0.2s' }} />
                    <div className="w-2 h-2 bg-green-500 rounded-full animate-bounce" style={{ animationDelay: '0.4s' }} />
                  </div>
                </div>
              </div>
            )}
            <div ref={messagesEndRef} />
          </div>

          {/* Input form */}
          <form onSubmit={handleSubmit} className="p-4 border-t border-green-500/20 bg-black/40">
            {imagePreview && (
              <div className="relative mb-2">
                <img
                  src={imagePreview}
                  alt="Preview"
                  className="w-20 h-20 object-cover rounded-lg"
                />
                <button
                  type="button"
                  onClick={removeImage}
                  className="absolute -top-2 -right-2 bg-red-500 rounded-full p-1"
                >
                  <X className="w-4 h-4 text-white" />
                </button>
              </div>
            )}
            <div className="flex items-center space-x-2">
              <input
                type="text"
                value={input}
                onChange={(e) => setInput(e.target.value)}
                placeholder="Type your message..."
                className="flex-1 bg-gray-800 text-white rounded-lg px-4 py-2 focus:outline-none focus:ring-2 focus:ring-green-500"
              />
              <input
                type="file"
                ref={fileInputRef}
                onChange={handleFileChange}
                accept="image/*"
                className="hidden"
              />
              <button
                type="button"
                onClick={() => fileInputRef.current?.click()}
                className="p-2 hover:bg-gray-800 rounded-lg transition-colors"
              >
                <Image className="w-5 h-5 text-green-400" />
              </button>
              <button
                type="submit"
                disabled={isLoading || (!input.trim() && !selectedImage)}
                className="p-2 hover:bg-gray-800 rounded-lg transition-colors disabled:opacity-50"
              >
                <Send className="w-5 h-5 text-green-400" />
              </button>
            </div>
          </form>
        </div>
      )}
    </div>
  );
};

export default ChatBot;