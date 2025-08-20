import React from 'react'
import { Link } from 'react-router-dom'
import { Avatar, AvatarFallback, AvatarImage } from './ui/avatar'
import { useSelector } from 'react-redux'
import SuggestedUser from './SuggestedUser'

const RightSidebar = () => {
  const {user} = useSelector(state => state.auth)
  console.log(user, 'user in right sidebar');
  
  
  return (
    <div className='py-10 text-white bg-black lg:pr-32 md:pr-16 max-md:pr-8 max-sm:hidden w-fit '>
      <div className='flex items-center gap-2'>
        <Link to={`/profile/${user?._id}`}>
          <Avatar>
            <AvatarImage
              className='object-cover w-full h-full rounded-full'
              src={
                user?.profilePicture ||
                user?.profilePhoto ||
                'https://github.com/shadcn.png'
              }
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
                ? `${user.bio.slice(0, 15)}...`
                : user.bio
              : 'No bio found'}
          </span>
        </div>
      </div>
      <SuggestedUser />
    </div>
  );
}

export default RightSidebar