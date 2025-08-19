import React from 'react'
import { Avatar, AvatarFallback, AvatarImage } from './ui/avatar'
import { Link } from 'react-router-dom';

const Comment = ({comment}) => {
  return (
    <div className='mb-4'>
        <Link to={`/profile/${comment?.author?._id}`}>
      <div className='flex items-center gap-2'>
        <Avatar>
          <AvatarImage
            className='object-cover w-full h-full rounded-full'
            src={
              comment?.author?.profilePicture || 'https://github.com/shadcn.png'
            }
            />
        </Avatar>
        <h1 className='text-sm font-bold'>
          {comment?.author?.username}{' '}
          <span className='pl-1 font-normal'>{comment?.text}</span>{' '}
        </h1>
      </div>
            </Link>
    </div>
  );
}

export default Comment