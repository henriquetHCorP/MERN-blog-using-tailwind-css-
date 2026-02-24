import { Table } from 'flowbite-react';
import React, { useEffect, useState } from 'react'
import { useNavigate, useParams } from 'react-router-dom';
import  { Card, Carousel}  from 'flowbite-react'
import CommentSection from './CommentSection';
import { useSelector } from 'react-redux';




const UserInfo = ({}) => {
    const { userId } = useParams();
    const [user, setUser] = useState('');

    const {currentUser} = useSelector((state) => state.user); 

    const navigate = useNavigate(); 
  useEffect(() => {
    // Use the ID to fetch full details
        fetch(`/api/user/${userId}`)
      .then(res => res.json())
      .then(data => setUser(data));
  }, [userId]); 
    //  console.log('here:', user); 
  return (
     
        <div className="p-0 gap-0 shadow-none py-4 rounded-2xl w-full h-auto flex flex-col md:flex-row justify-center border border-t-8 border-blue-500">
     {/* <div className="p-2 w-64 h-64"> */}
     <div className="p-2 w-64 h-72 overflow-hidden">
     <Card imgSrc= {user.profilePicture} class="p-1 w-64 h-auto md:w-72 lg:w-auto object-contain"/>
      </div>
       <div className="pl-1 md:pl-5 flex flex-col">
        {/* <Table hoverable className="shadow-md p-10"> */}
          <div className="p-12 pb-3 pl-2 md:p-2">
            {/* <Table.Head> */}
                        <h1 className='-mt-10 md:-mt-0 text-xl uppercase font-semibold'>identifiants:</h1>
            {/* </Table.Head> */}
            </div>
        
        {/* <h1 className='uppercase font-bold p-5'>Information sur l'Utilisateur</h1> */}
        <div className="pt-0 p-2 paragraph-spacing">
        <p  className="text-base">Noms de l'utilisateur: {user && user.username}</p>
        
        <p className="text-base"> Adresse e-mail: {user && user.email}</p>
        <p className="text-base"> Date de création du compte: {user && new Date(user.createdAt).toLocaleDateString('fr-FR', {
          weekday:'short',
          year:'numeric',
          month:'short',
          day:'numeric',
        }
             
        )}</p>
        {/* {user.createdAt !== user.updatedAt && <p className="text-base">Date de mise à jour du compte: {user && new Date(user.updatedAt).toLocaleDateString('fr-FR', {
          weekday:'short',
          year:'numeric',
          month:'short',
          day:'numeric',
        }
             
        )}</p>
      } */}
        </div>
        <div className="py-0 md:py-7">
     {/* {currentUser && <CommentSection postId={userId} content={currentUser._id}
         />} */}
         {/* <CommentSection postId={currentUser._id} />  */}
      
         
         </div>
        {/* <span>
            Nom d'utilisateur: {user && user.username}
        </span> */}
        {/* <span>
             Adresse e-mail: {user && user.email}
        </span> */}
        {/* <span>Date de création du compte: {user && new Date(user.createdAt).toLocaleDateString('fr-FR', {
          weekday:'long',
          year:'numeric',
          month:'long',
          day:'numeric',
        }
             
        )}</span>  */}
        {/* <span>Date de mise à jour du compte: {user && new Date(user.updatedAt).toLocaleDateString('fr-FR', {
          weekday:'long',
          year:'numeric',
          month:'long',
          day:'numeric',
        }
             
        )}</span>  */}
        {/* </Table> */}
        </div>
    </div>
  )
}

export default UserInfo
