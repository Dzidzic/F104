const communitiesModel = require("../models/communitiesModel");
const { getCommunityPosts } = require("../models/postsModel");
const { deleteCommunityPosts } = require("../models/postsModel");
const { getUserById } = require("../models/authModel");
const { encodeObjectId, decodeObjectId } = require("../utils/objectIdBase62");

async function getCommunity(req, res) {
    const communityId = decodeObjectId(req.params.commId); 
    const tagFilter = req.query.tag?.trim();
    const sortBy = req.query.sortBy || "date";
    const order = req.query.order === "asc" ? 1 : -1;

    const communityInfo = await communitiesModel.getCommunityInfo(communityId)
    const creatorName = await getUserById(communityInfo.creatorId).then(u => u.username);   
    
    const SORT_FIELDS = {
        title: "title",
        likes: "likes",
        date: "createdAt"
    };
    const sortField = SORT_FIELDS[sortBy] || "createdAt";
    
    const tempPosts = await getCommunityPosts(communityId, tagFilter, sortField, order);
    const posts = await Promise.all(
        tempPosts.map(async post => {
            const user = await getUserById(post.authorId);

            if(post.content.length > 40)
                post.content = post.content.substring(0, 37).trim() + "...";

            const likesCount = post.likes ? post.likes : 0;
            
            return {
                ...post,
                likesCount,
                author: user.username,
                urlId: encodeObjectId(post._id)               
            };
        })
    );

    res.render("pages/communities/show.ejs", { communityInfo, creatorName, posts, commUrlId: req.params.commId, sortBy, order, tagFilter });
}

async function getAddCommunity(req, res) {
    const validator = {
        name: "",
        description: "",
        theme: "",
    }

    res.render("pages/communities/add.ejs", { validator, formAction: "/c/add" });
}

function formValidation(name, description, theme, customTheme) {
    const validator = {
        name: "invalid",
        description: "invalid",
        theme: "invalid",
        customTheme: "invalid"
    }

    const nameRegex = /^[a-zA-Z0-9]+$/;
    if (name.length >= 3 && name.length <= 50 && nameRegex.test(name)) 
        validator.name = name

    if (description.length <= 500) 
        validator.description = description;

    if (theme.replace(/[^a-zA-Z0-9]/g, "").length !== 0){
        if(theme == "Inna"){
            if(customTheme.replace(/[^a-zA-Z0-9]/g, "").length !== 0){
                validator.theme = theme;              
                validator.customTheme = customTheme.charAt(0).toUpperCase() + customTheme.slice(1);;
            }
        }else{
            validator.theme = theme;
            validator.customTheme = theme;
        }
    }

    return validator;
}

async function postAddCommunity(req, res) {
    const { name, description, theme, customTheme } = req.body;

    const validator = formValidation(name, description, theme, customTheme);

    const hasInvalid = Object.values(validator).some(value => value === "invalid");
    if (hasInvalid) 
        return res.render("pages/communities/add.ejs", { validator, formAction: "/c/add" }); 

    const result = await communitiesModel.createCommunity({...validator, creatorId: req.session.user.id});

    if(result === "communityExist") {
        validator.name = "taken";
        return res.render("pages/communities/add.ejs", { validator, formAction: "/c/add" });
    }else if(result.acknowledged == true){
        const urlId = encodeObjectId(result.insertedId);
        return res.redirect(`/c/${urlId}`);
    }
        
    return res.render("pages/communities/add.ejs", { validator, formAction: "/c/add" });
}

async function getEditCommunity(req, res) {
    const urlId = req.params.commId;
    const communityId = decodeObjectId(req.params.commId);

    const communityInfo = await communitiesModel.getCommunityInfo(communityId);
    if(!communityInfo)
        return next();

    const themes = ["Programowanie", "Gry", "Sport", "Kultura"];
    const deafultTheme = themes.includes(communityInfo.theme) ? communityInfo.theme : "Inna";

    const validator = {
        name: communityInfo.name,
        description: communityInfo.description,
        theme: deafultTheme,
        customTheme: communityInfo.theme
    }

    res.render("pages/communities/edit.ejs" , { validator, formAction: `/c/${urlId}/edit` });
}

async function postEditCommunity(req, res) {
    const { name, description, theme, customTheme } = req.body;
    const urlId = req.params.commId;
    
    const validator = formValidation(name, description, theme, customTheme);

    const hasInvalid = Object.values(validator).some(value => value === "invalid");
    if (hasInvalid) 
        return res.render("pages/communities/edit.ejs", { validator, formAction: `/c/${urlId}/edit` }); 

    const result = await communitiesModel.editCommunity({...validator, communityId: decodeObjectId(urlId)});

    if(result === "communityExist") {
        validator.name = "taken";
        return res.render("pages/communities/edit.ejs", { validator, formAction: `/c/${urlId}/edit` });
    }else if(result.acknowledged == true)
        return res.redirect(`/c/${urlId}`);

    return res.render("pages/communities/edit.ejs", { validator, formAction: `/c/${urlId}/edit` });
}

async function deleteCommunity(req, res) {
    const commId = decodeObjectId(req.params.commId);
    
    await communitiesModel.deleteCommunity(commId);
    await deleteCommunityPosts(commId);

    res.redirect("/");
}

module.exports = {
    getAddCommunity,
    postAddCommunity,
    getEditCommunity,
    postEditCommunity,
    getCommunity,
    deleteCommunity
};