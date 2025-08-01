import React from 'react'
import { Link } from 'react-router-dom'

 
export default function PostCard({post}) {
  return (
    <div className="group relative w-full border border-blue-500 hover:border-2 h-[400px] overflow-hidden rounded-lg sm:w-[430px] transition-all">
        {/* sm: mobile size and above */}
        <Link to={`/post/${post.slug}`}>
            <img src={post.image} alt="post cover" className="h-[260px] w-full object-cover group-hover:h-[200px] transition-all duration-300 z-20"/> 
         {/* z index: we want our image to be a the top of everything else on the page  */}
        </Link>
        <div className="p-3 flex flex-col gap-2">
            <p className="text-lg font-semibold line-clamp-2">{post.title}</p>
            <span className="italic text-sm">{post.category}</span>
            <Link to={`/post/${post.slug}`} className="z-10 group-hover:bottom-0 absolute bottom-[-200px] left-0 right-0 border border-blue-500 text-blue-500 hover:bg-blue-500 hover:text-white transition-all duration-300 text-center py-2 rounded-md !rounded-tl-none m-2">
                {/* z index on 10 z-10: because we only want it to be seen when we hover over it; 
                   since we are using absolute, we have to make the div that contain everthing to 'relative' 
                   left-0 right-0 to bring it completely in the center.    
                 */}
                 Lire l'article
            </Link>

        </div>
       
    </div>
  )
}
