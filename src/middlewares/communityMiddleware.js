const { getCommunityInfo } = require("../models/communitiesModel");
const { ObjectId } = require("mongodb");
const { decodeObjectId } = require("../utils/objectIdBase62");

async function communityExists(req, res, next) {
    const urlId = req.params.commId;
    const communityId = decodeObjectId(req.params.commId);

    try {
        new ObjectId(communityId);
    }
    catch (error) {
        const err = new Error("Społeczność nie istnieje");
        err.status = 404;
        return next(err);
    }

    const community = await getCommunityInfo(communityId);
    if (!community){
        const err = new Error("Społeczność nie istnieje");
        err.status = 404;
        return next(err);
    }
        
    next();
}

async function isCommunityOwner(req, res, next) {  
    const commId = decodeObjectId(req.params.commId);
    const userId = req.session?.user?.id;

    const community = await getCommunityInfo(commId);

    if (community.creatorId.toString() !== userId) {
        const err = new Error("Nie masz uprawnień do edycji tej społeczności");
        err.status = 403;
        return next(err);
    }

    next();
}

module.exports = { communityExists, isCommunityOwner };