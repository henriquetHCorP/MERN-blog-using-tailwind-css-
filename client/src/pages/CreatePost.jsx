
import ReactQuill from 'react-quill';
import 'react-quill/dist/quill.snow.css';
import { Alert, Button, FileInput, Select, TextInput } from 'flowbite-react'
import React, { useState } from 'react'
import { getDownloadURL, getStorage, ref, uploadBytesResumable } from 'firebase/storage';
import { app } from '../firebase';
import { CircularProgressbar } from 'react-circular-progressbar';
import 'react-circular-progressbar/dist/styles.css'; 
import { useNavigate } from 'react-router-dom'


export default function CreatePost() {
    const [file, setFile] = useState(null); 
    const [imageUploadProgress, setImageUploadProgress] = useState(null); 
    const [imageUploadError, setImageUploadError] = useState(null); 
    const [formData, setFormData] = useState({}); 
    const [publishError, setPublishError] = useState(null); 

    const navigate = useNavigate(); 


    // console.log(formData); 
    const handleUploadImage = async () => {
        try {
            if (!file) {
                setImageUploadError('Please select an image'); 
                return; 
            }
            setImageUploadError(null); 
            const storage = getStorage(app);
            const fileName = new Date().getTime() + '-' + file.name;
            const storageRef = ref(storage, fileName); 
            const uploadTask = uploadBytesResumable(storageRef, file); 
            uploadTask.on(
               'state_changed', 
               (snapshot) => {
                const progress =
                (snapshot.bytesTransferred / snapshot.totalBytes) * 100; 
                setImageUploadProgress(progress.toFixed(0)); 
               }, 
               (error) => {
                  setImageUploadError('Image upload failed'); 
                  setImageUploadProgress(null); 
               },
               () => {
                getDownloadURL(uploadTask.snapshot.ref).then((downloadURL) => {
                    setImageUploadProgress(null); 
                    setImageUploadError(null);
                    setFormData({...formData, image: downloadURL}); 
                });
               }

            ); 

        } catch(error) {
            setImageUploadError('Image upload failed'); 
            setImageUploadProgress(null); 
            console.log(error)
        }

    }

    const handleSubmit = async (e) => {
            e.preventDefault(); 
            try {
                 const res = await fetch('/api/post/create', {
                    method: 'POST', 
                    headers: {
                        'Content-Type': 'application/json', 
                    }, 
                    body: JSON.stringify(formData), 
                 });
                 const data = await res.json(); 
                 if(!res.ok) {
                    setPublishError(data.message)
                    return; 
                 }

                 if(res.ok){
                    setPublishError(null) 
                    navigate(`/post/${data.slug}`)
                 }
            }catch(error){
               setPublishError('Something went wrong'); 
            }

    }
  return (
    <div className="p-3 max-w-3xl mx-auto min-h-screen">
        <h1 className="text-center text-3xl my-7 font-semibold">Create a post</h1>
        <form className="flex flex-col gap-4" onSubmit={handleSubmit}>  
            <div className="flex flex-col gap-4 sm:flex-row justify-between">
                <TextInput 
                      type="text" 
                      placeholder="Title" 
                      required id='title' 
                      className="flex-1"
                      onChange={(e) => 
                        setFormData({...formData, title: e.target.value})
                    }
                      />
                <Select
                  onChange={(e) => 
                    setFormData({...formData, category:e.target.value})
                }
                >
                    <option value="uncategorized ">Select a category</option>
                    <option value="javascript">JavaScript</option>
                    <option value="reactjs">React.js</option>
                    <option value="PrimeMinister">Office of the Prime Minister</option>
                    <option value="MinistryMine">Ministry of Mine</option>
                    <option value="MinistryJustice">Ministry of Justice</option>
                    <option value="MinistryFinances">Ministry of Finances</option>
                    <option value="MinistryEconomy">Ministry of economy</option>
                    <option value="MinistryEmployment">Ministry of Employment</option>
                    <option value="MinistryNationalDefense">Ministry of National Defense </option>
                    <option value="MinistryCommunication">Ministry of Communication</option>
                    <option value="MinistryHealthCare ">Ministry of Health Care </option>
                    <option value="MinistryForeignAffairs">Ministry of Foreign Affairs</option>
                    <option value="henriquet">KAPEMA HENRIQUET</option>
                    <option value="henriquet">KAPEMA HENRIQUET</option>
                    <option value="henriquet">KAPEMA HENRIQUET</option>
                    <option value="henriquet">KAPEMA HENRIQUET</option>
                </Select>
            </div>
            <div className="flex gap-4 items-center justify-between border-4 border-teal-500 border-dotted p-3">
                <FileInput 
                   type='file' 
                   accept='image/*' 
                   onChange={(e)=>setFile(e.target.files[0])} />
                <Button 
                type='button' 
                gradientDuoTone='purpleToBlue' 
                size='sm' 
                outline
                onClick={handleUploadImage}
                disabled={imageUploadProgress}
                >
                    
                   {imageUploadProgress ? 
                    (<div className="w-16 h-16">
                        <CircularProgressbar value={imageUploadProgress} text={`${imageUploadProgress || 0}%`} /> 

                    </div>) : ( 'Upload Image'
                    )}
                    </Button>
            </div>
            {imageUploadError && (
               <Alert color='failure'>
                {imageUploadError}
               </Alert>
            )}
            {formData.image && (
                <img 
                  src={formData.image}
                  alt='upload'
                  className="w-full h-72 object-cover"

                />
                
                )}
            <ReactQuill 
               theme="snow" 
               placeholder='Write something...' 
               className="h-72 mb-12" 
               onChange={(value) => {
                //this is the way we give the information from react quill 
                setFormData({...formData, content: value}); 
               }}
               />
            <Button type='submit' gradientDuoTone='purpleToPink'>
                  Publish
            </Button>
            {publishError && <Alert className="mt-5" color='failure'>{publishError}</Alert>}
        </form>
    </div>
  )
}
