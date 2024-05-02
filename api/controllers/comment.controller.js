import Comment from "../models/comment.model.js";

//  import  Comment  from "/models/comment.model.js"
export const createComment = async (req, res, next) => {
    try {
         const { content, postId, userId} = req.body; 
         // ibelow, f the userId is not the same as the one inside the cookie, "you'are not allow to comment"
          if (userId !== req.user.id){
            return next(errorHandler(403, 'You are not allowed to create this comment')); 
          }
          const newComment = new Comment({
            content,
            postId,
            userId,
          }); 

          await newComment.save(); 

          res.status(200).json(newComment); 
        } catch(error) {
        next(error); 
    }
}

export const getPostComments = async (req, res, next) =>{
    try {
       const comments = await Comment.find({ postId:req.params.postId}).sort({
        // createdAt: -1 means sort and show results with the newest at the top
        createdAt: -1,  
    }); 
    res.status(200).json(comments); 

    } catch (error) {
         next(error)
    }
}

export const likeComment = async (req, res, next) => {
  try {
      const comment = await Comment.findById(req.params.commentId); 
      if(!comment) {
        return next(errorHandler(404,'Comment not found '))
      }
      const userIndex = comment.likes.indexOf(req.user.id); 
      // if the user index === -1 means the user index is not inside te array of the users associated with that comment, you can add him by means of "push"
      if(userIndex === -1) {
        comment.numberOfLikes +=1; 
        comment.likes.push(req.user.id); 
      } else {
        //! means the user Id is already there, you can remove him my means of splice 
        comment.numberOfLikes -=1; 
        comment.likes.splice(userIndex, 1); 
      }
      await comment.save(); 
      res.status(200).json(comment); 
  } catch(error) {
    next(error)
  }
}

