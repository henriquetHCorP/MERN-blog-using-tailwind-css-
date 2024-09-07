import React, { useEffect, useState } from 'react'
import { Link } from 'react-router-dom'
import CallToAction from '../components/CallToAction'
import PostCard from '../components/PostCard';

export default function Home() {
  const [posts, setPosts] = useState([]); 

  useEffect(() => {
    const fetchPosts = async () => {
      const res = await fetch('/api/post/getPosts'); 
      // check inside the controller if you can see the getposts 
      const data = await res.json(); 
      setPosts(data.posts); 
    }
    fetchPosts(); 
  },[])
  return (
    <div>
      <div className="items-center flex flex-col gap-6 lg:p-28 px-3 max-w-7xl mx-auto">
            <h1 className="text-3xl font-bold lg:text-6xl">Welcome to the DRC Government</h1>
            <h1 className="text-3xl font-bold lg:text-6xl">Social Media</h1>
            <div className="items-center whitespace-nowrap text-sm sm:text-xl font-semibold dark:text-white">
            <span className="px-2 py-3 bg-gradient-to-r from-blue-500 via-blue-500 to-red-500 rounded-lg text-white">
                  DRC Gov
            </span>
          Social Media 
        </div>
            <p className="text-gray-500 text-xs sm:text-sm">
              {/* Here you'll find a variety of articles and tutorials on topic such as web development, software engineering, and programming languages.
              */}
             Here you will find in real time, latest news and information related to Government members. 
              </p>
      <Link to='/search' className="text-xs sm:text-sm text-blue-700 font-bold"> 
      <button className=" pl-4 pr-4 bg-blue-300 hover:bg-blue-400 hover:text-blue-800 transition-all duration-700 text-lg rounded-full shadow-lg hover:underline">
      View all posts
        </button>
      </Link>
      {/* drc congo wildlife image  */}
     
      {/* <Link to="/search" className="items-center pl-60"> */}
      <img
        className="opacity-50 hover:opacity-100 transition-all duration-700 shadow-2xl rounded-2xl h-1/2 w-1/2"
        src="https://dynaimage.cdn.cnn.com/cnn/c_fill,g_auto,w_1200,h_675,ar_16:9/https%3A%2F%2Fcdn.cnn.com%2Fcnnnext%2Fdam%2Fassets%2F190122214551-okapi-tease-2.jpg"
        alt="Congo "
       
      />
      
      {/* </Link> */}
      
      </div>
      <div className="p-3 bg-amber-100 dark:bg-slate-700">
         <CallToAction /> 
      </div>

      <div className="max-w-6xl mx-auto p-3 flex flex-col gap-8 py-7">
        {
          posts && posts.length > 0 && (
            <div className="flex flex-col gap-6">    
              <h2 className="text-2xl font-semibold text-center">
                  Recent Articles
              </h2>
              {/* <div className="flex flex-wrap gap-4"> */}
              <div className="flex flex-wrap gap-5 mt-5 justify-center">
                {posts.map((post) => (
                  <PostCard key={post._id} post={post}/> 
                ))}
              </div>
              {/* <Link to={'/search'} className="text-lg text-teal-500 hover:underline text-center">
                View all posts
              
              </Link> */}

<Link to='/search' className="text-xs sm:text-sm text-blue-500 font-bold text-center"> 
<button className=" pl-4 pr-4 bg-blue-300 hover:bg-blue-400 hover:text-blue-800 transition-all duration-700 text-lg rounded-full shadow-lg hover:underline">
      View all posts
        </button>
      </Link>
            </div>
          )
        }

      </div>
    </div>
  )
}
