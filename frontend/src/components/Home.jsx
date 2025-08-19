import React from 'react'
import Feed from './Feed'
import { Outlet } from 'react-router-dom'
import RightSidebar from './RightSidebar'
import useGetAllPost from '@/hooks/useGetAllPost'
import useGetSuggestesUsers from '@/hooks/useGetSuggestesUsers'

const Home = () => {
  useGetAllPost();
  useGetSuggestesUsers();
  return (
    <div className='flex'>
      <div className='flex-grow'>
        <Feed/>
        <Outlet/>
      </div>
      <RightSidebar/>
      </div>
  )
}

export default Home