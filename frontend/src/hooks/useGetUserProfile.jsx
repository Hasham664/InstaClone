import { useEffect } from 'react';
import axios from 'axios';
import { useDispatch } from 'react-redux';
import { setUserProfile } from '@/redux/authSlice';

const useGetUserProfile = (userId) => {
  const BACKENDURL = import.meta.env.VITE_BACKEND_URL;
  const dispatch = useDispatch();
  useEffect(() => {
    const fetchSuggestedUsers = async () => {
      try {
        const response = await axios.get(`${BACKENDURL}/user/${userId}/profile`, {
          withCredentials: true,
        });
        if (response.data.success) {
          dispatch(setUserProfile(response.data.user));
        }
      } catch (error) {
        console.error('Error fetching posts:', error);
      }
    };

    fetchSuggestedUsers();
  }, [userId]);
};

export default useGetUserProfile;
