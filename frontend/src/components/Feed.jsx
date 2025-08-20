import React from 'react'
import Posts from './Posts'

const Feed = () => {
  return (
    <div className=' bg-black text-white flex-1 py-8 flex flex-col items-center p-2 md:pl-[20%]'>
        <Posts/>
    </div>
  )
}

export default Feed