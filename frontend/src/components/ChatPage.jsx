import { setSelectedUser } from '@/redux/authSlice';
import { Avatar, AvatarImage } from '@radix-ui/react-avatar';
import React, { useEffect, useState } from 'react'
import { useDispatch, useSelector } from 'react-redux';
import { Input } from './ui/input';
import { MessageCircle } from 'lucide-react';
import { Button } from './ui/button';
import Messages from './Messages';
import axios from 'axios';
import { toast } from 'sonner';
import { setMessages } from '@/redux/chatSlice';
const ChatPage = () => {
  const BACKENDURL = import.meta.env.VITE_BACKEND_URL;
  const [textMessage, setTextMessage] = useState('');
    const { user, SuggestedUser, selectedUser } = useSelector( (state) => state.auth);
    const {onlineUsers, messages} = useSelector((state) => state.chat);
    // const isOnline = true;
    const dispatch = useDispatch();
    const sendMessageHandler = async (reciverId) => {
      try {
        const res = await axios.post(`${BACKENDURL}/message/send/${reciverId}`, {textMessage},{
          headers: {
            'Content-Type': 'application/json',
          },
          withCredentials: true,
        });
        if (res.data.success) {
          dispatch(setMessages([...messages, res.data.newMessage]));

          setTextMessage('');
        //  toast.success('Message sent successfully!');
        } else {
          console.error('Failed to send message:', res.data.message);
        }
      } catch (error) {
        console.error('Error sending message:', error);
        
      }
    }
   useEffect(() => {
    return () => {
      dispatch(setSelectedUser(null));
    }
  }, []);
  return (
    <div className='flex ml-[16%] h-screen'>
      <section className='w-full my-8 md:w-1/4'>
        <h1 className='px-3 mb-4 text-xl font-bold'>{user?.username}</h1>
        <hr className='mb-4 border-gray-400' />
        <div className='overflow-y-auto h-[80vh]'>
          {SuggestedUser?.map((user) => {
            const isOnline = onlineUsers.includes(user?._id);
            
            return (
              <div
                onClick={() => {
                  dispatch(setSelectedUser(user));
                }}
                key={user._id}
                className='flex items-center px-3 py-2 cursor-pointer hover:bg-gray-100'
              >
                <Avatar className='mr-3 rounded-full h-14 w-14'>
                  <AvatarImage
                    className='object-cover w-full h-full rounded-full'
                    src={
                      user?.profilePicture || 'https://github.com/shadcn.png'
                    }
                  />
                </Avatar>
                <div className='flex flex-col'>
                  <p className='font-medium'>{user?.username}</p>
                  <p
                    className={`text-xs font-bold ${
                      isOnline ? 'text-green-500' : 'text-red-500'
                    }`}
                  >
                    {isOnline ? 'Online' : 'Offline'}
                  </p>
                </div>
              </div>
            );
          })}
        </div>
      </section>
      {selectedUser ? (
        <section className='flex flex-col flex-1 h-full p-4 border-l border-gray-300'>
          <div className='sticky top-0 z-10 flex items-center gap-3 px-3 py-2 bg-white border-b border-gray-300'>
            <Avatar className='mr-3 rounded-full h-14 w-14'>
              <AvatarImage
                className='object-cover w-full h-full rounded-full'
                src={
                  selectedUser?.profilePicture ||
                  selectedUser?.profilePhoto ||
                  'https://github.com/shadcn.png'
                }
              />
            </Avatar>
            <div className='flex flex-col'>
              <p className='font-medium'>{selectedUser?.username}</p>
            </div>
          </div>
         <Messages selectedUser={selectedUser} />
          <div className='flex items-center p-4 border-t border-gray-300'>
            <Input
              value={textMessage}
              onChange={(e) => setTextMessage(e.target.value)}
              type='text'
              className='flex-1 mr-2 focus-visible:ring-transparent'
              placeholder='Type a message'
            />
            <Button onClick={ () => sendMessageHandler(selectedUser?._id) } >Send</Button>
          </div>
        </section>
      ) : (
       <div className='flex flex-col items-center justify-center mx-auto'>
        <MessageCircle className='w-32 h-32 my-4' />
        <h1 className='text-lg font-bold'>Select a user</h1>
        <p className='text-gray-500'>Start chatting with someone!</p>
       </div>
      )}
    </div>
  );
}

export default ChatPage