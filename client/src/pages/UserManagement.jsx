import React, { useEffect, useMemo, useState } from 'react';
import axios from 'axios';
import {Button, Label, Modal, Table, TextInput, ToggleSwitch} from 'flowbite-react'
import { useNavigate } from 'react-router-dom';
import { FaCheck, FaUser, FaUserCircle } from 'react-icons/fa';
import { HiOutlineExclamationCircle, HiOutlineUser } from 'react-icons/hi';
import { AiOutlineSearch } from 'react-icons/ai';
import { CiUser } from "react-icons/ci";
import toast from 'react-hot-toast';
import { signoutSuccess } from '../redux/user/userSlice';
import { useDispatch } from 'react-redux';
function UserManagement() {
    const [users, setUsers] = useState([]);
     const [showMore, setShowMore ] = useState(true); 
     const navigate = useNavigate(); 
     const dispatch = useDispatch(); 

     const [loading, setLoading] = useState(false); 

     const [selectedImage, setSelectedImage] = useState(null);

     const [showModal, setShowModal] = useState(false); 
       const [userIdToDelete, setUserIdToDelete] = useState(''); 

       const [openModal, setOpenModal] = useState(false);
  const [userToToggle, setUserToToggle] = useState(null);

  const handleToggleClick = (user) => {
    setUserToToggle(user);
    setOpenModal(true);
  };

    // Fetch users from backend
    useEffect(() => {
        // const fetchUsers = async () => {
        //     const { data } = await axios.get('/api/getusers');
        //     setUsers(data);
        // };
        // fetchUsers();
        const fetchUsers = async () => {
            try {
              setLoading(true); 
            const res = await fetch('/api/user/getusers?limit=999999999999999999')
            const data = await res.json()
            if(res.ok) {
                  setUsers(data.users)
                  setLoading(false); 
            }
            if(res.status === 401){
              setLoading(false); 
               toast.error('Vérification de l’utilisateur connecté en cours... Votre session a expiré. Reconnectez-vous sur DRC Gov Social Media avec une adresse e-mail et un mot de passe valides.', {duration:10000})
                 await handleSignout();
                 setTimeout(() => {
      window.location.href = '/sign-in';
    }, 10000)
            }
            if(data.users.length < 9){
              setLoading(false)
                  setShowMore(false); 
                }

                if(data.users.length > 10 ) {
                  setLoading(false);
                    setShowMore(false); 
                }
             //console.log('users:', users)

    
           }catch(error) {
         console.log(error.message)
         setLoading(false); 
       }
        }
        fetchUsers();
    }, []);
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

    

    // Toggle Admin handler
    const toggleAdmin = async (userId) => {
        try {
            const { data } = await axios.put(`/api/user/${userId}/toggle-admin`);
            // Update UI
            setUsers(users.map(user => user._id === userId ? data.user : user));
            
        } catch (error) {
            console.error(error);
        }
    setOpenModal(false);
    };
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

const [searchTerm, setSearchTerm] = useState('');
const handleSearch = (event) => {
  setSearchTerm(event.target.value);
};
const filteredData = useMemo(() => {
    return users.filter((user) =>
      Object.values(user).some((val) =>
        String(val).toLowerCase().includes(searchTerm.toLowerCase())
      )
    );
  }, [searchTerm, users]);
 // console.log("resultfound:",filteredData.length)
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
   window.history.replaceState(null, '', '/')
   
    return (
        <div className="table-auto overflow-x-scroll md:mx-auto p-3 scrollbar scrollbar-track-slate-100 scrollbar-thumb-slate-300 dark:scrollbar-track-slate-700 dark:scrollbar-thumb-slate-500">
            {/* <h1>Gestionnaire des utilisateurs</h1>  */}
            {/* <div className="flex flex-col">
            <div className="font-sans text-xs uppercase shadow-md">
                Nombre total d'utilisateurs: {users.length}
                </div>
            <div className="font-sans text-xs uppercase">
                Nombre total des membres des CellCom: {users.filter(user => user.isAdmin).length}</div>
            </div> */}



            <div className="grid grid-cols-1 gap-4 md:grid-cols-2 p-4">
  {/* Total Users Card */}
  <div className="flex items-center p-6 bg-white dark:bg-slate-800 rounded-lg shadow-md border border-gray-100 dark:border-slate-800">
    <div className="p-3 mr-4 text-white bg-blue-600 dark:bg-blue-500 rounded-full">
      <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 4.354a4 4 0 110 5.292M15 21H3v-1a6 6 0 0112 0v1zm0 0h6v-1a6 6 0 00-9-5.196M13 7a4 4 0 11-8 0 4 4 0 018 0z"></path>
      </svg>
    </div>
    <div>
      <p className="text-sm font-medium text-gray-600 dark:text-white uppercase">Total utilisateurs</p>
      <p className="text-2xl font-semibold text-gray-900 dark:text-white">{users.length}</p>
    </div>
  </div>

  {/* Admin Users Card */}
  <div className="flex items-center p-6 bg-white dark:bg-slate-800 rounded-lg shadow-md border border-gray-100 dark:border-slate-800">
    <div className="p-3 mr-4 text-white bg-green-600 dark:bg-green-500 rounded-full">
      <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z"></path>
      </svg>
    </div>
    <div>
      <p className="text-sm font-medium text-gray-600 dark:text-white uppercase">Total membres CellCom</p>
      <p className="text-2xl font-semibold text-gray-900 dark:text-white">{users.filter(user => user.isAdmin).length}</p>
    </div>
  </div>
</div>

            {/* <Table>
                <Table.Head>
                    <Table.HeadCell>Nombre total d'utilisateurs</Table.HeadCell>
                    <Table.HeadCell>Nombre total des membres des CellCom</Table.HeadCell>
                     </Table.Head>
                     <Table.Body>
                        <Table.Row>
                            <Table.Cell>{users.length}</Table.Cell>
                            <Table.Cell>{users.filter(user => user.isAdmin).length}</Table.Cell>
                        </Table.Row>
                     </Table.Body>
               
            </Table> */}
            <div className="mb-4">
      <Label htmlFor="table-search" value="Search items:" className="sr-only" />
      {/* <TextInput
        id="table-search"
        type="text"
        placeholder="Search by name or email"
        value={searchTerm}
         onChange={(e) => setSearchTerm(e.target.value)}
      /> */}
       <div className="max-w-lg mx-auto p-4">
        <TextInput
                   id="table-search"
                   type='text'
                   placeholder='Rechercher un nom ou une adresse e-mail'
                   rightIcon={AiOutlineSearch}
                   className=""
                   value={searchTerm}
                   onChange={(e)=>setSearchTerm(e.target.value) }
                  />
       </div>
    </div>
     <div>
      {searchTerm && filteredData && filteredData.length === 1  && <p className="p-1 text-gray-500 text-md dark:text-white">{filteredData.length} résultat trouvé :</p>}
      {searchTerm && filteredData && filteredData.length > 1  && <p className="p-1 text-gray-500 text-md dark:text-white">{filteredData.length} résultats trouvés :</p>}
     </div> 
        {loading && <p>Chargement en cours...</p>}
            {filteredData && filteredData.length >= 1? (<Table hoverable className="shadow-md">
                <Table.Head>
                
                    
                        <Table.HeadCell>Date de création</Table.HeadCell>
                        <Table.HeadCell>Image</Table.HeadCell>
                        <Table.HeadCell>Noms</Table.HeadCell>
                        <Table.HeadCell>E-mail</Table.HeadCell>
                        {/* <Table.HeadCell>Admin Status</Table.HeadCell> */}
                        <Table.HeadCell>Type de Compte</Table.HeadCell>
                        <Table.HeadCell>Action</Table.HeadCell>
                        <Table.HeadCell>Supprimer</Table.HeadCell>
                        
                    
        
                </Table.Head>
                <Table.Body>
                    {filteredData && filteredData.length > 0 && filteredData.map(user => (
                       
                       <Table.Row key={user._id}>
                            <Table.Cell> {new Date(user.createdAt).toLocaleDateString('fr-FR')}</Table.Cell>

                            <Table.Cell>
                               <img 
                      src={user.profilePicture}
                      alt={user.userName}
                      className=" w-10 h-10 object-cover bg-gray-500 rounded-full cursor-pointer"
                      // onClick={() => navigate(`/user/${user._id}`)}
                      //onClick={() => window.open(`/user/${user._id}`, '_blank', 'noopener,noreferrer')} 
                       onClick={() => setSelectedImage(user.profilePicture)} 
                    />
                           {/* Modal Overlay */}
      {selectedImage && (
        <div 
          className="fixed inset-0 bg-black bg-opacity-75 flex items-center justify-center z-50 p-4"
          onClick={() => setSelectedImage(null)} // Close on background click
        >
          <div className="relative max-w-2xl max-h-full">
            <img 
              src={selectedImage} 
              alt={user.username} 
              className="max-w-full max-h-[80vh] rounded-lg"
            />
            <button 
              className="absolute top-2 right-2 text-white text-2xl font-bold bg-gray-800 rounded-full w-8 h-8 flex items-center justify-center"
              onClick={() => setSelectedImage(null)}
            >
              &times;
            </button>
          </div>
        </div>
      )}     
                                </Table.Cell>
                            <Table.Cell>{user.username}</Table.Cell>
                            <Table.Cell>{user.email}</Table.Cell>
                            <Table.Cell>{user.isAdmin ? <Button size="xs" 
                            
                            // onClick={() => toggleAdmin(user._id)} 
                        
                            className="no-hover-button2 cursor-default rounded-md bg-green-600 dark:bg-green-500 mr-5 text-white flex flex-row items-center p-1 gap-1 font-bold">CellCom <FaCheck className="mr-1 ml-1 text-white text-base"/></Button> 
                            : <Button size="xs" 
                            
                            // onClick={() => toggleAdmin(user._id)}  
                           
                            className="no-hover-button cursor-default text-white dark:text-white bg-blue-600 dark:bg-blue-500 flex flex-row items-center font-bold">Utilisateur <HiOutlineUser className='text-white text-base'/></Button>}
                            </Table.Cell>
                            {/* <Table.Cell>
                                <Button
                                 size="xs"
                                  gradientDuoTone="purpleToBlue" className='rounded-full transition-all duration-1000 dark:!from-green-500 dark:!to-blue-500 dark:text-white-500 text-lg shadow-lg'
                                onClick={() => toggleAdmin(user._id)}>
                                    
                                    Changer
                                </Button>
                            </Table.Cell> */}

                            <Table.Cell> 
                            {user && user._id !== import.meta.env.VITE_PR_ID && <ToggleSwitch 
                  checked={user.isAdmin}  
                   color='green'
                  onChange={() => handleToggleClick(user)} 
                  disabled={user._id === import.meta.env.VITE_PR_ID}
                />} </Table.Cell>
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
                                            {/* <Table.Cell> <ToggleSwitch 
                  checked={user.isAdmin} 
                  onChange={() => handleToggleClick(user)} 
                /></Table.Cell> */}
                        </Table.Row>
                    ))
  //                   : (
  //   <Table.Row>
  //     <Table.Cell colSpan="6" textAlign="center">
  //       Aucun utilisateur inscrit sur DRC Gov Social Media ne porte ce nom
  //     </Table.Cell>
  //   </Table.Row>
  // )
  }
                </Table.Body>
            </Table> 
            ) : !loading && <p className="text-gray-500 text-md dark:text-white"> Aucun résultat trouvé sur DRC Gov Social Media</p>}
            {
                      showMore && (
                        // <button onClick={handleShowMore} className="w-full text-teal-500 self-center text-sm py-7">
                        //   Voir plus 
            
                        // </button>
                        <div className="p-4 flex items-center justify-center">
                        <Button 
                        onClick={handleShowMore} 
                          gradientDuoTone="purpleToBlue" className='rounded-full transition-all duration-1000 dark:!from-green-500 dark:!to-blue-500 dark:text-white-500 text-lg shadow-lg'>
                          Voir plus 
            
                        </Button>
                        </div>
            
                      )
                    }
        
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


               {/* Confirmation Modal */}
      <Modal show={openModal} size="md" onClose={() => setOpenModal(false)} popup>
        <Modal.Header />
        <Modal.Body>
          <div className="text-center">
            <HiOutlineExclamationCircle className="mx-auto mb-4 h-14 w-14 text-gray-400 dark:text-gray-200" />
            {/* <h3 className="mb-5 text-lg font-normal text-gray-500 dark:text-gray-400">
              Are you sure you want to {userToToggle?.isAdmin ? 'remove' : 'grant'} admin rights for {userToToggle?.name}?
            </h3> */}
            <h3 className="mb-5 text-lg font-normal text-gray-500 dark:text-gray-400">
               Êtes-vous sûr de vouloir {userToToggle?.isAdmin ? 'retirer' : 'attribuer'}  les privilèges réservés aux types de compte "Cellcom" à {userToToggle?.username}?
            </h3>
            <div className="flex justify-center gap-4">
              <Button color="failure" onClick={() => toggleAdmin(userToToggle._id)}>
                Oui, je suis sûr
              </Button>
              <Button color="gray" onClick={() => setOpenModal(false)}>
                Non, annuler
              </Button>
            </div>
          </div>
        </Modal.Body>
      </Modal>
        
        </div>
        
    );
}

export default UserManagement;
