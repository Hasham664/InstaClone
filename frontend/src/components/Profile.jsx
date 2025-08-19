import useGetUserProfile from '@/hooks/useGetUserProfile';
import React, { useState } from 'react';
import { useSelector } from 'react-redux';
import { Link, useParams } from 'react-router-dom';
import { Avatar, AvatarImage } from './ui/avatar';
import { Button } from './ui/button';
import { Badge } from './ui/badge';
import { AtSign, Heart, MessageCircle } from 'lucide-react';

const Profile = () => {
  const params = useParams();
  const userId = params.id;
  useGetUserProfile(userId);
  const { userProfile, user } = useSelector((state) => state.auth);
  
  const isLoggedInUserProfile = user?._id === userProfile?._id;  
  const [activeTab, setActiveTab] = useState('posts');
  const handleTabClick = (tab) => {
    setActiveTab(tab);
  }
  const displayedPosts = activeTab === 'posts' ? userProfile?.posts : userProfile?.bookmarks || [];
  return (
    <div className='flex justify-center max-w-5xl pl-10 mx-auto'>
      <div className='flex flex-col gap-20 p-8'>
        <div className='grid grid-cols-2'>
          <section className='flex items-center justify-center'>
            <Avatar className='w-32 h-32 '>
              <AvatarImage
              className='object-cover w-full h-full rounded-full'
                src={
                  userProfile?.profilePicture || 'https://github.com/shadcn.png'
                }
              />
            </Avatar>
          </section>
          <section>
            <div className='flex flex-col gap-5'>
              <div className='flex items-center gap-3'>
                <p>{userProfile?.username}</p>
                {
                  isLoggedInUserProfile ? (
                    <>
                <Link to='/account/edit'>
                  <Button
                    variant='secondary'
                    className='h-8 hover:bg-gray-200 '
                    >
                    Edit Profile
                  </Button>
                    </Link>
                  <Button
                    variant='secondary'
                    className='h-8 hover:bg-gray-200 '
                  >
                    View archive
                  </Button>
                  <Button
                    variant='secondary'
                    className='h-8 hover:bg-gray-200 '
                  >
                    Ad tools
                  </Button>
                </>
                  ) : (
                    <Button
                      variant='secondary'
                      className='h-8 text-white bg-blue-600 hover:bg-blue-500'
                    >
                      Follow
                    </Button>
                  )
                }
                
              </div>
              <div className='flex items-center gap-4'>
                <p>
                  <span className='font-semibold'>
                    {userProfile?.posts?.length} posts
                  </span>
                </p>

                <p>
                  <span className='font-semibold'>
                    {userProfile?.followers?.length} followers
                  </span>
                </p>
                <p>
                  <span className='font-semibold'>
                    {userProfile?.following?.length} following
                  </span>
                </p>
              </div>
              <div className='flex flex-col gap-1 '>
                <h1 className='font-seemibold'>
                  {userProfile?.bio || 'bio here.....'}
                </h1>
                <Badge className='px-2 py-1 w-fit' variant='outline'>
                  {' '}
                  <AtSign size={16} />{' '}
                  <span className='pl-1'>{userProfile?.username}</span>
                </Badge>
                <span>Learn code with Hasham</span>
                <span>Coding is love and love is coding</span>
              </div>
            </div>
          </section>
        </div>
        <div className='border-t border-t-gray-200'>
          <div className='flex items-center justify-center gap-10 text-sm'>
            <span
              onClick={() => handleTabClick('posts')}
              className={`py-3 cursor-pointer ${
                activeTab === 'posts' ? 'font-bold text-black' : ''
              } `}
            >
              POSTS
            </span>

            <span
              onClick={() => handleTabClick('saved')}
              className={`py-3 cursor-pointer ${
                activeTab === 'saved' ? 'font-bold text-black' : ''
              } `}
            >
              SAVED
            </span>
            <span className={`py-3 cursor-pointer`}>REELS</span>
            <span className={`py-3 cursor-pointer`}>TAGS</span>
          </div>
          <div className='grid grid-cols-3 gap-2'>
            {displayedPosts?.map((post) => (
              <div key={post._id} className='relative cursor-pointer group '>
                <img
                  src={post.image}
                  alt={post.image}
                  className='object-cover w-full my-2 rounded-sm h-[450px] '
                />
                <div className='absolute inset-0 flex items-center justify-center transition-all duration-300 ease-in-out rounded-lg opacity-0 bg-black/50 group-hover:opacity-100'>
                  <div className='flex items-center space-x-4 text-white'>
                    <button className='flex items-center gap-2 text-white hover:text-gray-300 '>
                      <Heart size={20} />
                      <span>{post?.likes?.length}</span>
                    </button>
                    <button className='flex items-center gap-2 text-white hover:text-gray-300 '>
                      <MessageCircle size={20} />
                      <span>{post?.comments?.length}</span>
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

export default Profile;
