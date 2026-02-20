import { Button, Modal, Table } from 'flowbite-react';
import React, { useEffect, useState } from 'react'
import { FaThumbsUp } from 'react-icons/fa';
import { HiOutlineExclamationCircle } from 'react-icons/hi';
import { useDispatch, useSelector } from 'react-redux'; 
import { Link, useNavigate } from 'react-router-dom';
import { signoutSuccess } from '../redux/user/userSlice';
import toast from 'react-hot-toast';

export default function DashPosts() {
  const { currentUser } = useSelector((state) => state.user);  
  const [userPosts, setUserPosts] = useState([]); 
  const [posts, setPosts] = useState([]); 
  const [showMore, setShowMore ] = useState(true); 
  const [showModal, setShowModal] = useState(false); 
  const [postIdToDelete, setPostIdToDelete] = useState(''); 
  //console.log(userPosts); 
 
  const navigate = useNavigate(); 
  const dispatch = useDispatch(); 

  useEffect (() => {
     const fetchPosts = async () => {
        try {
              // Since this is a get request we don't need to add any method... 
              const res = await fetch(`/api/post/getposts?userId=${currentUser._id}`)
              // here we convert the json file into data 
              const data = await res.json(); 
              // console.log(data); 
              if(res.ok){
                //setUserPosts(data.posts) cfr post.controller.js res.status(200).json({posts, totalPosts,lastMonthPosts,  
                setUserPosts(data.posts); 
                if(data.posts.length < 9){
                  setShowMore(false); 
                }
              }

        } catch(error) {
              console.log(error.message); 
        }
     }; 
     if(currentUser.isAdmin) {
      fetchPosts(); 
     }
   }, [currentUser._id])
   
   const handleShowMore = async () => {
     const startIndex = userPosts.length; 
     try {
        const res = await fetch(`/api/post/getposts?userId=${currentUser._id}&startIndex=${startIndex}`); 
        const data = await res.json(); 
        if(res.ok) {
          setUserPosts((prev) => [...prev, ...data.posts]); 
          if(data.posts.length < 9) {
            setShowMore(false); 
          }
        }
     } catch(error) {
            console.log(error)
     }
   }

   const handleDeletePost = async() => {
    setShowModal(false); 
    try {
        const res = await fetch(
          `/api/post/deletepost/${postIdToDelete}/${currentUser._id}`,
          {
            method: 'DELETE', 
          }
        );
        const data = await res.json(); 
        if(!res.ok) {
          console.log(data.message); 
          if(res.status === 401) {
            // window.alert('Vérification de l’utilisateur connecté en cours... Votre session a expiré. Reconnectez-vous avec une adresse e-mail et un mot de passe valides.')
            // handleSignout();

             toast.error('Vérification de l’utilisateur connecté en cours... Votre session a expiré. Reconnectez-vous sur DRC Gov Social Media avec une adresse e-mail et un mot de passe valides.', {duration:10000})
                handleSignout();
            navigate('/sign-in');
          }
          
        } else { 
          setUserPosts((prev) => 
         prev.filter((post) => post._id !== postIdToDelete)
        ); 
        }

    }catch(error) {
      console.log(error)
    }

   }; 

  //  const handlePostLike = async ({postId}) => {
  //   try {
  //     if(!currentUser) {
  //       navigate('/sign-in'); 
  //       return; 
  //     }
  //     const res = await fetch(`/api/post/likePost/${postId}`, 
  //      {
  //       method: 'PUT', 
  //      }); 
  //      if(res.ok) {
  //       const data = await res.json(); 
  //       setPosts(posts.map((post) => {
  //         post._id === postId ? {
  //           ...post,
  //           likes: data.likes,
  //           numberOfLikes: data.likes.length, 
  //         } : post 
  //       }))
  //      }
  //   }catch(error) {
  //     console.log(error.message); 
  //   }
     
  //  }

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
  return (
    <div className="table-auto overflow-x-scroll md:mx-auto p-3 scrollbar scrollbar-track-slate-100 scrollbar-thumb-slate-300 dark:scrollbar-track-slate-700 dark:scrollbar-thumb-slate-500">
     {currentUser.isAdmin && userPosts.length > 0 ? (
        <>
        <Table hoverable className="shadow-md">
           <Table.Head>
            <Table.HeadCell>date de mise à jour</Table.HeadCell>
            <Table.HeadCell>Image d'article</Table.HeadCell>
            <Table.HeadCell>Titre d'article</Table.HeadCell>
            {/* <Table.HeadCell>Category</Table.HeadCell> */}
            <Table.HeadCell>Categorie</Table.HeadCell>
            <Table.HeadCell>Supprimer</Table.HeadCell>
            {/* <Table.HeadCell>Post Like</Table.HeadCell> */}
            <Table.HeadCell>
              <span>Editer</span>
            </Table.HeadCell>
           </Table.Head>
           {userPosts.map((post) => (
            <Table.Body className="divide-y">
              <Table.Row className="bg-white dark:border-gray-700 dark:bg-gray-800">
                <Table.Cell>
                  {new Date(post.updatedAt).toLocaleDateString(
                    'fr-FR'

                  )}
                </Table.Cell>
                <Table.Cell>
                  <Link to={`/post/${post.slug}`}>
                    <img 
                      src={post.image}
                      alt={post.title}
                      className="w-20 h-10 object-cover bg-gray-500"
                    />
                  </Link>
                </Table.Cell>
                <Table.Cell>
                  <Link className="font-medium text-gray-900 dark:text-white" to={`/post/${post.slug}`}>{post.title}</Link>
                </Table.Cell>
                <Table.Cell>{post.category}</Table.Cell>
                <Table.Cell>
                  <span 
                    onClick={() => {
                      setShowModal(true);   
                      setPostIdToDelete(post._id); 
                    }}
                    className="font-medium text-red-500 hover:underline hover:cursor-pointer">
                   Supprimer
                    </span>
                </Table.Cell>
               {/* <Table.Cell> */}
                  {/* <Link className="text-teal-500 hover:underline" to={`/update-post/${post._id}`}> */}
                  {/* {post.numberOfLikes}
                  <div>
                  <button type="button" className='text-gray-400 hover:text-blue-500' onClick={()=>handlePostLike(post._id)}>
                  <FaThumbsUp className="text-sm"/> 
                  </button>
                  </div> */}
                  {/* </Link> */}
                {/* </Table.Cell> */}
                <Table.Cell>
                  <Link className="text-blue-500 hover:underline" to={`/update-post/${post._id}`}>
                    <span>Editer</span>
                  </Link>
                </Table.Cell>
              </Table.Row>
            </Table.Body>
           ))}
        </Table>
        {
          showMore && 
          // (
          //   <button onClick={handleShowMore} className="w-full text-blue-500 self-center text-sm py-7">
          //     Voir plus

          //   </button>

          // )
          <div className="p-4 flex items-center justify-center">
                      <Button 
                      onClick={handleShowMore} 
                        gradientDuoTone="purpleToBlue" className='rounded-full transition-all duration-1000 dark:!from-green-500 dark:!to-blue-500 dark:text-white-500 text-lg shadow-lg'>
                        Voir plus 
          
                      </Button>
                      </div>
        }
        </>
     ):(<p>Vous n'avez aucune publication d'article pour l'instant</p>)}
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
            <h3 className="mb-5 text-lg text-gray-500 dark:text-gray-400"> 
              Êtes-vous sûr de vouloir supprimer cette publication?
            </h3>
             <div className="flex justify-center gap-4">
              <Button color='failure' onClick={handleDeletePost}>Oui, je suis sûr</Button>
              <Button color='gray' onClick={() => setShowModal(false)}>Non, annuler</Button>
             </div>
          </div>
        </Modal.Body>
      </Modal>

    </div>
  )
}
