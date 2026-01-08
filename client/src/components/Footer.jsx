import React from 'react'
import { Footer } from 'flowbite-react'
import { Link } from 'react-router-dom'
import { BsFacebook, BsTwitter, BsInstagram, BsDribbble, BsGithub} from 'react-icons/bs'

export default function FooterCom() {
  return (
    <Footer container className="border border-t-8 border-blue-500">
   {/* <Footer container className="border border-t-8 border-blue-500 bg-hcorp1"> */}
        <div className="w-full max-w-7xl mx-auto">
            <div className="grid w-full justify-between sm:flex md:grid-cols-1">
                <div className="flex flex-1 gap-12">
                    {/* <Link
                      to='/'
                      className="self-center whitespace-nowrap text-lg sm:text-xl font-semibold dark:text-white"
                    >
                      <span className="px-2 py-1 bg-gradient-to-r from-indigo-500 via-purple-500 to-pink-500 rounded-lg text-white">
                         Sahand's
                        </span>
                        Blog                     
                    </Link> */}
                     {/* <img src="https://upload.wikimedia.org/wikipedia/commons/e/e1/Flag-map_of_the_Democratic_Republic_of_the_Congo.png" className="shadow-lg hover:shadow-md object-fit bg bg-none border border-2xl w-20 h-20"/>  */}
                     <img src="/drc-gov-social-media.png" className="shadow-lg hover:shadow-md object-fit bg bg-none w-20 h-20"/> 
        <Link to="/" className="pt-3 items-center whitespace-nowrap text-sm sm:text-xl font-semibold dark:text-white">
        <div className="mt-4 shadow-xl shadow-black dark:shadow-slate-200 pl-3 pr-3 rounded-r-full">
           <span className="px-2 py-3 bg-gradient-to-r from-blue-500 via-blue-500 to-red-500 rounded-lg text-white">
                  DRC Gov
            </span>
          Social Media 
        </div>
            
        </Link>
                </div>
                <div className="pt-6 grid grid-cols-2 gap-8 mt-4 sm:grid-cols-2 sm:gap-6">
                   <div>
                   <Footer.Title title='Institutions'/>
                   <Footer.LinkGroup col>
                    {/* <Footer.Link 
                       href='https://www.github.com/henriquetkapema'
                       target='_blank'
                       rel='noopener no referrer'
                    > */}
                     <Footer.Link 
                       href='https://www.presidence.cd/'
                       target='_blank'
                       rel='noopener no referrer'
                    > 

                      La Présidence
                    </Footer.Link>
                    <Footer.Link 
                       href='https://assembleenationale.cd/'
                       target='_blank'
                       rel='noopener no referer'
                    >
                      L'Assemblée Nationale  
                    </Footer.Link>
                    <Footer.Link 
                       href='https://www.senat.cd'
                       target='_blank'
                       rel='noopener no referer'
                    >
                       Le Sénat 
                    </Footer.Link>
                    <Footer.Link 
                       href='https://www.primature.cd'
                       target='_blank'
                       rel='noopener no referer'
                    >
                       Le Gouvernement 
                    </Footer.Link>
                   </Footer.LinkGroup>
                   </div>
                   <div>
                   <Footer.Title title='A propos'/>
                   <Footer.LinkGroup col>
                    {/* <Footer.Link 
                       href='https://www.100jsprojects.com'
                       target='_blank'
                       rel='noopener no referrer'
                    >
                        100 JS Projects
                    </Footer.Link> */}
                    <Footer.Link 
                       href='/about'
                       target='_blank'
                       rel='noopener no referer'
                    >
                        DRC Gov Social Media 
                    </Footer.Link>
                   </Footer.LinkGroup>
                   </div>
                   
                </div>
            </div>
            <Footer.Divider/> 
            {/* <Footer.Divider className="border-blue-500"/>  */}
            <div className="w-full sm:flex sm:items-center sm:justify-between">
                <Footer.Copyright 
                 href='#'
                 by="Sofware Engineering Facility"
                 year={new Date().getFullYear()}
                /> 
                <div className="flex gap-6 sm:mt-0 mt-4 sm:justify-center">
                    <Footer.Icon href="#" icon={BsFacebook}/>
                    <Footer.Icon href="#" icon={BsInstagram}/>
                    <Footer.Icon href="#" icon={BsTwitter}/>
                    {/* <Footer.Icon href="https://www.github.com/sahandghavidel" icon={BsGithub}/> */}
                    {/* <Footer.Icon href="#" icon={BsDribbble}/> */}
                    
                </div>
            </div>

        </div>
    </Footer>
    
  )
}
