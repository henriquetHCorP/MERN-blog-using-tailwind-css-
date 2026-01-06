import React, { useEffect, useState } from 'react'; 
import moment from 'moment'; 



import { Button, Textarea } from 'flowbite-react';
import { FaThumbsUp} from 'react-icons/fa'; 
import { useSelector } from 'react-redux';




moment.locale('fr', {
    months : 'janvier_février_mars_avril_mai_juin_juillet_août_septembre_octobre_novembre_décembre'.split('_'),
    monthsShort : 'janv._févr._mars_avr._mai_juin_juil._août_sept._oct._nov._déc.'.split('_'),
    monthsParseExact : true,
    weekdays : 'dimanche_lundi_mardi_mercredi_jeudi_vendredi_samedi'.split('_'),
    weekdaysShort : 'dim._lun._mar._mer._jeu._ven._sam.'.split('_'),
    weekdaysMin : 'Di_Lu_Ma_Me_Je_Ve_Sa'.split('_'),
    weekdaysParseExact : true,
    longDateFormat : {
        LT : 'HH:mm',
        LTS : 'HH:mm:ss',
        L : 'DD/MM/YYYY',
        LL : 'D MMMM YYYY',
        LLL : 'D MMMM YYYY HH:mm',
        LLLL : 'dddd D MMMM YYYY HH:mm'
    },
    calendar : {
        sameDay : '[Aujourd’hui à] LT',
        nextDay : '[Demain à] LT',
        nextWeek : 'dddd [à] LT',
        lastDay : '[Hier à] LT',
        lastWeek : 'dddd [dernier à] LT',
        sameElse : 'L'
    },
    relativeTime : {
        future : 'dans %s',
        past : 'il y a %s',
        s : 'quelques secondes',
        m : 'une minute',
        mm : '%d minutes',
        h : 'une heure',
        hh : '%d heures',
        d : 'un jour',
        dd : '%d jours',
        M : 'un mois',
        MM : '%d mois',
        y : 'un an',
        yy : '%d ans'
    },
    dayOfMonthOrdinalParse : /\d{1,2}(er|e)/,
    ordinal : function (number) {
        return number + (number === 1 ? 'er' : 'e');
    },
    meridiemParse : /PD|MD/,
    isPM : function (input) {
        return input.charAt(0) === 'M';
    },
    // In case the meridiem units are not separated around 12, then implement
    // this function (look at locale/id.js for an example).
    // meridiemHour : function (hour, meridiem) {
    //     return /* 0-23 hour, given meridiem token and hour 1-12 */ ;
    // },
    meridiem : function (hours, minutes, isLower) {
        return hours < 12 ? 'PD' : 'MD';
    },
    week : {
        dow : 1, // Monday is the first day of the week.
        doy : 4  // Used to determine first week of the year.
    }
});




