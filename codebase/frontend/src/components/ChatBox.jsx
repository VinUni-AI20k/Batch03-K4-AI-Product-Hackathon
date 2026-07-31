import React, { useState, useEffect, useRef } from "react";
import { useAppContext } from "../context/AppContext";
import { assets } from "../assets/assets";
import Message from "./Message";
import toast from "react-hot-toast";

const ChatBox = () => {

  const containerRef = useRef(null);

  const {
    user,
    selectedChat,
    theme,
    axios,
    token,
    updateChatMessages
  } = useAppContext();

  const [messages, setMessages] = useState([]);

  const [loading, setLoading] = useState(false);

  const [prompt, setPrompt] = useState('');

  const onSubmit = async (e) => {

    try {

      e.preventDefault();

      if (!user) {

        return toast.error(
          'Please login to send a message'
        );

      }

      if (!selectedChat) {

        return toast.error(
          'No chat selected'
        );

      }

      setLoading(true);

      const promptCopy = prompt;

      setPrompt('');

      const userMessage = {
        role: 'user',
        content: promptCopy,
        timestamp: Date.now()
      };

      setMessages(prev => [
        ...prev,
        userMessage
      ]);

      updateChatMessages(
        selectedChat._id,
        userMessage
      );

      const { data } = await axios.post(
        '/api/message/text',
        {
          chatId: selectedChat._id,
          prompt: promptCopy
        },
        {
          headers: {
            Authorization: token
          }
        }
      );

      if (data.success) {

        setMessages(prev => [
          ...prev,
          data.reply
        ]);

        updateChatMessages(
          selectedChat._id,
          data.reply
        );

      } else {

        toast.error(data.message);

      }

    } catch (error) {

      toast.error(
        error.response?.data?.message ||
        error.message
      );

    } finally {

      setLoading(false);

    }

  };

  useEffect(() => {

    if (selectedChat) {

      setMessages(
        selectedChat.messages || []
      );

    }

  }, [selectedChat]);

  useEffect(() => {

    if (containerRef.current) {

      containerRef.current.scrollTo({
        top: containerRef.current.scrollHeight,
        behavior: 'smooth',
      });

    }

  }, [messages]);

  return (
    <div className='flex-1 flex flex-col justify-between m-5 md:m-10 xl:mx-30
    max-md:mt-14 2xl:pr-40'>

      {/* Chat Messages */}
      <div
        className='flex-1 mb-5 overflow-y-scroll scrollbar-thin
        scrollbar-thumb-purple-500/20'
        ref={containerRef}
      >

        {messages.length === 0 && (
          <div className='h-full flex flex-col justify-center items-center
          gap-2 text-primary'>

            <img
              src={theme === 'dark'
                ? assets.logo_full
                : assets.logo_full_dark
              }
              alt=""
              className='w-full max-w-56 sm:max-w-68'
            />

            <p className='mt-5 text-4xl sm:text-6xl sm:text-center
            text-gray-400 dark:text-white'>
              Enter your message to start the conversation.
            </p>

          </div>
        )}

        {messages.map((message, index) => (
          <Message key={index} message={message} />
        ))}

        {/* Loading */}
        {
          loading && (
            <div className='Loader flex items-center justify-center gap-1.5'>

              <div className='w-1.5 h-1.5 rounded-full bg-gray-500
              dark:bg-white animate-bounce'></div>

              <div className='w-1.5 h-1.5 rounded-full bg-gray-500
              dark:bg-white animate-bounce'></div>

              <div className='w-1.5 h-1.5 rounded-full bg-gray-500
              dark:bg-white animate-bounce'></div>

            </div>
          )
        }

      </div>

      {/* Prompt Input */}
      <form
        className='bg-primary/20 dark:bg-[#583C79]/30 border border-primary
        dark:border-[#80609F]/30 rounded-full w-full max-w-2xl p-3 pl-4
        mx-auto flex gap-4 items-center'
        onSubmit={onSubmit}
      >

        <input
          onChange={(e) => setPrompt(e.target.value)}
          value={prompt}
          type="text"
          placeholder="Type your messages here..."
          className="flex-1 w-full text-sm outline-none bg-transparent
          text-gray-700 dark:text-white
          placeholder-gray-400 dark:placeholder-gray-500"
          required
        />

        <button
          type="submit"
          disabled={loading}
        >

          <img
            className="w-8 cursor-pointer"
            src={loading
              ? assets.stop_icon
              : assets.send_icon
            }
            alt=""
          />

        </button>

      </form>
    </div>
  );

};

export default ChatBox;