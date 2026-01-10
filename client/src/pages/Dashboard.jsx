import { useEffect, useState } from 'react';
import {useLocation } from 'react-router-dom'; 
import DashSidebar from '../components/DashSidebar';
import DashProfile from '../components/DashProfile';
import DashPosts from '../components/DashPosts';
import DashUsers from '../components/DashUsers';
import DashAdms from '../components/DashAdms';
import DashComments from '../components/DashComments';
import DashboardComp from '../components/DashboardComp';

export default function Dashboard() {
  const location = useLocation(); 
  const [tab, setTab] = useState(''); 
  useEffect(() => {
    const urlParams = new URLSearchParams(location.search)
    const tabFromUrl = urlParams.get('tab')
    if(tabFromUrl){
      setTab(tabFromUrl); 
    }
    // console.log(tabFromUrl); 
  }, [location.search])

  window.history.replaceState(null, '', '/')
  return (
    <div className="min-h-screen flex flex-col md:flex-row">
     <div className="md:w-56">
      {/* Sidebar */}
      <DashSidebar /> 
     </div>
     {/* Profile... */}
     {tab === 'profile' && <DashProfile /> }
     {/* posts... */}
     {tab === 'posts' && <DashPosts />}
     {/* adms */}
     {tab === 'adms' && <DashAdms />}
     {/* users  */}
     {tab ==='users' && <DashUsers /> }
     {/* comments */}
     {tab ==='comments' && <DashComments /> }
     {/* Dashboard Comp  */}
     {tab ==='dash' && <DashboardComp /> }
    </div>

  )
}
