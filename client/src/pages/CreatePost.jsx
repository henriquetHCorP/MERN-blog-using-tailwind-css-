
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
            <div className="gap-4 sm:flex-row justify-between">
                <TextInput 
                      type="text" 
                      placeholder="Title" 
                      required id='title' 
                      className="flex-1"
                      onChange={(e) => 
                        setFormData({...formData, title: e.target.value})
                    }
                      />
                      </div>
                      <div className="gap-4 sm:flex-row justify-between">
                <Select
                  onChange={(e) => 
                    setFormData({...formData, category:e.target.value})
                }
                >
                    <option value="...">Selectioner un Ministre</option>
                    {/* <option value="javascript">JavaScript</option>
                    <option value="reactjs">React.js</option> */}
                    <option value="Premier Ministre">Premier Ministre</option>
                    <option value="Interieur">VPM Intérieur et Sécurité, Décentralisation et Affaires coutumières</option>
                    <option value="Transport">VPM Transports et Voies de Communication et Désenclavement</option>
                    <option value="Défense">VPM Ministre de la Défense Nationale et Anciens Combattants</option>
                    <option value="Economie">VPM Ministre de l’Economie Nationale</option>
                    <option value="Fonction Publique">VPM Ministre de la Fonction Publique et Modernisation de l’Administration et Innovation des Services Publics</option>
                    <option value="Plan">VPM Ministre du Plan et de la Coordination de l’Aide au Développement</option>
                    <option value="Agriculture">MINETAT Ministre de l’Agriculture et Sécurité Alimentaire</option>
                    <option value="Affaires Etrangères">MINETAT Ministre des Affaires Etrangères, Coopération Internationale et Francophonie</option>
                    <option value="Éducation Nationale">MINETAT Ministre de l’Éducation Nationale et Nouvelle Citoyenneté</option>
                    <option value="’Environnement">MINETAT Ministre de l’Environnement et Développement Durable</option>
                    <option value="Infrastructures">MINETAT  Ministre des Infrastructures et Travaux Publics</option>
                    <option value="Budget">MINETAT Ministre du Budget</option> 
                    <option value="Affaires Foncières">MINETAT Ministre des Affaires Foncières</option>
                    <option value="Développement Rural">MINETAT Ministre du Développement Rural</option>
                    <option value="Aménagement du territoire">MINETAT Ministre de l’Aménagement du Territoire</option>
                    <option value="Justice">MINETAT Ministre de la Justice et Garde des Sceaux</option>
                    <option value="Finance">Ministre des Finances</option>
                    <option value="Industrie">Ministre de l’Industrie et Développement des PME</option>
                    <option value="Electricité"> Ministre des Ressources Hydroliques et Electricité</option>
                    <option value="Mines">Ministre des Mines</option>
                    <option value="Hydrocarbures"> Ministre des Hydrocarbures</option>
                    <option value="Emploi">Ministre de l’Emploi et Travail</option>
                    <option value="Urbanisme">Ministre de l’Urbanisme et Habitat</option>
                    <option value="Droits Humains">Ministre des Droits Humains</option>
                    <option value="Santé Publique">Ministre de la Santé Publique, Hygiène et Prévoyance Sociale</option>
                    <option value="Enseignement Supérieur">Ministre de l’Enseignement Supérieur et Universitaire</option>
                    <option value="Recherche Scientifique">Ministre de la Recherche Scientifique et Innovation Technologique</option>
                    <option value="Postes, Télécommunications et Numérique">Ministre des Postes, Télécommunications et Numérique</option>
                    <option value="Portefeuille">Ministre du Portefeuille</option>
                    <option value="Affaires sociales">Ministre des Affaires Sociales, Actions Humanitaires et Solidarité Nationale</option>
                    <option value="Commerce Extérieur"> Ministre du Commerce Extérieur</option>
                    <option value="Intégration Régionale">Ministre de l’Intégration Régionale</option>
                    <option value="Communication">Ministre de la Communication, Médias et Porte-Parole du Gouvernement</option>
                    <option value="Formation Professionnelle">Ministre de la Formation Professionnelle</option>
                    <option value="Genre, Famille et Enfant">Ministre du Genre, Famille et Enfant</option>
                    <option value="Pêche et Elevage">Ministre de la Pêche et Elevage</option>
                    <option value="Culture, Arts et Patrimoine">Ministre de la Culture, Arts et Patrimoine</option>
                    <option value="Tourisme">Ministre du Tourisme</option>
                    <option value="Jeunesse">Ministre de la Jeunesse et Éveil Patriotique</option>
                    <option value="MD Affaires Etrangères:Coopération Internationale et Francophonie">Ministre Délégué près le Ministre des Affaires Etrangères en charge de la Coopération Internationale et Francophonie</option>
                    <option value="MD Urbanisme et Habitat:Politique de la Ville">Ministre Délégué près le Ministre de l’Urbanisme et Habitat en charge de la Politique de la Ville</option>
                    <option value="MD Environnement et Développement Durable:Nouvelle Economie du Climat">Ministre Délégué près le Ministre de l’Environnement et Développement Durable en charge de la Nouvelle Economie du Climat</option>
                    <option value="MD Affaires Sociales:Personnes vivant avec Handicap">Ministre Délégué près le Ministre des Affaires Sociales en charge des Personnes vivant avec Handicap</option>
                    <option value="VM Intérieur, Sécurité, Décentralisation">Vice-Ministre de l’Intérieur, Sécurité, Décentralisation</option>
                    <option value="VM Affaires Etrangères">Vice-Ministre des Affaires Etrangères</option>
                    <option value="VM Justice et Contentieux International">Vice-Ministre de la Justice et Contentieux International</option>
                    <option value="VM Budget">Vice-Ministre du Budget</option>
                    <option value="VM Finances">Vice-Ministre des Finances</option>
                    <option value="VM Défense Nationale">Vice-Ministre de la Défense Nationale et Anciens Combattants</option>
                    <option value="VM Éducation Nationale">Vice-Ministre de l’Éducation Nationale et Nouvelle Citoyenneté</option>
                    <option value="VM Mines">Vice-Ministre des Mines</option>
                    <option value="VM Hydrocarbures">Vice-Ministre des Hydrocarbures</option>
                    <option value="VM Affaires Coutumières">Vice-Ministre des Affaires Coutumières</option>
                     
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
