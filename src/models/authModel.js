const { ObjectId } = require("mongodb");
const { getDB } = require("../data/connection");
const crypto = require("crypto");

function hashPassword(password) {
    const hash = crypto
        .createHash("sha256")
        .update(password)
        .digest("hex");

    return hash;
}

async function getUserByNameOrEmail(username, email) {
    const db = getDB();
    return await db
        .collection("users")
        .findOne({
            $or: [
                { username: username },
                { email: email }
            ]
        });
}

async function getUserById(userId) {
    const db = getDB();
    return await db
        .collection("users")
        .findOne({ _id: new ObjectId(userId)});
}

async function addNewUser(validator) {
    const db = getDB();
    const existingUser = await getUserByNameOrEmail(validator.username, validator.email);

    if(existingUser)
        return "userExist";

    const hashedPassword = hashPassword(validator.password);
    
    return await db.collection("users").insertOne({
        username: validator.username,
        email: validator.email,
        password: hashedPassword,
        createdAt: new Date(),
        communities: [], 
        likedPosts: []
    });
}

async function addLikedPost(userId, postId) {
    const db = getDB();
    return await db.collection("users").updateOne(
        { _id: new ObjectId(userId) },
        { $addToSet: { likedPosts: postId.toString() } }
    );
}

async function removeLikedPost(userId, postId) {
    const db = getDB();
    return await db.collection("users").updateOne(
        { _id: new ObjectId(userId) },
        { $pull: { likedPosts: postId.toString() } }
    );
}

module.exports = {
    hashPassword,
    addNewUser,
    getUserByNameOrEmail,
    getUserById,
    addLikedPost,
    removeLikedPost
}