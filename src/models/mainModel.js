const { ObjectId } = require("mongodb");
const { getDB } = require("../data/connection");

async function getAllCommunities(filter) {
    const db = getDB();
    return await db
        .collection("communities")
        .find(filter)
        .toArray();
}

module.exports = {
    getAllCommunities,
}