import React from "react";
import { assets } from "../assets/assets";
import { useAppContext } from "../context/AppContext";
import { useNavigate } from "react-router-dom";

const Sidebar = ({ isMenuOpen, setIsMenuOpen }) => {

  const { theme, setTheme } = useAppContext();

  const navigate = useNavigate();

  return (
    <div className={`flex flex-col h-screen min-w-72 p-5 dark:bg-gradient-to-b 
    from-[#242124]/30 to-[#000000]/30 border-r border-[#80609F]/30 
    backdrop-blur-3xl transition-all duration-500 max-md:absolute 
    left-0 z-1 ${!isMenuOpen && 'max-md:-translate-x-full'}`}>

      <img
        src={
          theme === 'dark'
            ? assets.logo_full
            : assets.logo_full_dark
        }
        alt="Logo"
        className='w-full max-w-48'
      />

      <button
        onClick={() => navigate("/")}
        className='flex justify-center items-center w-full py-2 mt-10 text-white bg-gradient-to-r from-[#A456F7] to-[#3D81F6] text-sm rounded-md cursor-pointer'
      >
        <span className='mr-2 text-xl'>+</span>
        New Chat
      </button>

      {/* Search UI giữ nguyên */}
      <div className='flex items-center gap-2 p-3 mt-4 border border-gray-400 dark:border-white/20 rounded-md'>

        <img
          src={assets.search_icon}
          className='w-4 not-dark:invert'
          alt=""
        />

        <input
          type="text"
          placeholder='Search conversations'
          className='bg-transparent text-xs placeholder:text-gray-400 outline-none w-full'
          disabled
        />

      </div>

      {/* Tạm ẩn Recent Chats cho tới khi có backend */}
      <div className='flex-1 overflow-y-auto mt-3 text-sm space-y-3'></div>

      <div
        onClick={() => {

          navigate('/knowledge-base');

          setIsMenuOpen(false);

        }}
        className='flex items-center gap-2 p-3 mt-4 border border-gray-300 dark:border-white/15 rounded-md cursor-pointer hover:scale-103 transition-all'
      >

        <img
          src={assets.gallery_icon}
          className='w-4.5 not-dark:invert'
          alt=""
        />

        <div className='flex flex-col text-sm'>
          <p className="font-medium">
            Data DashBoard
          </p>

          <p className='text-[10px] text-gray-500'>
            Dashboard dữ liệu và tài liệu
          </p>
        </div>

      </div>

      <div
        onClick={() => {

          navigate('/support');

          setIsMenuOpen(false);

        }}
        className='flex items-center gap-2 p-3 mt-4 border border-gray-300 dark:border-white/15 rounded-md cursor-pointer hover:scale-103 transition-all'
      >

        <img
          src={assets.diamond_icon}
          className='w-4.5 dark:invert'
          alt=""
        />

        <div className='flex flex-col text-sm'>

          <p className="font-medium">
            Help & Feedback
          </p>

          <p className='text-[10px] text-gray-500'>
            Hỗ trợ kỹ thuật
          </p>

        </div>

      </div>

      <div className='flex items-center justify-between gap-2 p-3 mt-4 border border-gray-300 dark:border-white/15 rounded-md'>

        <div className='flex items-center gap-2 text-sm'>

          <img
            src={assets.theme_icon}
            className='w-4 not-dark:invert'
            alt=""
          />

          <p>Dark Mode</p>

        </div>

        <label className='relative inline-flex cursor-pointer'>

          <input
            type="checkbox"
            className="sr-only peer"
            checked={theme === 'dark'}
            onChange={() =>
              setTheme(
                theme === 'dark'
                  ? 'light'
                  : 'dark'
              )
            }
          />

          <div className='w-9 h-5 bg-gray-400 rounded-full peer-checked:bg-purple-600 transition-all'></div>

          <span className='absolute left-1 top-1 w-3 h-3 bg-white rounded-full transition-transform peer-checked:translate-x-4'></span>

        </label>

      </div>

      {/* Footer giữ nguyên style */}

      <div className='flex items-center gap-3 p-3 mt-4 border border-gray-300 dark:border-white/15 rounded-md cursor-pointer group'>

        <img
          src={assets.user_icon}
          className='w-7 rounded-full'
          alt=""
        />

        <p className='flex-1 text-sm dark:text-primary truncate'>
          AI Learning Assistant
        </p>

      </div>

      <img
        onClick={() =>
          setIsMenuOpen(false)
        }
        src={assets.close_icon}
        className='absolute top-3 right-3 w-5 h-5 cursor-pointer md:hidden not-dark:invert'
        alt="Close"
      />

    </div>
  );

};

export default Sidebar;