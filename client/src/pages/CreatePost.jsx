
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
                    <option value="uncategorized ">Select a Minister</option>
                    {/* <option value="javascript">JavaScript</option>
                    <option value="reactjs">React.js</option> */}
                    <option value="Prime Minister">Prime Minister</option>
                    <option value="Interior">VPM Interior and Security</option>
                    <option value="Transport">VPM Transport, CRD</option>
                    <option value="Defense">VPM National Defense</option>
                    <option value="Economy">VPM National Economy</option>
                    <option value="Public Service">VPM Public Service</option>
                    <option value="Planning">VPM Planning and Development Aid Coord</option>
                    <option value="Agriculture">MS Minister of Agriculture</option>
                    <option value="Foreign Affairs">MS Minister of Foreign Affairs</option>
                    <option value="National education">MS Minister of National Educ. and NC</option>
                    <option value="Infrastructure">MS Minister Infrastructure and PW</option>
                    <option value="justice">MS Minister of Justice</option>
                    <option value="Budget">MS Minister of Budget</option> 
                    <option value="Land Affairs">MS Minister of Land Affairs</option>
                    <option value="Rural Development">MS Minister of Rural Development</option>
                    <option value="Land Management">MS Minister of Land Amenagement</option>
                    <option value="Finance">Minister of Finances</option>
                    <option value="Industry">Minister of Industry and SMEs</option>
                    <option value="Electricity">Minister of Hydraulic Resources and Electricity</option>
                    <option value="Mines">Minister of Mines</option>
                    <option value="Hydrocarbons">Minister of Hydrocarbons</option>
                    <option value="Employment">Minister of Labor, Employment, and Social Welfare</option>
                    <option value="Urbanism">Minister of Urbanism and Housing</option>
                    <option value="Human Rights">Minister of Human Rights</option>
                    <option value="Health">Minister Health</option>
                    <option value="Higher Education">Minister of Higher Education and University</option>
                    <option value="Scientific Research">Minister of Scientifc Research and Innovation</option>
                    <option value="Technologies">Minister of Posts, Telecom, New Tech, and Info and Com</option>
                    <option value="Portfolio">Minister of Portfolio</option>
                    <option value="Social Affairs">Minister of Social Affairs and Humanitarian Action</option>
                    <option value="External Trade">Minister of External Trade</option>
                    <option value="Regional Integration">Minister of Regional Integration</option>
                    <option value="Communication">Minister of Communication and Medias</option>
                    <option value="Professional Training">Minister of Professsional Training</option>
                    <option value="Gender">Minister of Gender</option>
                    <option value="Fisheries">Minister of Fisheries and Livestock</option>
                    <option value="Culture and Arts">Minister of Culture and Arts</option>
                    <option value="Tourism">Minister of Tourism</option>
                    <option value="Sports">Minister of Sports</option>
                     
                    {/* <option value="henriquet">KAPEMA HENRIQUET</option>
                    <option value="henriquet">KAPEMA HENRIQUET</option>
                    <option value="henriquet">KAPEMA HENRIQUET</option>
                    <option value="henriquet">KAPEMA HENRIQUET</option> */}
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
