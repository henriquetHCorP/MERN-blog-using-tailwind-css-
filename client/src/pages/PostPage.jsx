import { Button, Spinner } from "flowbite-react";
import { useEffect, useState } from "react";
import { Link, useParams } from "react-router-dom";
import CallToAction from "../components/CallToAction";
import CommentSection from "../components/CommentSection";
import PostCard from "../components/PostCard";


export default function PostPage() {

   //in the line below, postSlug is the rename of what you get by using getparams; 
    const {postSlug} = useParams(); 
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(false); 
    const [post, setPost] = useState(null);  
    const [recentPosts, setRecentPosts] = useState(null); 

    console.log(post); 

    useEffect(() => {
        // console.log(postSlug)
        const fetchPost = async() => {
            try {
              setLoading(true); 
              const res = await fetch(`/api/post/getposts?slug=${postSlug}`);
              const data = await res.json();
              
              if(!res.ok) {
                setError(true); 
                setLoading(false); 
                return; 
              } 
              if(res.ok) {
                setPost(data.posts[0]); 
                setLoading(false); 
                setError(false);
                // for the above line, cfr getposts of the post controller
              }
            } catch(error) {
                setError(true); 
                setLoading(false); 
            }
        }
        fetchPost(); 
    }, [postSlug]); 

    useEffect( () => {
    try { 
          const fetchRecentPosts = async () => {
            const res = await fetch(`/api/post/getposts?limit=3`); 
            const data = await res.json(); 
            if(res.ok){
              setRecentPosts(data.posts); 
            }
          }
          fetchRecentPosts(); 
    }catch(error) {
      console.log(error.message); 
    }
    }, [])

    if (loading) 
        return (
        <div className="flex justify-center items-center min-h-screen">
            <Spinner size='xl' /> 
         </div>
         ); 

         //henriquet add
        //  const handlePostLike = async (postId) => {

        //  }
  return (
    <main className='items-center p-3 flex flex-col max-w-6xl mx-auto min-h-screen'>
      <h1 className="text-3xl mt-10 p-3 text-center font-serif max-w-2xl mx-auto lg:text-4xl">{post && post.title}</h1>
    <Link to={`/search?category=${post && post.category}`} className='self-center mt-5'>
        {/* in the line below, pill will make it round */}
        <Button color='gray' pill size='xs'>{post.category}</Button>
    </Link>
    {/* object-cover in the classname is to keep the aspect ration of the image  */}
    <img src={post && post.image} alt={post && post.title} 
      //  className="mt-10 p-3 max-h-[600px] w-full object-cover"
       className="mt-10 p-3 h-3/4 w-3/4 object-cover rounded-3xl"
       
       />
    <div className="flex justify-between p-3 border-b border-slate-500 mx-auto w-full max-w-2xl text-xs"> 
        <span>{post && new Date(post.createdAt).toLocaleDateString('fr-FR', {
          weekday:'long',
          year:'numeric',
          month:'long',
          day:'numeric',
        }
             
        )}</span>   
        {/* tofixed(0) ==> is to fixed 0 decimal */}
        <span className="italic">{post && (post.content.length /1000).toFixed(0)} min de lecture</span>
    </div>
    {/* for the post-content className below, go to index.css for styling  */}
    <div className="p-3 max-w-2xl mx-auto w-full post-content" dangerouslySetInnerHTML={{__html:post && post.content}}>
    </div>
    <div className="max-w-4xl mx-auto w-full"> 
        <CallToAction /> 
    </div>
    <CommentSection postId={post._id} /> 
    <div className="flex flex-col justify-center items-center mb-5"> 
    <h1 className="text-xl mt-5">Articles récents</h1>
    <div className="flex flex-wrap gap-5 mt-5 justify-center">
      {/* flex-wrap has the benefit of automatically changing the number of column  */}
      {
        recentPosts && 
          recentPosts.map((post) => (
            <PostCard id={post._id} post={post} /> 
          ))
      }

    </div>

    </div>
    </main>
  )
}

