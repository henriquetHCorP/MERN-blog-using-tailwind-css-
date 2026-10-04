import { useSelector } from 'react-redux'; 
import { Alert, Button, Modal, TextInput } from 'flowbite-react';
import { useEffect, useRef, useState } from 'react';
import { getDownloadURL, getStorage, ref, uploadBytesResumable} from 'firebase/storage';
import { app } from '../firebase';  
import { CircularProgressbar } from 'react-circular-progressbar';
import { Link, useNavigate } from 'react-router-dom';
import 'react-circular-progressbar/dist/styles.css';
import {
  updateStart, 
  updateSuccess, 
  updateFailure, 
  deleteUserStart, 
  deleteUserSuccess,
  deleteUserFailure,
  signoutSuccess
} from '../redux/user/userSlice'; 
import { useDispatch } from 'react-redux';
import {HiOutlineExclamationCircle} from 'react-icons/hi'

import toast from 'react-hot-toast';

export default function DashProfile() {

  
  const {currentUser, error, loading} = useSelector(state => state.user)
  const [imageFile, setImageFile ] = useState(null); 
  const [imageFileUrl, setImageFileUrl] = useState(null); 
  const [imageFileUploadProgress, setImageFileUploadProgress] = useState(null); 
  const [imageFileUploadError, setImageFileUploadError] = useState(null); 
  const [imageFileUploading, setImageFileUploading] = useState(false); 
  const [updateUserSuccess, setUpdateUserSuccess] = useState(null); 
  const [updateUserError, setUpdateUserError] = useState(null); 
  //  console.log(imageFileUploadProgress, imageFileUploadError); 
  const [showModal, setShowModal] = useState(false); 
  const [formData, setFormData] = useState({}); 
  
  const filePickerRef = useRef(); 
  const dispatch = useDispatch();

  const navigate = useNavigate(); 

  

     const handleImageChange = async(e) => {
        let file = e.target.files[0];  
        
          // if (file ) {
          //     setImageFile(file); 
          //     setImageFileUrl(URL.createObjectURL(file));   
          // }
          if((file && (file.type === "image/heic" || file.name.toLowerCase().endsWith(".heic")))){
               try{
                  // Convert HEIC blob to JPEG blob
      const convertedBlob = await heic2any({
        blob: file,
        toType: "image/jpeg",
        quality: 0.8
      });
      
      file = new File([convertedBlob], file.name.replace(/\.[^/.]+$/, ".jpg"), {
        type: "image/jpeg",
      });
               } catch(error){
                   console.error("HEIC conversion failed", error);
               }
               e.target.value = ""; 
          }
            setImageFile(file); 
            setImageFileUrl(URL.createObjectURL(file));
        // console.log(imageFile,"image Url:", imageFileUrl); 
     }; 

     useEffect(() => {
         if(imageFile) {
          uploadImage(); 
         }
     }, [imageFile]); 

     const uploadImage = async () => {
      console.log('Uploading image...'); 

      // ---service firebase.storage {
      //   match /b/{bucket}/o {
      //     match /{allPaths=**} {
      //       allow read;
      //       allow write: if 
      //       request.resource.size < 2 * 1024 * 1024 && 
      //       request.resource.contentType.matches('image/.*')
      //     }
      //   }
      // } ---
      setImageFileUploading(true);
      setImageFileUploadError(null); 
      const storage = getStorage(app); 
      const fileName = new Date().getTime() + imageFile.name; 
      const storageRef = ref(storage, fileName); 
      const uploadTask = uploadBytesResumable(storageRef, imageFile); 
      uploadTask.on(
       'state_changed', 
       //snapshot is a piece of information that you get everytime you upload an image byte by byte
       (snapshot) => {
        const progress = (snapshot.bytesTransferred / snapshot.totalBytes) * 100; 
        //the formula below will provide how many percentage you've uploaded for axample
        
          // tofixed method will remove the decimal parts.  
        setImageFileUploadProgress(progress.toFixed(0)); 
       }, 
       (error) => {
        //  setImageFileUploadError('Could not upload image (File must be less than 2MB)'); 
         setImageFileUploadError("Echec lors du chargement de l'image (Veuillez choisir un fichier image dont la taille ne devra pas surpasser 2MB)"); 
         setImageFileUploadProgress(null); 
         setImageFile(null);
         setImageFileUrl(null);
         setImageFileUploading(false);

        }, 
       () => {
        getDownloadURL(uploadTask.snapshot.ref).then((downloadURL) => {
          setImageFileUrl(downloadURL); 
          setFormData({...formData, profilePicture:downloadURL}); 
          setImageFileUploading(false); 
        })
       }  

      )
     }

      const handleChange = (e) => {
        setFormData({...formData, [e.target.id]:e.target.value}); 
      }; 
      //  console.log(formData); 

      const handleSubmit = async(e) => {
        e.preventDefault(); 
        setUpdateUserError(null); 
        setUpdateUserSuccess(null); 
         if (Object.keys(formData).length === 0) {
          // setUpdateUserError('No changes made'); 
          toast.error("Aucun changement effectué.")
          setUpdateUserError('Aucun changement effectué.'); 
           return; 
         }
         if(imageFileUploading){
          // setUpdateUserError('Please wait for image to upload'); 
          toast("Veuillez patienter pendant le chargement de l'image", {icon:'⚠️'})
          setUpdateUserError("Veuillez patienter pendant le chargement de l'image"); 
          return; 
         }

         try {
             dispatch(updateStart()); 
             const res = await fetch(`/api/user/update/${currentUser._id}`,{
              method:'PUT', 
              headers: {
                'Content-Type': 'application/json',
              },
              body: JSON.stringify(formData), 
             });
             const data = await res.json(); 
             if (!res.ok){
               toast.error(data.message, {duration:6000})
              dispatch(updateFailure(data.message)); 
              setUpdateUserError(data.message)
              

             } else {
                dispatch(updateSuccess(data)); 
                toast.success("Votre profil d'utilisateur a été mis à jour avec succès.", {duration:6000})
                setUpdateUserSuccess("Votre profil d'utilisateur a été mis à jour avec succès."); 
             }
             if(res.status === 401) {
              dispatch(updateFailure(data.message)); 
              setUpdateUserError(data.message); 

              setTimeout(() => {
                 navigate('/sign-in');
                  }, 1000);

                  setTimeout(() => {
                    handleSignout();
                  }, 1000); 
             }
         }catch(error){
          dispatch(updateFailure(error.message)); 

         }
      }
     const handleDeleteUser = async () => {
       setShowModal(false); 
       try {
        dispatch(deleteUserStart());
        const res = await fetch(`/api/user/delete/${currentUser._id}`, {
          method: 'DELETE',
        }); 
        const data = await res.json(); 
        if(!res.ok){
          dispatch(deleteUserFailure(data.message)); 
          if(res.status === 401) {
            //window.alert('Vérification de l’utilisateur connecté en cours... Votre session a expiré. Reconnectez-vous avec une adresse e-mail et un mot de passe valides.')
             toast.error('Vérification de l’utilisateur connecté en cours... Votre session a expiré. Reconnectez-vous sur DRC Gov Social Media avec une adresse e-mail et un mot de passe valides.', {duration:10000})
            //handleSignout();
            setTimeout(() => {
      handleSignout();
    }, 10000)
           // navigate('/sign-in');
           setTimeout(() => {
      window.location.href = '/sign-in';
    }, 10000)
          }
        } else {
            dispatch(deleteUserSuccess(data)); 
        }

       }catch(error){
        dispatch(deleteUserFailure(error.message));  
       }
     }; 

     const handleSignout = async () => {
       try {
        const res = await fetch('api/user/signout', {
          method: 'POST', 
        });
        const data = await res.json(); 
        if(!res.ok){
          console.log(data.message); 
        } else { 
          dispatch(signoutSuccess()); 
          toast.success('Votre déconnexion à DRC Gov Social Media a été effectuée avec succès.', {duration:7000})
        }
       }catch(error){
        console.log(error.message); 
       }

     }
  return (
    <div className="max-w-lg mx-auto p-3 w-full">
      {/* <h1 className="my-7 text-center font-semibold text-3xl">Profil</h1> */}
      <div className="flex items-center justify-center flex-row">
      {currentUser.isAdmin === false && <h1 className="my-7 text-center font-semibold text-3xl">Mon compte</h1>}
      {currentUser._id === import.meta.env.VITE_PR_ID && (
        <div className="flex flex-row items-center">
          <img src="/presidence.jpg" alt="cellcom" height={90} width={90} className="dark:hidden"/>
          <img src="/darklogpr.png"  alt="cellcom" height={90} width={90} className="hidden dark:block"/>
          <img src="/line.png" alt="cellcom" height={11} width={11} className=""/>
        
        <p className="text-xs md:text-sm font-bold text-left uppercase font-serif">Présidence de la République</p></div>)}
      {currentUser._id === "6681d7a57be22de25eb96b82" && (
        <div className="flex flex-row items-center">
          <img src="/gouvernement.jpg" alt="cellcom" height={90} width={90} className="dark:hidden"/>
          <img src="/darklog-.png"  alt="cellcom" height={90} width={90} className="hidden dark:block"/>
          <img src="/line.png" alt="cellcom" height={11} width={11} className=""/>
        
        <p className="text-xs md:text-sm font-bold text-left uppercase font-serif">La Primature</p>
        
        </div>
      
      )}
      {currentUser._id === "6a9fdb617768387b859908da" && (
        <div className="flex flex-row items-center">
          <img src="/gouvernement.jpg" alt="cellcom" height={90} width={90} className="dark:hidden"/>
          <img src="/darklog-.png"  alt="cellcom" height={90} width={90} className="hidden dark:block"/>
          <img src="/line.png" alt="cellcom" height={11} width={11} className=""/>
        <p className="text-xs md:text-sm font-bold text-left uppercase font-serif"> Ministère <br/> de l'Intérieur et Sécurité, <br/> Décentralisation et Affaires coutumières</p>
        </div>
          // <p>VPM, Ministre de l'Intérieur et Sécurité, Décentralisation et Affaires coutumières</p>
        
        )}
      {currentUser._id === "6a9fdf567768387b859908f8" && (
        <div className="flex flex-row items-center">
          <img src="/gouvernement.jpg" alt="cellcom" height={90} width={90} className="dark:hidden"/>
          <img src="/darklog-.png"  alt="cellcom" height={90} width={90} className="hidden dark:block"/>
          <img src="/line.png" alt="cellcom" height={11} width={11} className=""/>
        <p className="text-xs md:text-sm font-bold text-left uppercase font-serif"> Ministère <br/> des Transports, <br/> Voies de Communication <br/>et Désenclavement </p>
        </div>
        
          // <p>VPM, Ministre des Transports et Voies de Communication et Désenclavement</p>
        )}
      {currentUser._id === "6a9fe0267768387b859908fa" && (
        
        <div className="flex flex-row items-center">
          <img src="/gouvernement.jpg" alt="cellcom" height={90} width={90} className="dark:hidden"/>
          <img src="/darklog-.png"  alt="cellcom" height={90} width={90} className="hidden dark:block"/>
          <img src="/line.png" alt="cellcom" height={11} width={11} className=""/>
        <p className="text-xs md:text-sm font-bold text-left uppercase font-serif"> Ministère <br/> de la Défense Nationale, <br/> et Anciens Combattants</p>
        </div>
          // <p>VPM, Ministre de la Défense Nationale et Anciens Combattants</p>
      
    )}
      {currentUser._id === "6a9fe1ad7768387b85990913" && (
        
         <div className="flex flex-row items-center">
          <img src="/gouvernement.jpg" alt="cellcom" height={90} width={90} className="dark:hidden"/>
          <img src="/darklog-.png"  alt="cellcom" height={90} width={90} className="hidden dark:block"/>
          <img src="/line.png" alt="cellcom" height={11} width={11} className=""/>
        <p className="text-xs md:text-sm font-bold text-left uppercase font-serif"> Ministère <br/> de l’Economie Nationale </p>
        </div>
          // <p>VPM, Ministre de l’Economie Nationale</p>
    
    
    )}
      {currentUser._id === "6924157d7e5e81010202ec46" && (
        <div className="flex flex-row items-center">
          <img src="/gouvernement.jpg" alt="cellcom" height={90} width={90} className="dark:hidden"/>
          <img src="/darklog-.png"  alt="cellcom" height={90} width={90} className="hidden dark:block"/>
          <img src="/line.png" alt="cellcom" height={11} width={11} className=""/>
        <p className="text-xs md:text-sm font-bold text-left uppercase font-serif"> Ministère <br/> de la Fonction Publique, <br/> Modernisation de l'Administration <br/> et Innovation du Service Public</p>
        </div>
      
      )}
      {currentUser._id === "6a9fe2a37768387b8599091b" && (
        
        <div className="flex flex-row items-center">
          <img src="/gouvernement.jpg" alt="cellcom" height={90} width={90} className="dark:hidden"/>
          <img src="/darklog-.png"  alt="cellcom" height={90} width={90} className="hidden dark:block"/>
          <img src="/line.png" alt="cellcom" height={11} width={11} className=""/>
        <p className="text-xs md:text-sm font-bold text-left uppercase font-serif"> Ministère du Plan <br/> et de la Coordination de l’Aide <br/> au Développement </p>
        </div>
        
          // <p>VPM, Ministre du Plan et de la Coordination de l’Aide au Développement</p>
    
    
    )}
      {currentUser._id === "6a9fe31f7768387b8599091d" && (
        <div className="flex flex-row items-center">
          <img src="/gouvernement.jpg" alt="cellcom" height={90} width={90} className="dark:hidden"/>
          <img src="/darklog-.png"  alt="cellcom" height={90} width={90} className="hidden dark:block"/>
          <img src="/line.png" alt="cellcom" height={11} width={11} className=""/>
        <p className="text-xs md:text-sm font-bold text-left uppercase font-serif"> Ministère  <br/>de l’Agriculture et <br/> Sécurité Alimentaire </p>
        </div>
          // <p>MINETAT, Ministre de l’Agriculture et Sécurité Alimentaire</p>
    
    )}
      {currentUser._id === "6800379a3210a81630a4af74" && (
        <div className="flex flex-row items-center">
          <img src="/gouvernement.jpg" alt="cellcom" height={90} width={90} className="dark:hidden"/>
          <img src="/darklog-.png"  alt="cellcom" height={90} width={90} className="hidden dark:block"/>
          <img src="/line.png" alt="cellcom" height={11} width={11} className=""/>
          <p className=" text-xs md:text-sm font-bold text-left uppercase font-serif"> Ministère <br/> des Affaires Etrangères, <br/> Coopération Internationale, <br/> Francophonie et Diaspora Congolaise</p>
          </div>
        
        )}
      {currentUser._id === "6a9fe6567768387b85990927" && (
        
        <div className="flex flex-row items-center">
          <img src="/gouvernement.jpg" alt="cellcom" height={90} width={90} className="dark:hidden"/>
          <img src="/darklog-.png"  alt="cellcom" height={90} width={90} className="hidden dark:block"/>
          <img src="/line.png" alt="cellcom" height={11} width={11} className=""/>
          <p className=" text-xs md:text-sm font-bold text-left uppercase font-serif"> Ministère <br/> de l’Education Nationale <br/> et Nouvelle Citoyenneté</p>
          </div>
          // <p>MINETAT, Ministre de l’Education Nationale et Nouvelle Citoyenneté</p>
      
      
      )
      
      
      }
      {currentUser._id === "6a9fea977768387b8599093a" && (
        <div className="flex flex-row items-center">
          <img src="/gouvernement.jpg" alt="cellcom" height={90} width={90} className="dark:hidden"/>
          <img src="/darklog-.png"  alt="cellcom" height={90} width={90} className="hidden dark:block"/>
          <img src="/line.png" alt="cellcom" height={11} width={11} className=""/>
          <p className=" text-xs md:text-sm font-bold text-left uppercase font-serif"> Ministère de l’Environnement, <br/>Développement Durable <br/> et Nouvelle Economie du Climat</p>
          </div>
    
          // <p>MINETAT, Ministre de l’Environnement et Développement Durable</p>
    
    
    )}
      {currentUser._id === "6964bf57b15d50f0a19c1fcf" && (
        <div className="flex flex-row items-center">
          <img src="/gouvernement.jpg" alt="cellcom" height={90} width={90} className="dark:hidden"/>
          <img src="/darklog-.png"  alt="cellcom" height={90} width={90} className="hidden dark:block"/>
          <img src="/line.png" alt="cellcom" height={11} width={11} className=""/>
        <p className="text-xs md:text-sm font-bold text-left uppercase font-serif"> Ministère <br/> des Infrastructures <br/> et Travaux Publics</p></div>)}
      {currentUser._id === "6953f277308bf59062360b79" && (
        <div className="flex flex-row items-center">
          <img src="/gouvernement.jpg" alt="cellcom" height={90} width={90} className="dark:hidden"/>
          <img src="/darklog-.png"  alt="cellcom" height={90} width={90} className="hidden dark:block"/>
          <img src="/line.png" alt="cellcom" height={11} width={11} className=""/>
        <p className="text-xs md:text-sm font-bold text-left uppercase font-serif"> Ministère <br/> du Budget</p></div>)}
      {currentUser._id === "6a9ff6e37768387b85990957" && (
        <div className="flex flex-row items-center">
          <img src="/gouvernement.jpg" alt="cellcom" height={90} width={90} className="dark:hidden"/>
          <img src="/darklog-.png"  alt="cellcom" height={90} width={90} className="hidden dark:block"/>
          <img src="/line.png" alt="cellcom" height={11} width={11} className=""/>
        <p className="text-xs md:text-sm font-bold text-left uppercase font-serif"> Ministère des <br/> Affaires Foncières</p>
        </div>
      
      )}
      {currentUser._id === "6a9fe82e7768387b85990932" && (

        <div className="flex flex-row items-center">
          <img src="/gouvernement.jpg" alt="cellcom" height={90} width={90} className="dark:hidden"/>
          <img src="/darklog-.png"  alt="cellcom" height={90} width={90} className="hidden dark:block"/>
          <img src="/line.png" alt="cellcom" height={11} width={11} className=""/>
        <p className="text-xs md:text-sm font-bold text-left uppercase font-serif"> Ministère<br/> du Développement Rural</p>
        </div>
          // <p>MINETAT, Ministre du Développement Rural</p>
        
        )}
      {currentUser._id === "6a9ff1817768387b8599094b" && (

        <div className="flex flex-row items-center">
          <img src="/gouvernement.jpg" alt="cellcom" height={90} width={90} className="dark:hidden"/>
          <img src="/darklog-.png"  alt="cellcom" height={90} width={90} className="hidden dark:block"/>
          <img src="/line.png" alt="cellcom" height={11} width={11} className=""/>
        <p className="text-xs md:text-sm font-bold text-left uppercase font-serif"> Ministère de l’Aménagement<br/>du Territoire</p>
        </div>
        
          // <p>MINETAT, Ministre de l’Aménagement du Territoire</p>
        
        )}
      {currentUser._id === "6a9fe53e7768387b85990923" && (
        
        <div className="flex flex-row items-center">
          <img src="/gouvernement.jpg" alt="cellcom" height={90} width={90} className="dark:hidden"/>
          <img src="/darklog-.png"  alt="cellcom" height={90} width={90} className="hidden dark:block"/>
          <img src="/line.png" alt="cellcom" height={11} width={11} className=""/>
        <p className="text-xs md:text-sm font-bold text-left uppercase font-serif"> Ministère<br/>de la Justice</p>
        </div>
          // <p>MINETAT, Ministre de la Justice et Garde des Sceaux</p>
    
    
    )}
      {currentUser._id === "66d6235d399aa8313d458d16" && (
        
        <div className="flex flex-row items-center">
          <img src="/gouvernement.jpg" alt="cellcom" height={90} width={90} className="dark:hidden"/>
          <img src="/darklog-.png"  alt="cellcom" height={90} width={90} className="hidden dark:block"/>
          <img src="/line.png" alt="cellcom" height={11} width={11} className=""/>
        <p className="text-xs md:text-sm font-bold text-left uppercase font-serif">Ministère <br/> des Finances</p></div>)}
      
      {currentUser._id === "699053053735f45c8bf42046" && (
        
        <div className="flex flex-row items-center">
          <img src="/gouvernement.jpg" alt="cellcom" height={90} width={90} className="dark:hidden"/>
          <img src="/darklog-.png"  alt="cellcom" height={90} width={90} className="hidden dark:block"/>
          <img src="/line.png" alt="cellcom" height={11} width={11} className=""/>
        <p className="text-xs md:text-sm font-bold text-left uppercase font-serif">Ministère <br/>de la Communication <br/> et Médias</p></div>)}
      {currentUser._id === "69ea1609247cb1850188f2b1" && (
         <div className="flex flex-row items-center">
          <img src="/gouvernement.jpg" alt="cellcom" height={90} width={90} className="dark:hidden"/>
          <img src="/darklog-.png"  alt="cellcom" height={90} width={90} className="hidden dark:block"/>
          <img src="/line.png" alt="cellcom" height={11} width={11} className=""/>
        <p className="text-xs md:text-sm font-bold text-left uppercase font-serif">Ministère <br/>des Mines</p></div>
      )}
      {currentUser._id === "6a9feda77768387b85990945" && (
         <div className="flex flex-row items-center">
          <img src="/gouvernement.jpg" alt="cellcom" height={90} width={90} className="dark:hidden"/>
          <img src="/darklog-.png"  alt="cellcom" height={90} width={90} className="hidden dark:block"/>
          <img src="/line.png" alt="cellcom" height={11} width={11} className=""/>
        <p className="text-xs md:text-sm font-bold text-left uppercase font-serif">Ministère <br/> des Postes et <br/> Télécommunications</p></div>
      )}
      {currentUser._id === "6a31408d5dba104e25135b5d" && (
         <div className="flex flex-row items-center">
          <img src="/gouvernement.jpg" alt="cellcom" height={90} width={90} className="dark:hidden"/>
          <img src="/darklog-.png"  alt="cellcom" height={90} width={90} className="hidden dark:block"/>
          <img src="/line.png" alt="cellcom" height={11} width={11} className=""/>
        <p className="text-xs md:text-sm font-bold text-left uppercase font-serif">Ministère <br/>de l'Economie <br/>Numérique </p></div>
      )}
      {currentUser._id === "6a9fe4027768387b8599091f" && (
         <div className="flex flex-row items-center">
          <img src="/gouvernement.jpg" alt="cellcom" height={90} width={90} className="dark:hidden"/>
          <img src="/darklog-.png"  alt="cellcom" height={90} width={90} className="hidden dark:block"/>
          <img src="/line.png" alt="cellcom" height={11} width={11} className=""/>
        <p className="text-xs md:text-sm font-bold text-left uppercase font-serif">Ministère <br/>de l’Industrie </p></div>
      )}
      {currentUser._id === "6a9fe49e7768387b85990921" && (
         <div className="flex flex-row items-center">
          <img src="/gouvernement.jpg" alt="cellcom" height={90} width={90} className="dark:hidden"/>
          <img src="/darklog-.png"  alt="cellcom" height={90} width={90} className="hidden dark:block"/>
          <img src="/line.png" alt="cellcom" height={11} width={11} className=""/>
        <p className="text-xs md:text-sm font-bold text-left uppercase font-serif">Ministère des Affaires Sociales, <br/> Actions Humanitaires <br/>et Solidarité Nationale </p></div>
      )}
      {currentUser._id === "6a9fe5ce7768387b85990925" && (
         <div className="flex flex-row items-center">
          <img src="/gouvernement.jpg" alt="cellcom" height={90} width={90} className="dark:hidden"/>
          <img src="/darklog-.png"  alt="cellcom" height={90} width={90} className="hidden dark:block"/>
          <img src="/line.png" alt="cellcom" height={11} width={11} className=""/>
        <p className="text-xs md:text-sm font-bold text-left uppercase font-serif">Ministère des Hydrocarbures</p></div>
      )}
      {currentUser._id === "6a9fe6567768387b85990927" && (
         <div className="flex flex-row items-center">
          <img src="/gouvernement.jpg" alt="cellcom" height={90} width={90} className="dark:hidden"/>
          <img src="/darklog-.png"  alt="cellcom" height={90} width={90} className="hidden dark:block"/>
          <img src="/line.png" alt="cellcom" height={11} width={11} className=""/>
        <p className="text-xs md:text-sm font-bold text-left uppercase font-serif">Ministère de l’Education Nationale <br/> et Nouvelle Citoyenneté</p></div>
      )}
      {currentUser._id === "6a9fe71e7768387b8599092e" && (
         <div className="flex flex-row items-center">
          <img src="/gouvernement.jpg" alt="cellcom" height={90} width={90} className="dark:hidden"/>
          <img src="/darklog-.png"  alt="cellcom" height={90} width={90} className="hidden dark:block"/>
          <img src="/line.png" alt="cellcom" height={11} width={11} className=""/>
        <p className="text-xs md:text-sm font-bold text-left uppercase font-serif">Ministère <br/> de la Formation <br/> Professionnelle</p></div>
      )}
      {currentUser._id === "6a9fe78c7768387b85990930" && (
         <div className="flex flex-row items-center">
          <img src="/gouvernement.jpg" alt="cellcom" height={90} width={90} className="dark:hidden"/>
          <img src="/darklog-.png"  alt="cellcom" height={90} width={90} className="hidden dark:block"/>
          <img src="/line.png" alt="cellcom" height={11} width={11} className=""/>
        <p className="text-xs md:text-sm font-bold text-left uppercase font-serif">Ministère <br/> de l'Urbanisme <br/> et Habitat</p></div>
      )}
      {currentUser._id === "6a9fe82e7768387b85990932" && (
         <div className="flex flex-row items-center">
          <img src="/gouvernement.jpg" alt="cellcom" height={90} width={90} className="dark:hidden"/>
          <img src="/darklog-.png"  alt="cellcom" height={90} width={90} className="hidden dark:block"/>
          <img src="/line.png" alt="cellcom" height={11} width={11} className=""/>
        <p className="text-xs md:text-sm font-bold text-left uppercase font-serif">Ministère <br/> du Développement <br/>Rural</p></div>
      )}
      {currentUser._id === "6a9fe8af7768387b85990934" && (
         <div className="flex flex-row items-center">
          <img src="/gouvernement.jpg" alt="cellcom" height={90} width={90} className="dark:hidden"/>
          <img src="/darklog-.png"  alt="cellcom" height={90} width={90} className="hidden dark:block"/>
          <img src="/line.png" alt="cellcom" height={11} width={11} className=""/>
        <p className="text-xs md:text-sm font-bold text-left uppercase font-serif">Ministère des Relations  <br/> avec le Parlement</p></div>
      )}
      {currentUser._id === "6a9fe95b7768387b85990936" && (
         <div className="flex flex-row items-center">
          <img src="/gouvernement.jpg" alt="cellcom" height={90} width={90} className="dark:hidden"/>
          <img src="/darklog-.png"  alt="cellcom" height={90} width={90} className="hidden dark:block"/>
          <img src="/line.png" alt="cellcom" height={11} width={11} className=""/>
        <p className="text-xs md:text-sm font-bold text-left uppercase font-serif">Ministère de la Santé Publique, <br/> Hygiène et Prévoyance Sociale </p></div>
      )}
      {currentUser._id === "6a9fe9f47768387b85990938" && (
         <div className="flex flex-row items-center">
          <img src="/gouvernement.jpg" alt="cellcom" height={90} width={90} className="dark:hidden"/>
          <img src="/darklog-.png"  alt="cellcom" height={90} width={90} className="hidden dark:block"/>
          <img src="/line.png" alt="cellcom" height={11} width={11} className=""/>
        <p className="text-xs md:text-sm font-bold text-left uppercase font-serif">Ministère <br/> du Commerce <br/>Extérieur </p></div>
      )}
      {currentUser._id === "6a9fea977768387b8599093a" && (
         <div className="flex flex-row items-center">
          <img src="/gouvernement.jpg" alt="cellcom" height={90} width={90} className="dark:hidden"/>
          <img src="/darklog-.png"  alt="cellcom" height={90} width={90} className="hidden dark:block"/>
          <img src="/line.png" alt="cellcom" height={11} width={11} className=""/>
        <p className="text-xs md:text-sm font-bold text-left uppercase font-serif">Ministère de l’Environnement, <br/> Développement Durable <br/>et Nouvelle Economie du Climat </p></div>
      )}
      {currentUser._id === "6a9febd57768387b85990941" && (
         <div className="flex flex-row items-center">
          <img src="/gouvernement.jpg" alt="cellcom" height={90} width={90} className="dark:hidden"/>
          <img src="/darklog-.png"  alt="cellcom" height={90} width={90} className="hidden dark:block"/>
          <img src="/line.png" alt="cellcom" height={11} width={11} className=""/>
        <p className="text-xs md:text-sm font-bold text-left uppercase font-serif">Ministère Enseignement Supérieur, <br/> Universitaire, Recherche Scientifique <br/>et Innovations </p></div>
      )}
      {currentUser._id === "6a9fec8c7768387b85990943" && (
         <div className="flex flex-row items-center">
          <img src="/gouvernement.jpg" alt="cellcom" height={90} width={90} className="dark:hidden"/>
          <img src="/darklog-.png"  alt="cellcom" height={90} width={90} className="hidden dark:block"/>
          <img src="/line.png" alt="cellcom" height={11} width={11} className=""/>
        <p className="text-xs md:text-sm font-bold text-left uppercase font-serif">Ministère de l'Emploi <br/> et Travail</p></div>
      )}
      {currentUser._id === "6a9fef327768387b85990947" && (
         <div className="flex flex-row items-center">
          <img src="/gouvernement.jpg" alt="cellcom" height={90} width={90} className="dark:hidden"/>
          <img src="/darklog-.png"  alt="cellcom" height={90} width={90} className="hidden dark:block"/>
          <img src="/line.png" alt="cellcom" height={11} width={11} className=""/>
        <p className="text-xs md:text-sm font-bold text-left uppercase font-serif">Ministère <br/> des Ressources Hydroliques <br/> et Electricité</p></div>
      )}
      {currentUser._id === "6a9ff06a7768387b85990949" && (
         <div className="flex flex-row items-center">
          <img src="/gouvernement.jpg" alt="cellcom" height={90} width={90} className="dark:hidden"/>
          <img src="/darklog-.png"  alt="cellcom" height={90} width={90} className="hidden dark:block"/>
          <img src="/line.png" alt="cellcom" height={11} width={11} className=""/>
        <p className="text-xs md:text-sm font-bold text-left uppercase font-serif">Ministère de Entrepreneuriat <br/> et Développement des Petites <br/> et Moyennes Entreprises</p></div>
      )}
      {currentUser._id === "6a9ff1817768387b8599094b" && (
         <div className="flex flex-row items-center">
          <img src="/gouvernement.jpg" alt="cellcom" height={90} width={90} className="dark:hidden"/>
          <img src="/darklog-.png"  alt="cellcom" height={90} width={90} className="hidden dark:block"/>
          <img src="/line.png" alt="cellcom" height={11} width={11} className=""/>
        <p className="text-xs md:text-sm font-bold text-left uppercase font-serif">Ministère <br/> de l'Aménagement <br/> du territoire </p></div>
      )}
      {currentUser._id === "6a9ff2137768387b8599094d" && (
         <div className="flex flex-row items-center">
          <img src="/gouvernement.jpg" alt="cellcom" height={90} width={90} className="dark:hidden"/>
          <img src="/darklog-.png"  alt="cellcom" height={90} width={90} className="hidden dark:block"/>
          <img src="/line.png" alt="cellcom" height={11} width={11} className=""/>
        <p className="text-xs md:text-sm font-bold text-left uppercase font-serif">Ministère <br/> du Tourisme </p></div>
      )}
      {currentUser._id === "6a9ff2c87768387b8599094f" && (
         <div className="flex flex-row items-center">
          <img src="/gouvernement.jpg" alt="cellcom" height={90} width={90} className="dark:hidden"/>
          <img src="/darklog-.png"  alt="cellcom" height={90} width={90} className="hidden dark:block"/>
          <img src="/line.png" alt="cellcom" height={11} width={11} className=""/>
        <p className="text-xs md:text-sm font-bold text-left uppercase font-serif">Ministère <br/> de la Pêche et Elevage </p></div>
      )}
      {currentUser._id === "6a9ff3677768387b85990951" && (
         <div className="flex flex-row items-center">
          <img src="/gouvernement.jpg" alt="cellcom" height={90} width={90} className="dark:hidden"/>
          <img src="/darklog-.png"  alt="cellcom" height={90} width={90} className="hidden dark:block"/>
          <img src="/line.png" alt="cellcom" height={11} width={11} className=""/>
        <p className="text-xs md:text-sm font-bold text-left uppercase font-serif">Ministère <br/> de la Culture, <br/> Arts et Patrimoine</p></div>
      )}
      {currentUser._id === "6a9ff41b7768387b85990953" && (
         <div className="flex flex-row items-center">
          <img src="/gouvernement.jpg" alt="cellcom" height={90} width={90} className="dark:hidden"/>
          <img src="/darklog-.png"  alt="cellcom" height={90} width={90} className="hidden dark:block"/>
          <img src="/line.png" alt="cellcom" height={11} width={11} className=""/>
        <p className="text-xs md:text-sm font-bold text-left uppercase font-serif">Ministère <br/> des Droits Humains </p></div>
      )}
      {currentUser._id === "6a9ff4b47768387b85990955" && (
         <div className="flex flex-row items-center">
          <img src="/gouvernement.jpg" alt="cellcom" height={90} width={90} className="dark:hidden"/>
          <img src="/darklog-.png"  alt="cellcom" height={90} width={90} className="hidden dark:block"/>
          <img src="/line.png" alt="cellcom" height={11} width={11} className=""/>
        <p className="text-xs md:text-sm font-bold text-left uppercase font-serif">Ministère <br/> de l’Intégration <br/> Régionale </p></div>
      )}
      {currentUser._id === "6a9ff6e37768387b85990957" && (
         <div className="flex flex-row items-center">
          <img src="/gouvernement.jpg" alt="cellcom" height={90} width={90} className="dark:hidden"/>
          <img src="/darklog-.png"  alt="cellcom" height={90} width={90} className="hidden dark:block"/>
          <img src="/line.png" alt="cellcom" height={11} width={11} className=""/>
        <p className="text-xs md:text-sm font-bold text-left uppercase font-serif">Ministère <br/> des Affaires Foncières</p></div>
      )}
      {currentUser._id === "6a9ff7f17768387b85990960" && (
         <div className="flex flex-row items-center">
          <img src="/gouvernement.jpg" alt="cellcom" height={90} width={90} className="dark:hidden"/>
          <img src="/darklog-.png"  alt="cellcom" height={90} width={90} className="hidden dark:block"/>
          <img src="/line.png" alt="cellcom" height={11} width={11} className=""/>
        <p className="text-xs md:text-sm font-bold text-left uppercase font-serif">Ministère <br/> des Sports <br/> et Loisirs</p></div>
      )}
      {currentUser._id === "6a9ff8717768387b85990962" && (
         <div className="flex flex-row items-center">
          <img src="/gouvernement.jpg" alt="cellcom" height={90} width={90} className="dark:hidden"/>
          <img src="/darklog-.png"  alt="cellcom" height={90} width={90} className="hidden dark:block"/>
          <img src="/line.png" alt="cellcom" height={11} width={11} className=""/>
        <p className="text-xs md:text-sm font-bold text-left uppercase font-serif">Ministère <br/>du Portefeuille</p></div>
      )}
      {currentUser._id === "6a9ff9277768387b85990964" && (
         <div className="flex flex-row items-center">
          <img src="/gouvernement.jpg" alt="cellcom" height={90} width={90} className="dark:hidden"/>
          <img src="/darklog-.png"  alt="cellcom" height={90} width={90} className="hidden dark:block"/>
          <img src="/line.png" alt="cellcom" height={11} width={11} className=""/>
        <p className="text-xs md:text-sm font-bold text-left uppercase font-serif">Ministère du Genre, <br/>Famille et Enfants</p></div>
      )}
      {currentUser._id === "6a9ffa247768387b85990966" && (
         <div className="flex flex-row items-center">
          <img src="/gouvernement.jpg" alt="cellcom" height={90} width={90} className="dark:hidden"/>
          <img src="/darklog-.png"  alt="cellcom" height={90} width={90} className="hidden dark:block"/>
          <img src="/line.png" alt="cellcom" height={11} width={11} className=""/>
        <p className="text-xs md:text-sm font-bold text-left uppercase font-serif">Ministère de la Jeunesse</p></div>
      )}
      {currentUser._id === "6a9ffb657768387b85990968" && (
         <div className="flex flex-row items-center">
          <img src="/gouvernement.jpg" alt="cellcom" height={90} width={90} className="dark:hidden"/>
          <img src="/darklog-.png"  alt="cellcom" height={90} width={90} className="hidden dark:block"/>
          <img src="/line.png" alt="cellcom" height={11} width={11} className=""/>
        <p className="text-xs md:text-sm font-bold text-left uppercase font-serif">Ministre Délégué <br/> près le Ministre des Affaires Etrangères <br/> en charge de la Francophonie et de la Diaspora Congolaise</p></div>
      )}
      {currentUser._id === "6a9ffbfd7768387b8599096a" && (
         <div className="flex flex-row items-center">
          <img src="/gouvernement.jpg" alt="cellcom" height={90} width={90} className="dark:hidden"/>
          <img src="/darklog-.png"  alt="cellcom" height={90} width={90} className="hidden dark:block"/>
          <img src="/line.png" alt="cellcom" height={11} width={11} className=""/>
        <p className="text-xs md:text-sm font-bold text-left uppercase font-serif">Ministre Délégué <br/> près le Ministre de l’Environnement et Développement Durable <br/> en charge de la Nouvelle Economie du Climat</p></div>
      )}
      {currentUser._id === "6a9ffcd77768387b8599096c" && (
         <div className="flex flex-row items-center">
          <img src="/gouvernement.jpg" alt="cellcom" height={90} width={90} className="dark:hidden"/>
          <img src="/darklog-.png"  alt="cellcom" height={90} width={90} className="hidden dark:block"/>
          <img src="/line.png" alt="cellcom" height={11} width={11} className=""/>
        <p className="text-xs md:text-sm font-bold text-left uppercase font-serif">Ministre Délégué <br/> près le Ministre de l’Urbanisme et Habitat <br/> en charge de la Politique de la Ville</p></div>
      )}
      {currentUser._id === "6a9ffdd87768387b8599096e" && (
         <div className="flex flex-row items-center">
          <img src="/gouvernement.jpg" alt="cellcom" height={90} width={90} className="dark:hidden"/>
          <img src="/darklog-.png"  alt="cellcom" height={90} width={90} className="hidden dark:block"/>
          <img src="/line.png" alt="cellcom" height={11} width={11} className=""/>
        <p className="text-xs md:text-sm font-bold text-left uppercase font-serif">Ministre Délégué <br/> près le Ministre des Affaires Sociales <br/> en charge des Personnes vivant avec Handicap</p></div>
      )}
      {currentUser._id === "6a9ffeb57768387b85990970" && (
         <div className="flex flex-row items-center">
          <img src="/gouvernement.jpg" alt="cellcom" height={90} width={90} className="dark:hidden"/>
          <img src="/darklog-.png"  alt="cellcom" height={90} width={90} className="hidden dark:block"/>
          <img src="/line.png" alt="cellcom" height={11} width={11} className=""/>
        <p className="text-xs md:text-sm font-bold text-left uppercase font-serif">Ministre Délégué <br/> près le Ministre de la Défense Nationale <br/> en Charge des Anciens Combattants</p></div>
      )}
      {currentUser._id === "6aa000147768387b85990972" && (
         <div className="flex flex-row items-center">
          <img src="/gouvernement.jpg" alt="cellcom" height={90} width={90} className="dark:hidden"/>
          <img src="/darklog-.png"  alt="cellcom" height={90} width={90} className="hidden dark:block"/>
          <img src="/line.png" alt="cellcom" height={11} width={11} className=""/>
        <p className="text-xs md:text-sm font-bold text-left uppercase font-serif">Vice-Ministre <br/> du Budget</p></div>
      )}
      {currentUser._id === "6aa0010e7768387b85990974" && (
         <div className="flex flex-row items-center">
          <img src="/gouvernement.jpg" alt="cellcom" height={90} width={90} className="dark:hidden"/>
          <img src="/darklog-.png"  alt="cellcom" height={90} width={90} className="hidden dark:block"/>
          <img src="/line.png" alt="cellcom" height={11} width={11} className=""/>
        <p className="text-xs md:text-sm font-bold text-left uppercase font-serif">Vice-Ministre de l’Intérieur, <br/> Sécurité, Décentralisation<br/></p></div>
      )}
      {currentUser._id === "6aa001fc7768387b85990976" && (
         <div className="flex flex-row items-center">
          <img src="/gouvernement.jpg" alt="cellcom" height={90} width={90} className="dark:hidden"/>
          <img src="/darklog-.png"  alt="cellcom" height={90} width={90} className="hidden dark:block"/>
          <img src="/line.png" alt="cellcom" height={11} width={11} className=""/>
        <p className="text-xs md:text-sm font-bold text-left uppercase font-serif">Vice-Ministre <br/> des Affaires Etrangères</p></div>
      )}
      {currentUser._id === "6aa0027e7768387b85990978" && (
         <div className="flex flex-row items-center">
          <img src="/gouvernement.jpg" alt="cellcom" height={90} width={90} className="dark:hidden"/>
          <img src="/darklog-.png"  alt="cellcom" height={90} width={90} className="hidden dark:block"/>
          <img src="/line.png" alt="cellcom" height={11} width={11} className=""/>
        <p className="text-xs md:text-sm font-bold text-left uppercase font-serif">Vice-Ministre <br/> des Finances</p></div>
      )}
      {currentUser._id === "6aa003c77768387b8599097a" && (
         <div className="flex flex-row items-center">
          <img src="/gouvernement.jpg" alt="cellcom" height={90} width={90} className="dark:hidden"/>
          <img src="/darklog-.png"  alt="cellcom" height={90} width={90} className="hidden dark:block"/>
          <img src="/line.png" alt="cellcom" height={11} width={11} className=""/>
        <p className="text-xs md:text-sm font-bold text-left uppercase font-serif">Vice-Ministre <br/> de l’Éducation Nationale <br/>et Nouvelle Citoyenneté</p></div>
      )}
      {currentUser._id === "6aa004c97768387b8599097c" && (
         <div className="flex flex-row items-center">
          <img src="/gouvernement.jpg" alt="cellcom" height={90} width={90} className="dark:hidden"/>
          <img src="/darklog-.png"  alt="cellcom" height={90} width={90} className="hidden dark:block"/>
          <img src="/line.png" alt="cellcom" height={11} width={11} className=""/>
        <p className="text-xs md:text-sm font-bold text-left uppercase font-serif">Vice-Ministre <br/> des Affaires <br/> Coutumières</p></div>
      )}

    { currentUser.isAdmin &&  <span className=" flex h-8 w-8 items-center justify-center rounded-full bg-green-500 border-2 border-white text-white text-[25px] font-bold shadow-md z-10">
            ✓
          </span>}
      </div>
      <form onSubmit={handleSubmit} className="flex flex-col gap-4">
            <input 
            placeholder="Choisir une photo de profil..." 
      class="w-full max-w-xs px-4 py-2 bg-white text-slate-700 placeholder-slate-400 border border-slate-300 rounded-lg shadow-sm focus:outline-none focus:border-blue-500 focus:ring-1 focus:ring-blue-500 transition duration-200"
            type="file" 
            accept='image/*' 
            onChange={handleImageChange} 
            onInput={handleImageChange} // Swapping or adding alongside onChange
            ref={filePickerRef}
            hidden






        //hidden
            //       style={{
            //   position: 'absolute',
            //   width: '1px',
            //   height: '1px',
            //   padding: '0',
            //   margin: '-1px',
            //   overflow: 'hidden',
            //   clip: 'rect(0, 0, 0, 0)',
            //   whiteSpace: 'nowrap',
            //   border: '0',
            //   opacity: 0,
            // }}
        /> 
        <div className="relative w-32 h-32 self-center cursor-pointer shadow-md overflow-hidden rounded-full"
          onClick={() => filePickerRef.current.click()}
        >
          {imageFileUploadProgress && (
            <CircularProgressbar 
              value={imageFileUploadProgress || 0} 
              text={`${imageFileUploadProgress}%`} 
              strokeWidth={5}
              styles={{
                root:{
                  width:'128',
                  height:'128', 
                  position:'absolute',
                  top:0, 
                  left:0, 
                },
                path: {
                  stroke: `rgba(62, 152, 199, ${
                    imageFileUploadProgress / 100
                  })`,
                },
              }}
              />
          )}
       { currentUser.isAdmin ? <img src={imageFileUrl || currentUser.profilePicture} 
        alt=""   
        className={`rounded-full w-full h-full object-cover border-8 border-[#0E9F6E] ${imageFileUploadProgress && imageFileUploadProgress < 100 && 'opacity-60'}`} onClick={()=>filePickerRef.current.click()}  />
        : <img src={imageFileUrl || currentUser.profilePicture} 
        alt=""   
        className={`rounded-full w-full h-full object-cover border-8 border-[lightgray] ${imageFileUploadProgress && imageFileUploadProgress < 100 && 'opacity-60'}`} onClick={()=>filePickerRef.current.click()} />}
        </div>
        {imageFileUploadError && <Alert color='failure'>{imageFileUploadError}</Alert>}
        <p>Voulez-vous modifier vos identifiants? </p>



      <div className="w-full flex flex-row gap-3 justify-start items-center">
         <p className="text-sm">Avatar:</p>
        <input 
        placeholder="Choisir une photo de profil..." 
  // below test class="w-full max-w-xs"
  class="w-full px-4 py-1 bg-white dark:bg-gray-700 dark:text-white dark:border-gray-600 text-slate-700 placeholder-slate-400 border border-slate-300 rounded-lg shadow-sm focus:outline-none focus:border-blue-500 focus:ring-1 focus:ring-blue-500 transition duration-200"
        type="file" 
        accept='image/*' 
        onChange={handleImageChange} 
        onInput={handleImageChange} // Swapping or adding alongside onChange
        ref={filePickerRef}
        //hidden
            //       style={{
            //   position: 'absolute',
            //   width: '1px',
            //   height: '1px',
            //   padding: '0',
            //   margin: '-1px',
            //   overflow: 'hidden',
            //   clip: 'rect(0, 0, 0, 0)',
            //   whiteSpace: 'nowrap',
            //   border: '0',
            //   opacity: 0,
            // }}
        /> 


      </div>


        <div className="w-full flex flex-row gap-3 justify-start items-center">
           <p className="text-sm">Noms:</p>
        <TextInput 
          type="text" 
          id="username" 
          placeholder="Nom d'utilisateur" 
          className='w-full'
          defaultValue={currentUser.username} onChange={handleChange} />
        </div>
          <div className="w-full flex flex-row gap-3 justify-start items-center">
            <p className="text-sm">Email:</p>
        <TextInput 
          type="email" 
          id="email" 
          placeholder="e-mail" 
          className='w-full'
          defaultValue={currentUser.email} onChange={handleChange} />
          </div>
          <div className="w-full flex flex-row gap-3 justify-start items-center">
             <p className="text-sm">Code:</p>
        <TextInput 
          type="password" 
          id="password"
          className='w-full'
          placeholder="Taper le nouveau mot de passe" onChange={handleChange} />
          
          </div>
          <div className="w-full flex flex-row gap-3 justify-start items-center">
            <p className="text-sm">Code:</p>
        <TextInput 
          type="password" 
          id="confirmPassword"
          className='w-full'
          placeholder="Confirmer le nouveau mot de passe" onChange={handleChange} />

          </div>
          
          <Button 
             type="submit" 
             gradientDuoTone='purpleToBlue' 
             outline
             disabled={loading || imageFileUploading}
             >
               {loading ? 'Chargement en cours...' : 'Mettre à jour mon profil'}
          </Button>
          {currentUser.isAdmin && (
            <Link to={'/create-post'}> 
            <Button
              type='button'
              gradientDuoTone='purpleToBlue'
              className='w-full'
            >
              Créer un article et/ou une vidéo
            </Button>
            </Link>
          )}
         
      </form>
      <div className="py-4">
       <Button 
          href={`/user/${currentUser._id}`} 
       //onClick={() => window.open(`/user/${currentUser._id}`, '_blank', 'noopener,noreferrer')} 
       
       className="w-full dark:!from-green-500 dark:!to-blue-500 dark:text-white-500" type='button' gradientDuoTone='purpleToBlue'>
  Voir mon profil
</Button>
</div>
      <div className="text-red-500 flex justify-between mt-5">
        <span onClick ={() => setShowModal(true)} className="cursor-pointer">Supprimer le compte</span>
        <span onClick={handleSignout} className="cursor-pointer">Se déconnecter</span> 
      </div>
      {updateUserSuccess && (
        <Alert color='success' className="mt-5">
          {updateUserSuccess}
        </Alert>
      )}
      {updateUserError && (
        <Alert color='failure' className="mt-5">
          {updateUserError}
        </Alert>
      )}
      {/* the error below is coming from the useSelector */}
      {error && (
        <Alert color='failure' className="mt-5">
          {error}
        </Alert>
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
            <h3 className="mb-5 text-lg text-gray-500 dark:text-gray-400"> Êtes-vous sûr de vouloir effacer ce compte?
            </h3>
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
