import { Router } from "express";
import {
  approveTaskStatus,
  approvedTask,
  assignWork,
  createTask,
  deleteTask,
  getAllTasks,
  getSubmissions,
  pendingTask,
  searchTask,
} from "../controllers/maintainer.controller";
import { protect } from "../middlewares/auth.middleware";

const maintainerRouter = Router();

maintainerRouter.route("/addTask").post(protect, createTask);
maintainerRouter.route("/deleteTask").post(protect, deleteTask);
maintainerRouter.route("/allTasks").get(protect, getAllTasks);
maintainerRouter.route("/search").get(protect, searchTask);
maintainerRouter.route("/pendingTask").get(protect, pendingTask);
maintainerRouter.route("/approvedTask").get(protect, approvedTask);
maintainerRouter.route("/approveTaskStatus").post(protect, approveTaskStatus);
maintainerRouter.route("/assignTask").post(protect, assignWork);
maintainerRouter.route("/getSubmissions").get(protect, getSubmissions);

export default maintainerRouter;
