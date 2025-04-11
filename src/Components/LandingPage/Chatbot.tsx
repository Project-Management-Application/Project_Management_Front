import { useState } from "react";
import { motion } from "framer-motion";
import { MessageCircle } from "lucide-react";
import axios from "axios";

export default function ChatBubble() {
  const [isOpen, setIsOpen] = useState(false);
  const [message, setMessage] = useState("");
  const [chatHistory, setChatHistory] = useState<
    { sender: string; text: string }[]
  >([]);
  const [hasInteracted, setHasInteracted] = useState(false); // Track user interaction
  const [isLoading, setIsLoading] = useState(false); // Loading state for typing indicator

  const handleSuggestionClick = (text: string) => {
    setMessage(text);
    sendMessage(text);
    setHasInteracted(true); // User clicked a suggestion
  };

  const sendMessage = async (text: string) => {
    if (!text.trim()) return;

    const newUserMessage = { sender: "You", text };
    setChatHistory((prev) => [...prev, newUserMessage]);

    try {
      setIsLoading(true); // Set loading to true while fetching the response
      const response = await axios.post("http://10.30.30.26:5000/chat", {
        message: text,
      });
      const botReply = { sender: "ChatBot", text: response.data.response };
      setChatHistory((prev) => [...prev, botReply]);
    } catch (error) {
      console.error("Error sending message:", error);
    } finally {
      setIsLoading(false); // Set loading to false after fetching the response
    }

    setMessage("");
    setHasInteracted(true); // User started typing
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === "Enter") {
      sendMessage(message); // Send message when Enter is pressed
    }
  };

  return (
    <div className="fixed bottom-6 right-6 z-50 flex flex-col items-end">
      {isOpen && (
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: 20 }}
          className="flex h-[500px] w-[450px] flex-col justify-between rounded-2xl border border-gray-200 bg-white p-6 shadow-2xl"
        >
          <div className="flex h-[350px] flex-col space-y-2 overflow-y-auto border-b p-2">
            {chatHistory.map((msg, index) => (
              <div
                key={index}
                className={`rounded-lg p-2 ${
                  msg.sender === "You"
                    ? "self-end bg-blue-500 text-white"
                    : "self-start bg-gray-200 text-gray-800"
                }`}
              >
                <strong>{msg.sender}:</strong> {msg.text}
              </div>
            ))}
            {isLoading && (
              <div className="self-start p-2 text-gray-500">
                ChatBot is typing...
              </div>
            )}
          </div>

          <div className="mt-2">
            {!hasInteracted && (
              <div className="space-y-2">
                {[
                  "What is SCRUM?",
                  "What is Kanban?",
                  "What is the difference between SCRUM and Kanban?",
                ].map((text, index) => (
                  <button
                    key={index}
                    onClick={() => handleSuggestionClick(text)}
                    className="block w-full rounded-lg bg-gray-100 px-3 py-2 text-left text-sm text-gray-700 hover:bg-gray-200"
                  >
                    {text}
                  </button>
                ))}
              </div>
            )}

            <div className="mt-4 flex items-center rounded-lg border border-gray-300 bg-white p-2">
              <input
                type="text"
                value={message}
                onChange={(e) => setMessage(e.target.value)}
                onKeyDown={handleKeyDown} // Add onKeyDown handler here
                className="flex-1 border-none bg-transparent text-sm text-gray-700 outline-none"
                placeholder="Type your message..."
              />
              <button
                onClick={() => sendMessage(message)}
                className="ml-2 text-sm font-medium text-blue-600 hover:text-blue-700"
              >
                Send
              </button>
            </div>

            <button
              onClick={() => setIsOpen(false)}
              className="mt-2 text-sm text-blue-600 hover:underline"
            >
              Close
            </button>
          </div>
        </motion.div>
      )}

      <motion.button
        onClick={() => setIsOpen(!isOpen)}
        whileHover={{ scale: 1.1 }}
        whileTap={{ scale: 0.9 }}
        className="rounded-full bg-blue-600 p-3 text-white shadow-lg hover:bg-blue-700 focus:outline-none"
      >
        <MessageCircle size={24} />
      </motion.button>
    </div>
  );
}
