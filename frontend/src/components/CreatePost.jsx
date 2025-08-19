import React, { useRef, useState } from 'react';
import { Dialog, DialogContent, DialogHeader } from './ui/dialog';
import { Avatar, AvatarFallback, AvatarImage } from './ui/avatar';
import { Textarea } from './ui/textarea';
import { Input } from './ui/input';
import { Button } from './ui/button';
import { readFileAsDataURL } from '@/lib/utils';
import { Loader2 } from 'lucide-react';
import { toast } from 'sonner';
import axios from 'axios';
import { useDispatch, useSelector } from 'react-redux';
import { setPosts } from '@/redux/postSlice';

const CreatePost = ({ open, setOpen }) => {
  const BACKENDURL = import.meta.env.VITE_BACKEND_URL;
  const imageRef = useRef();
  const [file, setFile] = useState('');
  const [caption, setCaption] = useState('');
  const [imagePreview, setImagePreview] = useState('');
  const [loading, setLoading] = useState(false);
  const {user} = useSelector((store) => store.auth);
  const {posts} = useSelector((store) => store.post);
  const dispatch = useDispatch();
  const FileChangeHandler = async (e) => {
    const file = e.target.files[0];
    if (file) {
      setFile(file);
      const dataUrl = await readFileAsDataURL(file);
      setImagePreview(dataUrl);
    }
  };
  const createPostHandler = async (e) => {
    const formdata = new FormData();
    formdata.append('caption', caption);
    if (imagePreview) formdata.append('image', file);
    try {
        setLoading(true);
      const response = await axios.post(
        `${BACKENDURL}/post/addpost`,
        formdata,
        {
          headers: {
            'Content-Type': 'multipart/form-data',
          },
          withCredentials: true,
        }
      );
      if(response.data.success){
        dispatch(setPosts([response.data.post, ...posts]));
          toast.success(response.data.message);
          setOpen(false);
        }
    } catch (error) {
      toast.error(error.response.data.message);
    } finally {
      setOpen(false);
    }
  };
  return (
    <Dialog open={open} className=''>
      <DialogContent onInteractOutside={() => setOpen(false)}>
        <DialogHeader className='font-semibold text-center '>
          {' '}
          create new post{' '}
        </DialogHeader>
        <div className='grid grid-cols-2 gap-2'>
          <div>
            {imagePreview && (
              <div className=''>
                <img
                  src={imagePreview}
                  alt='preview'
                  className='object-cover w-full h-64 '
                />
              </div>
            )}
          </div>
          <div>
            <div
              className='flex items-center gap-2 mb-6'
              onSubmit={createPostHandler}
            >
              <Avatar>
                <AvatarImage
                  className=' object-cover w-full h-full rounded-full'
                  src={user?.profilePicture || 'github.com/shadcn.png' }
                  alt='avatar'
                />
              </Avatar>
              <div>
                <h1 className='text-xs font-semibold'>{user?.username}</h1>
                <span className='text-xs text-gray-600'>Bio here....</span>
              </div>
            </div>
            <Textarea
              value={caption}
              onChange={(e) => setCaption(e.target.value)}
              placeholder='write something...'
              className='mb-12 border-none focous-visible:ring-transparent '
            />

            <Input
              ref={imageRef}
              type='file'
              className='hidden'
              onChange={FileChangeHandler}
            />
            <div className=''>

            <Button onClick={() => imageRef.current.click()} className='mt-6'>
              Post from media
            </Button>
            </div>
          </div>
        </div>

        {imagePreview &&
          (loading ? (
            <Button onClick={createPostHandler} className='mt-4'>
              <Loader2 className='w-4 h-4 mr-2 animate-spin ' />
              Please wait....
            </Button>
          ) : (
            <Button
              type='submit'
              onClick={createPostHandler}
              className='mt-4 mb-3 '
            >
              Post
            </Button>
          ))}
      </DialogContent>
    </Dialog>
  );
};

export default CreatePost;
