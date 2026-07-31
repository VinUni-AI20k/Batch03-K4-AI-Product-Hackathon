import { createContext, useContext, useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import toast from "react-hot-toast";

axios.defaults.baseURL = import.meta.env.VITE_SERVER_URL;

const AppContext = createContext();

export const AppContextProvider = ({ children }) => {

    const navigate = useNavigate();

    const [user, setUser] = useState(null);

    const [chats, setChats] = useState([]);

    const [selectedChat, setSelectedChat] = useState(null);

    const [theme, setTheme] = useState(
        localStorage.getItem('theme') || 'light'
    );

    const [token, setToken] = useState(
        localStorage.getItem('token') || null
    );

    const [loadingUser, setLoadingUser] = useState(true);

    // FETCH USER
    const fetchUser = async () => {

        try {

            const { data } = await axios.get(
                '/api/user/data',
                {
                    headers: {
                        Authorization: token
                    }
                }
            );

            if (data.success) {

                setUser(data.user);

            } else {

                toast.error(data.message);

            }

        } catch (error) {

            toast.error(
                error.response?.data?.message ||
                error.message
            );

        } finally {

            setLoadingUser(false);

        }

    };

    // CREATE CHAT
    const createNewChat = async () => {

        try {

            if (!user) {

                return toast.error(
                    'Login to create a new chat'
                );

            }

            navigate('/');

            await axios.post(
                '/api/chat/create',
                {},
                {
                    headers: {
                        Authorization: token
                    }
                }
            );

            await fetchUsersChats();

        } catch (error) {

            toast.error(
                error.response?.data?.message ||
                error.message
            );

        }

    };

    // FETCH CHATS
    const fetchUsersChats = async () => {

        try {

            const { data } = await axios.get(
                '/api/chat/get',
                {
                    headers: {
                        Authorization: token
                    }
                }
            );

            if (data.success) {

                setChats(data.chats);

                if (data.chats.length === 0) {

                    await createNewChat();

                } else {

                    setSelectedChat(data.chats[0]);

                }

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

    // UPDATE CHAT MESSAGES
    const updateChatMessages = (
        chatId,
        newMessage
    ) => {

        setChats(prev =>
            prev.map(chat => {

                if (chat._id === chatId) {

                    return {
                        ...chat,
                        messages: [
                            ...chat.messages,
                            newMessage
                        ],
                        updatedAt: Date.now()
                    };

                }

                return chat;

            })
        );

    };

    // THEME
    useEffect(() => {

        if (theme === 'dark') {

            document.documentElement.classList.add('dark');

        } else {

            document.documentElement.classList.remove('dark');

        }

        localStorage.setItem(
            'theme',
            theme
        );

    }, [theme]);

    // USER CHANGE
    useEffect(() => {

        if (user) {

            fetchUsersChats();

        } else {

            setChats([]);

            setSelectedChat(null);

        }

    }, [user]);

    // TOKEN CHANGE
    useEffect(() => {

        if (token) {

            fetchUser();

        } else {

            setUser(null);

            setLoadingUser(false);

        }

    }, [token]);

    const value = {

        navigate,

        user,
        setUser,

        chats,
        setChats,

        selectedChat,
        setSelectedChat,

        theme,
        setTheme,

        token,
        setToken,

        loadingUser,

        fetchUser,
        fetchUsersChats,

        createNewChat,

        updateChatMessages,

        axios,

    };

    return (

        <AppContext.Provider value={value}>
            {children}
        </AppContext.Provider>

    );

};

export const useAppContext = () =>
    useContext(AppContext);