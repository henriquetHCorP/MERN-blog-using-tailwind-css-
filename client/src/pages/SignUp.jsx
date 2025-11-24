import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom'
import {Alert, Button, Label, Spinner, TextInput} from 'flowbite-react'
import OAuth from '../components/OAuth';

export default function SignUp() {
  const [formData, setFormData] = useState({});
  const [errorMessage, setErrorMessage] = useState(null);
  const [loading, setLoading] = useState(false);  

  const navigate = useNavigate(); 

  const handleChange = (e) => {
    setFormData({...formData, [e.target.id]: e.target.value.trim() }); 
    // console.log(e.target.value); 
  }; 
  // console.log(formData); 
 const handleSubmit = async (e) => {
  e.preventDefault(); 
  
  if (!formData.username || !formData.email || !formData.password || !formData.confirmPassword) {
      return setErrorMessage('Veuillez remplir tous les champs.'); 
  }

  if(formData.confirmPassword !== formData.password) {
    return setErrorMessage('Les deux mots de passe saisis ne sont pas identiques')
  }
  try {

    setLoading(true); 
    setErrorMessage(null); 
     const res = await fetch('/api/auth/signup', {
      method:'POST', 
      headers: { 'Content-Type' : 'application/json' }, 
      body: JSON.stringify(formData),
     });

     const data = await res.json(); 

     if (data.success === false) {
      // return setErrorMessage(data.message); 
      setLoading(false);
      return setErrorMessage("Désolé, ces informations d'identification existent déjà, veuillez trouver une autre adresse e-mail et un autre nom d'utilisateur"); 
     }
     setLoading(false); 
     if(res.ok) {
      navigate('/sign-in');
     }
  } catch(error) {
      //  setErrorMessage(error.message);
      setErrorMessage("Désolé, ces informations d'identification existent déjà, veuillez trouver une autre adresse e-mail et un autre nom d'utilisateur");

       setLoading(false); 
  }
 }
  return (
    <div className="min-h-screen mt-20">
      <p className="text-center text-4xl text-pretty">Page d'inscription</p>
      <div className="flex p-3 max-w-3xl mx-auto flex-col md:flex-row md:items-center gap-5">
        {/* left */}
        <div className="flex-1">
          {/* <Link
           to='/'
           className="font-bold dark:text-white text-4xl"
          >
            <span className="px-2 py-1 bg-gradient-to-r from-indigo-500 via-purple-500 to-pink-500 rounded-lg text-white">
                 Sahand's
            </span>
            Blog
          </Link> */}
          {/* <img src="https://upload.wikimedia.org/wikipedia/commons/e/e1/Flag-map_of_the_Democratic_Republic_of_the_Congo.png" className="shadow-xl hover:shadow-md object-fit bg bg-none border border-2xl w-50 h-50"/>  */}
          <img src="drc-gov-social-media.png" className="shadow-xl hover:shadow-md object-fit bg bg-none w-50 h-50"/> 
          <Link
           to='/'
           className="font-bold dark:text-white text-4xl"
          >
            {/* <span className="px-2 py-1 bg-gradient-to-r from-indigo-500 via-purple-500 to-pink-500 rounded-lg text-white">
                 Sahand's
            </span>
            Blog */}
          </Link>
          <p className="text-sm mt-5">
            {/* You can sign up with your email and password or with Google. */}
            Vous pouvez vous inscrire via votre adresse e-mail et mot de passe ou votre compte Google.
          </p>
          {/* <p className="text-sm mt-5">
            This is a demo project. You can sign up with your email and password or with Google.
          </p> */}
        </div>
        {/* Right  */}
        <div className="flex-1">
          <form className="flex flex-col gap-4" onSubmit={handleSubmit}>
            <div>
              <Label value="Votre nom d'utilisateur" />
              <TextInput type='text' placeholder='Nom d&apos;utilisateur' id='username' onChange={handleChange} /> 
            </div>
            <div>
              <Label value="Votre adresse e-mail" />
              <TextInput type='email' placeholder='nom@compagnie.com' id='email' onChange={handleChange}/> 
            </div>
            <div>
              <Label value="Votre mot de passe" />
            <TextInput type='password' placeholder='Mot de passe' id='password' onChange={handleChange}/> 
            </div>
            <div>
              <Label value="confirmer votre mot de passe" />
            <TextInput type='password' placeholder='confirmer votre Mot de passe' id='confirmPassword' onChange={handleChange}/> 
            </div>
            <Button gradientDuoTone='purpleToBlue' type='submit' disabled={loading}>
              {
              loading ? (
                <>
                <Spinner size='sm' />
                <span className="pl-3">Chargement en cours... </span>
                </>
              ) : "S'inscrire"
              }
               
            </Button>
            <OAuth /> 
          </form>
          <div className="flex gap-2 text-sm mt-5">
            <span>Avez-vous un compte?</span>
            <Link to='/sign-in' className='text-blue-500' >
              Se connecter 
            </Link>
          </div>
          {errorMessage && (
            <Alert className="mt-5" color="failure">
              {errorMessage}
            </Alert>
          )}
        </div>
      </div>
     
    </div>
  )
}
