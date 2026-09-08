import { Button, Spinner } from "flowbite-react";
import { useEffect, useRef, useState } from "react";
import { Link, useNavigate, useParams } from "react-router-dom";
import CallToAction from "../components/CallToAction";
import CommentSection from "../components/CommentSection";
import PostCard from "../components/PostCard";
import LikeButton from "../components/LikeButton";
import { useSelector } from "react-redux";
import { FaThumbsUp } from "react-icons/fa";
import toast from "react-hot-toast";
import DOMPurify from 'dompurify';


export default function PostPage() {
  const navigate = useNavigate(); 
  const [isExpanded, setIsExpanded] = useState(false);
  const [showButton, setShowButton] = useState(false);
  const contentRef = useRef(null);
   //console.log("contentRef:", contentRef); 

 
  const toggleExpand = () => setIsExpanded(!isExpanded);

   //in the line below, postSlug is the rename of what you get by using getparams; 
    const {postSlug} = useParams(); 
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(false); 
    const [post, setPost] = useState(null);  
    const [recentPosts, setRecentPosts] = useState(null); 

    const {currentUser} = useSelector((state) => (state.user)); 

    //---console.log(posto.postal.posta); 
    //console.log("post length:", post?.content.length); 

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
              //console.log("length:", post.content.length)
            } catch(error) {
                setError(true); 
                setLoading(false); 
            }
        }
        fetchPost(); 
    }, [postSlug]); 
      
     useEffect(() => {
    // Check if content exceeds the collapsed height (e.g., 150px)
    if (contentRef.current && contentRef.current.scrollHeight > 150) {
      setShowButton(true);
    }
  },[post]);

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

    const cleanContent = DOMPurify.sanitize(post.content, {
  FORBID_TAGS: ['iframe']
});

