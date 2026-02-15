import { Alert, Button, Modal, Textarea } from 'flowbite-react';
import React, { useEffect, useState } from 'react'
import { useSelector, useDispatch } from 'react-redux'; 
import { Link, useNavigate, useLocation } from 'react-router-dom';
import Comment from './Comment';
import { HiOutlineExclamationCircle } from 'react-icons/hi';
import { signoutSuccess } from '../redux/user/userSlice';

import { BsFillSendFill } from 'react-icons/bs'
import { BsSend } from 'react-icons/bs'


export default function CommentSection({postId}) {
    const {currentUser} = useSelector((state) => state.user); 
    const [comment, setComment] = useState(''); 
    const [commentError, setCommentError] = useState(null); 
    const [comments, setComments] = useState([]); 
    const [showModal, setShowModal] = useState(false); 
    const [commentToDelete, setCommentToDelete] = useState(null); 

    const [posts, setPosts] = useState('' || null); 

    const navigate = useNavigate(); 
    const location = useLocation(); 
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

    // console.log(comments); 

    const handleSubmit = async (e) => {
        e.preventDefault(); 
        if(comment.length > 200) {
            return
        };

        const urlPattern = /(https?:\/\/(?:www\.|(?!www))[a-zA-Z0-9][a-zA-Z0-9-]+[a-zA-Z0-9]\.[^\s]{2,}|www\.[a-zA-Z0-9][a-zA-Z0-9-]+[a-zA-Z0-9]\.[^\s]{2,}|https?:\/\/[a-zA-Z0-9]+\.[^\s]{2,}|[a-zA-Z0-9]+\.[^\s]{2,})/gi;
        
        //const commentWithoutSpaces = comment.replace(/\s/g, '');

        if (comment.includes('..')){
                setCommentError(' Les commentaires ne doivent pas contenir de points successifs.')
                return; 
            }

        if (urlPattern.test(comment)) {
      setCommentError('Les commentaires ne doivent pas contenir de liens.');
      return; // Stop the submission
    }
      try {
        const res = await fetch('/api/comment/create', {
            method: 'POST', 
            headers: {
                'Content-Type': 'application/json', 
            }, 
            body: JSON.stringify({content: comment, postId, userId: currentUser._id}), 
          });
          const data = await res.json(); 
          if(res.ok){
            setComment(''); 
            setCommentError(null); 
            setComments([data, ...comments]);     
              }

              if(res.status === 401) {
               
                 setTimeout(() => {
                 navigate('/sign-in');
                  }, 10000);

                  setTimeout(() => {
                    handleSignout();
                  }, 10001); 
                    
                   // Example of clearing a token
        // Redirect to the sign-in page
        // window.location.href = '/sign-in'; // Replace '/signin' with your actual sign-in route
        

            }  

               if(res.status === 500) {
                 throw new Error ("Insérer un commentaire au format valide et réessayer")
               }

               if(res.status === 401) {
                  throw new Error('Vérification de l’utilisateur connecté en cours... Votre session a expiré. Reconnectez-vous avec une adresse e-mail et un mot de passe valides.')
               }
              if(!res.ok){
                // handleSignout() && 
                // return (
                //     <Alert color="failure" className="mt-5">
                //     VOTRE SESSION A EXPIRE
                //       {commentError}
                // </Alert>
                //  ) &&
                //  navigate('/sign-in');
                  
                throw new Error('une erreur est survenue. Veuillez vous déconnecter et réessayer ultérieurement')
                // await handleSignout()
                //    navigate('/sign-in');
                 
// setTimeout(() => {
// navigate('/sign-in');
//  }, 5000);

                }
                 
             
                
      
      } catch(error){
        setCommentError(error.message); 
        
        
      }
      
    }; 

    useEffect(() => {
        const getComments = async () => {
            try {
                // api/comment from index.js and then getPostComments/:postId from the comment.route 
                const res = await fetch(`/api/comment/getPostComments/${postId}`); 
                if (res.ok){
                    const data = await res.json(); 
                    setComments(data); 
                }
                
            } catch(error){
                console.log(error.message)
            }
        }
      getComments(); 
    }, [postId]); 
    const handleLike = async (commentId) => {
       try {
            if(!currentUser) {
                navigate('/sign-in');
                return;  
            }
            const res = await fetch(`/api/comment/likeComment/${commentId}`, {
                method:'PUT', 
                // nothing else like the content type ... because we get the id of the user through commentId
            }); 
            //console.log("reponse:", comment.numberOfLikes); 
              
            if (res.status === 401) {

                alert('Vérification de l’utilisateur connecté en cours... Votre session a expiré. Reconnectez-vous avec une adresse e-mail et un mot de passe valides.')
                
                 await handleSignout();
                
        console.error('Session expired or unauthorized. Redirecting to sign-in page.');
        // Log the user out (clear any local storage/cookies)
        localStorage.removeItem('userToken'); // Example of clearing a token
        // Redirect to the sign-in page
        window.location.href = '/sign-in'; // Replace '/signin' with your actual sign-in route
       
        return; // Stop further processing
    }
    if (!res.ok) {
        throw new Error(`HTTP error! status: ${res.status}`);
    }

            if(res.ok){
                const data = await res.json(); 
                setComments(comments.map((comment) => 
                    comment._id === commentId ? {
                        ...comment, 
                        likes: data.likes, 
                        numberOfLikes:data.likes.length, 
                    } 
                    : comment

                    
            )
        );
    }
       }catch(error) {
        console.log(error.message)
        
       }
       
    };
     
    const handleEdit = async(comment, editedContent) => {
        
        const urlPattern = /(https?:\/\/(?:www\.|(?!www))[a-zA-Z0-9][a-zA-Z0-9-]+[a-zA-Z0-9]\.[^\s]{2,}|www\.[a-zA-Z0-9][a-zA-Z0-9-]+[a-zA-Z0-9]\.[^\s]{2,}|https?:\/\/[a-zA-Z0-9]+\.[^\s]{2,}|[a-zA-Z0-9]+\.[^\s]{2,})/gi;
        
        //const commentWithoutSpaces = comment.replace(/\s/g, '');

        if (urlPattern.test(editedContent)) {
      alert('Les commentaires modifiés ne doivent pas contenir de liens.');
      return;
        }
           setComments(
            comments.map((c) =>
            c._id === comment._id ? {...c, content: editedContent } : c )
        )
        
   
    }; 
 
     
  
//     const handleEdit = async (comment, editedContent) => {
        

//         const urlPattern = /(https?:\/\/(?:www\.|(?!www))[a-zA-Z0-9][a-zA-Z0-9-]+[a-zA-Z0-9]\.[^\s]{2,}|www\.[a-zA-Z0-9][a-zA-Z0-9-]+[a-zA-Z0-9]\.[^\s]{2,}|https?:\/\/[a-zA-Z0-9]+\.[^\s]{2,}|[a-zA-Z0-9]+\.[^\s]{2,})/gi;
        
//         //const commentWithoutSpaces = comment.replace(/\s/g, '');

        

//         if (urlPattern.test(comment)) {
//       setCommentError('Links are not allowed in comments.');
//       return; // Stop the submission
//     }
//         if (urlPattern.test(editedContent)) {
//       setCommentError('Links are not allowed in correcting comments.');
//       return; // Stop the submission
//     }

//     if(!urlPattern.test(editedContent)) {
//   try {
//     // 1. Send the update request to the server
//     const response = await fetch(`/api/comment/editComment/${comment._id}`, { // Replace with your actual API endpoint
//       method: 'PUT', // Or 'PATCH', depending on your API
//       headers: {
//         'Content-Type': 'application/json',
//         // Include your authorization token here, e.g.:
        
//       },
//       body: JSON.stringify({ content: editedContent }),
//     });

//     // 2. Check the response status
    
//       if (response.status === 401) {
//         // Handle 401 Unauthorized error
//         // console.error("401 Unauthorized: User not authenticated or session expired.");
//         //   throw new Error(response.message); 
//           alert(response.message); 
//         setTimeout(() => {
//                  navigate('/sign-in');
//                   }, 10000);

//                   setTimeout(() => {
//                     handleSignout();
//                   }, 10001); 

//                   alert('try')
      
//         // **ACTION:** Redirect to login page, prompt for re-authentication, or refresh token
//         // Example: window.location.href = '/login'; 
//         return; // Stop further execution
//       }
      

//     // 3. Process successful response
//     // Optional: get the updated data from the server response if needed
//     // const updatedComment = await response.json(); 

//     // 4. Update the local state only if the server update was successful
//     setComments(
//       comments.map((c) =>
//         c._id === comment._id ? { ...c, content: editedContent } : c
//       )
//     );

//   } catch (error) {
//     // 5. Handle network errors or errors thrown in the try block
//     console.error("Error updating comment:", error.message );
//     // Display a user-friendly message (e.g., "Failed to update comment")
//   }
// };
//     }

    const handleDelete= async (commentId) => {
        setShowModal(false); 
        try {
             if(!currentUser) {
                navigate('/sign-in'); 
                return ; 
             }
             const res = await fetch(`/api/comment/deleteComment/${commentId}`, {
                method: 'DELETE', 
             }); 
             if (res.ok) {
                const data = await res.json(); 
                // comments.map((comment) => {
                //     if(comment._id === commentId) {
                    // filter is similar to map; 
                         setComments(comments.filter((comment) => comment._id !== commentId))
                    }
                // })
            //  }

            if (res.status === 401) {
                 alert('Vérification de l’utilisateur connecté en cours... Votre session a expiré. Reconnectez-vous avec une adresse e-mail et un mot de passe valides.')
                 await handleSignout();
                
        console.error('Session expired or unauthorized. Redirecting to sign-in page.');
        // Log the user out (clear any local storage/cookies)
        localStorage.removeItem('userToken'); // Example of clearing a token
        // Redirect to the sign-in page
        window.location.href = '/sign-in'; // Replace '/signin' with your actual sign-in route
       
        return; // Stop further processing
    }
        }catch(error){

        }
    }; 

    // const handlePostLike = async (postId) => {
    //     try {
    //         if(!currentUser) {
    //             navigate('/sign-in'); 
    //             return; 
    //         }
    //         const res = await fetch(`/api/post/likePost/${postId}`, {
    //             method: 'PUT', 
    //         });
    //         if(res.ok) {
    //             const data = await res.json(); 
    //             setPosts(posts.map((post) => {
    //                 post._id === postId ? {
    //                     ...post, 
    //                     likes: data.likes, 
    //                     numberOfLikes: data.likes.length, 
    //                 }: post 
    //             }))
    //         }

    //     }catch(error) {

    //     }
    // }

     const handlePaste = async () => {
    try {
      const textFromClipboard = await navigator.clipboard.readText();
      // Appending the pasted text to existing comment
      setComment((prev) => prev + '@' + textFromClipboard + ' , ');
    } catch (err) {
      console.error("Failed to read clipboard!", err);
      alert("Veuillez autoriser le presse-papiers à coller.");
    }
  };

    
  return (
      <div className="max-w-2xl mx-auto w-full p-3">
        {currentUser ? 
        (
            <div className="flex items-center gap-1 my-5 text-gray-500">
                <p>Connecté en tant que :</p>
                <img className="h-10 w-10 object-cover rounded-full cursor-pointer" src={currentUser.profilePicture} onClick={() => navigate(`/user/${currentUser._id}`)}/>
                <Link 
                  to={'/dashboard?tab=profile'}
                //   className="text-xs text-cyan-600 hover:underline" 
                  className="text-xs text-blue-500 hover:underline" 
                >
                  @{currentUser.username}
                </Link> 
            </div>
        ) : (
            <div className="text-sm text-blue-500 my-5 flex gap-1">
                Vous devez être connecté pour commenter.
                <Link className="text-blue-500 hover:underline" to ={'/sign-in'}>
                    Se connecter 
                </Link>
            </div>
        )}
        {currentUser && (
            <form onSubmit={handleSubmit} className="border border-blue-500 rounded-md p-3">
                <Textarea
                  placeholder='Ajouter un commentaire...'
                  rows='3'
                  maxLength='200'
                  onChange={(e) => setComment(e.target.value)}
                  value={comment}
                  onDoubleClick={handlePaste}
                   
                /> 
                <div className=" flex justify-between items-center mt-5">
                    <p className="text-gray-500 text-xs">{200-comment.length} caractères restants</p>
                    <Button 
                       outline
                       gradientDuoTone='purpleToBlue'
                       type='submit'
                       disabled={ comment === ""  || comment.trim() === "" || comment.includes('AFC') || comment.includes('M23') || comment.includes('Afc') || comment.includes('afc') || comment.includes('M23') || comment.includes('m23') || comment.includes('M 2 3') || comment.includes('m 2 3') || comment.includes('KAGAME') || comment.includes('Kagame') || comment.includes('kagame') || comment.includes('NANGA') || comment.includes('Nanga') || comment.includes('NANGAA') || comment.includes('Nangaa') || comment.includes('nanga') || comment.includes('Willy Ngoma') || comment.includes('VISIT RWANDA') || comment.includes('Visit Rwanda') || comment.includes('Alliance Fleuve Congo') || comment.includes('alliance fleuve congo') || comment.includes('Alliance Fleuve Congo') || comment.includes('ALLIANCE FLEUVE CONGO') || comment.includes('M-23') || comment.includes('M/23') || comment.includes('m-23') || comment.includes('m/ 2 3') || comment.includes('M/ 2 3') || comment.includes('m/23') || comment.includes('Alliance fleuve congo') || comment.includes('Alliance Fleuve congo') || comment === ""  || comment.trim() === "" || comment.replace(/\s/g, '').toLowerCase().includes('afc') || comment.replace(/\s/g, '').toLowerCase().includes('m23') || comment.replace(/\s/g, '').toLowerCase().includes('kagame') || comment.replace(/\s/g, '').toLowerCase().includes('nanga') || comment.replace(/\s/g, '').toLowerCase().includes('nangaa') || comment. replace(/\s/g, '').toLowerCase().includes('willyngoma') || comment.replace(/\s/g, '').toLowerCase().includes('visitrwanda') || comment.replace(/\s/g, '').toLowerCase().includes('alliancefleuvecongo') || comment.replace(/\s/g, '').toLowerCase().includes('m-23') || comment.replace(/\s/g, '').toLowerCase().includes('m/23') || comment.replace(/[\s-_%@#$%^&*/\\.]/g, '').toLowerCase().includes('nanga') || comment.replace(/[\s-_%@#$%^&*/\\]/g, '').toLowerCase().includes('corneillen.') || comment.replace(/[\s-_%@#$%^&*/\\.]/g, '').toLowerCase().includes('afc') || comment.replace(/[\s-_%@#$%^&*/\\.]/g, '').toLowerCase().includes('m23') || comment.replace(/[\s-_%@#$%^&*/\\.]/g, '').toLowerCase().includes('alliancefleuvecongo') || comment.replace(/[\s-_%@#$%^&*/\\.]/g, '').toLowerCase().includes('kagame') || comment.replace(/[\s-_%@#$%^&*/\\.]/g, '').toLowerCase().includes('willyngoma') || comment.replace(/[\s-_%@#$%^&*/\\.]/g, '').toLowerCase().includes('visitrwanda') }
                       iconOnly
                      
                       >
                       { comment === ""  || comment.trim() === "" || comment.includes('AFC') || comment.includes('M23') || comment.includes('Afc') || comment.includes('afc') || comment.includes('M23') || comment.includes('m23') || comment.includes('M 2 3') || comment.includes('m 2 3') || comment.includes('KAGAME') || comment.includes('Kagame') || comment.includes('kagame') || comment.includes('NANGA') || comment.includes('Nanga') || comment.includes('NANGAA') || comment.includes('Nangaa') || comment.includes('nanga') || comment.includes('Willy Ngoma') || comment.includes('VISIT RWANDA') || comment.includes('Visit Rwanda') || comment.includes('Alliance Fleuve Congo') || comment.includes('alliance fleuve congo') || comment.includes('Alliance Fleuve Congo') || comment.includes('ALLIANCE FLEUVE CONGO') || comment.includes('M-23') || comment.includes('M/23') || comment.includes('m-23') || comment.includes('m/ 2 3') || comment.includes('M/ 2 3') || comment.includes('m/23') || comment.includes('Alliance fleuve congo') || comment.includes('Alliance Fleuve congo') || comment === ""  || comment.trim() === "" || comment.replace(/\s/g, '').toLowerCase().includes('afc') || comment.replace(/\s/g, '').toLowerCase().includes('m23') || comment.replace(/\s/g, '').toLowerCase().includes('kagame') || comment.replace(/\s/g, '').toLowerCase().includes('nanga') || comment.replace(/\s/g, '').toLowerCase().includes('nangaa') || comment. replace(/\s/g, '').toLowerCase().includes('willyngoma') || comment.replace(/\s/g, '').toLowerCase().includes('visitrwanda') || comment.replace(/\s/g, '').toLowerCase().includes('alliancefleuvecongo') || comment.replace(/\s/g, '').toLowerCase().includes('m-23') || comment.replace(/\s/g, '').toLowerCase().includes('m/23') || comment.replace(/[\s-_%@#$%^&*/\\.]/g, '').toLowerCase().includes('nanga') || comment.replace(/[\s-_%@#$%^&*/\\]/g, '').toLowerCase().includes('corneillen.')|| comment.replace(/[\s-_%@#$%^&*/\\]/g, '').toLowerCase().includes('afc') || comment.replace(/[\s-_%@#$%^&*/\\.]/g, '').toLowerCase().includes('m23') || comment.replace(/[\s-_%@#$%^&*/\\.]/g, '').toLowerCase().includes('alliancefleuvecongo') || comment.replace(/[\s-_%@#$%^&*/\\.]/g, '').toLowerCase().includes('kagame') || comment.replace(/[\s-_%@#$%^&*/\\.]/g, '').toLowerCase().includes('willyngoma') || comment.replace(/[\s-_%@#$%^&*/\\.]/g, '').toLowerCase().includes('visitrwanda') ? <BsSend color="gray" className='h-5 w-5' /> : <BsFillSendFill color="blue" className='h-5 w-5' />}
                        
                        
                    </Button>

                </div>
                {commentError && <Alert color="failure" className="mt-5">
                    {commentError}

                </Alert>}
                
            </form>
        )}
        {comments.length === 0 ? (
            <p className="text-sm my-5">Pas encore de commentaire!</p>
        ) : (
            <>
            <div className="tex-sm my-5 flex items-center gap-1">
                <p>Commentaires</p>
                <div className="border border-gray-400 py-1 px-2 rounded-sm">
                    <p>{comments.length}</p>
                </div>
            </div>
            {comments.map((comment) => (
                <Comment 
                    key={comment._id} 
                    
                    comment={comment} 
                    onLike={handleLike} 
                    // onPostLike={handlePostLike}
                    onEdit={handleEdit} 
                    onDelete={(commentId) => {
                           setShowModal(true) 
                           setCommentToDelete(commentId)
                    }}/>

            ))}
            </>
        )}
        <Modal
        show={showModal}
        onClose={() => setShowModal(false)}
        popup
        size='md'
      >
        <Modal.Header />
        <Modal.Body>
          <div className="text-center">
            <HiOutlineExclamationCircle className="h-14 w-14 text-gray-400 dark:text-gray-200 mb-4 mx-auto" />
            <h3 className="mb-5 text-lg text-gray-500 dark:text-gray-400"> Êtes-vous sûr de vouloir effacer ce commentaire ?
            </h3>
             <div className="flex justify-center gap-4">
              <Button color='failure' onClick={() => handleDelete(commentToDelete)}>Oui, je suis sûr</Button>
              <Button color='gray' onClick={() => setShowModal(false)}>Non, annuler </Button>
             </div>
          </div>
        </Modal.Body>
      </Modal>

      </div>

  )
}
