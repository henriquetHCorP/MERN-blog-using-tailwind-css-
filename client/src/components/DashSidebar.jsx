import { Sidebar } from 'flowbite-react'; 
import { useEffect, useState } from 'react';
import { HiUser , HiArrowSmRight, HiDocumentText, HiOutlineUserGroup, HiAnnotation, HiChartPie} from 'react-icons/hi'; 
import { useDispatch } from 'react-redux';
import { Link, useLocation } from 'react-router-dom'
import { signoutSuccess } from '../redux/user/userSlice';
import { useSelector } from 'react-redux'; 


export default function DashSidebar() {

    const armoiries = ()=>{
        return (
          <div className='justify-start'>
            <img src ='/armoiries2.png' height='25px' width='25px'/>
          </div>
        )
    } 

    const location = useLocation(); 
    const dispatch = useDispatch(); 
    const { currentUser } = useSelector(state => state.user); 
    const [tab, setTab] = useState(''); 
    useEffect( () => {
        const urlParams = new URLSearchParams(location.search);
        const tabFromUrl = urlParams.get('tab'); 
        if (tabFromUrl){
            setTab(tabFromUrl)
        }
    }, [location.search]); 

    const handleSignout = async () => {
        try {
            const res = await fetch('api/user/signout', {
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

  return (
    <Sidebar className="w-full md:w-56">
        <Sidebar.Items>
            <Sidebar.ItemGroup className="flex flex-col gap-1">
                <Link to='/dashboard?tab=profile'>
                    {
                        currentUser && currentUser.isAdmin && (
                            <Link to='/dashboard?tab=dash'>
                                <Sidebar.Item
                                active={tab === 'dash' || !tab}
                                  icon={HiChartPie}
                                  as='div'
                                >
                                  {/* Dashboard */}
                                  Tableau de bord
                                </Sidebar.Item>
                            
                            </Link>
                        )
                    }
                
                <Sidebar.Item 
                   active={tab === 'profile' } 
                   icon={HiUser} 
                   label={currentUser.isAdmin ? 'CellCom' : 'Utilisateur'} 
                   labelColor='dark'
                   as='div'
                   >
                    Profil
                </Sidebar.Item>
                </Link>
                {currentUser.isAdmin && (
                <Link to='/dashboard?tab=adms'>
                    <Sidebar.Item
                      active={tab === 'adms'}
                      // icon={HiOutlineUserGroup}
                      icon={armoiries}
                      
                      as='div'
                    >
                       Cellcoms (Tous)
                    </Sidebar.Item>
                </Link>
                ) }
                {currentUser.isAdmin && (
                <Link to='/dashboard?tab=posts'>
                    <Sidebar.Item
                      active={tab === 'posts'}
                      icon={HiDocumentText}
                      as='div'
                    >
                      Articles
                    </Sidebar.Item>
                </Link>
                ) }


                {currentUser.isAdmin && (
                    <>
                    <Link to='/dashboard?tab=users'>
                    <Sidebar.Item
                      active={tab === 'users'}
                      icon={HiOutlineUserGroup}
                      as='div'
                    >
                      Utilisateurs
                    </Sidebar.Item>
                 </Link>



                   
                 


                 <Link to='/dashboard?tab=comments'>
                 <Sidebar.Item
                   active={tab === 'comments'}
                   icon={HiAnnotation}
                   as='div'
                 >
                   Commentaires 
                 </Sidebar.Item>
             </Link>
             </>

                ) }
                <Sidebar.Item icon={HiArrowSmRight} className="cursor-pointer" onClick={handleSignout}>
                    Se déconnecter 
                </Sidebar.Item>
            </Sidebar.ItemGroup>
        </Sidebar.Items>
    </Sidebar>
  )
}
