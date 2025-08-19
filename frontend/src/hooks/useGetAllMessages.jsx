import React, { useEffect } from 'react';
import axios from 'axios';
import { useDispatch, useSelector } from 'react-redux';
import { setMessages } from '@/redux/chatSlice';

const useGetAllMessages = () => {
  const BACKENDURL = import.meta.env.VITE_BACKEND_URL;
  const {selectedUser} = useSelector((state) => state.auth);
    const dispatch = useDispatch();
  useEffect(() => {
    const fetchAllMessage = async () => {
      try {
        const response = await axios.get(
          `${BACKENDURL}/message/all/${selectedUser._id}`,
          {
            withCredentials: true,
          }
        );
        if (response.data.success) {
          console.log(response.data);

          dispatch(setMessages(response.data.messages));
          // dispatch(setMessages([...messages, newMessage]));

        }
      } catch (error) {
        console.error('Error fetching posts:', error);
      }
    };
//  if (!selectedUser?._id) return;
    fetchAllMessage();
  }, [selectedUser]);
};

export default useGetAllMessages;
