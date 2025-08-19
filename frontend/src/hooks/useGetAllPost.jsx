import React, { useEffect } from 'react'
import { setPosts } from '@/redux/postSlice';
import axios from 'axios';
import { useDispatch } from 'react-redux'

const useGetAllPost = () => {
    const BACKENDURL = import.meta.env.VITE_BACKEND_URL;
 const dispatch = useDispatch();
 useEffect(() => {
   const fetchAllPost = async () => {
     try {
       const response = await axios.get(`${BACKENDURL}/post/all`,{withCredentials: true});
       if(response.data.success){
        console.log(response.data);
        
        dispatch(setPosts(response.data.posts));
       }
     } catch (error) {
       console.error('Error fetching posts:', error);
     }
   }
 
   fetchAllPost();
 }, [])
 
}

export default useGetAllPost