const postsModel = require("../models/postsModel");
const { getCommunityInfo } = require("../models/communitiesModel");
const { encodeObjectId, decodeObjectId } = require("../utils/objectIdBase62");
const { getUserById, removeLikedPost, addLikedPost } = require("../models/authModel");

async function getPost(req, res) {
    const commUrlId = req.params.commId;
    const postUrlId = req.params.postId;

    const tempPost = await postsModel.getPostById(decodeObjectId(postUrlId));
    const likesCount = tempPost.likes ? tempPost.likes : 0;
    
    const post = {
        ...tempPost,
        likesCount,
        author: await getUserById(tempPost.authorId).then(u => u.username),
        urlId: postUrlId
    };

    const communityName = await getCommunityInfo(decodeObjectId(commUrlId)).then(c => c.name);
 
    let isLiked = false;
    const user = req.session.user ? await getUserById(req.session.user.id) : null;

    if(user) 
        isLiked = user.likedPosts.includes(post._id.toString()); 

    res.render("pages/posts/show.ejs", { post, communityName, commUrlId, isLiked });
}

async function getAddPost(req, res) {
    const validator = {
        title: "",
        content: "",
        tags: ""
    }
    const urlId = req.params.commId;
    const communityName = await getCommunityInfo(decodeObjectId(urlId)).then(c => c.name);

    res.render("pages/posts/add.ejs", { communityName, validator, formAction: `/c/${urlId}/post/add` });
}

function formValidation(title, content, tags, isSpoiler) {
     const validator = {
        title: "invalid",
        content: "invalid",
        tags: "",
        spoiler: isSpoiler
    }

    const titleRegex = /[a-zA-Z0-9]/;
    if (title.length >= 5 && title.length <= 50 && titleRegex.test(title)) 
        validator.title = title;

    if (content.length >= 10 && content.length <= 5000)
        validator.content = content;

    let parsedTags = [];
    if(tags !== "") {
        parsedTags = tags
            .split(",")
            .map(t => t.trim().toLowerCase())
            .filter(Boolean);

        if (parsedTags.length <= 5)
            validator.tags = tags;
        else
            validator.tags = "invalid";
    }

    return { validator, parsedTags };
}

async function postAddPost(req, res) {
    const { title, content, tags } = req.body;
    const isSpoiler = req.body.spoiler === "on";
    const urlId = req.params.commId;
    const communityName = await getCommunityInfo(decodeObjectId(urlId)).then(c => c.name);

    const { validator, parsedTags } = formValidation(title, content, tags, isSpoiler);
   
    const hasInvalid = Object.values(validator).some(value => value === "invalid");
    if (hasInvalid)
        return res.render("pages/posts/add.ejs", { communityName, validator, formAction: `/c/${urlId}/post/add` }); 

    const result = await postsModel.createPost({
        ...validator, 
        communityId: decodeObjectId(urlId),
        authorId: req.session.user.id,
        parsedTags,
        isSpoiler
    });

    if(result === "postExist") {
        validator.title = "taken";
        return res.render("pages/posts/add.ejs", { communityName, validator, formAction: `/c/${urlId}/post/add`,  });
    }else if(result.acknowledged == true)
        return res.redirect(`/c/${urlId}`);

    return res.render("pages/posts/add.ejs", { communityName, validator, formAction: `/c/${urlId}/post/add` });   
}

async function getEditPost(req, res) { 
    const commUrlId = req.params.commId;
    const postUrlId = req.params.postId;
    const communityName = await getCommunityInfo(decodeObjectId(commUrlId)).then(c => c.name);

    const post = await postsModel.getPostById(decodeObjectId(postUrlId));

    const validator = {
        title: post.title,
        content: post.content,
        tags: post.tags.join(", ")
    }

    res.render("pages/posts/edit.ejs", { communityName, validator, formAction: `/c/${commUrlId}/post/${postUrlId}/edit` });
}

async function postEditPost(req, res) {
    const { title, content, tags } = req.body;
    const isSpoiler = req.body.spoiler === "on";

    const postUrlId = req.params.postId;
    const commUrlId = req.params.commId;

    const communityName = await getCommunityInfo(decodeObjectId(commUrlId)).then(c => c.name);

    const { validator, parsedTags } = formValidation(title, content, tags, isSpoiler);
   
    const hasInvalid = Object.values(validator).some(value => value === "invalid");
    if (hasInvalid)
        return res.render("pages/posts/edit.ejs", { communityName, validator, formAction: `/c/${commUrlId}/post/${postUrlId}/edit` }); 

    const result = await postsModel.updatePost(decodeObjectId(postUrlId), {
        ...validator, 
        communityId: decodeObjectId(commUrlId),
        parsedTags,
        isSpoiler
    });

    if(result === "postExist") {
        validator.title = "taken";
        return res.render("pages/posts/edit.ejs", { communityName, validator, formAction: `/c/${commUrlId}/post/${postUrlId}/edit`,  });
    }else if(result.acknowledged == true)
        return res.redirect(`/c/${commUrlId}/post/${postUrlId}`);

    return res.render("pages/posts/edit.ejs", { communityName, validator, formAction: `/c/${commUrlId}/post/${postUrlId}/edit` });   
}

async function postLikePost(req, res) {
    const commUrlId = req.params.commId;
    const postUrlId = req.params.postId;
    const userId = req.session.user.id;

    const user = await getUserById(userId);
    const isLiked = user.likedPosts.includes(decodeObjectId(postUrlId).toString());

    if(isLiked)
        await removeLikedPost(userId, decodeObjectId(postUrlId));
    else
        await addLikedPost(userId, decodeObjectId(postUrlId));

    await postsModel.likePost(decodeObjectId(postUrlId), isLiked ? -1 : 1);
    
    return res.redirect(`/c/${commUrlId}/post/${postUrlId}`);
}

async function postDeletePost(req, res) {
    const commUrlId = req.params.commId;
    const postUrlId = req.params.postId;

    await postsModel.deletePost(decodeObjectId(postUrlId));

    return res.redirect(`/c/${commUrlId}`);
}

module.exports = {
    getPost,
    getAddPost,
    postAddPost,
    getEditPost,
    postEditPost,
    postLikePost,
    postDeletePost
};