export default function Comment({comment, onLike, onEdit, onDelete}) {
    const [user, setUser ] = useState({}); 
    const [isEditing, setIsEditing] = useState(false); 
    const [editedContent, setEditedContent] = useState(comment.content); 
    const {currentUser} = useSelector((state) => (state.user)); 

    
    // console.log(user); 
    useEffect(() => {
         const getUser = async () => {
            try {
               const res = await fetch(`/api/user/${comment.userId}`); 
               const data = await res.json(); 
               if(res.ok) {
                setUser(data); 
               }
            }catch(error) {
                console.log(error.message)
            }
         } 
         getUser(); 
    }, [comment]); 

  
  const filterUrls = (text) => {
    // Regex finds common URL patterns (http/https/ftp and www. or just text.domain)
    const urlRegex = /(https?:\/\/[^\s]+|www\.[^\s]+|[a-zA-Z0-9]+\.[^\s]+)/gi;
    return text.replace(urlRegex, '[Lien retiré]');
  };

  const handleEdit = () => {
    setIsEditing(true); 
    setEditedContent(comment.content); 

  }

  const handleSave = async () => {
    try {
      const res = await fetch(`/api/comment/editComment/${comment._id}`, {
        method:'PUT', 
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          content:editedContent
        })
      });
      if(res.ok) {
        setIsEditing(false); 
        onEdit(comment, editedContent)
      } 
    } catch(error) {
      console.log(error.message); 
    }


  }
   
  return (
    <>
    {/* <div className="flex gap-1 justify-end">
            <button type="button" onClick={() => onPostLike(post._Id)} className="text-gray-400 hover:text-blue-500">
              <FaThumbsUp className="text-xl"/> 
            </button>
            <p>Like this Post</p> 
          </div> */}
          
    <div className="flex p-4 border-b dark:border-gray-600 text-sm">
      
        <div className="flex-shrink-0 mr-3">
          
            <img  className="w-10 h-10 rounded-full bg-gray-200" 
              src={user.profilePicture} 
              alt={user.username} 
              /> 
        </div>
        <div className="flex-1">
            {/* <div > */}
            <div className ="flex items-center mb-1">
                {/* below, anonymous user in case the user has been deleted  */}
                <span className="font-bold mr-1 text-xs truncate">{user ? `@${user.username}` : 'Utilisateur supprimé'}</span>
                <span className="text-gray-500 text-xs">
                  
                  {moment(comment.createdAt).fromNow()}</span>
            </div>
            {isEditing? (
              <>
              <Textarea
               className="mb-2"
               value={editedContent}
               onChange={(e) => setEditedContent(e.target.value)}
              />
              <div className="flex justify-end gap-2 text-xs">
                <Button
                  type='button'
                  size='sm'
                  gradientDuoTone='purpleToBlue'
                  onClick={handleSave}
                  disabled={editedContent === "" || editedContent.trim() === "" || editedContent.includes('AFC') || editedContent.includes('M23') || editedContent.includes('Afc') || editedContent.includes('afc') || editedContent.includes('M23') || editedContent.includes('M 2 3') || editedContent.includes('m 2 3') || editedContent.includes('m23') || editedContent.includes('KAGAME') || editedContent.includes('Kagame') || editedContent.includes('kagame') || editedContent.includes('NANGA') || editedContent.includes('Nanga') || editedContent.includes('NANGAA') || editedContent.includes('Nangaa') || editedContent.includes('nanga') || editedContent.includes('Willy Ngoma') || editedContent.includes('willy ngoma') || editedContent.includes('VISIT RWANDA') || editedContent.includes('Visit Rwanda') || editedContent.includes('Alliance Fleuve Congo') || editedContent.includes('alliance fleuve congo') || editedContent.includes('ALLIANCE FLEUVE CONGO') || editedContent.includes('M-23') || editedContent.includes('M/23') || editedContent.includes('m-23') || editedContent.includes('m/ 2 3') || editedContent.includes('M/ 2 3') || editedContent.includes('m/23') || editedContent.includes('Alliance fleuve congo') || editedContent.includes('Alliance Fleuve congo')}
                >
                    Enregister 
                </Button>
                <Button
                  type='button'
                  size='sm'
                  gradientDuoTone='purpleToBlue'
                  outline
                  onClick= {() => setIsEditing(false)}
                >
                    Annuler
                </Button>
              </div>
              </>
            ) : ( 
              
          <>
          <p className="text-gray-500 pb-2">{filterUrls(comment.content)}</p>
            <div className="flex items-center pt-2 text-xs border-t dark:border-gray-700 max-w-fit gap-2">
              <button 
                 type='button' 
                 onClick = {() => onLike(comment._id)}
                 className={`text-gray-400 hover:text-blue-500 ${currentUser && comment.likes.includes(currentUser._id) && '!text-blue-500'}`}>
                <FaThumbsUp  className="text-sm"/> 
                </button>
                <p className="text-gray-400">
                  {
                    comment.numberOfLikes > 0 && comment.numberOfLikes + " " +(comment.numberOfLikes === 1 ? "like" : "likes")
                  }
                </p>
                {
                  currentUser && (currentUser._id === comment.userId || currentUser.isAdmin) && (
                    <>
                    <button
                      type='button'
                      className="text-gray-400 hover:text-blue-500"
                      onClick={handleEdit}
                      // we dont't need to create and handleEdit function in the CommentSection because doing so will affect all the others comments. we just need to update this comment 
                    >
                          Editer
                    </button>
                    <button
                    type='button'
                    onClick={() => onDelete(comment._id)}
                    className="text-gray-400 hover:text-red-500"
                    // we dont't need to create and handleEdit function in the CommentSection because doing so will affect all the others comments. we just need to update this comment 
                  >
                        Supprimer
                  </button>
                  </>
                  )
                }
            </div>
          </>
            )  
            }
            
        </div>
     
    </div>
    </>
  )
}
