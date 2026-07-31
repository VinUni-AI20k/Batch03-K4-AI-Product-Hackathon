import React, { useState } from "react";
import { assets } from "../assets/assets";
import { useAppContext } from "../context/AppContext";
import moment from "moment";
import toast from "react-hot-toast";

const Sidebar = ({ isMenuOpen, setIsMenuOpen }) => {

  const {
    chats,
    setSelectedChat,
    theme,
    setTheme,
    user,
    navigate,
    createNewChat,
    axios,
    setChats,
    fetchUsersChats,
    setToken,
    token
  } = useAppContext();

  const [search, setSearch] = useState('');

  const logout = () => {

    localStorage.removeItem('token');

    setToken(null);

    toast.success('Logged out successfully');

  };

  const deleteChat = async (e, chatId) => {

    try {

      e.stopPropagation();

      const confirmDelete = window.confirm(
        'Delete this Chat?'
      );

      if (!confirmDelete) return;

      const { data } = await axios.post(
        '/api/chat/delete',
        { chatId },
        {
          headers: {
            Authorization: token
          }
        }
      );

      if (data.success) {

        setChats(prev =>
          prev.filter(chat => chat._id !== chatId)
        );

        await fetchUsersChats();

        toast.success(data.message);

      } else {

        toast.error(data.message);

      }

    } catch (error) {

      toast.error(
        error.response?.data?.message ||
        error.message
      );

    }

  };

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
        onClick={createNewChat}
        className='flex justify-center items-center w-full py-2 mt-10 text-white bg-gradient-to-r from-[#A456F7] to-[#3D81F6] text-sm rounded-md cursor-pointer'
      >
        <span className='mr-2 text-xl'>+</span>
        New Chat
      </button>

      <div className='flex items-center gap-2 p-3 mt-4 border border-gray-400 dark:border-white/20 rounded-md'>
        <img
          src={assets.search_icon}
          className='w-4 not-dark:invert'
          alt=""
        />

        <input
          onChange={(e) =>
            setSearch(e.target.value)
          }
          value={search}
          type="text"
          placeholder='Search conversations'
          className='bg-transparent text-xs placeholder:text-gray-400 outline-none w-full'
        />
      </div>

      {chats.length > 0 &&
        <p className='mt-4 text-sm'>
          Recent Chats
        </p>
      }

      <div className='flex-1 overflow-y-auto mt-3 text-sm space-y-3'>

        {
          chats
            .filter((chat) => {

              const content =
                chat.messages?.[0]?.content
                  ?.toLowerCase() || "";

              const name =
                chat.name?.toLowerCase() || "";

              return (
                content.includes(
                  search.toLowerCase()
                ) ||
                name.includes(
                  search.toLowerCase()
                )
              );

            })
            .map((chat) => (

              <div
                key={chat._id}
                onClick={() => {

                  navigate('/');

                  setSelectedChat(chat);

                  setIsMenuOpen(false);

                }}
                className='p-2 px-4 dark:bg-[#57317C]/10 border border-gray-300 dark:border-[#80609F]/15 rounded-md cursor-pointer flex justify-between items-center group'
              >

                <div>

                  <p className='truncate w-full'>
                    {
                      chat.messages?.length > 0
                        ? chat.messages[0].content.slice(0, 32)
                        : chat.name
                    }
                  </p>

                  <p className='text-xs text-gray-500 dark:text-[#B1A6C0]'>
                    {moment(chat.updatedAt).fromNow()}
                  </p>

                </div>

                <img
                  src={assets.bin_icon}
                  className='hidden group-hover:block w-4 cursor-pointer not-dark:invert'
                  alt="Delete"
                  onClick={(e) => {

                    toast.promise(
                      deleteChat(e, chat._id),
                      {
                        loading: 'Deleting...',
                        success: 'Chat deleted',
                        error: 'Delete failed'
                      }
                    );

                  }}
                />

              </div>

            ))
        }

      </div>

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

      <div className='flex items-center gap-3 p-3 mt-4 border border-gray-300 dark:border-white/15 rounded-md cursor-pointer group'>

        <img
          src={assets.user_icon}
          className='w-7 rounded-full'
          alt=""
        />

        <p className='flex-1 text-sm dark:text-primary truncate'>
          {
            user
              ? user.name
              : 'Login your account'
          }
        </p>

        {
          user &&
          <img
            onClick={logout}
            src={assets.logout_icon}
            className='h-5 cursor-pointer hidden not-dark:invert group-hover:block'
            alt="Logout"
          />
        }

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
