const asyncHandler = require("express-async-handler");
const requireAuth = require("./requireAuth");
const { PrismaClient } = require("@prisma/client");
const myError = require("../lib/myError");
const prisma = new PrismaClient();

/**
 * Steps: 
 * 1. Retrive post information from request
 * 2. Verify request is from authenticated user
 * 3. Verifiy request is authorised (owner of post etc)
 * 4. Parse the id of the post to Number() back into request
 */

const ownPostAuth = [
    requireAuth,
    asyncHandler(async(req,res,next) => {
        const id = Number(req.params.postId)
        const post = await prisma.post.findUnique({
            where:{id}
        })
        
        if (!post){
            res.status(404).send(`Post with ID:${id} does not exist`);
            return;
        }
        
        if(post.userId!=req.user.id){
            throw new myError(`POST ${id} not owned by ${req.user.id}`,401)
        }
        
        req.params.postId = Number(req.params.postId) 
        //Don't have to do this in controller endpoint
        req.post = post;
        next(); //sucessful
    })
]

module.exports = ownPostAuth;