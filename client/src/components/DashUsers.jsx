import { Button, Modal, Table } from 'flowbite-react';
import React, { useEffect, useState } from 'react'
import { HiCheck, HiOutlineExclamationCircle } from 'react-icons/hi';
import { useDispatch, useSelector } from 'react-redux'; 
// import { Link } from 'react-router-dom';
import { FaCheck, FaTimes } from 'react-icons/fa'; 
import { useNavigate } from 'react-router-dom';
import { signoutSuccess } from '../redux/user/userSlice';

export default function DashUsers() {
  const { currentUser } = useSelector((state) => state.user);  
  const [users, setUsers] = useState([]); 
  const [showMore, setShowMore ] = useState(true); 
  const [showModal, setShowModal] = useState(false); 
  const [userIdToDelete, setUserIdToDelete] = useState(''); 
//   console.log(userPosts); 

  const navigate = useNavigate(); 
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

  useEffect (() => {
     const fetchUsers = async () => {
        try {
              // Since this is a get request we don't need to add any method... 
              const res = await fetch(`/api/user/getusers?`)
              // here we convert the json file into data 
              const data = await res.json(); 
              // console.log(data); 
              
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


              if(res.ok){
                //setUserPosts(data.posts) cfr post.controller.js res.status(200).json({posts, totalPosts,lastMonthPosts,  
                setUsers(data.users); 
                
                if(data.users.length < 9){
                  setShowMore(false); 
                }
              }

        } catch(error) {
              console.log(error.message); 
        }
     }; 
     if(currentUser.isAdmin) {
      fetchUsers(); 
     }
   }, [currentUser._id])
   
   const handleShowMore = async () => {
     const startIndex = users.length; 
     try {
        const res = await fetch(`/api/user/getusers?&startIndex=${startIndex}`); 
        const data = await res.json(); 
        if(res.ok) {
          setUsers((prev) => [...prev, ...data.users]); 
          if(data.users.length < 9) {
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
const handleDeleteUser = async() => {
    try {
        const res = await fetch(`api/user/delete/${userIdToDelete}`, {
            method:'DELETE', 
        }); 
        const data = await res.json(); 
        if(res.ok) {
            setUsers((prev) => prev.filter((user) => user._id!== userIdToDelete)); 
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
     {currentUser.isAdmin && users.length > 0 ? (
        <>
        <Table hoverable className="shadow-md ">
           <Table.Head>
            <Table.HeadCell>Date de creation</Table.HeadCell>
            <Table.HeadCell>Image d'utilisateur</Table.HeadCell>
            <Table.HeadCell>Nom d'utilisateur</Table.HeadCell>
            <Table.HeadCell>E-mail</Table.HeadCell>
            <Table.HeadCell>CellCom</Table.HeadCell>
            <Table.HeadCell>Supprimer</Table.HeadCell>
            
           </Table.Head>
           {users.map((user) => (
            <Table.Body className="divide-y" key={user._id}>
              <Table.Row className="bg-white dark:border-gray-700 dark:bg-gray-800">
                <Table.Cell>
                  {new Date(user.createdAt).toLocaleDateString('fr-FR')}
                </Table.Cell>
                <Table.Cell>
                  {/* <Link to={`/post/${post.slug}`}> */}
                    <img 
                      src={user.profilePicture}
                      alt={user.userName}
                      className=" w-10 h-10 object-cover bg-gray-500 rounded-full"
                    />
                  {/* </Link> */}
                </Table.Cell>
                <Table.Cell>
                   {/* <Link className="font-medium text-gray-900 dark:text-white" to={`/post/${post.slug}`}> */}
                  {user.username}
                  
                {/* </Link>  */}
                </Table.Cell>
                <Table.Cell>{user.email}</Table.Cell>
                {/* my idea was to handle this way : <Table.Cell>{user.isAdmin ? (<HiCheck />): (<span>No</span>)}</Table.Cell> */}
                <Table.Cell>{user.isAdmin ? (<FaCheck className="text-green-500"/>) : (<FaTimes className="text-red-500"/>)}</Table.Cell>
                <Table.Cell>
                  <span 
                    onClick={() => {
                      setShowModal(true);   
                      setUserIdToDelete(user._id); 
                    }}
                    // className="font-medium text-red-500 hover:underline">
                    className="font-medium text-red-500 hover:underline hover:cursor-pointer">
                    {/* Delete */}
                    {user.isAdmin? null : "Supprimer"}
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
     ):(<p>Vous n'avez pas encore d'utilisateurs</p>)}
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
            <h3 className="mb-5 text-lg text-gray-500 dark:text-gray-400"> Êtes-vous sûr de vouloir supprimer cet utilisateur?</h3>
             <div className="flex justify-center gap-4">
              <Button color='failure' onClick={handleDeleteUser}>Oui, je suis sûr</Button>
              <Button color='gray' onClick={() => setShowModal(false)}>Non, annuler</Button>
             </div>
          </div>
        </Modal.Body>
      </Modal>

    </div>
  )
}