// Check if content is solely an iframe
  const isOnlyIframe = post.content.trim().startsWith('<iframe') && 
                      post.content.trim().endsWith('</iframe>');

  
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
        
        <p className="text-xs md:text-sm font-bold text-left uppercase font-serif">La Primature</p>
        
        </div>
      
      )}
      {post.category === "Interieur" && (
        <div className="flex flex-row items-center">
          <img src="/gouvernement.jpg" alt="cellcom" height={90} width={90} className="dark:hidden"/>
          <img src="/darklog-.png"  alt="cellcom" height={90} width={90} className="hidden dark:block"/>
          <img src="/line.png" alt="cellcom" height={11} width={11} className=""/>
        <p className="text-xs md:text-sm font-bold text-left uppercase font-serif"> Ministère <br/> de l'Intérieur et Sécurité, <br/> Décentralisation et Affaires coutumières</p>
        </div>
          // <p>VPM, Ministre de l'Intérieur et Sécurité, Décentralisation et Affaires coutumières</p>
        
        )}
      {post.category === "Transport" && (
        <div className="flex flex-row items-center">
          <img src="/gouvernement.jpg" alt="cellcom" height={90} width={90} className="dark:hidden"/>
          <img src="/darklog-.png"  alt="cellcom" height={90} width={90} className="hidden dark:block"/>
          <img src="/line.png" alt="cellcom" height={11} width={11} className=""/>
        <p className="text-xs md:text-sm font-bold text-left uppercase font-serif"> Ministère <br/> des Transports, <br/> Voies de Communication <br/>et Désenclavement </p>
        </div>
        
          // <p>VPM, Ministre des Transports et Voies de Communication et Désenclavement</p>
        )}
      {post.category === "Défense" && (
        
        <div className="flex flex-row items-center">
          <img src="/gouvernement.jpg" alt="cellcom" height={90} width={90} className="dark:hidden"/>
          <img src="/darklog-.png"  alt="cellcom" height={90} width={90} className="hidden dark:block"/>
          <img src="/line.png" alt="cellcom" height={11} width={11} className=""/>
        <p className="text-xs md:text-sm font-bold text-left uppercase font-serif"> Ministère <br/> de la Défense Nationale, <br/> et Anciens Combattants</p>
        </div>
          // <p>VPM, Ministre de la Défense Nationale et Anciens Combattants</p>
      
    )}
      {post.category === "Economie" && (
        
         <div className="flex flex-row items-center">
          <img src="/gouvernement.jpg" alt="cellcom" height={90} width={90} className="dark:hidden"/>
          <img src="/darklog-.png"  alt="cellcom" height={90} width={90} className="hidden dark:block"/>
          <img src="/line.png" alt="cellcom" height={11} width={11} className=""/>
        <p className="text-xs md:text-sm font-bold text-left uppercase font-serif"> Ministère <br/> de l’Economie Nationale </p>
        </div>
          // <p>VPM, Ministre de l’Economie Nationale</p>
    
    
    )}
      {post.category === "Fonction Publique" && (
        <div className="flex flex-row items-center">
          <img src="/gouvernement.jpg" alt="cellcom" height={90} width={90} className="dark:hidden"/>
          <img src="/darklog-.png"  alt="cellcom" height={90} width={90} className="hidden dark:block"/>
          <img src="/line.png" alt="cellcom" height={11} width={11} className=""/>
        <p className="text-xs md:text-sm font-bold text-left uppercase font-serif"> Ministère <br/> de la Fonction Publique, <br/> Modernisation de l'Administration <br/> et Innovation du Service Public</p>
        </div>
      
      )}
      {post.category === "Plan" && (
        
        <div className="flex flex-row items-center">
          <img src="/gouvernement.jpg" alt="cellcom" height={90} width={90} className="dark:hidden"/>
          <img src="/darklog-.png"  alt="cellcom" height={90} width={90} className="hidden dark:block"/>
          <img src="/line.png" alt="cellcom" height={11} width={11} className=""/>
        <p className="text-xs md:text-sm font-bold text-left uppercase font-serif"> Ministère du Plan <br/> et de la Coordination de l’Aide, <br/> au Développement </p>
        </div>
        
          // <p>VPM, Ministre du Plan et de la Coordination de l’Aide au Développement</p>
    
    
    )}
      {post.category === "Agriculture" && (
        <div className="flex flex-row items-center">
          <img src="/gouvernement.jpg" alt="cellcom" height={90} width={90} className="dark:hidden"/>
          <img src="/darklog-.png"  alt="cellcom" height={90} width={90} className="hidden dark:block"/>
          <img src="/line.png" alt="cellcom" height={11} width={11} className=""/>
        <p className="text-xs md:text-sm font-bold text-left uppercase font-serif"> Ministère de l’Agriculture <br/> et Sécurité Alimentaire, <br/> au Développement </p>
        </div>
          // <p>MINETAT, Ministre de l’Agriculture et Sécurité Alimentaire</p>
    
    )}
      {post.category === "Affaires Etrangères" && (
        <div className="flex flex-row items-center">
          <img src="/gouvernement.jpg" alt="cellcom" height={90} width={90} className="dark:hidden"/>
          <img src="/darklog-.png"  alt="cellcom" height={90} width={90} className="hidden dark:block"/>
          <img src="/line.png" alt="cellcom" height={11} width={11} className=""/>
          <p className=" text-xs md:text-sm font-bold text-left uppercase font-serif"> Ministère <br/> des Affaires Etrangères, <br/> Coopération Internationale, <br/> Francophonie et Diaspora Congolaise</p>
          </div>
        
        )}
      {post.category === "Education Nationale" && (
        
        <div className="flex flex-row items-center">
          <img src="/gouvernement.jpg" alt="cellcom" height={90} width={90} className="dark:hidden"/>
          <img src="/darklog-.png"  alt="cellcom" height={90} width={90} className="hidden dark:block"/>
          <img src="/line.png" alt="cellcom" height={11} width={11} className=""/>
          <p className=" text-xs md:text-sm font-bold text-left uppercase font-serif"> Ministère <br/> de l’Education Nationale <br/> et Nouvelle Citoyenneté</p>
          </div>
          // <p>MINETAT, Ministre de l’Education Nationale et Nouvelle Citoyenneté</p>
      
      
      )
      
      
      }
      {post.category === "Environnement" && (
        <div className="flex flex-row items-center">
          <img src="/gouvernement.jpg" alt="cellcom" height={90} width={90} className="dark:hidden"/>
          <img src="/darklog-.png"  alt="cellcom" height={90} width={90} className="hidden dark:block"/>
          <img src="/line.png" alt="cellcom" height={11} width={11} className=""/>
          <p className=" text-xs md:text-sm font-bold text-left uppercase font-serif"> Ministère de l’Environnement, <br/>Développement Durable <br/> et Nouvelle Economie du Climat</p>
          </div>
    
          // <p>MINETAT, Ministre de l’Environnement et Développement Durable</p>
    
    
    )}
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
        <p className="text-xs md:text-sm font-bold text-left uppercase font-serif"> Ministère des <br/> Affaires Foncières</p>
        </div>
      
      )}
      {post.category === "Développement Rural" && (

        <div className="flex flex-row items-center">
          <img src="/gouvernement.jpg" alt="cellcom" height={90} width={90} className="dark:hidden"/>
          <img src="/darklog-.png"  alt="cellcom" height={90} width={90} className="hidden dark:block"/>
          <img src="/line.png" alt="cellcom" height={11} width={11} className=""/>
        <p className="text-xs md:text-sm font-bold text-left uppercase font-serif"> Ministère<br/> du Développement Rural</p>
        </div>
          // <p>MINETAT, Ministre du Développement Rural</p>
        
        )}
      {post.category === "Aménagement du territoire" && (

        <div className="flex flex-row items-center">
          <img src="/gouvernement.jpg" alt="cellcom" height={90} width={90} className="dark:hidden"/>
          <img src="/darklog-.png"  alt="cellcom" height={90} width={90} className="hidden dark:block"/>
          <img src="/line.png" alt="cellcom" height={11} width={11} className=""/>
        <p className="text-xs md:text-sm font-bold text-left uppercase font-serif"> Ministère de l’Aménagement<br/>du Territoire</p>
        </div>
        
          // <p>MINETAT, Ministre de l’Aménagement du Territoire</p>
        
        )}
      {post.category === "Justice" && (
        
        <div className="flex flex-row items-center">
          <img src="/gouvernement.jpg" alt="cellcom" height={90} width={90} className="dark:hidden"/>
          <img src="/darklog-.png"  alt="cellcom" height={90} width={90} className="hidden dark:block"/>
          <img src="/line.png" alt="cellcom" height={11} width={11} className=""/>
        <p className="text-xs md:text-sm font-bold text-left uppercase font-serif"> Ministère<br/>de la Justice</p>
        </div>
          // <p>MINETAT, Ministre de la Justice et Garde des Sceaux</p>
    
    
    )}
      {post.category === "Finances" && (
        
        <div className="flex flex-row items-center">
          <img src="/gouvernement.jpg" alt="cellcom" height={90} width={90} className="dark:hidden"/>
          <img src="/darklog-.png"  alt="cellcom" height={90} width={90} className="hidden dark:block"/>
          <img src="/line.png" alt="cellcom" height={11} width={11} className=""/>
        <p className="text-xs md:text-sm font-bold text-left uppercase font-serif">Ministère <br/> des Finances</p></div>)}
      
      {post.category === "Communication" && (
        
        <div className="flex flex-row items-center">
          <img src="/gouvernement.jpg" alt="cellcom" height={90} width={90} className="dark:hidden"/>
          <img src="/darklog-.png"  alt="cellcom" height={90} width={90} className="hidden dark:block"/>
          <img src="/line.png" alt="cellcom" height={11} width={11} className=""/>
        <p className="text-xs md:text-sm font-bold text-left uppercase font-serif">Ministère <br/>de la Communication <br/> et Médias</p></div>)}
      {post.category === "Mines" && (
         <div className="flex flex-row items-center">
          <img src="/gouvernement.jpg" alt="cellcom" height={90} width={90} className="dark:hidden"/>
          <img src="/darklog-.png"  alt="cellcom" height={90} width={90} className="hidden dark:block"/>
          <img src="/line.png" alt="cellcom" height={11} width={11} className=""/>
        <p className="text-xs md:text-sm font-bold text-left uppercase font-serif">Ministère <br/>des Mines</p></div>
      )}
      {post.category === "Postes et Télécommunications" && (
         <div className="flex flex-row items-center">
          <img src="/gouvernement.jpg" alt="cellcom" height={90} width={90} className="dark:hidden"/>
          <img src="/darklog-.png"  alt="cellcom" height={90} width={90} className="hidden dark:block"/>
          <img src="/line.png" alt="cellcom" height={11} width={11} className=""/>
        <p className="text-xs md:text-sm font-bold text-left uppercase font-serif">Ministère des Postes <br/>et Télécommunications</p></div>
      )}
      {post.category === "Economie Numérique" && (
         <div className="flex flex-row items-center">
          <img src="/gouvernement.jpg" alt="cellcom" height={90} width={90} className="dark:hidden"/>
          <img src="/darklog-.png"  alt="cellcom" height={90} width={90} className="hidden dark:block"/>
          <img src="/line.png" alt="cellcom" height={11} width={11} className=""/>
        <p className="text-xs md:text-sm font-bold text-left uppercase font-serif">Ministère <br/>de l'Economie <br/>Numérique </p></div>
      )}
      {post.category === "Industrie" && (
         <div className="flex flex-row items-center">
          <img src="/gouvernement.jpg" alt="cellcom" height={90} width={90} className="dark:hidden"/>
          <img src="/darklog-.png"  alt="cellcom" height={90} width={90} className="hidden dark:block"/>
          <img src="/line.png" alt="cellcom" height={11} width={11} className=""/>
        <p className="text-xs md:text-sm font-bold text-left uppercase font-serif">Ministère <br/>de l’Industrie </p></div>
      )}
      {post.category === "Sociales" && (
         <div className="flex flex-row items-center">
          <img src="/gouvernement.jpg" alt="cellcom" height={90} width={90} className="dark:hidden"/>
          <img src="/darklog-.png"  alt="cellcom" height={90} width={90} className="hidden dark:block"/>
          <img src="/line.png" alt="cellcom" height={11} width={11} className=""/>
        <p className="text-xs md:text-sm font-bold text-left uppercase font-serif">Ministère des Affaires Sociales, <br/> Actions Humanitaires <br/>et Solidarité Nationale </p></div>
      )}
      {post.category === "Hydrocarbures" && (
         <div className="flex flex-row items-center">
          <img src="/gouvernement.jpg" alt="cellcom" height={90} width={90} className="dark:hidden"/>
          <img src="/darklog-.png"  alt="cellcom" height={90} width={90} className="hidden dark:block"/>
          <img src="/line.png" alt="cellcom" height={11} width={11} className=""/>
        <p className="text-xs md:text-sm font-bold text-left uppercase font-serif">Ministère des Hydrocarbures</p></div>
      )}
      {post.category === "Education Nationale" && (
         <div className="flex flex-row items-center">
          <img src="/gouvernement.jpg" alt="cellcom" height={90} width={90} className="dark:hidden"/>
          <img src="/darklog-.png"  alt="cellcom" height={90} width={90} className="hidden dark:block"/>
          <img src="/line.png" alt="cellcom" height={11} width={11} className=""/>
        <p className="text-xs md:text-sm font-bold text-left uppercase font-serif">Ministère de l’Education Nationale <br/> et Nouvelle Citoyenneté</p></div>
      )}
      {post.category === "Formation Professionelle" && (
         <div className="flex flex-row items-center">
          <img src="/gouvernement.jpg" alt="cellcom" height={90} width={90} className="dark:hidden"/>
          <img src="/darklog-.png"  alt="cellcom" height={90} width={90} className="hidden dark:block"/>
          <img src="/line.png" alt="cellcom" height={11} width={11} className=""/>
        <p className="text-xs md:text-sm font-bold text-left uppercase font-serif">Ministère <br/> de la Formation <br/> Professionnelle</p></div>
      )}
      {post.category === "Urbanisme et Habitat" && (
         <div className="flex flex-row items-center">
          <img src="/gouvernement.jpg" alt="cellcom" height={90} width={90} className="dark:hidden"/>
          <img src="/darklog-.png"  alt="cellcom" height={90} width={90} className="hidden dark:block"/>
          <img src="/line.png" alt="cellcom" height={11} width={11} className=""/>
        <p className="text-xs md:text-sm font-bold text-left uppercase font-serif">Ministère <br/> de l'Urbanisme <br/> et Habitat</p></div>
      )}
      {post.category === "Développement Rural" && (
         <div className="flex flex-row items-center">
          <img src="/gouvernement.jpg" alt="cellcom" height={90} width={90} className="dark:hidden"/>
          <img src="/darklog-.png"  alt="cellcom" height={90} width={90} className="hidden dark:block"/>
          <img src="/line.png" alt="cellcom" height={11} width={11} className=""/>
        <p className="text-xs md:text-sm font-bold text-left uppercase font-serif">Ministère <br/> du Développement <br/>Rural</p></div>
      )}
      {post.category === "Relations avec le Parlement" && (
         <div className="flex flex-row items-center">
          <img src="/gouvernement.jpg" alt="cellcom" height={90} width={90} className="dark:hidden"/>
          <img src="/darklog-.png"  alt="cellcom" height={90} width={90} className="hidden dark:block"/>
          <img src="/line.png" alt="cellcom" height={11} width={11} className=""/>
        <p className="text-xs md:text-sm font-bold text-left uppercase font-serif">Ministère des Relations  <br/> avec le Parlement</p></div>
      )}
      {post.category === "Santé Publique" && (
         <div className="flex flex-row items-center">
          <img src="/gouvernement.jpg" alt="cellcom" height={90} width={90} className="dark:hidden"/>
          <img src="/darklog-.png"  alt="cellcom" height={90} width={90} className="hidden dark:block"/>
          <img src="/line.png" alt="cellcom" height={11} width={11} className=""/>
        <p className="text-xs md:text-sm font-bold text-left uppercase font-serif">Ministère de la Santé Publique, <br/> Hygiène et Prévoyance Sociale </p></div>
      )}
      {post.category === "Commerce Extérieur" && (
         <div className="flex flex-row items-center">
          <img src="/gouvernement.jpg" alt="cellcom" height={90} width={90} className="dark:hidden"/>
          <img src="/darklog-.png"  alt="cellcom" height={90} width={90} className="hidden dark:block"/>
          <img src="/line.png" alt="cellcom" height={11} width={11} className=""/>
        <p className="text-xs md:text-sm font-bold text-left uppercase font-serif">Ministère <br/> du Commerce <br/>Extérieur </p></div>
      )}
      {post.category === "Environnement" && (
         <div className="flex flex-row items-center">
          <img src="/gouvernement.jpg" alt="cellcom" height={90} width={90} className="dark:hidden"/>
          <img src="/darklog-.png"  alt="cellcom" height={90} width={90} className="hidden dark:block"/>
          <img src="/line.png" alt="cellcom" height={11} width={11} className=""/>
        <p className="text-xs md:text-sm font-bold text-left uppercase font-serif">Ministère de l’Environnement, <br/> Développement Durable <br/>et Nouvelle Economie du Climat </p></div>
      )}
      {post.category === "Enseignement Supérieur, Recherche et Innovation" && (
         <div className="flex flex-row items-center">
          <img src="/gouvernement.jpg" alt="cellcom" height={90} width={90} className="dark:hidden"/>
          <img src="/darklog-.png"  alt="cellcom" height={90} width={90} className="hidden dark:block"/>
          <img src="/line.png" alt="cellcom" height={11} width={11} className=""/>
        <p className="text-xs md:text-sm font-bold text-left uppercase font-serif">Ministère Enseignement Supérieur, <br/> Universitaire, Recherche Scientifique <br/>et Innovations </p></div>
      )}
      {post.category === "Emploi et Travail" && (
         <div className="flex flex-row items-center">
          <img src="/gouvernement.jpg" alt="cellcom" height={90} width={90} className="dark:hidden"/>
          <img src="/darklog-.png"  alt="cellcom" height={90} width={90} className="hidden dark:block"/>
          <img src="/line.png" alt="cellcom" height={11} width={11} className=""/>
        <p className="text-xs md:text-sm font-bold text-left uppercase font-serif">Ministère de l'Emploi <br/> et Travail</p></div>
      )}
      {post.category === "Ressources Hydroliques et Electricité" && (
         <div className="flex flex-row items-center">
          <img src="/gouvernement.jpg" alt="cellcom" height={90} width={90} className="dark:hidden"/>
          <img src="/darklog-.png"  alt="cellcom" height={90} width={90} className="hidden dark:block"/>
          <img src="/line.png" alt="cellcom" height={11} width={11} className=""/>
        <p className="text-xs md:text-sm font-bold text-left uppercase font-serif">Ministère <br/> des Ressources Hydroliques <br/> et Electricité</p></div>
      )}
      {post.category === "Entrepreneuriat et PME" && (
         <div className="flex flex-row items-center">
          <img src="/gouvernement.jpg" alt="cellcom" height={90} width={90} className="dark:hidden"/>
          <img src="/darklog-.png"  alt="cellcom" height={90} width={90} className="hidden dark:block"/>
          <img src="/line.png" alt="cellcom" height={11} width={11} className=""/>
        <p className="text-xs md:text-sm font-bold text-left uppercase font-serif">Ministère de Entrepreneuriat <br/> et Développement des Petites <br/> et Moyennes Entreprises</p></div>
      )}
      {post.category === "Aménagement du territoire" && (
         <div className="flex flex-row items-center">
          <img src="/gouvernement.jpg" alt="cellcom" height={90} width={90} className="dark:hidden"/>
          <img src="/darklog-.png"  alt="cellcom" height={90} width={90} className="hidden dark:block"/>
          <img src="/line.png" alt="cellcom" height={11} width={11} className=""/>
        <p className="text-xs md:text-sm font-bold text-left uppercase font-serif">Ministère <br/> de l'Aménagement <br/> du territoire </p></div>
      )}
      {post.category === "Tourisme" && (
         <div className="flex flex-row items-center">
          <img src="/gouvernement.jpg" alt="cellcom" height={90} width={90} className="dark:hidden"/>
          <img src="/darklog-.png"  alt="cellcom" height={90} width={90} className="hidden dark:block"/>
          <img src="/line.png" alt="cellcom" height={11} width={11} className=""/>
        <p className="text-xs md:text-sm font-bold text-left uppercase font-serif">Ministère <br/> du Tourisme </p></div>
      )}
      {post.category === "Pêche et Elevage" && (
         <div className="flex flex-row items-center">
          <img src="/gouvernement.jpg" alt="cellcom" height={90} width={90} className="dark:hidden"/>
          <img src="/darklog-.png"  alt="cellcom" height={90} width={90} className="hidden dark:block"/>
          <img src="/line.png" alt="cellcom" height={11} width={11} className=""/>
        <p className="text-xs md:text-sm font-bold text-left uppercase font-serif">Ministère <br/> de la Pêche et Elevage </p></div>
      )}
      {post.category === "Culture, Arts et Patrimoine" && (
         <div className="flex flex-row items-center">
          <img src="/gouvernement.jpg" alt="cellcom" height={90} width={90} className="dark:hidden"/>
          <img src="/darklog-.png"  alt="cellcom" height={90} width={90} className="hidden dark:block"/>
          <img src="/line.png" alt="cellcom" height={11} width={11} className=""/>
        <p className="text-xs md:text-sm font-bold text-left uppercase font-serif">Ministère <br/> de la Culture, <br/> Arts et Patrimoine</p></div>
      )}
      {post.category === "Droits Humains" && (
         <div className="flex flex-row items-center">
          <img src="/gouvernement.jpg" alt="cellcom" height={90} width={90} className="dark:hidden"/>
          <img src="/darklog-.png"  alt="cellcom" height={90} width={90} className="hidden dark:block"/>
          <img src="/line.png" alt="cellcom" height={11} width={11} className=""/>
        <p className="text-xs md:text-sm font-bold text-left uppercase font-serif">Ministère <br/> des Droits Humains </p></div>
      )}
      {post.category === "Intégration Régionale" && (
         <div className="flex flex-row items-center">
          <img src="/gouvernement.jpg" alt="cellcom" height={90} width={90} className="dark:hidden"/>
          <img src="/darklog-.png"  alt="cellcom" height={90} width={90} className="hidden dark:block"/>
          <img src="/line.png" alt="cellcom" height={11} width={11} className=""/>
        <p className="text-xs md:text-sm font-bold text-left uppercase font-serif">Ministère <br/> de l’Intégration <br/> Régionale </p></div>
      )}
      {post.category === "Affaires Foncières" && (
         <div className="flex flex-row items-center">
          <img src="/gouvernement.jpg" alt="cellcom" height={90} width={90} className="dark:hidden"/>
          <img src="/darklog-.png"  alt="cellcom" height={90} width={90} className="hidden dark:block"/>
          <img src="/line.png" alt="cellcom" height={11} width={11} className=""/>
        <p className="text-xs md:text-sm font-bold text-left uppercase font-serif">Ministère <br/> des Affaires Foncières</p></div>
      )}
      {post.category === "Sports" && (
         <div className="flex flex-row items-center">
          <img src="/gouvernement.jpg" alt="cellcom" height={90} width={90} className="dark:hidden"/>
          <img src="/darklog-.png"  alt="cellcom" height={90} width={90} className="hidden dark:block"/>
          <img src="/line.png" alt="cellcom" height={11} width={11} className=""/>
        <p className="text-xs md:text-sm font-bold text-left uppercase font-serif">Ministère <br/> des Sports <br/> et Loisirs</p></div>
      )}
      {post.category === "Portefeuille" && (
         <div className="flex flex-row items-center">
          <img src="/gouvernement.jpg" alt="cellcom" height={90} width={90} className="dark:hidden"/>
          <img src="/darklog-.png"  alt="cellcom" height={90} width={90} className="hidden dark:block"/>
          <img src="/line.png" alt="cellcom" height={11} width={11} className=""/>
        <p className="text-xs md:text-sm font-bold text-left uppercase font-serif">Ministère <br/>du Portefeuille</p></div>
      )}
      {post.category === "Genre, Famille et Enfants" && (
         <div className="flex flex-row items-center">
          <img src="/gouvernement.jpg" alt="cellcom" height={90} width={90} className="dark:hidden"/>
          <img src="/darklog-.png"  alt="cellcom" height={90} width={90} className="hidden dark:block"/>
          <img src="/line.png" alt="cellcom" height={11} width={11} className=""/>
        <p className="text-xs md:text-sm font-bold text-left uppercase font-serif">Ministère du Genre, <br/>Famille et Enfants</p></div>
      )}
      {post.category === "Jeunesse" && (
         <div className="flex flex-row items-center">
          <img src="/gouvernement.jpg" alt="cellcom" height={90} width={90} className="dark:hidden"/>
          <img src="/darklog-.png"  alt="cellcom" height={90} width={90} className="hidden dark:block"/>
          <img src="/line.png" alt="cellcom" height={11} width={11} className=""/>
        <p className="text-xs md:text-sm font-bold text-left uppercase font-serif">Ministère de la Jeunesse</p></div>
      )}
      {post.category === "MD Affaires Etrangères:Francophonie et Diaspora Congolaise" && (
         <div className="flex flex-row items-center">
          <img src="/gouvernement.jpg" alt="cellcom" height={90} width={90} className="dark:hidden"/>
          <img src="/darklog-.png"  alt="cellcom" height={90} width={90} className="hidden dark:block"/>
          <img src="/line.png" alt="cellcom" height={11} width={11} className=""/>
        <p className="text-xs md:text-sm font-bold text-left uppercase font-serif">Ministre Délégué <br/> près le Ministre des Affaires Etrangères <br/> en charge de la Francophonie et de la Diaspora Congolaise</p></div>
      )}
      {post.category === "MD Environnement et Développement Durable" && (
         <div className="flex flex-row items-center">
          <img src="/gouvernement.jpg" alt="cellcom" height={90} width={90} className="dark:hidden"/>
          <img src="/darklog-.png"  alt="cellcom" height={90} width={90} className="hidden dark:block"/>
          <img src="/line.png" alt="cellcom" height={11} width={11} className=""/>
        <p className="text-xs md:text-sm font-bold text-left uppercase font-serif">Ministre Délégué <br/> près le Ministre de l’Environnement et Développement Durable <br/> en charge de la Nouvelle Economie du Climat</p></div>
      )}
      {post.category === "MD Urbanisme et Habitat" && (
         <div className="flex flex-row items-center">
          <img src="/gouvernement.jpg" alt="cellcom" height={90} width={90} className="dark:hidden"/>
          <img src="/darklog-.png"  alt="cellcom" height={90} width={90} className="hidden dark:block"/>
          <img src="/line.png" alt="cellcom" height={11} width={11} className=""/>
        <p className="text-xs md:text-sm font-bold text-left uppercase font-serif">Ministre Délégué <br/> près le Ministre de l’Urbanisme et Habitat <br/> en charge de la Politique de la Ville</p></div>
      )}
      {post.category === "MD Affaires Sociales" && (
         <div className="flex flex-row items-center">
          <img src="/gouvernement.jpg" alt="cellcom" height={90} width={90} className="dark:hidden"/>
          <img src="/darklog-.png"  alt="cellcom" height={90} width={90} className="hidden dark:block"/>
          <img src="/line.png" alt="cellcom" height={11} width={11} className=""/>
        <p className="text-xs md:text-sm font-bold text-left uppercase font-serif">Ministre Délégué <br/> près le Ministre des Affaires Sociales <br/> en charge des Personnes vivant avec Handicap</p></div>
      )}
      {post.category === "MD Défense Nationale" && (
         <div className="flex flex-row items-center">
          <img src="/gouvernement.jpg" alt="cellcom" height={90} width={90} className="dark:hidden"/>
          <img src="/darklog-.png"  alt="cellcom" height={90} width={90} className="hidden dark:block"/>
          <img src="/line.png" alt="cellcom" height={11} width={11} className=""/>
        <p className="text-xs md:text-sm font-bold text-left uppercase font-serif">Ministre Délégué <br/> près le Ministre de la Défense Nationale <br/> en Charge des Anciens Combattants</p></div>
      )}
      {post.category === "VM Budget" && (
         <div className="flex flex-row items-center">
          <img src="/gouvernement.jpg" alt="cellcom" height={90} width={90} className="dark:hidden"/>
          <img src="/darklog-.png"  alt="cellcom" height={90} width={90} className="hidden dark:block"/>
          <img src="/line.png" alt="cellcom" height={11} width={11} className=""/>
        <p className="text-xs md:text-sm font-bold text-left uppercase font-serif">Vice-Ministre <br/> du Budget</p></div>
      )}
      {post.category === "VM Intérieur, Sécurité, Décentralisation" && (
         <div className="flex flex-row items-center">
          <img src="/gouvernement.jpg" alt="cellcom" height={90} width={90} className="dark:hidden"/>
          <img src="/darklog-.png"  alt="cellcom" height={90} width={90} className="hidden dark:block"/>
          <img src="/line.png" alt="cellcom" height={11} width={11} className=""/>
        <p className="text-xs md:text-sm font-bold text-left uppercase font-serif">Vice-Ministre de l’Intérieur, <br/> Sécurité, Décentralisation<br/></p></div>
      )}
      {post.category === "VM Affaires Etrangères" && (
         <div className="flex flex-row items-center">
          <img src="/gouvernement.jpg" alt="cellcom" height={90} width={90} className="dark:hidden"/>
          <img src="/darklog-.png"  alt="cellcom" height={90} width={90} className="hidden dark:block"/>
          <img src="/line.png" alt="cellcom" height={11} width={11} className=""/>
        <p className="text-xs md:text-sm font-bold text-left uppercase font-serif">Vice-Ministre <br/> des Affaires Etrangères</p></div>
      )}
      {post.category === "VM Finances" && (
         <div className="flex flex-row items-center">
          <img src="/gouvernement.jpg" alt="cellcom" height={90} width={90} className="dark:hidden"/>
          <img src="/darklog-.png"  alt="cellcom" height={90} width={90} className="hidden dark:block"/>
          <img src="/line.png" alt="cellcom" height={11} width={11} className=""/>
        <p className="text-xs md:text-sm font-bold text-left uppercase font-serif">Vice-Ministre <br/> des Finances</p></div>
      )}
      {post.category === "VM Éducation Nationale" && (
         <div className="flex flex-row items-center">
          <img src="/gouvernement.jpg" alt="cellcom" height={90} width={90} className="dark:hidden"/>
          <img src="/darklog-.png"  alt="cellcom" height={90} width={90} className="hidden dark:block"/>
          <img src="/line.png" alt="cellcom" height={11} width={11} className=""/>
        <p className="text-xs md:text-sm font-bold text-left uppercase font-serif">Vice-Ministre <br/> de l’Éducation Nationale <br/>et Nouvelle Citoyenneté</p></div>
      )}
      {post.category === "VM Affaires Coutumières" && (
         <div className="flex flex-row items-center">
          <img src="/gouvernement.jpg" alt="cellcom" height={90} width={90} className="dark:hidden"/>
          <img src="/darklog-.png"  alt="cellcom" height={90} width={90} className="hidden dark:block"/>
          <img src="/line.png" alt="cellcom" height={11} width={11} className=""/>
        <p className="text-xs md:text-sm font-bold text-left uppercase font-serif">Vice-Ministre <br/> des Affaires <br/> Coutumières</p></div>
      )}
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
    <div ref={contentRef} className={`p-3 max-w-2xl mx-auto w-full post-content ${isExpanded ? 'expanded' : 'clamped'} dark:p-3 dark:max-w-2xl`} dangerouslySetInnerHTML={{__html:post && post.content}}>
    </div>
    {/* <div
  ref={contentRef}
  className={`p-3 max-w-2xl mx-auto w-full ${isExpanded ? 'expanded' : 'clamped'} post-content dark:post-content`}
  dangerouslySetInnerHTML={{ __html: post?.content }}
/> */}
    <div className="mr-56 md:mr-96">
       {showButton && post.content.length > 800 && (
        <button onClick={toggleExpand} className="see-more-btn dark:text-blue-500 text-sm italic">
          {isExpanded ? 'Lire moins' : 'Lire plus'}
        </button> 
      )}
       
    </div>
    <div className="border-t dark:border-gray-600">
      
      {/* {post.numberOfLikes} */}
      <>
       {currentUser ? 
       <LikeButton postId={post._id} initialLikes={post.likes.length} post={post} userId={currentUser?._id} /> : 
       <div className="flex flex-col items-center justify-center">
       <button type='button' 
      //  onClick={() => toast('Vous devez vous connecter pour aimer ou "liker" une publication', {icon:'⚠️', duration:5000})}
          onClick ={() => toast('Vous devez vous connecter pour aimer ou "liker" une publication', {icon:'⚠️', duration:6000}) && setTimeout(()=>{navigate('/sign-in')}, 2000)} 
       className="dark:text-blue-500 text-xs flex flex-row items-center"> <p className="animate-slow-blink">🔔</p>Connectez-vous pour aimer ou "liker" une publication</button>
          <Link className="text-gray-400 p-2 items-center" onClick={()=>handleLikeButton()}>
        <FaThumbsUp />
          </Link>
          {!currentUser && <p className="text-gray-600 pb-2 italic dark:text-white text-sm">Cette publication a été aimée par:{' '}{post.likes.length} {post.likes.length > 1 ? 'internautes' : 'internaute'}</p>}
          </div>
        }
        </>
    </div>
  
    <div className="max-w-4xl mx-auto w-full"> 
        <CallToAction /> 
    </div>
    <CommentSection postId={post._id} /> 
      {/* <div className="flex flex-col justify-center items-center mb-5">  */}
    <div className="flex flex-col justify-left items-left mb-5"> 
      {/* <h1 className="text-xl mt-5">Articles récents</h1> */}
      <h2 className="text-2xl font-semibold text-left">
                  A la une :
                    {/* <div class="h-1 w-24 bg-blue-500"></div> */}
                    {/* <div class="h-1 w-24 bg-gradient-to-r from-blue-500 via-red-500 to-yellow-500"></div> */}
                      {/* <div class="h-1 w-full bg-gradient-to-r from-blue-500 from-33% via-red-500 via-33% via-66% to-yellow-500 to-66%"></div> */}
                      <div class="flex h-0.5 w-24">
  <div class="bg-blue-500 flex-1"></div>
  <div class="bg-red-500 flex-1"></div>
  <div class="bg-yellow-300 flex-1"></div>
</div>
              </h2>
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

