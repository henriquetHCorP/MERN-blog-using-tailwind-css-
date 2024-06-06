import React from 'react'

export default function Privacy() {
  return (
    <div className="min-h-screen flex items-center justify-center">
     <div className="max-w-2xl mx-auto text-center">
      <div>
        <h1 className="text-3xl p-2 font font-semibold text-center my-2"> Privacy & Policy</h1>
        <div className="text-md text-gray-500 flex flex-col gap-3">
          <p>
            {/* Sahand's Blog is a blog that I created to share my thoughts and ideas with the world. I am a software engineer and I love to write about my experiences and things that I have learned. 
            I hope you enjoy reading my blog.  */}
            {/* Welcome to Sahand's Blog! This blog was created by Sahand Ghavidel as a personal project to share his thoughts and ideas with the world. Sahand is a passionate developper who loves to write about technology, coding, and everything in between.  */}
            The policies we have in place are to protect your personal information, which we store onto secured servers. By using this Social Media, you consent that all personal data, submitted onto this social media, can be processed in the manner and for the purposes described in the documentation: to serve as credentials for authentication. 
          </p>
            
          {/* <p>We encourage you to leave comments on our posts and engage with other readers. You can like other people's comments and reply to them as well. we believe that a community of learners can help earch other grow and improve. </p> */}
           <p>
           When you become an administrator or a guest, you will automatically be notified on new posts and comments published by users on this social media.  
           </p>
             <p>
             Information obtained about you will assist us in identifying any accounts with bad intentions like to spread false information and insults. Consequently, we will block them permanently from this social media.  
             </p>
        </div>

      </div>
     </div>
      
    </div>
  )
}
