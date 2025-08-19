import  { useEffect } from 'react';
import { setMessages } from '@/redux/chatSlice';
import { useDispatch, useSelector } from 'react-redux';
const useGetRTM = () => {
    const {messages} = useSelector((state) => state.chat);
    const {socket} = useSelector((state) => state.socketio);
  const dispatch = useDispatch();
  useEffect(() => {
    if (!socket) return;
      socket.on('newMessage', (newMessage) => {
        dispatch(setMessages([...messages, newMessage]));
    //   });
    // socket.on('newMessage', (newMessage) => {
    //   dispatch(setMessages((prev) => [...prev, newMessage]));
    });

    return () => {
     socket?.off('newMessage');
    };
  }, [messages, setMessages]);
};

export default useGetRTM;
