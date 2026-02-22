import { Button, Spinner } from "flowbite-react";
import { useEffect, useState } from "react";
import { Link, useNavigate, useParams } from "react-router-dom";
import CallToAction from "../components/CallToAction";
import CommentSection from "../components/CommentSection";
import PostCard from "../components/PostCard";
import LikeButton from "../components/LikeButton";
import { useSelector } from "react-redux";
import { FaThumbsUp } from "react-icons/fa";
import toast from "react-hot-toast";


export default function PostPage() {
  const navigate = useNavigate(); 

   //in the line below, postSlug is the rename of what you get by using getparams; 
    const {postSlug} = useParams(); 
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(false); 
    const [post, setPost] = useState(null);  
    const [recentPosts, setRecentPosts] = useState(null); 

    const {currentUser} = useSelector((state) => (state.user)); 

    //---console.log(posto.postal.posta); 

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
            const res = await fetch(`/api/post/getposts?limit=12`); 
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

  window.addEventListener("pageshow", function(event) {
    var historyTraversal = event.persisted || 
                           (typeof window.performance != "undefined" && 
                            window.performance.navigation.type === 2);
    if (historyTraversal) {
      // Handle page restore (i.e., the user navigated back)
      window.location.reload(); 
    }
  });
  const savedIsLiked = JSON.parse(localStorage.getItem('isLiked'));
  const savedCurrentUserId = JSON.parse(localStorage.getItem('currentUser._id'));
  
  
  const handleLikeButton = () => {
     toast('Vous devez vous connecter pour aimer ou "liker" une publication', {icon:'⚠️', duration:5000})
      setTimeout(() => {
      navigate('/sign-in');
    }, 2000); 
    }
  return (
    <main className='items-center p-3 flex flex-col max-w-6xl mx-auto min-h-screen'>
      
      {post.category === "Présidence" && (
        <div className="flex flex-row items-center">
          <img src="/presidence.jpg" alt="cellcom" height={90} width={90} className="dark:hidden"/>
          <img src="/darklogpr.png"  alt="cellcom" height={90} width={90} className="hidden dark:block"/>
          <img src="/line.png" alt="cellcom" height={11} width={11} className=""/>
        
        <p className="text-xs md:text-sm font-bold text-left uppercase font-serif">Présidence de la République</p></div>)}
      {post.category === "Premier Ministre" && (
        <div className="flex flex-row items-center">
          <img src="/gouvernement.jpg" alt="cellcom" height={90} width={90} className="dark:hidden"/>
          <img src="/darklog-.png"  alt="cellcom" height={90} width={90} className="hidden dark:block"/>
          <img src="/line.png" alt="cellcom" height={11} width={11} className=""/>
        
        <p className="text-xs md:text-sm font-bold text-left uppercase font-serif">La Primature</p></div>)}
      {post.category === "Interieur" && <p>VPM, Ministre de l'Intérieur et Sécurité, Décentralisation et Affaires coutumières</p>}
      {post.category === "Transport" && <p>VPM, Ministre des Transports et Voies de Communication et Désenclavement</p>}
      {post.category === "Défense" && <p>VPM, Ministre de la Défense Nationale et Anciens Combattants</p>}
      {post.category === "Economie" && <p>VPM, Ministre de l’Economie Nationale</p>}
      {post.category === "Fonction Publique" && (
        <div className="flex flex-row items-center">
          <img src="/gouvernement.jpg" alt="cellcom" height={90} width={90} className="dark:hidden"/>
          <img src="/darklog-.png"  alt="cellcom" height={90} width={90} className="hidden dark:block"/>
          <img src="/line.png" alt="cellcom" height={11} width={11} className=""/>
        <p className="text-xs md:text-sm font-bold text-left uppercase font-serif"> Ministère <br/> de la Fonction Publique, <br/> Modernisation de l'Administration <br/> et Innovation du Service Public</p>
        </div>)}
      {post.category === "Plan" && <p>VPM, Ministre du Plan et de la Coordination de l’Aide au Développement</p>}
      {post.category === "Agriculture" && <p>MINETAT, Ministre de l’Agriculture et Sécurité Alimentaire</p>}
      {post.category === "Affaires Etrangères" && (
        <div className="flex flex-row items-center">
          <img src="/gouvernement.jpg" alt="cellcom" height={90} width={90} className="dark:hidden"/>
          <img src="/darklog-.png"  alt="cellcom" height={90} width={90} className="hidden dark:block"/>
          <img src="/line.png" alt="cellcom" height={11} width={11} className=""/>
          <p className=" text-xs md:text-sm font-bold text-left uppercase font-serif"> Ministère <br/> des Affaires Etrangères, <br/> Coopération Internationale, <br/> Francophonie et Diaspora Congolaise</p>
          </div>)}
      {post.category === "Education Nationale" && <p>MINETAT, Ministre de l’Education Nationale et Nouvelle Citoyenneté</p>}
      {post.category === "Environnement" && <p>MINETAT, Ministre de l’Environnement et Développement Durable</p>}
      {post.category === "Infrastructures" && (
        <div className="flex flex-row items-center">
          <img src="/gouvernement.jpg" alt="cellcom" height={90} width={90} className="dark:hidden"/>
          <img src="/darklog-.png"  alt="cellcom" height={90} width={90} className="hidden dark:block"/>
          <img src="/line.png" alt="cellcom" height={11} width={11} className=""/>
        <p className="text-xs md:text-sm font-bold text-left uppercase font-serif"> Ministère <br/> des Infrastructures <br/> et Travaux Publics</p></div>)}
      {post.category === "Budget" && (
        <div className="flex flex-row items-center">
          <img src="/gouvernement.jpg" alt="cellcom" height={90} width={90} className="dark:hidden"/>
          <img src="/darklog-.png"  alt="cellcom" height={90} width={90} className="hidden dark:block"/>
          <img src="/line.png" alt="cellcom" height={11} width={11} className=""/>
        <p className="text-xs md:text-sm font-bold text-left uppercase font-serif"> Ministère <br/> du Budget</p></div>)}
      {post.category === "Affaires Foncières" && (
        <div className="flex flex-row items-center">
          <img src="/gouvernement.jpg" alt="cellcom" height={90} width={90} className="dark:hidden"/>
          <img src="/darklog-.png"  alt="cellcom" height={90} width={90} className="hidden dark:block"/>
          <img src="/line.png" alt="cellcom" height={11} width={11} className=""/>
        <p className="text-xs md:text-sm font-bold text-left uppercase font-serif"> Ministère des <br/> Affaires Foncières</p></div>)}
      {post.category === "Développement Rural" && <p>MINETAT, Ministre du Développement Rural</p>}
      {post.category === "Aménagement du territoire" && <p>MINETAT, Ministre de l’Aménagement du Territoire</p>}
      {post.category === "Justice" && <p>MINETAT, Ministre de la Justice et Garde des Sceaux</p>}
      {post.category === "Finances" && (
        
        <div className="flex flex-row items-center">
          <img src="/gouvernement.jpg" alt="cellcom" height={90} width={90} className="dark:hidden"/>
          <img src="/darklog-.png"  alt="cellcom" height={90} width={90} className="hidden dark:block"/>
          <img src="/line.png" alt="cellcom" height={11} width={11} className=""/>
        <p className="text-xs md:text-sm font-bold text-left uppercase font-serif">Ministère <br/> des Finances</p></div>)}
      {/* {post.category === "Présidence" && <p>Présidence</p>}
      {post.category === "Présidence" && <p>Présidence</p>}
      {post.category === "Présidence" && <p>Présidence</p>}
      {post.category === "Présidence" && <p>Présidence</p>}
      {post.category === "Présidence" && <p>Présidence</p>}
      {post.category === "Présidence" && <p>Présidence</p>}
      {post.category === "Présidence" && <p>Présidence</p>}  */}

      <h1 className="text-3xl mt-10 p-3 text-center font-serif max-w-2xl mx-auto lg:text-4xl">{post && post.title}</h1>
    <Link to={`/search?category=${post && post.category}`} className='self-center mt-5'>
        {/* in the line below, pill will make it round */}
        <Button color='gray' pill size='xs'>{post.category}</Button>
    </Link>
    {/* object-cover in the classname is to keep the aspect ration of the image  */}
    <img src={post && post.image} alt={post && post.title} 
      // className="mt-10 p-3 max-h-[600px] w-full object-cover"
      className="mt-10 p-3 max-h-[800px] w-full object-cover"
      //  className="mt-10 p-3 h-3/4 w-3/4 object-cover rounded-3xl"
       
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
    <div className="">
      
      {/* {post.numberOfLikes} */}
      <>
       {currentUser ? 
       <LikeButton postId={post._id} initialLikes={post.likes.length} post={post} userId={currentUser?._id} /> : 
       <div className="flex flex-col items-center justify-center">
       <button type='button' 
      //  onClick={() => toast('Vous devez vous connecter pour aimer ou "liker" une publication', {icon:'⚠️', duration:5000})}
          onClick ={() => toast('Vous devez vous connecter pour aimer ou "liker" une publication', {icon:'⚠️', duration:5000})} 
       className="dark:text-blue-500 text-sm">Vous devez vous connecter pour aimer ou "liker" une publication </button>
          <Link className="text-gray-400 p-2 items-center" onClick={()=>handleLikeButton()}>
        <FaThumbsUp />
          </Link>
          {!currentUser && <p className="text-gray-600 pb-2 italic dark:text-white">Cette publication a été aimée par:{' '}{post.likes.length} {post.likes.length > 1 ? 'internautes' : 'internaute'}</p>}
          </div>
        }
        </>
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

