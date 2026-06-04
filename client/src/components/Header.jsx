import React, { useEffect, useRef, useState } from 'react'; 
import { Avatar, Button, Dropdown, DropdownItem, Navbar, NavbarLink, TextInput } from 'flowbite-react'
import { Link, useLocation, useNavigate} from 'react-router-dom';
import {AiOutlineSearch} from 'react-icons/ai'; 
import { FaMoon, FaSun } from 'react-icons/fa'; 
import { useSelector, useDispatch } from 'react-redux';
import { toggleTheme } from '../redux/theme/themeSlice';  
import { signoutSuccess } from '../redux/user/userSlice';
import toast from 'react-hot-toast';
import { differenceInDays, isYesterday } from 'date-fns';
 
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


    const [recentArticles, setRecentArticles] = useState([]);
  const [loading, setLoading] = useState(true);

  const [isOpen, setIsOpen] = useState(false);

   const [refreshTrigger, setRefreshTrigger] = useState(0); 

  const triggerRefetch = () => {
    setRefreshTrigger(prev => prev + 1); // Increments to force useEffect to run
  };

  const now =  new Date(); 
  now.setDate(now.getDate()); 

    // const postDate = new Date(recentArticles.createdAt)
  //     const postsWithDates = recentArticles.map(post => {
  //   return {
  //     ...post,
  //     postDate: new Date(post.createdAt)
  //   };
  // });
  const postDate = new Date(recentArticles[0]?.createdAt);
    // console.log("post date:",postDate ); 
  useEffect(() => {
    const fetchRecentArticles = async () => {
      try {
        const response = await fetch('/api/post/recent');
        const data = await response.json();
        setRecentArticles(data);
          // console.log("recent articles", data)
      } catch (error) {
        console.error('Error fetching recent articles:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchRecentArticles();
  } , [[refreshTrigger]]);


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
                // console.log("data info:", data); 
                toast.success('Votre déconnexion à DRC Gov Social Media a été effectuée avec succès.', {duration:7000})
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
     const timerRef = useRef(null);
     const handleMouseEnter = () => {
    timerRef.current = setTimeout(() => {
      toast.success(theme === 'light'?'Passer au mode nuit': 'Passer au mode jour', {
//     duration: 1500,
//     icon: theme === 'light' ? <FaMoon/> : '☀️',
//   }), {
        duration: 1500,
        icon: theme === 'light' ? <FaMoon/> : '☀️',
      });
    }, 500);
  };
  const handleMouseLeave = () => {
    clearTimeout(timerRef.current);
  };

  const customTheme = {
  link: {
    active: {
      on: "bg-blue-700 text-white dark:text-white md:bg-transparent md:text-blue-700 rounded-2xl",
      off: "border-b border-gray-100 text-gray-700 rounded-2xl hover:bg-gray-50 dark:border-gray-700 dark:text-gray-400 dark:hover:bg-gray-700 dark:hover:text-white md:border-0 md:hover:bg-transparent md:hover:text-blue-700 md:dark:hover:bg-transparent md:dark:hover:text-white"
    }
  }
};
  return (
    <Navbar theme={customTheme} className="border-b-1">
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
//             onMouseEnter={()=> setTimeout(()=>{
//                 toast(theme === 'light'?'Passer au mode nuit': 'Passer au mode jour', {
//     duration: 1500,
//     icon: theme === 'light' ? <FaMoon/> : '☀️',
//   })
//             },1000)}
           onPointerEnter={handleMouseEnter}
           onPointerLeave={handleMouseLeave}
            
            color='gray' 
            pill
            onClick ={()=>dispatch(toggleTheme())}
            >
                {/* {theme === 'light' ? <FaMoon /> : <FaSun /> } */}
                {theme === 'light' ? <FaMoon /> :'☀️'}
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
                        {/* <Dropdown.Item>Profil</Dropdown.Item> */}
                        <Dropdown.Item>Mon compte</Dropdown.Item>
                    </Link>
                    <Dropdown.Divider />
                    <Link to={`/user/${currentUser._id}`}>
                        {/* <Dropdown.Item>Profil</Dropdown.Item> */}
                        <Dropdown.Item>Mon profil</Dropdown.Item>
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
                <Link to='/'>
                <Navbar.Link active={path === "/"} as={'div'}>
                    <Link to='/'>
                        Acceuil
                    </Link>
                </Navbar.Link >
                </Link>
                <Link to='/about'>
                <Navbar.Link active={path === "/about"} as={'div'}>
                    <Link to='/about'>
                        A propos
                    </Link>
                </Navbar.Link>
                </Link>
                <Link to='/projects'>
                <Navbar.Link active={path === "/projects"}as={'div'}>
                    <Link to='/projects'>
                       Actualités 
                    </Link>
                </Navbar.Link>
                </Link>
                
            </Navbar.Collapse>
            {currentUser && <Dropdown 
              // {currentUser && postDate.getMonth() === now.getMonth() && postDate.getFullYear() === now.getFullYear() && postDate.getDate() === now.getDate() || postDate.getMonth() === now.getMonth() && postDate.getFullYear() === now.getFullYear() && postDate.getDate() === now.getDate() - 1 || postDate.getMonth() === now.getMonth() - 1 && postDate.getFullYear() === now.getFullYear() && postDate.getDate() === 30 && now.getDate() === 1 || postDate.getMonth() === now.getMonth() - 1 && postDate.getFullYear() === now.getFullYear() && postDate.getDate() === 31 && now.getDate() === 1 || postDate.getMonth() === now.getMonth() - 1 && postDate.getFullYear() === now.getFullYear() - 1 && postDate.getDate() === 31 && now.getDate() === 1|| postDate.getDate() === 31 && postDate.getMonth() === 11 && now.getDate() === 1 && now.getMonth() === 0 && postDate.getFullYear() === now.getFullYear() - 1 || postDate.getMonth() === now.getMonth() - 1 && postDate.getFullYear() === now.getFullYear() && postDate.getDate() === 28 && now.getDate() === 1 || postDate.getMonth() === now.getMonth() - 1 && postDate.getFullYear() === now.getFullYear() && postDate.getDate() === 29 && now.getDate() === 1 &&  <Dropdown
          // className="" size="xs" label='🔔' outline gradientDuoTone='purpleToBlue'
          // theme={{
          // inlineWrapper: "p-0 bg-transparent text-xl hover:text-blue-500", // Style the inner content
          // arrowIcon: "hidden"// Optional: Hide the default arrow icon
           size="md"
           
      renderTrigger={() => (
        <button onChange={()=>triggerRefetch()}
        className="text-md p-2 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-700"
        >
          🔔
          
        </button>
      )}
                
        > 

        
        {/* <button className="dropbtn">Recent Articles</button> */}
        <Dropdown.Header className="dropdown-content">
          {loading ? (
              // <span>Loading...</span>
              <div class="flex items-center justify-center">
  <div class="h-8 w-8 animate-spin rounded-full border-4 border-solid border-blue-600 border-t-transparent"></div>
</div>
          ) : (
            recentArticles?.map?.(post => (
                <Dropdown.Item onClick={()=> navigate(`/post/${post.slug}`)} className="border dark:border-gray-600 rounded-tl-xl rounded-tr-xl rounded-bl-xl rounded-br-xl flex flex-col md:flex-col lg:flex-row gap-1"
                  
                
                >
                  <div className="flex flex-col gap-1">
                  {new Date(post.createdAt).toDateString() === new Date().toDateString() 
  && <p className="text-xs pl-2 pr-2 bg-red-700 hover:bg-red-800 transition-all duration-700 text-white cursor-pointer text-md font-bold rounded-full shadow-lg hover:shadow-2xl">Aujourd'hui</p> 
 
}
{isYesterday(new Date(post.createdAt)) && (
  <p className="text-xs pl-2 pr-2 bg-green-700 hover:bg-green-800 transition-all duration-700 text-white cursor-pointer text-md font-bold rounded-full shadow-lg hover:shadow-2xl">Hier</p>
)}
      {/* {console.log("diff:", differenceInDays(new Date(), new Date(post.createdAt)))} */}
    {differenceInDays(new Date(), new Date(post.createdAt)) === 1 && (
    <p className="text-xs pl-2 pr-2 bg-yellow-400 hover:bg-yellow-500 transition-all duration-700 text-white cursor-pointer text-md font-bold rounded-full shadow-lg hover:shadow-2xl">Il y a 1 jour</p>
  )}
  {differenceInDays(new Date(), new Date(post.createdAt)) === 2 && (
    <p className="text-xs pl-2 pr-2 bg-yellow-400 hover:bg-yellow-500 transition-all duration-700 text-white cursor-pointer text-md font-bold rounded-full shadow-lg hover:shadow-2xl">Il y a 2 jours</p>
  )}
  {differenceInDays(new Date(), new Date(post.createdAt)) === 3 && (
    <p className="text-xs pl-2 pr-2 bg-yellow-400 hover:bg-yellow-500 transition-all duration-700 text-white cursor-pointer text-md font-bold rounded-full shadow-lg hover:shadow-2xl">Il y a 3 jours</p>
  )}
  {differenceInDays(new Date(), new Date(post.createdAt)) === 4 && (
    <p className="text-xs pl-2 pr-2 bg-yellow-400 hover:bg-yellow-500 transition-all duration-700 text-white cursor-pointer text-md font-bold rounded-full shadow-lg hover:shadow-2xl">Il y a 4 jours</p>
  )}
  {differenceInDays(new Date(), new Date(post.createdAt)) === 5 && (
    <p className="text-xs pl-2 pr-2 bg-yellow-400 hover:bg-yellow-500 transition-all duration-700 text-white cursor-pointer text-md font-bold rounded-full shadow-lg hover:shadow-2xl">Il y a 5 jours</p>
  )}
  {differenceInDays(new Date(), new Date(post.createdAt)) === 6 && (
    <p className="text-xs pl-2 pr-2 bg-yellow-400 hover:bg-yellow-500 transition-all duration-700 text-white cursor-pointer text-md font-bold rounded-full shadow-lg hover:shadow-2xl">Il y a 6 jours</p>
  )}
  {differenceInDays(new Date(), new Date(post.createdAt)) === 7 && (
    <p className="text-xs pl-2 pr-2 bg-yellow-400 hover:bg-yellow-500 transition-all duration-700 text-white cursor-pointer text-md font-bold rounded-full shadow-lg hover:shadow-2xl">Il y a 7 jours</p>
  )}
  {differenceInDays(new Date(), new Date(post.createdAt)) === 8 && (
    <p className="text-xs pl-2 pr-2 bg-yellow-400 hover:bg-yellow-500 transition-all duration-700 text-white cursor-pointer text-md font-bold rounded-full shadow-lg hover:shadow-2xl">Il y a 8 jours</p>
  )}
  {differenceInDays(new Date(), new Date(post.createdAt)) === 9 && (
    <p className="text-xs pl-2 pr-2 bg-yellow-400 hover:bg-yellow-500 transition-all duration-700 text-white cursor-pointer text-md font-bold rounded-full shadow-lg hover:shadow-2xl">Il y a 9 jours</p>
  )}
  {differenceInDays(new Date(), new Date(post.createdAt)) === 10 && (
    <p className="text-xs pl-2 pr-2 bg-yellow-400 hover:bg-yellow-500 transition-all duration-700 text-white cursor-pointer text-md font-bold rounded-full shadow-lg hover:shadow-2xl">Il y a 10 jours</p>
  )}
  {differenceInDays(new Date(), new Date(post.createdAt)) === 11 && (
    <p className="text-xs pl-2 pr-2 bg-yellow-400 hover:bg-yellow-500 transition-all duration-700 text-white cursor-pointer text-md font-bold rounded-full shadow-lg hover:shadow-2xl">Il y a 11 jours</p>
  )}
  {differenceInDays(new Date(), new Date(post.createdAt)) === 12 && (
    <p className="text-xs pl-2 pr-2 bg-yellow-400 hover:bg-yellow-500 transition-all duration-700 text-white cursor-pointer text-md font-bold rounded-full shadow-lg hover:shadow-2xl">Il y a 12 jours</p>
  )}
  {differenceInDays(new Date(), new Date(post.createdAt)) === 13 && (
    <p className="text-xs pl-2 pr-2 bg-yellow-400 hover:bg-yellow-500 transition-all duration-700 text-white cursor-pointer text-md font-bold rounded-full shadow-lg hover:shadow-2xl">Il y a 13 jours</p>
  )}
  {differenceInDays(new Date(), new Date(post.createdAt)) === 14 && (
    <p className="text-xs pl-2 pr-2 bg-yellow-400 hover:bg-yellow-500 transition-all duration-700 text-white cursor-pointer text-md font-bold rounded-full shadow-lg hover:shadow-2xl">Il y a 14 jours</p>
  )}
  {differenceInDays(new Date(), new Date(post.createdAt)) === 15 && (
    <p className="text-xs pl-2 pr-2 bg-yellow-400 hover:bg-yellow-500 transition-all duration-700 text-white cursor-pointer text-md font-bold rounded-full shadow-lg hover:shadow-2xl">Il y a 15 jours</p>
  )}
  {differenceInDays(new Date(), new Date(post.createdAt)) === 16 && (
    <p className="text-xs pl-2 pr-2 bg-yellow-400 hover:bg-yellow-500 transition-all duration-700 text-white cursor-pointer text-md font-bold rounded-full shadow-lg hover:shadow-2xl">Il y a 16 jours</p>
  )}
  {differenceInDays(new Date(), new Date(post.createdAt)) === 17 && (
    <p className="text-xs pl-2 pr-2 bg-yellow-400 hover:bg-yellow-500 transition-all duration-700 text-white cursor-pointer text-md font-bold rounded-full shadow-lg hover:shadow-2xl">Il y a 17 jours</p>
  )}
  {differenceInDays(new Date(), new Date(post.createdAt)) === 18 && (
    <p className="text-xs pl-2 pr-2 bg-yellow-400 hover:bg-yellow-500 transition-all duration-700 text-white cursor-pointer text-md font-bold rounded-full shadow-lg hover:shadow-2xl">Il y a 18 jours</p>
  )}
  {differenceInDays(new Date(), new Date(post.createdAt)) === 19 && (
    <p className="text-xs pl-2 pr-2 bg-yellow-400 hover:bg-yellow-500 transition-all duration-700 text-white cursor-pointer text-md font-bold rounded-full shadow-lg hover:shadow-2xl">Il y a 19 jours</p>
  )}
  {differenceInDays(new Date(), new Date(post.createdAt)) === 20 && (
    <p className="text-xs pl-2 pr-2 bg-yellow-400 hover:bg-yellow-500 transition-all duration-700 text-white cursor-pointer text-md font-bold rounded-full shadow-lg hover:shadow-2xl">Il y a 20 jours</p>
  )}
  {differenceInDays(new Date(), new Date(post.createdAt)) === 21 && (
    <p className="text-xs pl-2 pr-2 bg-yellow-400 hover:bg-yellow-500 transition-all duration-700 text-white cursor-pointer text-md font-bold rounded-full shadow-lg hover:shadow-2xl">Il y a 21 jours</p>
  )}
  {differenceInDays(new Date(), new Date(post.createdAt)) === 22 && (
    <p className="text-xs pl-2 pr-2 bg-yellow-400 hover:bg-yellow-500 transition-all duration-700 text-white cursor-pointer text-md font-bold rounded-full shadow-lg hover:shadow-2xl">Il y a 22 jours</p>
  )}
  {differenceInDays(new Date(), new Date(post.createdAt)) === 23 && (
    <p className="text-xs pl-2 pr-2 bg-yellow-400 hover:bg-yellow-500 transition-all duration-700 text-white cursor-pointer text-md font-bold rounded-full shadow-lg hover:shadow-2xl">Il y a 23 jours</p>
  )}
  {differenceInDays(new Date(), new Date(post.createdAt)) === 24 && (
    <p className="text-xs pl-2 pr-2 bg-yellow-400 hover:bg-yellow-500 transition-all duration-700 text-white cursor-pointer text-md font-bold rounded-full shadow-lg hover:shadow-2xl">Il y a 24 jours</p>
  )}
  {differenceInDays(new Date(), new Date(post.createdAt)) === 25 && (
    <p className="text-xs pl-2 pr-2 bg-yellow-400 hover:bg-yellow-500 transition-all duration-700 text-white cursor-pointer text-md font-bold rounded-full shadow-lg hover:shadow-2xl">Il y a 25 jours</p>
  )}
  {differenceInDays(new Date(), new Date(post.createdAt)) === 26 && (
    <p className="text-xs pl-2 pr-2 bg-yellow-400 hover:bg-yellow-500 transition-all duration-700 text-white cursor-pointer text-md font-bold rounded-full shadow-lg hover:shadow-2xl">Il y a 26 jours</p>
  )}
  {differenceInDays(new Date(), new Date(post.createdAt)) === 27 && (
    <p className="text-xs pl-2 pr-2 bg-yellow-400 hover:bg-yellow-500 transition-all duration-700 text-white cursor-pointer text-md font-bold rounded-full shadow-lg hover:shadow-2xl">Il y a 27 jours</p>
  )}
  {differenceInDays(new Date(), new Date(post.createdAt)) === 28 && (
    <p className="text-xs pl-2 pr-2 bg-yellow-400 hover:bg-yellow-500 transition-all duration-700 text-white cursor-pointer text-md font-bold rounded-full shadow-lg hover:shadow-2xl">Il y a 28 jours</p>
  )}
  {differenceInDays(new Date(), new Date(post.createdAt)) === 29 && (
    <p className="text-xs pl-2 pr-2 bg-yellow-400 hover:bg-yellow-500 transition-all duration-700 text-white cursor-pointer text-md font-bold rounded-full shadow-lg hover:shadow-2xl">Il y a 28 jours</p>
  )}
    {/* {differenceInDays(new Date(), new Date(post.createdAt)) >= 13 && differenceInDays(new Date(), new Date(post.createdAt)) <= 365 && (
      <p className="text-xs pl-2 pr-2 bg-blue-700 hover:bg-blue-800 transition-all duration-700 text-white cursor-pointer text-md font-bold rounded-full shadow-lg hover:shadow-2xl<"> Auparavant</p>
    )} */}
  {differenceInDays(new Date(), new Date(post.createdAt)) >= 30 && differenceInDays(new Date(), new Date(post.createdAt)) < 60 && (
    <p className="text-xs pl-2 pr-2 bg-blue-700 hover:bg-blue-800 transition-all duration-700 text-white cursor-pointer text-md font-bold rounded-full shadow-lg hover:shadow-2xl"> Il y a un mois</p>
  )}
  {differenceInDays(new Date(), new Date(post.createdAt)) >= 60 && differenceInDays(new Date(), new Date(post.createdAt)) < 90 && (
    <p className="text-xs pl-2 pr-2 bg-blue-700 hover:bg-blue-800 transition-all duration-700 text-white cursor-pointer text-md font-bold rounded-full shadow-lg hover:shadow-2xl"> Il y a deux mois</p>
  )}
  {differenceInDays(new Date(), new Date(post.createdAt)) >= 90 && differenceInDays(new Date(), new Date(post.createdAt)) < 120 && (
    <p className="text-xs pl-2 pr-2 bg-blue-700 hover:bg-blue-800 transition-all duration-700 text-white cursor-pointer text-md font-bold rounded-full shadow-lg hover:shadow-2xl"> Il y a trois mois</p>
  )}
  {differenceInDays(new Date(), new Date(post.createdAt)) >= 120 && differenceInDays(new Date(), new Date(post.createdAt)) < 150 && (
    <p className="text-xs pl-2 pr-2 bg-blue-700 hover:bg-blue-800 transition-all duration-700 text-white cursor-pointer text-md font-bold rounded-full shadow-lg hover:shadow-2xl"> Il y a quatre mois</p>
  )}
  {differenceInDays(new Date(), new Date(post.createdAt)) >= 150 && differenceInDays(new Date(), new Date(post.createdAt)) < 180 && (
    <p className="text-xs pl-2 pr-2 bg-blue-700 hover:bg-blue-800 transition-all duration-700 text-white cursor-pointer text-md font-bold rounded-full shadow-lg hover:shadow-2xl"> Il y a cinq mois</p>
  )}
  {differenceInDays(new Date(), new Date(post.createdAt)) >= 180 && differenceInDays(new Date(), new Date(post.createdAt)) < 210 && (
    <p className="text-xs pl-2 pr-2 bg-blue-700 hover:bg-blue-800 transition-all duration-700 text-white cursor-pointer text-md font-bold rounded-full shadow-lg hover:shadow-2xl"> Il y a six mois</p>
  )}
  {differenceInDays(new Date(), new Date(post.createdAt)) >= 210 && differenceInDays(new Date(), new Date(post.createdAt)) <= 240 && (
    <p className="text-xs pl-2 pr-2 bg-blue-700 hover:bg-blue-800 transition-all duration-700 text-white cursor-pointer text-md font-bold rounded-full shadow-lg hover:shadow-2xl"> Il y a sept mois</p>
  )}
  {differenceInDays(new Date(), new Date(post.createdAt)) >= 240 && differenceInDays(new Date(), new Date(post.createdAt)) <  270 && (
    <p className="text-xs pl-2 pr-2 bg-blue-700 hover:bg-blue-800 transition-all duration-700 text-white cursor-pointer text-md font-bold rounded-full shadow-lg hover:shadow-2xl"> Il y a huit mois</p>
  )}
  {differenceInDays(new Date(), new Date(post.createdAt)) >= 270 && differenceInDays(new Date(), new Date(post.createdAt)) <= 300 && (
    <p className="text-xs pl-2 pr-2 bg-blue-700 hover:bg-blue-800 transition-all duration-700 text-white cursor-pointer text-md font-bold rounded-full shadow-lg hover:shadow-2xl"> Il y a neuf mois</p>
  )}
  {differenceInDays(new Date(), new Date(post.createdAt)) >= 300 && differenceInDays(new Date(), new Date(post.createdAt)) < 330 && (
    <p className="text-xs pl-2 pr-2 bg-blue-700 hover:bg-blue-800 transition-all duration-700 text-white cursor-pointer text-md font-bold rounded-full shadow-lg hover:shadow-2xl"> Il y a dix mois</p>
  )}
  {differenceInDays(new Date(), new Date(post.createdAt)) >= 330 && differenceInDays(new Date(), new Date(post.createdAt)) < 360 && (
    <p className="text-xs pl-2 pr-2 bg-blue-700 hover:bg-blue-800 transition-all duration-700 text-white cursor-pointer text-md font-bold rounded-full shadow-lg hover:shadow-2xl"> Il y a onze mois</p>
  )}
  {differenceInDays(new Date(), new Date(post.createdAt)) >= 360 && differenceInDays(new Date(), new Date(post.createdAt)) < 365 && (
    <p className="text-xs pl-2 pr-2 bg-blue-700 hover:bg-blue-800 transition-all duration-700 text-white cursor-pointer text-md font-bold rounded-full shadow-lg hover:shadow-2xl"> Il y a onze mois</p>
  )}
  {differenceInDays(new Date(), new Date(post.createdAt)) >= 365 && differenceInDays(new Date(), new Date(post.createdAt)) < 730 && (
    <p className="text-xs pl-2 pr-2 bg-amber-600 hover:bg-amber-700 transition-all duration-700 text-white cursor-pointer text-md font-bold rounded-full shadow-lg hover:shadow-2xl"> Il y a une année</p>
  )}
  {differenceInDays(new Date(), new Date(post.createdAt)) >= 730 && (
    <p className="text-xs pl-2 pr-2 bg-stone-500 hover:bg-stone-600 transition-all duration-700 text-white cursor-pointer text-md font-bold rounded-full shadow-lg hover:shadow-2xl"> Il y a longtemps</p>
  )}
                  <Avatar 
                  alt="IMG"
                      img={post.image}
                      onClick={()=> navigate(`/post/${post.slug}`)}
                      className=""
                      rounded
              />
              </div>
                    <div className="flex flex-col justify-start items-start">
                      <Link key={post._id} to={`/post/${post.slug}`} className='flex flex-col md:justify-start md:items-start'>
                <Button size="xs" color="none" className='flex justify-start item-start' >{post.title.slice(0, 180)} {post.title.length > 181? "...":""}</Button><p className="italic rounded px-2 text-xs">{post.category}</p>
              
              </Link>
            
                      </div>
              <Dropdown.Divider />
                </Dropdown.Item>
                  
                
                
              
            ))
          )}
        </Dropdown.Header>
      </Dropdown>}
     </Navbar>
  )
}
