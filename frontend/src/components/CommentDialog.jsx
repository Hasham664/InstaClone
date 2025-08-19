import React, { useEffect, useState } from 'react'
import { Dialog, DialogContent, DialogTrigger } from './ui/dialog'
import { Link } from 'react-router-dom';
import { Avatar, AvatarFallback, AvatarImage } from './ui/avatar';
import { MoreHorizontal } from 'lucide-react';
import { Button } from './ui/button';
import { useDispatch, useSelector } from 'react-redux';
import Comment from './Comment';
import axios from 'axios';
import { toast } from 'sonner';
import { setPosts } from '@/redux/postSlice';

const CommentDialog = ({open, setOpen}) => {
  const BACKENDURL = import.meta.env.VITE_BACKEND_URL;
    const [text, setText] = useState('');
    const {selectedPost,posts} = useSelector((store) => store.post);
    const [comment, setComment] = useState([]);
    const dispatch = useDispatch();
    const changeEventHandler = (event) => {
        const inputText = event.target.value;
        if (inputText.trim()) {
            setText(inputText);
        } else {
            setText('');
        }
    }
useEffect(() => {
  if (selectedPost) {
    setComment(selectedPost?.comments || []);
  }
}, [selectedPost]);

    
    const sendMessageHandler = async () => {
      try {
        const response = await axios.post(
          `${BACKENDURL}/post/${selectedPost?._id}/comment`,
          { text },
          {
            headers: {
              'Content-Type': 'application/json',
            },
            withCredentials: true,
          }
        );
        if (response.data.success) {
          const updatedCommentData = [...comment, response.data.comment];
          console.log(updatedCommentData,'updated');
          
          setComment(updatedCommentData);
          const updatedPostData = posts.map((p) =>
            p._id === selectedPost._id
              ? { ...p, comments: updatedCommentData }
              : p
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
  return (
    <Dialog open={open} className=''>
      
      <DialogContent
        onInteractOutside={() => setOpen(false)}
        className='flex flex-col max-w-5xl p-0 '
      >
        <div className='flex max-sm:flex-wrap'>
          <div className='sm:w-1/2 h-[550px]'>
            <img
              className='object-cover w-full h-full rounded-lg'
              src={selectedPost?.image}
              alt='post image'
            />
          </div>
          <div className='flex flex-col justify-between sm:w-1/2'>
            <div className='flex items-center justify-between p-4'>
              <div className='flex items-center gap-2 '>
                <Link to={`/profile/${selectedPost?.author?._id}`}>
                  <Avatar>
                    <AvatarImage className='object-cover w-full h-full rounded-full' src={selectedPost?.author?.profilePicture || 'https://github.com/shadcn.png' } />
                  </Avatar>
                </Link>
                <div>
                  <Link to={`/profile/${selectedPost?.author?._id}`} >
                    {' '}
                    <h1 className='text-sm font-bold'>
                      {selectedPost?.author?.username}
                    </h1>{' '}
                  </Link>
                </div>
              </div>
              <Dialog>
                <DialogTrigger asChild>
                  <MoreHorizontal className='cursor-pointer' />
                </DialogTrigger>
                <DialogContent className='flex flex-col items-center text-sm text-center '>
                  <div className='text-[#ed4956] font-bold cursor-pointer '>
                    Unfollow
                  </div>
                  <div className='w-full cursor-pointer '>Add to favorites</div>
                </DialogContent>
              </Dialog>
            </div>
            <hr />
            <div className='flex-1 p-4 overflow-y-auto max-h-96 '>
              {
                comment.map((comment) => (
                  <Comment key={comment._id} comment={comment} />
                ))
              }
            </div>
            <div className='p-4'>
              <div className='flex items-center gap-2'>
                <input
                  onChange={changeEventHandler}
                  value={text}
                  type='text'
                  placeholder='Add a comment'
                  className='w-full p-2 border border-gray-300 rounded outline-none'
                />
                <Button
                  onClick={sendMessageHandler}
                  disabled={!text}
                  variant='outline'
                >
                  Send
                </Button>
              </div>
            </div>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}

export default CommentDialog