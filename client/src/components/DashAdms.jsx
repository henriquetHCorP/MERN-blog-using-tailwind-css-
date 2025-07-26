import { Button, Modal, Table } from 'flowbite-react';
import React, { useEffect, useState } from 'react'
import { HiCheck, HiOutlineExclamationCircle } from 'react-icons/hi';
import { useSelector } from 'react-redux'; 
// import { Link } from 'react-router-dom';
import { FaCheck, FaTimes } from 'react-icons/fa'; 

export default function DashAdms() {
  const { currentUser } = useSelector((state) => state.user);  
  const [adms, setAdms] = useState([]); 
  const [showMore, setShowMore ] = useState(true); 
  const [showModal, setShowModal] = useState(false); 
  const [admIdToDelete, setAdmIdToDelete] = useState(''); 
//   console.log(userPosts); 

  useEffect (() => {
     const fetchAdms = async () => {
        try {
              // Since this is a get request we don't need to add any method... 
              const res = await fetch(`/api/user/getadms?`)
              // here we convert the json file into data 
              const data = await res.json(); 
              // console.log(data); 
              if(res.ok){
                //setUserPosts(data.posts) cfr post.controller.js res.status(200).json({posts, totalPosts,lastMonthPosts,  
                setAdms(data.adms); 
                
                if(data.adms.length < 9){
                  setShowMore(false); 
                }
              }

        } catch(error) {
              console.log(error.message); 
        }
     }; 
     if(currentUser.isAdmin) {
      fetchAdms(); 
     }
   }, [currentUser._id])
   
   const handleShowMore = async () => {
     const startIndex = adms.length; 
     try {
        const res = await fetch(`/api/user/getadms?&startIndex=${startIndex}`); 
        const data = await res.json(); 
        if(res.ok) {
          setAdms((prev) => [...prev, ...data.adms]); 
          if(data.adms.length < 9) {
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
// const handleDeleteAdm = async() => {
//     try {
//         const res = await fetch(`api/user/delete/${userIdToDelete}`, {
//             method:'DELETE', 
//         }); 
//         const data = await res.json(); 
//         if(res.ok) {
//             setUsers((prev) => prev.filter((user) => user._id!== userIdToDelete)); 
//             setShowModal(false); 
//         } else {
//             console.log(data.message); 
//         }

//     } catch(error) {
//         console.log(error.message); 
//     }

// }

const handleDeleteAdm = async() => {

}
  return (
    <div className="table-auto overflow-x-scroll md:mx-auto p-3 scrollbar scrollbar-track-slate-100 scrollbar-thumb-slate-300 dark:scrollbar-track-slate-700 dark:scrollbar-thumb-slate-500">
     {currentUser.isAdmin && adms.length > 0 ? (
        <>
        <Table hoverable className="shadow-md ">
           <Table.Head>
            <Table.HeadCell>Date de creation</Table.HeadCell>
            <Table.HeadCell>Image d'utilisateur</Table.HeadCell>
            <Table.HeadCell>Nom d'utilisateur</Table.HeadCell>
            <Table.HeadCell>E-mail</Table.HeadCell>
            <Table.HeadCell>CellCom</Table.HeadCell>
            {/* <Table.HeadCell>Effacer</Table.HeadCell> */}
            
           </Table.Head>
           {adms.map((adm) => (
            <Table.Body className="divide-y" key={adm._id}>
              <Table.Row className="bg-white dark:border-gray-700 dark:bg-gray-800">
                <Table.Cell>
                  {new Date(adm.createdAt).toLocaleDateString('fr-FR')}
                </Table.Cell>
                <Table.Cell>
                  {/* <Link to={`/post/${post.slug}`}> */}
                    <img 
                      src={adm.profilePicture}
                      alt={adm.username}
                      className=" w-10 h-10 object-cover bg-gray-500 rounded-full"
                    />
                  {/* </Link> */}
                </Table.Cell>
                <Table.Cell>
                   {/* <Link className="font-medium text-gray-900 dark:text-white" to={`/post/${post.slug}`}> */}
                  {adm.username}
                  
                {/* </Link>  */}
                </Table.Cell>
                <Table.Cell>{adm.email}</Table.Cell>
                {/* my idea was to handle this way : <Table.Cell>{user.isAdmin ? (<HiCheck />): (<span>No</span>)}</Table.Cell> */}
                <Table.Cell>{adm.isAdmin ? (<FaCheck className="text-green-500"/>) : (<FaTimes className="text-red-500"/>)}</Table.Cell>
                {/* <Table.Cell>
                  <span 
                    onClick={() => {
                      setShowModal(true);   
                      //check below the adm._id is it correct?? yes
                      setAdmIdToDelete(adm._id); 
                    }}
                    // className="font-medium text-red-500 hover:underline">
                    className="font-medium text-red-500 hover:underline hover:cursor-pointer">
                    
                    {adm.isAdmin? null : "Effacer"}
                    </span>
                </Table.Cell> */}
                
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
     ):(<p>Vous n'avez aucun membre des cellules de communication pour l'instant</p>)}
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
            <h3 className="mb-5 text-lg text-gray-500 dark:text-gray-400"> Etes-vous sur de vouloir effacer cet utilisateur?</h3>
             <div className="flex justify-center gap-4">
              <Button color='failure' onClick={handleDeleteAdm}>Oui, je suis sûr</Button>
              <Button color='gray' onClick={() => setShowModal(false)}>Non, annuler</Button>
             </div>
          </div>
        </Modal.Body>
      </Modal>

    </div>
  )
}
