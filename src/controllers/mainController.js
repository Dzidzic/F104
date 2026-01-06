const mainModel = require("../models/mainModel");
const { encodeObjectId, decodeObjectId } = require("../utils/objectIdBase62");

async function getCommunities(req, res) {
    const themeFilter = req.query.theme?.trim();
    const filter = themeFilter ? { theme: themeFilter } : {};

    const rawCommunities = await mainModel.getAllCommunities(filter);
    const communities = rawCommunities.map(community => ({
        ...community,
        urlId: encodeObjectId(community._id)
    }));

    res.render("pages/home/index.ejs", { communities });
}

async function getProfile(req, res) {
    res.render("pages/user/account.ejs");
}

async function getAbout(req, res) {
    res.render("pages/info/about.ejs");
}

module.exports = {
    getCommunities,
    getProfile,
    getAbout
};