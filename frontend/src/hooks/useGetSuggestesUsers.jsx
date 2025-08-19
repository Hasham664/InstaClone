import React, { useEffect } from 'react'
import axios from 'axios';
import { useDispatch } from 'react-redux'
import { setSuggestedUser } from '@/redux/authSlice';

const useGetSuggestesUsers = () => {
  const BACKENDURL = import.meta.env.VITE_BACKEND_URL;
  const dispatch = useDispatch();
  useEffect(() => {
    const fetchSuggestedUsers = async () => {
      try {
        const response = await axios.get(`${BACKENDURL}/user/suggested`, {
          withCredentials: true,
        });
        if (response.data.success) {
          console.log(response.data);

          dispatch(setSuggestedUser(response.data.users));
        }
      } catch (error) {
        console.error('Error fetching posts:', error);
      }
    };

    fetchSuggestedUsers();
  }, []);
};

export default useGetSuggestesUsers;