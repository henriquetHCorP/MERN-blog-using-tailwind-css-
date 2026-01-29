import React, { useEffect, useState } from 'react'; 
import { Avatar, Button, Dropdown, Navbar, NavbarLink, TextInput } from 'flowbite-react'
import { Link, useLocation, useNavigate} from 'react-router-dom';
import {AiOutlineSearch} from 'react-icons/ai'; 
import { FaMoon, FaSun } from 'react-icons/fa'; 
import { useSelector, useDispatch } from 'react-redux';
import { toggleTheme } from '../redux/theme/themeSlice';  
import { signoutSuccess } from '../redux/user/userSlice';
 
export default function Header() {
    const path =useLocation().pathname; 
    const location = useLocation(); 
    const dispatch = useDispatch(); 
    const navigate = useNavigate(); 
    const { currentUser } = useSelector((state) => state.user )
    const { theme } = useSelector((state) => state.theme)
    const [searchTerm, setSearchTerm] = useState(''); 
    // console.log(currentUser); 
    // console.log('searchTerm:', searchTerm)
      useEffect(() => {
        const urlParams = new URLSearchParams(location.search); 
        const searchTermFromUrl = urlParams.get('searchTerm'); 
        if (searchTermFromUrl) {
            setSearchTerm(searchTermFromUrl)
        }

      },[location.search]); 
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
    const handleSubmit = (e) => {
        e.preventDefault(); 
        const urlParams = new URLSearchParams(location.search); 
        urlParams.set('searchTerm', searchTerm); 
        const searchQuery = urlParams.toString(); 
        navigate(`/search?${searchQuery}`); 
        // the searchTerm is the we find inside the value inside the form below 

    }
  return (
    <Navbar className="border-b-1">
     {/* <Navbar className="bg-hcorp1 border-blue-500 border-b-1"> */}
            {/* <img src="https://upload.wikimedia.org/wikipedia/commons/e/e1/Flag-map_of_the_Democratic_Republic_of_the_Congo.png" className="shadow-lg hover:shadow-md object-fit bg bg-none border border-2xl w-20 h-20"/>  */}
            {/* <img src="/drc-gov-social-media.png" className="shadow-lg hover:shadow-md object-fit bg bg-none w-20 h-20"/>  */}
            <img src="/drc-gov-social-media.png" className="object-fit bg bg-none w-20 h-20 cursor-pointer" onClick={() => navigate('/')}/> 
        <Link to="/" className="items-center whitespace-nowrap text-sm sm:text-xl font-semibold dark:text-white shadow-xl shadow-black dark:shadow-slate-200 transition-all duration-1000 pl-3 pr-3 rounded-r-full">
            {/* <span className="px-2 py-3 bg-gradient-to-r from-blue-500 via-blue-500 to-red-500 rounded-lg text-white">
                  DRC Gov
            </span> */}
            {/* <span className="px-2 py-3 rounded-lg text-white bg-[linear-gradient(to_right,blue_33%,blue_33%_66%,blue_66%)]">
               DRC Gov
            </span> */}
             <span className="px-2 py-3 bg-gradient-to-r from-blue-800 via-blue-800 to-red-600 rounded-lg text-white">
                  DRC Gov
            </span>
             
          Social Media 
        </Link>
        <form onSubmit={handleSubmit}> 
            <TextInput
             type='text'
             placeholder='Recherche...'
             rightIcon={AiOutlineSearch}
             className="hidden lg:inline"
             value={searchTerm}
             onChange={(e)=>setSearchTerm(e.target.value) }
            />
        </form>
        <Button className="w-12 h-10 lg:hidden" color="gray" pill href='/search'>
            <AiOutlineSearch /> 
        </Button>
        <div className="flex gap-2 md:order-2">
            <Button 
            className="w-12 h-10 sm:inline"
            // className="w-12 h-10 hidden sm:inline"
            
            color='gray' 
            pill
            onClick ={()=>dispatch(toggleTheme())}
            >
                {theme === 'light' ? <FaMoon /> : <FaSun /> }
            </Button>
            {currentUser ? (
                <Dropdown
                  arrowIcon={false}
                  inline
                  label={
                    <Avatar 
                      alt="IMG"
                      img={currentUser.profilePicture}
                      rounded
                    />  
                  }
                >
                    <Dropdown.Header>
                        <span className="block text-sm">@{currentUser.username}</span>
                        <span className="block text-sm font-medium truncate">
                            {currentUser.email}</span>
                    </Dropdown.Header>
                    <Link to={'/dashboard?tab=profile'}>
                        <Dropdown.Item>Profil</Dropdown.Item>
                    </Link>
                    <Dropdown.Divider /> 
                    <Dropdown.Item onClick={handleSignout}>Se déconnecter</Dropdown.Item>

                </Dropdown>
             ) : 
            (
                <Link to='/sign-in'>
                    <Button gradientDuoTone="purpleToBlue" outline>
                        Se connecter
                    </Button>
                </Link>

            )}
            <Navbar.Toggle /> 
        </div>
            <Navbar.Collapse>
                
                <Navbar.Link active={path === "/"} as={'div'}>
                    <Link to='/'>
                        Acceuil
                    </Link>
                </Navbar.Link >
                <Navbar.Link active={path === "/about"} as={'div'}>
                    <Link to='/about'>
                        A propos
                    </Link>
                </Navbar.Link>
                <Navbar.Link active={path === "/projects"}as={'div'}>
                    <Link to='/projects'>
                       Actualités 
                    </Link>
                </Navbar.Link>
                
            </Navbar.Collapse>
     </Navbar>
  )
}
