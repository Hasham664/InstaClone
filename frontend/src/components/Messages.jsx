import React from 'react';
import { Avatar } from './ui/avatar';
import { AvatarImage } from '@radix-ui/react-avatar';
import { Link } from 'react-router-dom';
import { Button } from './ui/button';
import { useSelector } from 'react-redux';
import useGetAllMessages from '@/hooks/useGetAllMessages';
import useGetRTM from '@/hooks/useGetRTM';

const Messages = ({ selectedUser }) => {
  useGetRTM();
  useGetAllMessages();
  const {messages} = useSelector((state) => state.chat);
  const { user } = useSelector((state) => state.auth);
  return (
    <div className='flex-1 p-4 overflow-y-auto '>
      <div className='flex justify-center'>
        <div className='flex flex-col items-center justify-center'>
          <Avatar className='w-20 h-20 mb-4'>
            <AvatarImage
              className='object-cover w-full h-full rounded-full'
              src={
                selectedUser?.profilePicture || 'https://github.com/shadcn.png'
              }
            />
          </Avatar>
          <h4 className='text-lg font-semibold'>{selectedUser?.username}</h4>
          <Link
            to={`/profile/${selectedUser?._id}`}
            className='text-sm text-gray-500'
          >
            <Button variant='secondary' className='h-8 my-2 '>
              View Profile
            </Button>
          </Link>
        </div>
      </div>
      <div className='flex flex-col gap-3'>
        { messages && messages?.map((msg, index) => {
          return (
            <div key={index} className={`p-2  rounded-lg ${msg.senderId === user._id ? 'self-end bg-white text-black font-semibold ' : 'self-start bg-white text-black font-semibold'}`}>
              <p className='text-sm'> {msg?.messages}</p>
            </div>
          );
        })}
      </div>
    </div>
  );
};

export default Messages;
