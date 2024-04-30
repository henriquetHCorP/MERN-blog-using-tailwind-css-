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