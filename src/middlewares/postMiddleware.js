const { ObjectId } = require("mongodb");
const { decodeObjectId } = require("../utils/objectIdBase62");
const { getPostById } = require("../models/postsModel");

async function postExists(req, res, next) {
    const postId = decodeObjectId(req.params.postId);

    try {
        new ObjectId(postId);
    }
    catch (error) {
        const err = new Error("Post nie istnieje");
        err.status = 404;
        return next(err);
    }

    const post = await getPostById(postId); 
    if (!post) {
        const err = new Error("Post nie istnieje");
        err.status = 404;
        return next(err);
    }

    next();
}

async function isPostOwner(req, res, next) {
    const postId = decodeObjectId(req.params.postId);
    const userId = req.session?.user?.id;

    const post = await getPostById(postId);

    if (post.authorId.toString() !== userId) {
        const err = new Error("Nie masz uprawnień do edycji tego posta");
        err.status = 403;
        return next(err);
    }

    next();
}

module.exports = { postExists, isPostOwner };