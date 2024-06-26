import { Button, Select, Spinner, TextInput } from 'flowbite-react'
import React, { useEffect, useState } from 'react'
import { useLocation, useNavigate } from 'react-router-dom';
import PostCard from '../components/PostCard'; 

export default function Search() {
  const [sidebarData, setSidebarData] = useState({
    searchTerm:'', 
    sort:'desc', 
    category:'uncategorized', 
  }); 

  console.log(sidebarData); 
  const [posts, setPosts] = useState([]); 
  const [loading, setLoading] = useState(false); 
  const [showMore, setShowMore] = useState(false); 

  const location = useLocation();
  const navigate = useNavigate(); 
  
  useEffect(() => {
    const urlParams = new URLSearchParams(location.search); 
    const searchTermFromUrl = urlParams.get('searchTerm'); 
    const sortFromUrl = urlParams.get('sort'); 
    const categoryFromUrl = urlParams.get('category'); 
    if (searchTermFromUrl || sortFromUrl || categoryFromUrl){
      setSidebarData({
        ...sidebarData, 
        searchTerm:searchTermFromUrl,
        sort:sortFromUrl,
        category:categoryFromUrl,  
      })
    }; 
    const fetchPosts = async() => {
      setLoading(true); 
      const searchQuery = urlParams.toString(); 
      const res = await fetch(`/api/post/getposts?${searchQuery}`); 
      if (!res.ok) {
         setLoading(false); 
         return; 
      }
      if(res.ok) {
        const data = await res.json(); 
        setPosts(data.posts); 
        setLoading(false); 
        if (data.posts.length === 9) {
          setShowMore(true); 
        } else {
          setShowMore(false); 
        }
      }
    }
    fetchPosts();
  },
  [location.search]); 

  const handleChange = (e) => {
     if(e.target.id === 'searchTerm'){
      setSidebarData({...sidebarData, searchTerm:e.target.value}); 
     }

     if (e.target.id === 'sort') {
      const order = e.target.value || 'desc'; 
      setSidebarData({...sidebarData, sort: order}); 
     }

     if (e.target.id === 'category') {
      const category = e.target.value || 'uncategorized';
      setSidebarData({...sidebarData, category});

     }
  }
  const handleSubmit = (e) => {

    e.preventDefault();
    const urlParams = new URLSearchParams(location.search); 
    urlParams.set('searchTerm', sidebarData.searchTerm); 
    urlParams.set('sort', sidebarData.sort); 
    urlParams.set('category', sidebarData.category);
    const searchQuery = urlParams.toString(); 
    navigate(`/search?${searchQuery}`); 
  }; 

  const handleShowMore = async() => {
    const numberOfPosts = posts.length; 
    const startIndex = numberOfPosts; 
    const urlParams = new URLSearchParams(location.search);
    urlParams.set('startIndex', startIndex); 
    const searchQuery = urlParams.toString(); 
    const res = await fetch(`/api/post/getposts?${searchQuery}`); 
    if(!res.ok){
      return;
    }
    
    if(res.ok) {
      const data = await res.json(); 
      setPosts([...posts, ...data.posts]); 
      if(data.posts.length === 9) {
        setShowMore(true);
      } else {
        setShowMore(false); 
      }
    }


  }
  return (
    <div className="flex flex-col md:flex-row">
      <div className="p-7 border-b md:border-r md:min-h-screen border-gray-500">
        <form className="flex flex-col gap-8" onSubmit={handleSubmit}>
          <div className="flex items-center gap-2">
            <label className="whitespace-nowrap font-semibold">Search Term:</label>
            <TextInput placeholder='Search...'
             id='searchTerm' type='text'
             value={sidebarData.searchTerm}
             onChange={handleChange}
            /> 

          </div>
          <div className="flex items-center gap-2">
            <label className="font-semibold"> Sort:</label>
            <Select
              onChange={handleChange}
              value={sidebarData.sort}
              id='sort'
            >
              <option value='desc'>Latest</option>
              <option value='asc'>Oldest</option>

            </Select>

          </div>
          <div className="flex items-center gap-2">
            {/* <label className="font-semibold"> Category:</label> */}
            <label className="font-semibold"> Ministry:</label>
            <Select
              onChange={handleChange}
              value={sidebarData.category}
              id='category'
            >
              {/* <option value='uncategorized'>Uncategorized</option>
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
                    <option value="MinistryHealthCare">Ministry of Health Care </option>
                    <option value="MinistryForeignAffairs">Ministry of Foreign Affairs</option>
                    <option value="henriquet">KAPEMA HENRIQUET</option>
                    <option value="henriquet">KAPEMA HENRIQUET</option>
                    <option value="henriquet">KAPEMA HENRIQUET</option>
                    <option value="henriquet">KAPEMA HENRIQUET</option>
            </Select> */}
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
          <Button type='submit' outline gradientDuoTone='purpleToPink'>
                  Appy Filters 
          </Button>
        </form>
      </div>
      <div className="w-full">
        <h1 className="text-3xl font-semibold sm:border-b border-gray-500 p-3 mt-5">Posts results:</h1>
         <div className="p-7 flex flex-wrap gap-4">
             {!loading && posts.length === 0 && (
              <p className="text-xl text-gray-500">No posts found. </p>
            )}
            {loading && <p className="text-xl text-gray-500">Loading ...</p> && <Spinner />}
            {!loading && posts && posts.map((post ) => (
              <PostCard key={post._id} post={post}/> 
            ))}

            {
              showMore && <button onClick={handleShowMore} className="text-teal-500 text-lg hover:underline p-7 w-full">Show More</button>
            }
         </div>
      </div>

    </div>
  )
}



