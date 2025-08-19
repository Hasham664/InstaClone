import React from 'react'
import Post from './Post'
import { useSelector } from 'react-redux'

const Posts = () => {
  const {posts} = useSelector((store) => store.post);
  return (
    <div>
      {posts.map((post1) => (
        <Post key={post1._id} post={post1} />
      ))}
    </div>
  );
}

export default Posts