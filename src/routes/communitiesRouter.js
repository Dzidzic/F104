const express = require("express");
const communitiesRouter = express.Router({ mergeParams: true });
const { requireAuth } = require("../middlewares/authMiddleware");
const { communityExists, isCommunityOwner } = require("../middlewares/communityMiddleware");
const { getCommunities } = require("../controllers/mainController");
const communitiesController = require("../controllers/communitiesController");

communitiesRouter.get("/", getCommunities);
communitiesRouter.get("/add", requireAuth, communitiesController.getAddCommunity);
communitiesRouter.post("/add", requireAuth, communitiesController.postAddCommunity);
communitiesRouter.get("/:commId", communityExists, communitiesController.getCommunity);
communitiesRouter.get("/:commId/edit", communityExists, requireAuth, isCommunityOwner, communitiesController.getEditCommunity);
communitiesRouter.post("/:commId/edit", communityExists, requireAuth, isCommunityOwner, communitiesController.postEditCommunity);
communitiesRouter.post("/:commId/delete", communityExists, requireAuth, isCommunityOwner, communitiesController.deleteCommunity);

module.exports = communitiesRouter;
