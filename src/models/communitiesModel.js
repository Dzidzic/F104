const { ObjectId } = require("mongodb");
const { getDB } = require("../data/connection");

async function getCommunityInfo(communityId) {
    const db = getDB();
    return await db
        .collection("communities")
        .findOne({ _id: new ObjectId(communityId)}) 
}

async function findCommunityByName(communityName) {
    const db = getDB();
    return await db
        .collection("communities")
        .findOne({ name: communityName });
}

async function createCommunity(values) {
    const db = getDB();
    const existingCommunity = await findCommunityByName(values.name);

    if(existingCommunity)
        return "communityExist";

    return await db.collection("communities").insertOne({ 
        name: values.name,
        description: values.description,
        theme: values.customTheme,
        creatorId: new ObjectId(values.creatorId),
        createdAt: new Date(),
        members: 1
    });
}

async function editCommunity(values) {
    const db = getDB();
    const existingCommunity = await findCommunityByName(values.name);

    if(existingCommunity && existingCommunity._id.toString() !== values.communityId)
        return "communityExist";
    
    return await db.collection("communities").updateOne(
        { _id: new ObjectId(values.communityId) },
        { $set: {
            name: values.name,
            description: values.description,    
            theme: values.customTheme
        }}
    );
}

async function deleteCommunity(commId) {
    const db = getDB();
    return await db.collection("communities").deleteOne({ _id: new ObjectId(commId) });
}

module.exports = {
    getCommunityInfo,
    editCommunity,
    createCommunity,
    deleteCommunity
};