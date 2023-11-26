import { Router } from "express";
import { protect } from "../middlewares/auth.middleware";
import {
  addMaintainerToProject,
  createProject,
  deleteProject,
  getOwnerProjects,
  removeMaintainerFromProject,
  renameProject,
} from "../controllers/owner.controller";

const ownerRouter = Router();

ownerRouter.route("/createProject").post(protect, createProject);
ownerRouter.route("/deleteProject").post(protect, deleteProject);
ownerRouter.route("/renameProject").post(protect, renameProject);

///-------------------- OWNER MAINTAINER ROUTES  ---------------------////////////////////
ownerRouter
  .route("/maintainer/addmaintainer")
  .post(protect, addMaintainerToProject);
ownerRouter
  .route("/maintainer/removemaintainer")
  .post(protect, removeMaintainerFromProject);

////----------------------  OWNER PERSONAL ROUTES  -----------------/////////////////

ownerRouter.route("/myprojects/:userId").get(protect, getOwnerProjects);

export default ownerRouter;
