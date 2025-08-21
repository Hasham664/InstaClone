import {
  Heart,
  Home,
  Instagram,
  LogOut,
  MessageCircle,
  PlusSquare,
  Search,
  TrendingUp,
} from 'lucide-react';
import React, { useState } from 'react';
import { Avatar, AvatarFallback, AvatarImage } from './ui/avatar';
import axios from 'axios';
import { Link, useNavigate } from 'react-router-dom';
import { toast } from 'sonner';
import { useDispatch, useSelector } from 'react-redux';
import { setAuthUser } from '@/redux/authSlice';
import CreatePost from './CreatePost';
import { Popover, PopoverContent, PopoverTrigger } from './ui/popover';
import { Button } from './ui/button';
import { setLikeNotification } from '@/redux/rtnSlice';
import { FaInstagram } from 'react-icons/fa';

const LeftSideBar = () => {
  const BACKENDURL = import.meta.env.VITE_BACKEND_URL;
  const { user } = useSelector((store) => store.auth);
  const { likeNotification } = useSelector(
    (store) => store.realTimeNotification
  );
  const [isPopoverOpen, setIsPopoverOpen] = useState(false);

  const [isCollapsed, setIsCollapsed] = useState(false);

  console.log(likeNotification, 'likeNotification');
  const dispatch = useDispatch();
  const [open, setOpen] = useState(false);
  const [allNotifications, setAllNotifications] = useState([]);

  const navigate = useNavigate();

  const myNotifications = likeNotification.filter(
    (n) => n.userId === user?._id // show ONLY receiver's notifications
  );
  const unreadCount = myNotifications.filter((n) => !n.isRead).length;
  const logOutHandler = async () => {
    try {
      const response = await axios.get(`${BACKENDURL}/user/logout`, {
        withCredentials: true,
      });
      console.log(response.data);

      if (response.data.success) {
        dispatch(setAuthUser(null));
        dispatch(setLikeNotification({ type: 'clear' })); // wipe from memory on logout

        navigate('/login');
        toast.success(response.data.message);
      }
    } catch (error) {
      console.log(error);
      toast.error(error.response.data.message);
    }
  };

  const fetchAllNotifications = async () => {
    try {
      const res = await axios.get(`${BACKENDURL}/post/notifications/all`, {
        withCredentials: true,
      });
      setAllNotifications(res.data); // This is ALL notifications from DB
    } catch (err) {
      console.error(err);
    }
  };

  // const apiDebug =  async () => {
  //   try {
  //     const res = await axios.get(`${BACKENDURL}/debug`, {
  //       withCredentials: true,
  //     });
  //     console.log(res.data);
  //   } catch (err) {
  //     console.error(err);
  //   }
  // };
  // apiDebug(); // Uncomment to test API

  const sidebarHandler = (text) => {
    if (text === 'Logout') {
      logOutHandler();
    } else if (text === 'Create') {
      setOpen(true);
    } else if (text === 'Profile') {
      navigate(`/profile/${user?._id}`);
    } else if (text === 'Home') {
      navigate('/');
    } else if (text === 'Messages') {
      navigate('/chat');
    }
  };
  const sidebarItems = [
    {
      icon: <Home />,
      text: 'Home',
    },
    {
      icon: <Search />,
      text: 'Search',
    },
    {
      icon: <TrendingUp />,
      text: 'Explore',
    },
    {
      icon: <MessageCircle />,
      text: 'Messages',
    },
    {
      icon: <Heart/>,
      text: 'Notifications',
    },
    {
      icon: <PlusSquare />,
      text: 'Create',
    },
    {
      icon: (
        <Avatar>
          <AvatarImage
            className='object-cover w-full h-full rounded-full'
            src={
              user?.profilePicture ||
              user?.profilePhoto ||
              'https://github.com/shadcn.png'
            }
          />
          <AvatarFallback>CN</AvatarFallback>
        </Avatar>
      ),
      text: 'Profile',
    },
    {
      icon: <LogOut />,
      text: 'Logout',
    },
  ];
  return (
    <div
      className={`
      overflow-y-auto max-md:flex max-md:items-center max-md:justify-between max-md:w-full max-md:bottom-0 md:block fixed md:top-0 left-0 max-sm:px-2 px-4  md:h-screen border-r border-gray-300 bg-[#070606] text-white z-50  
       ${isCollapsed ? 'max-lg:w-fit  ' : 'lg:w-[16%]'}
    `}
    >
      <Link to='/' className='max-sm:hidden'>
        <h1
          className={`
        cursor-pointer md:pt-10 md:pb-6 flex items-center gap-2 text-lg font-bold
           
      `}
        >
          <FaInstagram className='w-8 h-8 ' />
          <p
            className={` hidden  ${isCollapsed ? 'lg:hidden' : 'lg:block'}   `}
          >
            INSTA
          </p>
        </h1>
      </Link>

      {sidebarItems.map((item, ind) => {
        const isNotifications = item.text === 'Notifications';

        return (
          <div
            key={ind}
            className={`relative flex items-center gap-2 py-2 sm:p-1 sm:py-4 rounded-md cursor-pointer hover:bg-gray-900 transition-all duration-300 ease-in-out 
        ${
          item.text === 'Search' || item.text === 'Explore'
            ? 'max-md:hidden'
            : ''
        }`}
            onClick={async () => {
              if (isNotifications) {
                await fetchAllNotifications();
                setIsPopoverOpen(true);
              } else {
                sidebarHandler(item.text);
              }
              //  if (isMessages) setIsCollapsed(true); // collapse on Messages
            }}
          >
            <p className='text-xs'>{item.icon}</p>
            {/* Base: hidden on mobile. On lg: show unless collapsed */}
            <span
              className={`hidden ${isCollapsed ? 'lg:hidden' : 'lg:inline'}`}
            >
              {item.text}
            </span>

            {user && isNotifications && (
              <Popover
                open={isPopoverOpen}
                onOpenChange={async (open) => {
                  setIsPopoverOpen(open);
                  if (open) {
                    await fetchAllNotifications();
                    if (unreadCount > 0) {
                      await axios.put(
                        `${BACKENDURL}/post/notifications/read`,
                        {},
                        { withCredentials: true }
                      );
                      dispatch(setLikeNotification({ type: 'clearCountOnly' }));
                    }
                  }
                }}
              >
                {/* No separate badge click needed — just display the badge */}
                <PopoverTrigger asChild>
                  <div className='absolute flex items-center justify-center w-4 h-4 text-xs text-white bg-red-500 rounded-full sm:h-5 sm:w-5 bottom-5 sm:bottom-7 left-4'>
                    {unreadCount}
                  </div>
                </PopoverTrigger>

                <PopoverContent
                  // side='bottom'
                  // align='start'
                  sideOffset={-100}
                  className='z-50 max-h-[400px] overflow-y-auto'
                >
                  <div>
                    {allNotifications.length === 0 ? (
                      <p>No notifications yet</p>
                    ) : (
                      allNotifications.map((notification) => (
                        <div
                          key={notification._id}
                          className='flex items-center gap-2 p-2 rounded-md hover:bg-gray-100'
                        >
                          <Link to={`/profile/${notification.fromUser?._id}`}>
                            <Avatar className='w-8 h-8'>
                              <AvatarImage
                                className='object-cover w-full h-full rounded-full'
                                src={
                                  notification.fromUser?.profilePicture ||
                                  notification.fromUser?.profilePhoto ||
                                  'https://github.com/shadcn.png'
                                }
                              />
                            </Avatar>
                          </Link>
                          <div>
                            <h4 className='text-sm'>
                              <span className='font-bold'>
                                {notification.fromUser?.username}
                              </span>{' '}
                              {notification.type === 'dislike'
                                ? 'disliked your post'
                                : 'liked your post'}
                            </h4>
                          </div>
                        </div>
                      ))
                    )}
                  </div>
                </PopoverContent>
              </Popover>
            )}
          </div>
        );
      })}

      <CreatePost open={open} setOpen={setOpen} />
    </div>
  );
};

export default LeftSideBar;
