import { Router } from "express";
import {
  addUserToProject,
  approveTaskStatus,
  approvedTask,
  assignWork,
  createTask,
  deleteTask,
  getAllTasks,
  getMaintainerProjects,
  getSubmissions,
  pendingTask,
  removeUserFromProject,
  searchTask,
} from "../controllers/maintainer.controller";
import { protect } from "../middlewares/auth.middleware";

const maintainerRouter = Router();
/////-----------------------  MAINTAINER TASK ROUTES  ------------------------------//////////////////////
maintainerRouter.route("/tasks/addTask").post(protect, createTask);
maintainerRouter.route("/tasks/deleteTask").post(protect, deleteTask);
maintainerRouter.route("/tasks/allTasks").get(protect, getAllTasks);
maintainerRouter.route("/tasks/search").get(protect, searchTask);
maintainerRouter.route("/tasks/pendingTask").get(protect, pendingTask);
maintainerRouter.route("/tasks/approvedTask").get(protect, approvedTask);
maintainerRouter
  .route("/tasks/approveTaskStatus")
  .post(protect, approveTaskStatus);
maintainerRouter.route("/tasks/assignTask").post(protect, assignWork);
maintainerRouter.route("/tasks/getSubmissions").get(protect, getSubmissions);

////////---------------------- MAINTAINER MEMBERS ROUTES  ------------------------/////////////////////////

maintainerRouter.route("/members/addmember").post(protect, addUserToProject);
maintainerRouter
  .route("/members/removemember")
  .post(protect, removeUserFromProject);

//////// ----------------------- MAINTAINER PERSONAL ROUTES   ---------------------//////////////////

maintainerRouter
  .route("/myprojects/:userId")
  .get(protect, getMaintainerProjects);

export default maintainerRouter;
