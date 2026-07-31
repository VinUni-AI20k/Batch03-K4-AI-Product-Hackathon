import React, { useState, useEffect, useRef } from "react";
import { useAppContext } from "../context/AppContext";
import { assets } from "../assets/assets";
import Message from "./Message";
import toast from "react-hot-toast";

const ChatBox = () => {
  const containerRef = useRef(null);

  const { axios, theme } = useAppContext();

  const [messages, setMessages] = useState([]);
  const [prompt, setPrompt] = useState("");
  const [loading, setLoading] = useState(false);

  const onSubmit = async (e) => {
    e.preventDefault();

    if (!prompt.trim()) return;

    const userMessage = {
      role: "user",
      content: prompt,
      timestamp: Date.now(),
    };

    setMessages((prev) => [...prev, userMessage]);

    const message = prompt;

    setPrompt("");

    try {
      setLoading(true);

      // Gọi FastAPI
      const { data } = await axios.post("/chat", {
        message,
      });

      const aiMessage = {
        role: "assistant",
        content:
          data.answer ||
          data.error ||
          "No response from server.",
        timestamp: Date.now(),
      };

      setMessages((prev) => [...prev, aiMessage]);
    } catch (error) {
      toast.error(
        error.response?.data?.detail ||
        error.response?.data?.message ||
        error.message
      );
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (containerRef.current) {
      containerRef.current.scrollTop =
        containerRef.current.scrollHeight;
    }
  }, [messages]);

  return (
    <div className="flex-1 flex flex-col justify-between m-5 md:m-10 xl:mx-30 max-md:mt-14 2xl:pr-40">
      <div
        ref={containerRef}
        className="flex-1 overflow-y-auto mb-5 scrollbar-thin scrollbar-thumb-purple-500/20"
      >
        {messages.length === 0 && (
          <div className="h-full flex flex-col justify-center items-center gap-2 text-primary">
            <img
              src={
                theme === "dark"
                  ? assets.logo_full
                  : assets.logo_full_dark
              }
              className="w-full max-w-56 sm:max-w-68"
              alt=""
            />

            <p className="mt-5 text-4xl sm:text-6xl sm:text-center text-gray-400 dark:text-white">
              Ask anything about your course.
            </p>
          </div>
        )}

        {messages.map((msg, index) => (
          <Message key={index} message={msg} />
        ))}

        {loading && (
          <div className="flex gap-2 p-3">
            <div className="animate-pulse">Thinking...</div>
          </div>
        )}
      </div>

      <form
        onSubmit={onSubmit}
        className="bg-primary/20 dark:bg-[#583C79]/30 border border-primary dark:border-[#80609F]/30 rounded-full w-full max-w-2xl p-3 pl-4 mx-auto flex gap-4 items-center"
      >
        <input
          className="flex-1 bg-transparent outline-none"
          placeholder="Ask AI..."
          value={prompt}
          onChange={(e) => setPrompt(e.target.value)}
        />

        <button disabled={loading}>
          <img
            src={
              loading
                ? assets.stop_icon
                : assets.send_icon
            }
            className="w-8"
            alt=""
          />
        </button>
      </form>
    </div>
  );
};

export default ChatBox;