// import React, { useRef, useState } from 'react';
// import { Avatar, AvatarImage } from './ui/avatar';
// import { useDispatch, useSelector } from 'react-redux';
// import { Button } from './ui/button';
// import { Textarea } from './ui/textarea';
// import {
//   Select,
//   SelectContent,
//   SelectItem,
//   SelectTrigger,
//   SelectValue,
// } from './ui/select';
// import { Loader2 } from 'lucide-react';
// import axios from 'axios';
// import { toast } from 'sonner';
// import { useNavigate } from 'react-router-dom';
// import { setAuthUser } from '@/redux/authSlice';

// const EditProfile = () => {
//   const BACKENDURL = import.meta.env.VITE_BACKEND_URL;
//   const imageRef = useRef(null);
//   const { user } = useSelector((state) => state.auth);
//   const [loading, setLoading] = useState(false);

//   const [inputData, setInputData] = useState({
//     profilePicture: user?.profilePicture || '',
//     bio: user?.bio || '',
//     gender: user?.gender || '',
//   });
//   console.log(inputData, 'inputData in edit profile');
  
//   const dispatch = useDispatch();
//   const navigate = useNavigate();

//   const fileChangeHandler = (e) => {
//     const file = e.target.files[0];
//     if (file) {
//       setInputData({ ...inputData, profilePicture: file });
//     }
//   };
//   const selectHandler = (value) => {
//     setInputData({ ...inputData, gender: value });
//   };
//   const editProfileHandler = async (e) => {
//     const formData = new FormData();
//     formData.append('bio', inputData.bio);
//     formData.append('gender', inputData.gender);
//     if (inputData.profilePicture) {
//       formData.append('profilePicture', inputData.profilePicture);
//     }
//     try {
//       setLoading(true);
//       const response = await axios.post(`${BACKENDURL}/user/profile/edit`, formData,
//         {
//           headers: {
//             'Content-Type': 'multipart/form-data',
//           },
//           withCredentials: true,
//         }
//       );
//       if (response.data.success) {
//         setLoading(false);
//         const updatedUser = {
//           ...user,
//           profilePicture: response.data.user?.profilePicture,
//           bio: response.data.user?.bio,
//           gender: response.data.user?.gender,
//         };
//         dispatch(setAuthUser(updatedUser));
//         navigate(`/profile/${user?._id}`);
//         toast.success(response.data.message);
//       }
//     } catch (error) {
//       console.log(error);
//       toast.error(error.response.data.message);
//     }finally {
//       setLoading(false);
//     }
//   };
//   return (
//     <div className='flex max-w-2xl pl-10 mx-auto'>
//       <section className='flex flex-col w-full gap-5 my-8'>
//         <h1>Edit Profile</h1>
//         <div className='flex items-center justify-between p-4 bg-gray-100 rounded-xl '>
//           <div className='flex items-center gap-4'>
//             <Avatar>
//               <AvatarImage
//                 src={user?.profilePicture || 'https://github.com/shadcn.png'}
//               />
//             </Avatar>
//             <div>
//               <p className='text-lg font-semibold'>{user?.username}</p>
//               <p className='text-sm text-gray-500'>{user?.bio}</p>
//             </div>
//           </div>
//           <input
//             ref={imageRef}
//             onChange={fileChangeHandler}
//             type='file'
//             hidden
//             className='hidden'
//           />
//           <Button
//             onClick={() => imageRef?.current.click()}
//             className='px-4 py-2 text-white bg-blue-600 rounded-md hover:bg-blue-500'
//           >
//             CHange Photo
//           </Button>
//         </div>
//         <div>
//           <h1 className='mb-2 text-xl font-bold'>Bio</h1>
//           <Textarea
//             value={inputData.bio}
//             onChange={(e) =>
//               setInputData({ ...inputData, bio: e.target.value })
//             }
//             placeholder='Write something about yourself...'
//             name='bio'
//             className=' focus-visible:ring-transparent'
//           ></Textarea>
//         </div>
//         <div>
//           <h1 className='mb-2 font-bold'>Gender</h1>
//           <Select onValueChange={selectHandler} defaultValue={inputData.gender}>
//             <SelectTrigger className='w-full'>
//               <SelectValue />
//             </SelectTrigger>
//             <SelectContent>
//               <SelectItem value='male'>Male</SelectItem>
//               <SelectItem value='female'>Female</SelectItem>
//             </SelectContent>
//           </Select>
//         </div>
//         <div className='flex justify-end'>
//           {loading ? (
//             <Button>
//               <Loader2 className='w-4 h-4 mr-2 animate-spin' />
//               Please wait
//             </Button>
//           ) : (
//             <Button onClick={editProfileHandler}>Save Changes</Button>
//           )}
//         </div>
//       </section>
//     </div>
//   );
// };

