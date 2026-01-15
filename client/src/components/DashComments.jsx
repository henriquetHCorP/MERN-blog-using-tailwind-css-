import { Button, Modal, Table } from 'flowbite-react';
import React, { useEffect, useState } from 'react'
import { HiCheck, HiOutlineExclamationCircle } from 'react-icons/hi';
import { useDispatch, useSelector } from 'react-redux'; 
// import { Link } from 'react-router-dom';
import { FaCheck, FaTimes } from 'react-icons/fa'; 
import { useNavigate } from 'react-router-dom';
import { signoutSuccess } from '../redux/user/userSlice';

export default function DashComments() {
  const { currentUser } = useSelector((state) => state.user);  
  
  const [comments, setComments] = useState([]); 
  const [showMore, setShowMore ] = useState(true); 
  const [showModal, setShowModal] = useState(false); 
  const [commentIdToDelete, setCommentIdToDelete] = useState(''); 
  //   console.log(userPosts); 
  //console.log(comments); 
    const dispatch = useDispatch();
    const navigate = useNavigate();  

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
  
  useEffect (() => {
     const fetchComments = async () => {
        try {
              // Since this is a get request we don't need to add any method... 
              const res = await fetch(`/api/comment/getcomments?`)
              // here we convert the json file into data 
              const data = await res.json(); 
              // console.log(data); 
              if(res.ok){
                //setUserPosts(data.posts) cfr post.controller.js res.status(200).json({posts, totalPosts,lastMonthPosts,  
                setComments(data.comments); 
                if(data.comments.length < 9){
                  setShowMore(false); 
                }
              }

              if(res.status === 401){

                 setTimeout(() => {
                    handleSignout();
                  }, 10000); 

                setTimeout(() => {
                 navigate('/sign-in');
                  }, 10001);

                  if(!res.ok){
                    alert('Vérification de l’utilisateur connecté en cours... Votre session a expiré. Reconnectez-vous avec une adresse e-mail et un mot de passe valides.')
                   
                  }
                }

              

        } catch(error) {
              console.log(error.message); 
        }
     }; 
     if(currentUser.isAdmin) {
      fetchComments(); 
     }
   }, [currentUser._id])
   
   const handleShowMore = async () => {
     const startIndex = comments.length; 
     try {
        const res = await fetch(`/api/comment/getcomments?&startIndex=${startIndex}`); 
        const data = await res.json(); 
        if(res.ok) {
          setComments((prev) => [...prev, ...data.comments]); 
          if(data.comments.length < 9) {
            setShowMore(false); 
          }
        }
     } catch(error) {
            console.log(error)
     }
   }

//    const handleDeleteUser = async() => {
//     setShowModal(false); 
//     try {
//         const res = await fetch(
//           `/api/user/deleteuser/${userIdToDelete}/${currentUser._id}`,
//           {
//             method: 'DELETE', 
//           }
//         );
//         const data = await res.json(); 
//         if(!res.ok) {
//           console.log(data.message); 
//         } else { 
//           setUserPosts((prev) => 
//          prev.filter((post) => post._id !== postIdToDelete)
//         ); 
//         }

//     }catch(error) {
//       console.log(error)
//     }

//    }; 
const handleDeleteComment = async() => {
    setShowModal(false); 
    try {
        const res = await fetch(`api/comment/deleteComment/${commentIdToDelete}`, {
            method:'DELETE', 
        }); 
        const data = await res.json(); 
        if(res.ok) {
            setComments((prev) => prev.filter((comment) => comment._id!== commentIdToDelete)); 
            setShowModal(false); 
        } else {
            console.log(data.message); 
        }

    } catch(error) {
        console.log(error.message); 
    }

}
  return (
    <div className="table-auto overflow-x-scroll md:mx-auto p-3 scrollbar scrollbar-track-slate-100 scrollbar-thumb-slate-300 dark:scrollbar-track-slate-700 dark:scrollbar-thumb-slate-500">
     {currentUser.isAdmin && comments.length > 0 ? (
        <>
        <Table hoverable className="shadow-md ">
           <Table.Head>
            <Table.HeadCell>date de mise à jour</Table.HeadCell>
            <Table.HeadCell>Contenu du commentaire</Table.HeadCell>
            <Table.HeadCell>nombre de likes</Table.HeadCell>
            <Table.HeadCell>PostId</Table.HeadCell>
            <Table.HeadCell>UserId</Table.HeadCell>
            {/* <Table.HeadCell>Username</Table.HeadCell> */}
            <Table.HeadCell>Supprimer</Table.HeadCell>
            
           </Table.Head>
           {comments.map((comment) => (
            
            <Table.Body className="divide-y" key={comment._id}>
              <Table.Row className="bg-white dark:border-gray-700 dark:bg-gray-800">
                <Table.Cell>
                  {new Date(comment.updatedAt).toLocaleDateString('fr-FR')}
                </Table.Cell>
                <Table.Cell>
                  {/* <Link to={`/post/${post.slug}`}> */}
                    {/* <img 
                      src={comment.profilePicture}
                      alt={comment.userName}
                      className=" w-10 h-10 object-cover bg-gray-500 rounded-full"
                    /> */}
                    {comment.content}
                  {/* </Link> */}
                </Table.Cell>
                <Table.Cell>
                   {/* <Link className="font-medium text-gray-900 dark:text-white" to={`/post/${post.slug}`}> */}
                  {comment.numberOfLikes}
                  
                {/* </Link>  */}
                </Table.Cell>
                <Table.Cell>{comment.postId}</Table.Cell>
                {/* my idea was to handle this way : <Table.Cell>{user.isAdmin ? (<HiCheck />): (<span>No</span>)}</Table.Cell> */}
                <Table.Cell>
                    {/* {user.isAdmin ? (<FaCheck className="text-green-500"/>) : (<FaTimes className="text-red-500"/>)} */}
                    {comment.userId}
                    </Table.Cell>
                    {/* <Table.Cell>
                      {comment.username}
                    </Table.Cell> */}
                <Table.Cell>
                  <span 
                    onClick={() => {
                      setShowModal(true);   
                      setCommentIdToDelete(comment._id); 
                    }}
                    className="font-medium text-red-500 hover:underline">
                    Supprimer
                    </span>
                </Table.Cell>
                {/* <Table.Cell>
                  <Link className="text-teal-500 hover:underline" to={`/update-post/${post._id}`}>
                    <span>Edit</span>
                  </Link>
                </Table.Cell> */}
              </Table.Row>
            </Table.Body>
           ))}
        </Table>
        {
          showMore && (
            <button onClick={handleShowMore} className="w-full text-teal-500 self-center text-sm py-7">
              Voir plus 

            </button>

          )
        }
        </>
     ):(<p>Vous n'avez pas encore de commentaires</p>)}
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
            <h3 className="mb-5 text-lg text-gray-500 dark:text-gray-400"> Êtes-vous sûr de vouloir effacer ce commentaire?
            </h3>
             <div className="flex justify-center gap-4">
              <Button color='failure' onClick={handleDeleteComment}>Oui, je suis sûr </Button>
              <Button color='gray' onClick={() => setShowModal(false)}>Non, annuler </Button>
             </div>
          </div>
        </Modal.Body>
      </Modal>

    </div>
  )
}
