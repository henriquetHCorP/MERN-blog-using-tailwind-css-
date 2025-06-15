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
            {/* <h1 className="text-center text-2xl font-bold lg:text-6xl">Welcome to the DRC Government <br/> Social Media </h1> */}
            <h1 className="text-center text-2xl font-bold lg:text-6xl">Bienvenue sur DRC Gov<br/> Social Media </h1>
            
            <div className="items-center whitespace-nowrap text-sm sm:text-xl font-semibold dark:text-white">
            <span className="px-2 py-3 bg-gradient-to-r from-blue-500 via-blue-500 to-red-500 rounded-lg text-white">
                  DRC Gov
            </span>
          Social Media 
        </div>
            <p className="text-gray-500 text-xs sm:text-sm">
              {/* Here you'll find a variety of articles and tutorials on topic such as web development, software engineering, and programming languages.
              */}
             {/* Here you will find in real time, latest news and information related to the President Office and Government members.  */}
              Trouvez, en temps réel, les dernières informations au sujet de la Présidence de la République Démocratique du Congo et des membres du Gouvernement.  
              </p>
      <Link to='/search' className="text-xs sm:text-sm text-black font-bold"> 
      <button className=" pl-4 pr-4 bg-blue-300 hover:bg-blue-500 hover:text-black-800 dark:bg-blue-800 dark:text-white transition-all duration-700 text-lg rounded-full shadow-lg hover:underline">
      Voir tous les articles
        </button>
      </Link>
      {/* drc congo wildlife image  */}
     
      {/* <Link to="/search" className="items-center pl-60"> */}
      {/* <img
        className="opacity-50 hover:opacity-100 transition-all duration-700 shadow-2xl rounded-2xl h-1/2 w-1/2"
        src="https://dynaimage.cdn.cnn.com/cnn/c_fill,g_auto,w_1200,h_675,ar_16:9/https%3A%2F%2Fcdn.cnn.com%2Fcnnnext%2Fdam%2Fassets%2F190122214551-okapi-tease-2.jpg"
        alt="Congo "
       
      /> */}
      {/* <img
        className="opacity-50 hover:opacity-100 transition-all duration-700 shadow-2xl rounded-2xl h-1/2 w-1/2"
        src="https://blogger.googleusercontent.com/img/b/R29vZ2xl/AVvXsEgd9q_RJaX9GVqQDuQ7vJNC83HS_zIterby2p6Ec-Px3fazIU7_3JJwwsjGZcaIn1WOYQGNZn0ntOlPzY3NAYWaZ8kurn1acNfZNzFZAQeer8zUBss2bwkiH-ITiCH8BjX1S3V8ULFP-x4/s0/Flag_of_the_Democratic_Republic_of_the_Congo.gif"
       
      /> */}
      <img
        className="opacity-50 hover:opacity-100 transition-all duration-700 shadow-2xl rounded-2xl h-1/2 w-1/2"
        src="/drc-flag-animated.gif"
       
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
                  Articles récents   
 
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

<Link to='/search' className="text-xs sm:text-sm text-black font-bold text-center"> 
<button className=" pl-4 pr-4 bg-blue-300 hover:bg-blue-500 hover:text-black-800 dark:bg-blue-800 dark:text-white transition-all duration-700 text-lg rounded-full shadow-lg hover:underline">
      Voir tous les articles
        </button>
      </Link>
            </div>
          )
        }

      </div>
    </div>
  )
}
