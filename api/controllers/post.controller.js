 import { errorHandler } from "../utils/error.js"
import  Post from '../models/post.model.js'
import  User from '../models/user.model.js'
import nodemailer from 'nodemailer';

export const create = async (req, res, next ) => {
     
     

const transporter = nodemailer.createTransport({
  service: 'gmail',
  auth: {
    user: process.env.EMAIL_USER, // Your Gmail address
    pass: process.env.EMAIL_PASS // The 16-character App Password, NOT your regular password
  },
  tls: {
        rejectUnauthorized: false // <--- This line bypasses the error
    }
});


    if (!req.user.isAdmin) {
        return next(errorHandler(403, 'Vous n’êtes pas autorisé à créer d’article'));
    }
    if (!req.body.title || !req.body.content || !req.body.category || req.body.category === "...") {
        return next(errorHandler(400, 'Veuillez remplir tous les champs obligatoires'))
    }
    const slug = req.body.title
         .split(' ')
         .join('-')
         .toLowerCase()
         .replace(/[^a-zA-Z0-9-]/g, ''); 
    const newPost = new Post({
        ...req.body, 
        slug, 
        userId: req.user.id, 
    }); 
    try {
         const savedPost = await newPost.save(); 
           
          // 2. Fetch all user emails from the database
    const users = await User.find({}, 'email'); // Get all users, only select email field
    const userEmails = users.map(user => user.email).join(', '); // Format as comma-separated list
     
    // 3. Send notification emails
    const mailOptions = {
      from: process.env.EMAIL_USER,
      bcc: userEmails, // All recipient emails
      subject: "Une nouvelle publication vient de paraître",
      html: `<p>Titre de la publication: <strong>${newPost.title}</strong></p>
              <p>Auteur:<strong>${newPost.category}(CellCom)</strong><p/>
      `
    };

    transporter.sendMail(mailOptions, (error, info) => {
      if (error) {
        console.error('Email sending error:', error);
      } else {
        console.log('Emails sent successfully:', info.response);
      }
    });

    //res.status(201).json({ message: 'Post created and notifications sent' });
    res.status(201).json(savedPost);
        }catch(error){
            res.status(500).json({ error: error.message });
        next(error); 
    }
}; 

export const getposts = async (req, res, next ) => {
    try {
        //parseInt will convert to integer and if there's no start index or number use 0; 
       const startIndex = parseInt(req.query.startIndex) || 0 ;
       //parseInt will convert the req.query.limit to an integer and if there's no integer limit use 9;
       const limit = parseInt(req.query.limit) || 9; 
       //sort direction , 1 is for ascending order and -1 is for descending order;
       const sortDirection = req.query.order === 'asc'? 1 : -1; 
       const posts = await Post.find({
        ...(req.query.userId && { userId: req.query.userId }), 
        ...(req.query.category && { category: req.query.category }), 
        ...(req.query.slug && {slug: req.query.slug }), 
        ...(req.query.postId && {_id: req.query.postId}), 
        ...(req.query.searchTerm && {
            $or: [
                // i means lowercase or uppercase doesn't matter, or it's not case sensitive; 
                { title: { $regex: req.query.searchTerm, $options: 'i' } },
                { content: { $regex: req.query.searchTerm, $options: 'i'} },  
            ],
        }),
    }).sort({ updatedAt: sortDirection })
      .skip(startIndex)
      .limit(limit);
    
      const totalPosts = await Post.countDocuments(); 

      const now =  new Date(); 
      
      //console.log(now.getMonth()); 

      const oneMonthAgo = new Date(
        now.getFullYear(), 
        now.getMonth() - 1, 
        now.getDate()
      );
      //console.log(now.getMonth(), now.getDate(), now.getFullYear());
      //console.log(oneMonthAgo); 
      const lastMonthPosts = await Post.countDocuments({
             //$gte: greater than
        createdAt:{$gte:oneMonthAgo}
      }); 

      res.status(200).json({
        posts, 
        totalPosts, 
        lastMonthPosts, 
      })
    }catch(error){
       next(error); 
    }
}

export const deletepost = async (req, res, next) => {
    if (!req.user.isAdmin || req.user.id !== req.params.userId) {
       return next(errorHandler(403, 'You are not allowed to delete this post')); 
    }
    try {
         await Post.findByIdAndDelete(req.params.postId); 
         res.status(200).json("L'article a été supprimé"); 
    } catch(error) {
        next(error)
    }
}

// export const updatepost = async (req, res, next) => {
//     if (!req.user.isAdmin || req.user.id !== req.params.userId) {
//       return next(errorHandler(403, 'You are not allowed to update this post'));
//     }
//     try {
//       const updatedPost = await Post.findByIdAndUpdate(
//         req.params.postId,
//         {
//           $set: {
//             title: req.body.title,
//             content: req.body.content,
//             category: req.body.category,
//             image: req.body.image,
//           },
//         },
//         { new: true }
//       );
//       res.status(200).json(updatedPost);
//     } catch (error) {
//       next(error);
//     }
//   };
  export const updatepost = async (req, res, next ) => {

     if (!req.user.isAdmin || req.user.id !== req.params.userId) {
            return next(errorHandler(403, 'You are not allowed to update this post')); 
     }

     if (!req.body.title || !req.body.content || !req.body.category || req.body.category === "...") {
        return next(errorHandler(400, 'Veuillez remplir tous les champs obligatoires'))
    }

     try {
         const updatedPost = await Post.findByIdAndUpdate(
          req.params.postId,
          {
            $set: {
              title:req.body.title, 
              content:req.body.content, 
              category: req.body.category, 
              image: req.body.image,
            },
          }, 
            { new: true } 
          );
          res.status(200).json(updatedPost)
          console.log("image:", req.body.image);
          
     }catch(error){
      next(error); 
     }
  }
 
  // export const likePost = async(req, res, next) => {
  //    try {
  //       const post = await Post.findById(req.params.postId); 
  //       if(!post){
  //         return next(errorHandler(404, 'Post not found')); 
  //       }
  //       // we wanna check if any user has already like the post 
  //       const userIndex = post.likes.indexOf(req.user.id); 
  //       if (userIndex === -1) {
  //         post.numberOfLikes+= -1; 
  //         // userIndex === -1 means the user is not found inside the user array, we will push to  add him
  //         post.likes.push(req.user.id); 
  //       } else {
  //         // we will user splice to remove the user if he's found inside the array. 1 means that the user is found and has to be removed
  //         post.numberOfLikes -=1; 
  //         post.likes.splice(userIndex, 1); 
  //       }
  //       await post.save(); 
  //       res.status(200).json(post); 
  //    } catch(error) {
  //       next(error); 
  //    }
  // }