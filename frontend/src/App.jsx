import Login from "./components/Login"
import MainLayout from "./components/MainLayout"
import Signup from "./components/signup"
import { createBrowserRouter, RouterProvider } from "react-router-dom"
import Profile from "./components/Profile"
import Home from "./components/Home"
import EditProfile from "./components/EditProfile"
import ChatPage from "./components/ChatPage"
import {io} from 'socket.io-client';
import { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux"
import { setSocket } from "./redux/socketSlice"
import { setOnlineUsers } from "./redux/chatSlice"
import { setLikeNotification } from "./redux/rtnSlice"
import axios from "axios"
import ProtectedRoute from "./components/ProtectedRoute"
// import { connectSocket, disconnectSocket } from "./socketIo/socketService"
const router = createBrowserRouter([
  {
    path: '/',
    element: <ProtectedRoute> <MainLayout /></ProtectedRoute> ,
    children: [
      {
        path: '/',
        element: <Home />,
      },
      {
        path: '/profile/:id',
        element:   <Profile />,
      },
      {
        path: '/account/edit',
        element:  <EditProfile />,
      },
      {
        path: '/chat',
        element:  <ChatPage />,
      },
    ],
  },
  {
    path: '/signup',
    element: <Signup />,
  },
  {
    path: '/login',
    element: <Login />,
  },
]);
function App() {
  const BACKENDURL = import.meta.env.VITE_BACKEND_URL;
  const {user} = useSelector((state) => state.auth);
  // const {socket} = useSelector((state) => state.socketio);
  const dispatch = useDispatch();
  

useEffect(() => {
  if (user) {
    // Connect socket
    const socketio = io(import.meta.env.VITE_SOCKET_URL, {
      query: { userId: user?._id },
      transports: ['websocket'],
    });
    dispatch(setSocket(socketio));

    // Real-time
    socketio.on('getOnlineUsers', (onlineUsers) => {
      dispatch(setOnlineUsers(onlineUsers));
    });
    socketio.on('notification', (notification) => {
      dispatch(setLikeNotification(notification));
    });

    // Fetch unread notifications from DB
    axios
      .get(`${BACKENDURL}/post/notifications`, {
        withCredentials: true,
      })
      .then((res) => {
        res.data.forEach((notif) => {
          dispatch(setLikeNotification(notif));
        });
      })
      .catch(console.error);

    return () => {
      socketio?.close();
      dispatch(setSocket(null));
    };
  }
}, [user, dispatch]);

  return (
  <div>
  <RouterProvider router={router}/>
  </div>
  )
}

export default App
