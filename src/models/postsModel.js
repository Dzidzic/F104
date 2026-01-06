const { ObjectId } = require("mongodb");
const { getDB } = require("../data/connection");

async function getCommunityPosts(communityId, tagFilter, sortField = "createdAt", order = -1) {
    const db = getDB();
    
    const filter = { communityId: new ObjectId(communityId) };
    if (tagFilter) {
        const safeTag = tagFilter.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");

        filter.tags = { $regex: safeTag, $options: "i" };
    }

    return await db
        .collection("posts")
        .find(filter)
        .sort({ [sortField]: order })
        .toArray();       
}

async function getPostById(postId) {
    const db = getDB();
    return await db
        .collection("posts")
        .findOne({ _id: new ObjectId(postId) });
}

async function findPostByName(title, commId) {
    const db = getDB();
    return await db
        .collection("posts")
        .findOne({ 
            title: { $regex: `^${title}$`, $options: "i" }, 
            communityId: new ObjectId(commId) 
        });
}

async function createPost(values) {
    const db = getDB();
    const existingPost = await findPostByName(values.title, values.communityId);

    if(existingPost)
        return "postExist";

    return await db.collection("posts").insertOne({ 
        title: values.title,
        content: values.content,
        communityId: new ObjectId(values.communityId),
        authorId: new ObjectId(values.authorId),
        tags: values.parsedTags,  
        isSpoiler: values.isSpoiler,
        createdAt: new Date(),
    });
}

async function updatePost(postId, values) {
    const db = getDB();
    const existingPost = await findPostByName(values.title, values.communityId);

    if(existingPost && existingPost._id.toString() !== postId)
        return "postExist";

    return await db.collection("posts").updateOne(
        { _id: new ObjectId(postId) },
        { $set: {
            title: values.title,
            content: values.content,
            tags: values.parsedTags,
            isSpoiler: values.isSpoiler,
        }}
    );
}

async function likePost(postId, value) {
    const db = getDB();

    return await db.collection("posts").updateOne(
        { _id: new ObjectId(postId) },
        { $inc: { likes: value } }
    );
}

async function deletePost(postId) {
    const db = getDB();
    return await db.collection("posts").deleteOne({ _id: new ObjectId(postId) });
}

async function deleteCommunityPosts(communityId) {
    const db = getDB();
    return await db.collection("posts").deleteMany({ communityId: new ObjectId(communityId) });
}

module.exports = {
    getCommunityPosts,
    getPostById,
    createPost,
    updatePost,
    likePost,
    deletePost,
    deleteCommunityPosts
};