import { Button, Select, Spinner, TextInput } from 'flowbite-react'
import React, { useEffect, useState } from 'react'
import { useLocation, useNavigate } from 'react-router-dom';
import PostCard from '../components/PostCard'; 

export default function Search() {
  const [sidebarData, setSidebarData] = useState({
    searchTerm:'', 
    // sort:'desc', 
    order:'desc',
    category:'uncategorized', 
  }); 

  //console.log(sidebarData); 
  const [posts, setPosts] = useState([]); 
  const [loading, setLoading] = useState(false); 
  const [showMore, setShowMore] = useState(false); 

  const location = useLocation();
  const navigate = useNavigate(); 
  
  useEffect(() => {
    const urlParams = new URLSearchParams(location.search); 
    const searchTermFromUrl = urlParams.get('searchTerm'); 
    const sortFromUrl = urlParams.get('order'); 
     
    const categoryFromUrl = urlParams.get('category'); 
    if (searchTermFromUrl || sortFromUrl || categoryFromUrl){
      setSidebarData({
        ...sidebarData, 
        searchTerm:searchTermFromUrl,
        order:sortFromUrl,
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

     if (e.target.id === 'order') {
      const order = e.target.value || 'desc'; 
      setSidebarData({...sidebarData, order: order}); 
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
    urlParams.set('order', sidebarData.order); 
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
            <label className="whitespace-nowrap font-semibold">Recherche:</label>
            <TextInput placeholder='Recherche...'
             id='searchTerm' type='text'
             value={sidebarData.searchTerm}
             onChange={handleChange}
            /> 

          </div>
          <div className="flex items-center gap-2">
            <label className="font-semibold"> Trier:</label>
            <Select
              onChange={handleChange}
              value={sidebarData.order}
              id='order'
            >
               <option value='desc'>Du plus récent au plus ancien</option>
              <option value='asc'>Du plus ancien au plus récent</option>


            </Select>

          </div>
          <div className="flex items-center gap-2">
            {/* <label className="font-semibold"> Category:</label> */}
            <label className="font-semibold"> Catégorie:</label>
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
            {/* <option value="uncategorized ">Select a Minister</option> */}
                    {/* <option value="javascript">JavaScript</option>
                    <option value="reactjs">React.js</option> */}
                     {/* <option value="...">Selectioner un Ministre</option> */}
                    {/* <option value="javascript">JavaScript</option>
                    <option value="reactjs">React.js</option> */}
                     
                     <option value="...">Selectioner la Présidence ou un Ministre</option>
                    {/* <option value="javascript">JavaScript</option>
                    <option value="reactjs">React.js</option> */}
                      {/* {<option value="...">Selectioner la Présidence ou un Ministre correspondant à la publication</option>} */}
                    {<option value="Présidence">Présidence</option>}
                    {<option value="Premier Ministre">Premier Ministre</option>}
                    {<option value="Interieur">VPM, Ministre de l'Intérieur, Sécurité, Décentralisation et Affaires coutumières</option>}
                    {<option value="Transport">VPM, Ministre de Transports, Voies de Communication et Désenclavement</option>}
                    {<option value="Défense">VPM, Ministre de la Défense Nationale et Anciens Combattants</option>}
                    {<option value="Economie">VPM, Ministre de l’Economie Nationale</option>}
                    {<option value="Budget">VPM, Ministre du Budget</option>}
                    {<option value="Fonction Publique">VPM, Ministre de la Fonction Publique, Modernisation de l’Administration et Innovation du Service Public</option>}
                    {<option value="Plan">MINETAT, Ministre du Plan et de la Coordination de l’Aide au Développement</option>}
                    {<option value="Affaires Etrangères">MINETAT, Ministre des Affaires Etrangères, Coopération Internationale, Francophonie et Diaspora Congolaise</option>}
                    {<option value="Agriculture">MINETAT, Ministre de l’Agriculture et Sécurité Alimentaire</option>}
                    {<option value="Industrie">MINETAT, Ministre de l’Industrie</option>}
                    {<option value="Sociales">MINETAT, Ministre des Affaires Sociales, Actions Humanitaires et Solidarité Nationale</option>}  
                    {<option value="Justice">MINETAT, Ministre de la Justice et Garde des Sceaux</option>}
                    {<option value="Hydrocarbures">MINETAT, Ministre des Hydrocarbures</option>} 
                    {<option value="Education Nationale">MINETAT, Ministre de l’Education Nationale et Nouvelle Citoyenneté</option>}
                    {<option value="Formation Professionelle">MINETAT, Ministre de la Formation Professionnelle</option>} 
                    {<option value="Urbanisme et Habitat">MINETAT, Ministre de l'Urbanisme et Habitat</option>} 
                    {<option value="Développement Rural">MINETAT, Ministre du Développement Rural</option>}
                    {<option value="Relations avec le Parlement">MINETAT, Ministre des Relations avec le Parlement</option>}
                    {<option value="Finances">Ministre des Finances</option>}
                    {<option value="Santé Publique">Ministre de la Santé Publique, Hygiène et Prévoyance Sociale</option>}
                    {<option value="Commerce Extérieur">Ministre du Commerce Extérieur</option>} 
                    {<option value="Environnement">Ministre de l’Environnement, Développement Durable et Nouvelle Economie du Climat</option>}
                    {<option value="Infrastructures">Ministre des Infrastructures et Travaux Publics</option>}
                    {<option value="Enseignement Supérieur, Recherche et Innovation">Ministre de l'Enseignement Supérieur, Universitaire, Recherche Scientifique et Innovations</option>}
                    {<option value="Emploi et Travail">Ministre de l’Emploi et Travail</option>}
                    {<option value="Postes et Télécommunications">Ministre des Postes et Télécommunications</option>}
                    {<option value="Economie Numérique">Ministre de l'Economie Numérique</option>}
                    {<option value="Mines">Ministre des Mines</option>}
                    {<option value="Ressources Hydroliques et Electricité"> Ministre des Ressources Hydroliques et Electricité</option>}
                    {<option value="Communication">Ministre de la Communication, Médias et Porte-Parole du Gouvernement</option>}
                    {<option value="Entrepreneuriat et PME">Ministre de Entrepreneuriat et Développement des Petites et Moyennes Entreprises</option>}
                    {<option value="Aménagement du Territoire">Ministre de l’Aménagement du Territoire</option>}
                    {<option value="Tourisme">Ministre du Tourisme</option>}
                    {<option value="Pêche et Elevage">Ministre de la Pêche et Elevage</option>}
                    {<option value="Culture, Arts et Patrimoine">Ministre de la Culture, Arts et Patrimoine</option>}
                    {<option value="Droits Humains">Ministre des Droits Humains</option>}
                    {<option value="Intégration Régionale">Ministre de l’Intégration Régionale</option>}
                    {<option value="Affaires Foncières">Ministre des Affaires Foncières</option>}
                    {<option value="Sports">Ministre des Sports et Loisirs</option>}
                    {<option value="Portefeuille">Ministre du Portefeuille</option>}
                    {<option value="Genre, Famille et Enfants">Ministre du Genre, Famille et Enfants</option>}
                    {<option value="Jeunesse">Ministre de la Jeunesse</option>}
                    
                    {<option value="MD Affaires Etrangères:Francophonie et Diaspora Congolaise">Ministre Délégué près le Ministre des Affaires Etrangères en charge de la Francophonie et de la Diaspora Congolaise</option>} 
                    {<option value="MD Environnement et Développement Durable">Ministre Délégué près le Ministre de l’Environnement et Développement Durable en charge de la Nouvelle Economie du Climat</option>}
                    {<option value="MD Urbanisme et Habitat">Ministre Délégué près le Ministre de l’Urbanisme et Habitat en charge de la Politique de la Ville</option>}         
                    {<option value="MD Affaires Sociales">Ministre Délégué près le Ministre des Affaires Sociales en charge des Personnes vivant avec Handicap</option>}
                    {<option value="MD Défense Nationale">Ministre Délégué près le Ministre de la Défense Nationale en Charge des Anciens Combattants</option>}

                    {<option value="VM Budget">Vice-Ministre du Budget</option>}
                    {<option value="VM Intérieur, Sécurité, Décentralisation">Vice-Ministre de l’Intérieur, Sécurité, Décentralisation</option>}
                    {<option value="VM Affaires Etrangères">Vice-Ministre des Affaires Etrangères</option>}
                    {<option value="VM Finances">Vice-Ministre des Finances</option>}
                    {<option value="VM Éducation Nationale">Vice-Ministre de l’Éducation Nationale et Nouvelle Citoyenneté</option>}
                    {<option value="VM Affaires Coutumières">Vice-Ministre des Affaires Coutumières</option>}
                     
                    {/* <option value="henriquet">KAPEMA HENRIQUET</option>
                    <option value="henriquet">KAPEMA HENRIQUET</option>
                    <option value="henriquet">KAPEMA HENRIQUET</option>
                    <option value="henriquet">KAPEMA HENRIQUET</option> */}
                    {/* <option value="henriquet">KAPEMA HENRIQUET</option>
                    <option value="henriquet">KAPEMA HENRIQUET</option>
                    <option value="henriquet">KAPEMA HENRIQUET</option>
                    <option value="henriquet">KAPEMA HENRIQUET</option> */}
                </Select>
          </div>
          <Button type='submit' outline gradientDuoTone='purpleToBlue'>
                  Appliquer les filtres  
          </Button>
        </form>
      </div>
      <div className="w-full">
        <h1 className="text-3xl font-semibold sm:border-b border-gray-500 p-3 mt-5">{posts && posts.length > 1 ? "Résultats de la recherche:" : "Résultat de la recherche"}</h1>
         <div className="p-7 flex flex-wrap gap-4">
             {!loading && posts.length === 0 && (
              <p className="text-xl text-gray-500">Aucune publication trouvée. </p>
            )}
            {loading && <p className="text-xl text-gray-500">Chargement en cours ...</p> && <Spinner />}
            {!loading && posts && posts.map((post ) => (
              <PostCard key={post._id} post={post}/> 
            ))}

            {
              // showMore && <button onClick={handleShowMore} className="text-teal-500 text-lg hover:underline p-7 w-full">Show More</button>
              // showMore && <button onClick={handleShowMore} className=" pl-4 pr-4 bg-blue-300 hover:bg-blue-500 hover:text-black-800 dark:bg-blue-800 dark:text-white transition-all duration-700 text-lg rounded-full shadow-lg hover:underline">Show More</button>
              //showMore && <button onClick={handleShowMore} className="text-gray-700 hover:text-blue-500 transition-all duration-700 text-lg hover:underline p-7 w-full dark:text-white">Voir plus</button>
              // showMore && 
              // <footer className="">
              // <Button onClick={handleShowMore}  
              // gradientDuoTone="purpleToBlue" className='rounded-full transition-all duration-1000 dark:!from-green-500 dark:!to-blue-500 dark:text-white-500 text-lg shadow-lg'>
              //   Voir plus
              //   </Button>
              //   </footer>
            }
         </div>
         { showMore && 
              <div className="p-4 flex items-center justify-center">
              <Button onClick={handleShowMore}  
              gradientDuoTone="purpleToBlue" className='rounded-full transition-all duration-1000 dark:!from-green-500 dark:!to-blue-500 dark:text-white-500 text-lg shadow-lg'>
                Voir plus
                </Button>
                </div>}
      </div>

    </div>
  )
}



