import { Button } from 'flowbite-react'
import React from 'react'

export default function CallToAction() {
  return (
    <div className="flex flex-col sm:flex-row p-3 border border-blue-500 justify-center items-center rounded-tl-3xl rounded-br-3xl text-center">
      <div className="flex-1 justify-center flex flex-col">
        <h2 className="text-2xl">
            Want to learn more about the DRC? 
        </h2>
        <p className="text-gray-500 my-2">
            Checkout these resources at the Prime Minister office website
        </p>
        <Button gradientDuoTone='purpleToBlue' className="rounded-tl-xl rounded-bl-none">
            {/*here we are using achored tag instead of link because this will open an external link */}
           <a href="https://www.primature.cd" target='_blank' rel='noopener noreferrer'> Learn More</a>
            
        </Button>
        </div>
        {/* <div className="p-7 flex-1"> */}
        <div className="p-7 flex-1">
             {/* <img src="https://cdn.cfr.org/sites/default/files/styles/open_graph_article/public/image/2023/03/Burundi%20Soldiers%2003142023%20.jpeg"/>  */}
             {/* <img src = "https://media.istockphoto.com/id/497156586/photo/kinshasa-central-business-district-congo-skyline.jpg?s=612x612&w=0&k=20&c=b2U33n-K7pIp3qI9FdQVtwZZng3H7sRlxG-la7vBKLk="/>   */}
             <img src="/government suminwa.jpeg" className='opacity-100'/> 
        </div> 
    </div>
  )
}
