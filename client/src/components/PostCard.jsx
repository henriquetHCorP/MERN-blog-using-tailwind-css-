import React from 'react'
import { Link } from 'react-router-dom'

 
export default function PostCard({post}) {
  const now =  new Date(); 
  now.setDate(now.getDate()); 

  const postDate = new Date(post.createdAt)
  console.log(postDate.getMonth() + 1); 
  
  // if (now.getDate()=== 31 && postDate.getMonth()=== 0){now.getMonth === postDate.getMonth}
  // if (now.getDate()=== 31 && postDate.getMonth()=== 2){now.getMonth === postDate.getMonth}
  // if (now.getDate()=== 31 && postDate.getMonth()=== 4){now.getMonth === postDate.getMonth}
  // if (now.getDate()=== 31 && postDate.getMonth()=== 6){now.getMonth === postDate.getMonth}
  // if (now.getDate()=== 31 && postDate.getMonth()=== 7){now.getMonth === postDate.getMonth}
  // if (now.getDate()=== 31 && postDate.getMonth()=== 9){now.getMonth === postDate.getMonth}
  // if (now.getDate()=== 31 && postDate.getMonth()=== 11){now.getMonth === postDate.getMonth}


  // if (now.getDate()=== 30 && postDate.getMonth()=== 3){now.getMonth === postDate.getMonth}
  // if (now.getDate()=== 30 && postDate.getMonth()=== 5){now.getMonth === postDate.getMonth}
  // if (now.getDate()=== 30 && postDate.getMonth()=== 8){now.getMonth === postDate.getMonth}
  // if (now.getDate()=== 30 && postDate.getMonth()=== 10){now.getMonth === postDate.getMonth}

  // if (postDate.getDate() === 30 && postDate.getMonth() === 10){now.getMonth() === null}
  
  // if (now.getDate()=== 28 && postDate.getMonth()=== 1){now.getMonth === postDate.getMonth}
  // if (now.getDate()=== 29 && postDate.getMonth()=== 1){now.getMonth === postDate.getMonth}

  return (
    <div className="group relative w-full border border-blue-500 hover:border-2 h-[400px] overflow-hidden rounded-lg sm:w-[430px] transition-all">
        
        {
          postDate.getMonth() === now.getMonth() && postDate.getFullYear() === now.getFullYear() && postDate.getDate() === now.getDate() || postDate.getMonth() === now.getMonth() && postDate.getFullYear() === now.getFullYear() && postDate.getDate() === now.getDate() - 1 || postDate.getMonth() === now.getMonth() - 1 && postDate.getFullYear() === now.getFullYear() && postDate.getDate() === 30 && now.getDate() === 1 || postDate.getMonth() === now.getMonth() - 1 && postDate.getFullYear() === now.getFullYear() && postDate.getDate() === 31 && now.getDate() === 1 || postDate.getMonth() === now.getMonth() - 1 && postDate.getFullYear() === now.getFullYear() - 1 && postDate.getDate() === 31 && now.getDate() === 1 || postDate.getMonth() === now.getMonth() - 1 && postDate.getFullYear() === now.getFullYear() && postDate.getDate() === 28 && now.getDate() === 1 || postDate.getMonth() === now.getMonth() - 1 && postDate.getFullYear() === now.getFullYear() && postDate.getDate() === 29 && now.getDate() === 1 ? 
        // (<div>
        //   <img src="/new30.png" alt="new" className="h-20 w-52 absolute"/> 
        // </div>) : "" 
        (<div className="p-1 absolute">
          <Link to={`/post/${post.slug}`} className="pl-2 pr-2 bg-red-700 hover:bg-red-800 transition-all duration-700 text-white cursor-pointer text-md font-bold rounded-full shadow-lg hover:shadow-2xl">Nouveau</Link>
        </div>) : ("")
        }
            {
              post.createdAt !== post.updatedAt ?

              (<div className=" p-1 absolute">
          <Link to={`/post/${post.slug}`} className="pl-2 pr-2 bg-blue-700 hover:bg-blue-800 transition-all duration-700 text-white cursor-pointer text-sm font-thin italic rounded-md shadow-lg hover:shadow-2xl">Cet article a été modifié par l'auteur</Link>
        </div>) : ("")
            }

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
