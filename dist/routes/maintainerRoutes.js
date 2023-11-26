"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const maintainer_controller_1 = require("../controllers/maintainer.controller");
const auth_middleware_1 = require("../middlewares/auth.middleware");
const maintainerRouter = (0, express_1.Router)();
/////-----------------------  MAINTAINER TASK ROUTES  ------------------------------//////////////////////
maintainerRouter.route("/tasks/addTask").post(auth_middleware_1.protect, maintainer_controller_1.createTask);
maintainerRouter.route("/tasks/deleteTask").post(auth_middleware_1.protect, maintainer_controller_1.deleteTask);
maintainerRouter.route("/tasks/allTasks").get(auth_middleware_1.protect, maintainer_controller_1.getAllTasks);
maintainerRouter.route("/tasks/search").get(auth_middleware_1.protect, maintainer_controller_1.searchTask);
maintainerRouter.route("/tasks/pendingTask").get(auth_middleware_1.protect, maintainer_controller_1.pendingTask);
maintainerRouter.route("/tasks/approvedTask").get(auth_middleware_1.protect, maintainer_controller_1.approvedTask);
maintainerRouter
    .route("/tasks/approveTaskStatus")
    .post(auth_middleware_1.protect, maintainer_controller_1.approveTaskStatus);
maintainerRouter.route("/tasks/assignTask").post(auth_middleware_1.protect, maintainer_controller_1.assignWork);
maintainerRouter.route("/tasks/getSubmissions").get(auth_middleware_1.protect, maintainer_controller_1.getSubmissions);
////////---------------------- MAINTAINER MEMBERS ROUTES  ------------------------/////////////////////////
maintainerRouter.route("/members/addmember").post(auth_middleware_1.protect, maintainer_controller_1.addUserToProject);
maintainerRouter
    .route("/members/removemember")
    .post(auth_middleware_1.protect, maintainer_controller_1.removeUserFromProject);
//////// ----------------------- MAINTAINER PERSONAL ROUTES   ---------------------//////////////////
maintainerRouter
    .route("/myprojects/:userId")
    .get(auth_middleware_1.protect, maintainer_controller_1.getMaintainerProjects);
exports.default = maintainerRouter;
