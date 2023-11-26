"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const auth_middleware_1 = require("../middlewares/auth.middleware");
const owner_controller_1 = require("../controllers/owner.controller");
const ownerRouter = (0, express_1.Router)();
ownerRouter.route("/createProject").post(auth_middleware_1.protect, owner_controller_1.createProject);
ownerRouter.route("/deleteProject").post(auth_middleware_1.protect, owner_controller_1.deleteProject);
ownerRouter.route("/renameProject").post(auth_middleware_1.protect, owner_controller_1.renameProject);
///-------------------- OWNER MAINTAINER ROUTES  ---------------------////////////////////
ownerRouter
    .route("/maintainer/addmaintainer")
    .post(auth_middleware_1.protect, owner_controller_1.addMaintainerToProject);
ownerRouter
    .route("/maintainer/removemaintainer")
    .post(auth_middleware_1.protect, owner_controller_1.removeMaintainerFromProject);
////----------------------  OWNER PERSONAL ROUTES  -----------------/////////////////
ownerRouter.route("/myprojects/:userId").get(auth_middleware_1.protect, owner_controller_1.getOwnerProjects);
exports.default = ownerRouter;
