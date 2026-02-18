import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { FaHeart, FaRegHeart, FaThumbsUp } from 'react-icons/fa';
import { useDispatch, useSelector } from 'react-redux';
import { signoutSuccess } from '../redux/user/userSlice';


const LikeButton = ({ postId, initialLikes, post}) => {
    const {currentUser} = useSelector((state) => (state.user));
  const [likes, setLikes] = useState(initialLikes);
  const [isLiked, setIsLiked] = useState(false); // Track if user has liked during this session
  const [loading, setLoading] = useState(false); 

  const dispatch = useDispatch(); 
    

    const handleSignout = async () => {
        
            try {
                const res = await fetch('/api/user/signout', {
                    method: 'POST', 
                });
                const data = await res.json(); 
                if(!res.ok) {
                    console.log(data.message); 
                } else {
                    dispatch(signoutSuccess()); 
                }
            } catch(error) {
                console.log(error.message); 
            }
        }; 
  
     const userId = currentUser._id; 
    //  console.log("user id:", userId); 

  const handleLikeClick = async () => {
        
        
    try {
        localStorage.setItem('isLiked:', JSON.stringify(isLiked)); 
        localStorage.setItem('currentUser._id:', JSON.stringify(currentUser._id)); 
        setIsLiked(!isLiked); 
        setLoading(true); 
      // Send a POST request to your backend API endpoint
      const response = await axios.put(`/api/post/${postId}/like`,{userId});

      // Update the local state with the new like count from the server response
      if(response.ok){
        setLoading(false); 
      }
      setLikes(response.data.newLikesCount);
      
      //window.location.reload(); 
      setIsLiked(true);
      
      
      // console.log('response:', response); 
    } catch (error) {
       if (error.status === 401) {

                alert('Vérification de l’utilisateur connecté en cours... Votre session a expiré. Reconnectez-vous avec une adresse e-mail et un mot de passe valides.')
                
                 await handleSignout();
                
        console.error('Session expired or unauthorized. Redirecting to sign-in page.');
        // Log the user out (clear any local storage/cookies)
        localStorage.removeItem('userToken'); // Example of clearing a token
        // Redirect to the sign-in page
        window.location.href = '/sign-in'; // Replace '/signin' with your actual sign-in route
       
        return; // Stop further processing
    }
      console.error("Error liking the post:", error);
      // Optional: show an error message to the user
      
    } finally {
        setIsLiked(!isLiked); 
    }
    
  };
  return (
    <div className="flex items-center p-1 gap-1">
       {/* <button  type='button' onClick={()=> handleLikeClick()} className={`text-gray-400 hover:text-blue-500 ${currentUser && post.likes.includes(currentUser._id) && '!text-blue-500'}`}> */}
                          
      <button  type='button' onClick={()=> handleLikeClick()}>
        {/* {(isLiked || post.likes.includes(currentUser._id)) ? <FaThumbsUp className="text-blue-700 text-2xl hover:text-2xl"/> : <FaThumbsUp className="text-gray-400 text-xl hover:text-2xl hover:text-blue-700" />}  */}
             {(isLiked || post.likes.includes(currentUser._id)) ? <FaThumbsUp className="text-blue-700 text-2xl hover:text-2xl"/> : <FaThumbsUp className="text-gray-400 text-2xl hover:text-2xl hover:text-blue-700" />}          
          
         


         {/* <FaThumbsUp  className="text-md"/>   */}
        {/* { isLiked ? <FaThumbsUp className="text-blue-500" /> : <FaThumbsUp className={`text-gray-400 hover:text-blue-500 ${currentUser && post.likes.includes(currentUser._id) && '!text-blue-500'}`}/>} */}
         {/* <FaThumbsUp className={`text-gray-400 hover:text-blue-500 ${currentUser && post.likes.includes(currentUser._id) && '!text-blue-500'}`} />  */}
        {/* {isLiked ? 'Liked' : 'Like'}  */}
        {/* {isLiked? <FaHeart color="red" /> : <FaRegHeart color="gray" />} */}
      </button>
      
      <span>

        {
                    likes > 0 && likes + " " +( likes === 1 ? "like" : "likes")
                  }
      </span>
    </div>
  );
};

export default LikeButton;
