import React from 'react'

export default function about() {
  return (
    <div className="min-h-screen flex items-center justify-center">
     <div className="max-w-2xl mx-auto p-3 text-center">
      <div>
        <h1 className="text-3xl font font-semibold text-center my-7"> About Sahand'Blog</h1>
        <div className="text-md text-gray-500 flex flex-col gap-6">
          <p>
            {/* Sahand's Blog is a blog that I created to share my thoughts and ideas with the world. I am a software engineer and I love to write about my experiences and things that I have learned. 
            I hope you enjoy reading my blog.  */}
            Welcome to Sahand's Blog! This blog was created by Sahand Ghavidel as a personal project to share his thoughts and ideas with the world. Sahand is a passionate developper who loves to write about technology, coding, and everything in between. 
          </p>

          <p> On this blog, you'll find weekly articles and tutorials on topics such as web development, software enginneering, and programming languages. Sahand is always learning and eploring new technologies, so be sure to check back often for new content!
          </p>

          <p>We encourage you to leave comments on our posts and engage with other readers. You can like other people's comments and reply to them as well. we believe that a community of learners can help earch other grow and improve. </p>

        </div>

      </div>
     </div>
      
    </div>
  )
}
