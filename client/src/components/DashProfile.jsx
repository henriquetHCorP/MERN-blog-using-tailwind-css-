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

  

     const handleImageChange = (e) => {
        const file = e.target.files[0];  
        if (file) {
            setImageFile(file); 
            setImageFileUrl(URL.createObjectURL(file));   
        }
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
         setImageFileUploadError("Echec lors du chargement de l'image (La taille du fichier ne devra pas surpasser 2MB)"); 
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
          setUpdateUserError('Aucun changement effectué'); 
           return; 
         }
         if(imageFileUploading){
          // setUpdateUserError('Please wait for image to upload'); 
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
              dispatch(updateFailure(data.message)); 
              setUpdateUserError(data.message)

             } else {
                dispatch(updateSuccess(data)); 
                setUpdateUserSuccess("Le profil de l'utilisateur a été mis à jour avec succès"); 
             }
             if(res.status === 401) {
              
              dispatch(updateFailure(data.message)); 
              setUpdateUserError(data.message); 

              setTimeout(() => {
                 navigate('/sign-in');
                  }, 10000);

                  setTimeout(() => {
                    handleSignout();
                  }, 10001); 
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
        }
       }catch(error){
        console.log(error.message); 
       }

     }
  return (
    <div className="max-w-lg mx-auto p-3 w-full">
      <h1 className="my-7 text-center font-semibold text-3xl">Profil</h1>
      <form onSubmit={handleSubmit} className="flex flex-col gap-4">
        <input 
        type="file" 
        accept='image/*' 
        onChange={handleImageChange} 
        ref={filePickerRef}
        hidden
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
                  width:'100',
                  height:'100', 
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
        <img src={imageFileUrl || currentUser.profilePicture} 
        alt="Utilisateur"   
        className={`rounded-full w-full h-full object-cover border-8 border-[lightgray] ${imageFileUploadProgress && imageFileUploadProgress < 100 && 'opacity-60'}`} onClick={()=>filePickerRef.current.click()} />
        </div>
        {imageFileUploadError && <Alert color='failure'>{imageFileUploadError}</Alert>}
        <p>Voulez-vous modifier vos identifiants? </p>
        <TextInput 
          type="text" 
          id="username" 
          placeholder="Nom d'utilisateur" 
          defaultValue={currentUser.username} onChange={handleChange} />
        <TextInput 
          type="email" 
          id="email" 
          placeholder="e-mail" 
          defaultValue={currentUser.email} onChange={handleChange} />
        <TextInput 
          type="password" 
          id="password"
          placeholder="Taper le nouveau mot de passe" onChange={handleChange} />
        <TextInput 
          type="password" 
          id="confirmPassword"
          placeholder="Confirmer le nouveau mot de passe" onChange={handleChange} />
          <Button 
             type="submit" 
             gradientDuoTone='purpleToBlue' 
             outline
             disabled={loading || imageFileUploading}
             >
               {loading ? 'Chargement en cours...' : 'Mettre à jour le profil'}
          </Button>
          {currentUser.isAdmin && (
            <Link to={'/create-post'}> 
            <Button
              type='button'
              gradientDuoTone='purpleToBlue'
              className='w-full'
            >
              Créer un article 
            </Button>
            </Link>
          )}
      </form>
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
            <h3 className="mb-5 text-lg text-gray-500 dark:text-gray-400"> Etes-vous sur de vouloir effacer ce compte?
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
