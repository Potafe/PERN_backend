const router = require("express").Router();
const controller = require("../controllers/postController")
const requireAuth = require("../middleware/requireAuth")
const ownPostAuth = require("../middleware/ownPostAuth")

//Get all POST by recency, OPTIONAL: user
router.get("/:userId?", controller.getManyPosts)

// GET a single POST
router.get("/:postId", controller.getPost)

// GET a post by users who userId is followingo
router.get("/following",
    requireAuth,
    controller.getFollowingPosts
)

// POST a new post
router.post("/",
    requireAuth,
    controller.createPost
)

// DELETE a post
router.delete("/:postId",
    ownPostAuth,
    controller.deletePost
)

// UPDATE a post
router.patch(":/postId",
    ownPostAuth,
    controller.updatePost
)
 
module.exports = router;