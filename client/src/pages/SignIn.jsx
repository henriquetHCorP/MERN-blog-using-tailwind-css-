import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import {Alert, Button, Label, Spinner, TextInput} from 'flowbite-react';
import { useDispatch, useSelector } from 'react-redux'; 
import { signInStart, signInFailure, signInSuccess } from '../redux/user/userSlice'
import OAuth from '../components/OAuth';

export default function SignIn() {
  const [formData, setFormData] = useState({});
  // const [errorMessage, setErrorMessage] = useState(null);
  // const [loading, setLoading] = useState(false);  
const {loading, error:errorMessage} = useSelector(state => state.user);  
//use selector coming from our gloabal state with the name user. ^
  const dispatch = useDispatch(); 

  const navigate = useNavigate(); 

  const handleChange = (e) => {
    setFormData({...formData, [e.target.id]: e.target.value.trim() }); 
    // console.log(e.target.value); 
  }; 
  // console.log(formData); 
 const handleSubmit = async (e) => {
  e.preventDefault(); 
  if (!formData.email || !formData.password) {
      // 
      return dispatch(signInFailure('Veuillez remplir tous les champs')); 
  }
  try {
    // setLoading(true); 
    // setErrorMessage(null); 
    dispatch(signInStart()); 
     const res = await fetch('/api/auth/signin', {
      method:'POST', 
      headers: { 'Content-Type' : 'application/json' }, 
      body: JSON.stringify(formData),
     });

     const data = await res.json(); 

     if (data.success === false) {
      // return setErrorMessage(data.message); 
      dispatch(signInFailure(data.message));
     }
    //  setLoading(false); 
     if(res.ok) {
      dispatch(signInSuccess(data)); 
      // belo here, before it was just about navigating to the home page after sign success and i added the history condition.
      // navigate('/'); 
      // history.back()? history.back() : navigate('/');
      
      // navigate(-1, { preventScrollReset: true }) ;
       navigate(-1) && window.location.reload();
       
      
        
     }
  } catch(error) {
      //  setErrorMessage(error.message); 
      //  setLoading(false);
      dispatch(signInFailure(error.message));  
  }
 }
  return (
    <div className="min-h-screen mt-20">
      <p className="text-center text-4xl text-pretty">Page de connexion</p>
      <div className="flex p-3 max-w-3xl mx-auto flex-col md:flex-row md:items-center gap-5">
        {/* left */}
        <div className="flex-1">
           {/* <img src="https://upload.wikimedia.org/wikipedia/commons/e/e1/Flag-map_of_the_Democratic_Republic_of_the_Congo.png" className="shadow-xl hover:shadow-md object-fit bg bg-none border border-2xl w-50 h-50"/>  */}
           <img src="/drc-gov-social-media.png" className="shadow-xl hover:shadow-md object-fit bg bg-none w-50 h-50"/> 
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
            {/* You can sign in with your email and password or with Google. */}
            Vous pouvez vous connecter via votre adresse e-mail et mot de passe ou votre compte Google. 
          </p>
        </div>
        {/* Right  */}
        <div className="flex-1">
          <form className="flex flex-col gap-4" onSubmit={handleSubmit}>
            {/* <div>
              <Label value="Your username" />
              <TextInput type='text' placeholder='Username' id='username' onChange={handleChange} /> 
            </div> */}
            <div>
              <Label value="Votre e-mail" />
              <TextInput type='email' placeholder='nom@compagnie.com' id='email' onChange={handleChange}/> 
            </div>
            <div>
              <Label value="Votre mot de passe" />
            <TextInput type='password' placeholder='**********' id='password' onChange={handleChange}/> 
            </div>
            <Button gradientDuoTone='purpleToBlue' type='submit' disabled={loading}>
              {
              loading ? (
                <>
                <Spinner size='sm' />
                {/* <span className="pl-3">Loading... </span> */}
                <span className="pl-3">Chargement en cours... </span>
                </>
              ) : 'Se connecter'
              }
               
            </Button>
            <OAuth /> 
          </form>
          <div className="flex gap-2 text-sm mt-5">
            {/* <span>Don't have an account?</span> */}
            <span>Vous n'avez pas de compte ?</span>
            <Link to='/sign-up' className='text-blue-500' >
              S'inscrire
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
