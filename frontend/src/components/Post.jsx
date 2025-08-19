import React, { useEffect, useState } from 'react';
import { Avatar, AvatarFallback, AvatarImage } from './ui/avatar';
import { Dialog, DialogContent, DialogTrigger } from './ui/dialog';
import { Bookmark, BookmarkCheck, MessageCircle, MoreHorizontal, Send } from 'lucide-react';
import { Button } from './ui/button';
import { FaHeart, FaRegHeart } from 'react-icons/fa';
import CommentDialog from './CommentDialog';
import { useDispatch, useSelector } from 'react-redux';
import axios from 'axios';
import { toast } from 'sonner';
import { setPosts, setSelectedPost } from '@/redux/postSlice';
import { Badge } from './ui/badge';
import { Link } from 'react-router-dom';
const Post = ({ post }) => {
  const BACKENDURL = import.meta.env.VITE_BACKEND_URL;
  const { user } = useSelector((store) => store.auth);
  const { posts } = useSelector((store) => store.post);
  const likesArray = Array.isArray(post.likes) ? post.likes : [];
  const [liked, setLiked] = useState(likesArray?.includes(user?._id) || false);
  const [postLikes, setPostLikes] = useState(likesArray?.length);
  const [comments, setComments] = useState(post.comments);
const [isBookmarked, setIsBookmarked] = useState(post?.isBookmarked || false);

  const dispatch = useDispatch();
  const [text, setText] = useState('');
  const [open, setOpen] = useState(false);
  const changeEventHandler = (event) => {
    const inputText = event.target.value;
    if (inputText.trim()) {
      setText(inputText);
    } else {
      setText('');
    }
  };
  const likeDislikeHandler = async () => {
    try {
      const action = liked ? 'dislike' : 'like';
      const response = await axios.get(
        `${BACKENDURL}/post/${post?._id}/${action}`,
        { withCredentials: true }
      );
      if (response.data.success) {
        const updatedLikes = liked ? postLikes - 1 : postLikes + 1;
        setPostLikes(updatedLikes);
        setLiked(!liked);
        const updatedPostData = posts.map((p) =>
          p._id === post._id
            ? {
                ...p,
                likes: liked
                  ? p.likes.filter((id) => id !== user._id)
                  : [...p.likes, user._id],
              }
            : p
        );

        dispatch(setPosts(updatedPostData));
        toast.success(response.data.message);
      }
    } catch (error) {
      console.log(error);
      toast.error(error.response.data.message);
    }
  };
  const commentHandler = async () => {
    try {
      const response = await axios.post(
        `${BACKENDURL}/post/${post?._id}/comment`,
        { text },
        {
          headers: {
            'Content-Type': 'application/json',
          },
          withCredentials: true,
        }
      );
      if (response.data.success) {
        const updatedCommentData = [...comments, response.data.comment];
        setComments(updatedCommentData);
        const updatedPostData = posts.map((p) =>
          p._id === post._id ? { ...p, comments: updatedCommentData } : p
        );
        dispatch(setPosts(updatedPostData));
        toast.success(response.data.message);
      }
      setText('');
    } catch (error) {
      console.log(error);
      toast.error(error.response.data.message);
    }
  };
  const deletePostHandler = async () => {
    try {
      const response = await axios.delete(
        `${BACKENDURL}/post/delete/${post?._id}`,
        { withCredentials: true }
      );
      if (response.data.success) {
        const updatedPostData = posts.filter((item) => item?._id !== post?._id);
        dispatch(setPosts(updatedPostData));
        toast.success(response.data.message);
      }
    } catch (error) {
      console.log(error);
      toast.error(error.response.data.message);
    }
  };


  // 👉 fetch initial state
  useEffect(() => {
    const getBookmark = async () => {
      try {
        const res = await axios.get(
          `${BACKENDURL}/post/${post?._id}/bookmark`,
          { withCredentials: true }
        );
        if (res.data.success) {
          setIsBookmarked(res.data.isBookmarked);
        }
      } catch (err) {
        console.log(err);
      }
    };

    getBookmark();
  }, [post?._id]);

  // 👉 toggle on click
  const bookMarkHandler = async () => {
    try {
      const res = await axios.get(`${BACKENDURL}/post/${post?._id}/bookmark`, {
        withCredentials: true,
      });
      if (res.data.success) {
        setIsBookmarked(res?.data?.isBookmarked); // take value from backend
        toast.success(res.data.message);
      }
    } catch (err) {
      toast.error(err.response?.data?.message || 'Something went wrong');
    }
  };


  if (post === undefined)
    return (
      <div className='w-full max-w-sm mx-auto my-8'>
        <h1 className='text-center'>No post found</h1>
      </div>
    )
  return (
    <div className='w-full max-w-sm mx-auto my-8'>
      <div className='flex items-center justify-between '>
        <Link to={`/profile/${post?.author?._id}`}>
          <div className='flex items-center gap-2'>
            <Avatar>
              <AvatarImage
                className='object-cover w-full h-full rounded-full'
                src={
                  post.author?.profilePicture || 'https://github.com/shadcn.png'
                }
              />
            </Avatar>
            <div className='flex items-center gap-3'>
              <h1>{post.author?.username}</h1>
              {user && user._id === post.author?._id && (
                <Badge variant='secondary'>Author</Badge>
              )}
            </div>
          </div>
        </Link>
        <Dialog>
          <DialogTrigger asChild>
            <MoreHorizontal className='cursor-pointer' />
          </DialogTrigger>
          <DialogContent className='flex flex-col items-center text-sm text-center '>
            {
            user && user?._id !== post.author?._id && 
              <Button
              variant='ghost'
              className='w-fit cursor-pointer text-[#ed4956] font-bold '
              >
              Unfollow
            </Button>
            }
            <Button variant='ghost' className='cursor-pointer w-fit '>
              Add to favorites
            </Button>
            {user && user._id === post.author?._id && (
              <Button
                onClick={deletePostHandler}
                variant='ghost'
                className='cursor-pointer w-fit '
              >
                Delete
              </Button>
            )}
          </DialogContent>
        </Dialog>
      </div>
      <div className='h-[550px]'>
        <img
          className='object-cover w-full h-full my-4 rounded-sm '
          src={post?.image}
          alt='post image'
        />
      </div>

      <div className='flex items-center justify-between my-2 '>
        <div className='flex items-center gap-4'>
          {liked ? (
            <FaHeart
              onClick={likeDislikeHandler}
              size={24}
              className='text-red-600 cursor-pointer'
            />
          ) : (
            <FaRegHeart
              onClick={likeDislikeHandler}
              size={24}
              className='cursor-pointer '
            />
          )}
          <MessageCircle
            onClick={() => {
              dispatch(setSelectedPost(post));
              setOpen(true);
            }}
            className='cursor-pointer '
          />
          <Send className='cursor-pointer ' />
        </div>
        {isBookmarked ? (
          <BookmarkCheck
            onClick={bookMarkHandler}
            className='text-2xl cursor-pointer'
          />
        ) : (
          <Bookmark
            onClick={bookMarkHandler}
            className='text-2xl cursor-pointer'
          />
        )}
      </div>
      <span className='block mb-2 font-medium '>{postLikes} Likes</span>
      <p>
        <span className='mb-2 font-medium'>{post.author?.username} </span>

        {post.caption}
      </p>
      {comments.length > 0 && (
        <p
          className='pt-1 text-sm text-gray-500 cursor-pointer '
          onClick={() => {
            dispatch(setSelectedPost(post));
            setOpen(true);
          }}
        >
          View all {comments.length} comments
        </p>
      )}
      <CommentDialog open={open} setOpen={setOpen} />
      <div className='flex items-center justify-between mt-2 '>
        <input
          onChange={changeEventHandler}
          value={text}
          type='text'
          placeholder='Add a comment'
          className='w-full text-sm outline-none '
        />
        {text && (
          <span
            onClick={commentHandler}
            className='text-sm text-[#ed4956] cursor-pointer font-bold '
          >
            Post
          </span>
        )}
      </div>
    </div>
  );
};

export default Post;
