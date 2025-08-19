import React from 'react';
import { useSelector } from 'react-redux';
import { Avatar, AvatarFallback, AvatarImage } from './ui/avatar';
import { Link } from 'react-router-dom';

const SuggestedUser = () => {
  const { SuggestedUser } = useSelector((state) => state.auth);
  
  return (
    <div className='sticky my-8 top-10 '>
      <div className='flex items-center justify-between'>
        <h1 className='text-sm text-gray-600 '>Suggested for you</h1>
        <p className='font-medium cursor-auto '>See All</p>
      </div>
      {SuggestedUser?.slice(0, 7)?.map((user) => (
        <div className='flex items-center justify-between gap-2 my-5'>
          <div className='flex items-center gap-2 '>
            <Link to={`/profile/${user?._id}`}>
              <Avatar>
                <AvatarImage
                  className='object-cover w-full h-full rounded-full'
                  src={user?.profilePicture || 'https://github.com/shadcn.png'}
                />
                <AvatarFallback>cn</AvatarFallback>
              </Avatar>
            </Link>
            <div>
              <h1 className='text-sm font bold'>
                <Link to={`/profile/${user?._id}`}>{user?.username}</Link>
              </h1>
              <span className='text-sm text-gray-600'>
                {user?.bio
                  ? user.bio.length > 6
                    ? `${user.bio.slice(0, 10)}...`
                    : user.bio
                  : 'No bio found'}
              </span>
            </div>
          </div>
          <p className='font-medium text-red-600 cursor-pointer hover:underline hover:text-red-500'>
            Follow
          </p>
        </div>
      ))}
    </div>
  );
};

export default SuggestedUser;
