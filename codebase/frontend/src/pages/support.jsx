import React, { useState } from "react";
import axios from "axios";
import toast from "react-hot-toast";

const Support = () => {

  const [openIndex, setOpenIndex] = useState(null);

  const [email, setEmail] = useState("");
  const [message, setMessage] = useState("");
  const [loading, setLoading] = useState(false);

  const faqs = [
    {
      question: "How do I start a new chat?",
      answer:
        "Click the 'New Chat' button in the sidebar to create a new conversation instantly.",
    },
    {
      question: "Why is my AI response slow?",
      answer:
        "Response speed depends on your internet connection and the AI server status. Large prompts may also take longer.",
    },
    {
      question: "Can I save my conversations?",
      answer:
        "Yes. Your conversations are automatically stored and displayed in the Recent Chats section.",
    },
    {
      question: "How do I enable dark mode?",
      answer:
        "Use the Dark Mode toggle in the sidebar to switch between light and dark themes.",
    },
    {
      question: "What should I do if messages are not loading?",
      answer:
        "Refresh the page, check your backend server, and ensure MongoDB is connected properly.",
    },
  ];

  const toggleFAQ = (index) => {
    setOpenIndex(openIndex === index ? null : index);
  };

  const submitSupport = async () => {

    if (!email || !message) {
      return toast.error("Please fill all fields");
    }

    try {

      setLoading(true);

      const { data } = await axios.post(
        `${import.meta.env.VITE_SERVER_URL}/api/support/contact`,
        {
          email,
          message,
        }
      );

      if (data.success) {

        toast.success(data.message);

        setEmail("");
        setMessage("");

      } else {

        toast.error(data.message);

      }

    } catch (error) {

      toast.error(
        error.response?.data?.message || error.message
      );

    } finally {

      setLoading(false);

    }

  };

  return (
    <div
      className='flex-1 overflow-y-auto p-6 md:p-10
      bg-[#F5F5F7] dark:bg-transparent
      text-gray-900 dark:text-white'
    >

      <div className='max-w-4xl mx-auto'>

        {/* Header */}
        <div className='mb-10'>
          <p
            className='text-sm tracking-[6px] uppercase
            text-purple-400 dark:text-primary mb-3'
          >
            Support Center
          </p>

          <h1
            className='text-4xl md:text-5xl font-semibold mb-4
            text-gray-900 dark:text-white'
          >
            How can we help you?
          </h1>

          <p
            className='text-gray-600 dark:text-gray-400
            max-w-2xl leading-relaxed'
          >
            Find answers to common questions about QuickGPT,
            chat features, themes, conversations, and troubleshooting.
          </p>
        </div>

        {/* FAQ CARD */}
        <div
          className='rounded-3xl border
          border-gray-200 dark:border-white/10
          bg-white dark:bg-white/5
          backdrop-blur-md p-6 md:p-8 mb-10 shadow-2xl'
        >

          <div className='flex items-center gap-4 mb-6'>

            <div
              className='size-14 rounded-2xl
              bg-purple-100 dark:bg-primary/20
              flex items-center justify-center text-2xl'
            >
              💬
            </div>

            <div>
              <h2
                className='text-2xl font-semibold
                text-gray-900 dark:text-white'
              >
                QuickGPT Support
              </h2>

              <p
                className='text-gray-500 dark:text-gray-400 text-sm'
              >
                Frequently asked questions and troubleshooting
              </p>
            </div>

          </div>

          {/* FAQ LIST */}
          <div className='space-y-4'>

            {faqs.map((faq, index) => (

              <div
                key={index}
                className='rounded-2xl border
                border-gray-200 dark:border-white/10
                bg-[#F8F8F8] dark:bg-black/20
                overflow-hidden'
              >

                <button
                  onClick={() => toggleFAQ(index)}
                  className='w-full flex items-center justify-between
                  p-5 text-left'
                >

                  <span
                    className='font-medium text-base md:text-lg
                    text-gray-800 dark:text-white'
                  >
                    {faq.question}
                  </span>

                  <div
                    className={`size-8 rounded-full flex items-center
                    justify-center transition-all duration-300
                    ${
                      openIndex === index
                        ? "bg-primary text-black rotate-45"
                        : "bg-gray-200 dark:bg-white/10 text-gray-700 dark:text-white"
                    }`}
                  >
                    +
                  </div>

                </button>

                <div
                  className={`transition-all duration-300 overflow-hidden
                  ${
                    openIndex === index
                      ? "max-h-40 opacity-100"
                      : "max-h-0 opacity-0"
                  }`}
                >

                  <div
                    className='px-5 pb-5
                    text-gray-600 dark:text-gray-300
                    leading-relaxed'
                  >
                    {faq.answer}
                  </div>

                </div>

              </div>

            ))}

          </div>

        </div>

        {/* CONTACT BOX */}
        <div
          className='rounded-3xl border
          border-gray-200 dark:border-white/10
          bg-gradient-to-r
          from-[#F3E8FF] to-[#FFFFFF]
          dark:from-[#2B1E36] dark:to-[#161217]
          p-6 md:p-8 shadow-xl'
        >

          <h2
            className='text-2xl font-semibold mb-3
            text-gray-900 dark:text-white'
          >
            Need more help?
          </h2>

          <p
            className='text-gray-600 dark:text-gray-400
            mb-6 max-w-2xl'
          >
            If your issue is not listed above,
            contact the administrator or developer
            for additional support.
          </p>

          <div className='flex flex-col gap-4'>

            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="Enter your email"
              className='h-12 rounded-xl
              bg-white dark:bg-black/30
              border border-gray-300 dark:border-white/10
              px-4 outline-none
              focus:border-purple-400 dark:focus:border-primary
              text-sm text-gray-800 dark:text-white'
            />

            <textarea
              rows={5}
              value={message}
              onChange={(e) => setMessage(e.target.value)}
              placeholder="Describe your issue..."
              className='rounded-xl
              bg-white dark:bg-black/30
              border border-gray-300 dark:border-white/10
              px-4 py-3 outline-none
              focus:border-purple-400 dark:focus:border-primary
              text-sm text-gray-800 dark:text-white resize-none'
            />

            <button
              onClick={submitSupport}
              disabled={loading}
              className='h-12 px-6 rounded-xl
              bg-purple-500 dark:bg-primary
              text-white dark:text-black
              font-medium hover:opacity-90 transition'
            >
              {loading ? "Sending..." : "Contact Support"}
            </button>

          </div>

        </div>

      </div>

    </div>
  );
};

export default Support;