// export default EditProfile;
import React, { useRef, useState } from 'react';
import { Avatar, AvatarImage } from './ui/avatar';
import { useDispatch, useSelector } from 'react-redux';
import { Button } from './ui/button';
import { Textarea } from './ui/textarea';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from './ui/select';
import { Loader2 } from 'lucide-react';
import axios from 'axios';
import { toast } from 'sonner';
import { useNavigate } from 'react-router-dom';
import { setAuthUser } from '@/redux/authSlice';

const EditProfile = () => {
  const BACKENDURL = import.meta.env.VITE_BACKEND_URL;
  const imageRef = useRef(null);
  const { user } = useSelector((state) => state.auth);
  const [loading, setLoading] = useState(false);

  const [inputData, setInputData] = useState({
    profilePicture: user?.profilePicture || '',
    bio: user?.bio || '',
    gender: user?.gender || '',
  });
  const [preview, setPreview] = useState(user?.profilePicture || ''); // 👈 for preview

  const dispatch = useDispatch();
  const navigate = useNavigate();

  const fileChangeHandler = (e) => {
    const file = e.target.files[0];
    if (file) {
      setInputData({ ...inputData, profilePicture: file });
      setPreview(URL.createObjectURL(file)); // 👈 show preview
    }
  };

  const selectHandler = (value) => {
    setInputData({ ...inputData, gender: value });
  };

  const editProfileHandler = async () => {
    const formData = new FormData();
    formData.append('bio', inputData.bio);
    formData.append('gender', inputData.gender);

    if (inputData.profilePicture instanceof File) {
      formData.append('profilePicture', inputData.profilePicture);
    }

    try {
      setLoading(true);
      const response = await axios.post(
        `${BACKENDURL}/user/profile/edit`,
        formData,
        {
          headers: { 'Content-Type': 'multipart/form-data' },
          withCredentials: true,
        }
      );

      if (response.data.success) {
        const updatedUser = {
          ...user,
          profilePicture: response.data.user?.profilePicture,
          bio: response.data.user?.bio,
          gender: response.data.user?.gender,
        };
        dispatch(setAuthUser(updatedUser));
        navigate(`/profile/${user?._id}`);
        toast.success(response.data.message);
      }
    } catch (error) {
      toast.error(error.response?.data?.message || 'Something went wrong');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className='flex max-w-2xl px-3 mx-auto text-white md:pl-10 lg:max-w-3xl'>
      <section className='flex flex-col w-full gap-5 my-8'>
        <h1>Edit Profile</h1>
        <div className='flex max-sm:flex-wrap items-center justify-between p-4 bg-[#070606] rounded-xl'>
          <div className='flex items-center gap-4 max-sm:flex-wrap'>
            <Avatar className='w-24 h-24 md:h-30 md:w-30'>
              <AvatarImage
                src={preview || 'https://github.com/shadcn.png'} // 👈 show live preview
                className='object-cover w-full h-full rounded-full'
              />
            </Avatar>
            <div>
              <p className='text-lg font-semibold'>{user?.username}</p>
              <p className='text-sm text-gray-500'>{user?.bio}</p>
            </div>
          </div>
          <input
            ref={imageRef}
            onChange={fileChangeHandler}
            type='file'
            hidden
          />
          <Button
            onClick={() => imageRef?.current.click()}
            className='px-4 py-2 text-white bg-blue-600 rounded-md max-sm:mt-4 hover:bg-blue-500'
          >
            Change Photo
          </Button>
        </div>

        {/* Bio */}
        <div>
          <h1 className='mb-2 text-xl font-bold'>Bio</h1>
          <Textarea
            value={inputData.bio}
            onChange={(e) =>
              setInputData({ ...inputData, bio: e.target.value })
            }
            placeholder='Write something about yourself...'
            className='text-black focus-visible:ring-transparent '
          />
        </div>

        {/* Gender */}
        <div className='text-black'>
          <h1 className='mb-2 font-bold text-white'>Gender</h1>
          <Select
            onValueChange={selectHandler}
            className='text-black'
            defaultValue={inputData.gender}
          >
            <SelectTrigger className='w-full'>
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value='male'>Male</SelectItem>
              <SelectItem value='female'>Female</SelectItem>
            </SelectContent>
          </Select>
        </div>

        <div className='flex justify-end max-sm:mb-16 '>
          {loading ? (
            <Button>
              <Loader2 className='w-4 h-4 mr-2 animate-spin' />
              Please wait
            </Button>
          ) : (
            <Button onClick={editProfileHandler}>Save Changes</Button>
          )}
        </div>
      </section>
    </div>
  );
};

export default EditProfile;
