import { Request, RequestHandler, Response } from "express";
import asyncHandler from "express-async-handler";
import { Task } from "../models/tasks.model";
import { Project } from "../models/project.model";
import { populate } from "dotenv";

///////////---------------------------- MAINTAINER TASK API'S --------------------------------------//////////

export const createTask: RequestHandler = asyncHandler(
  async (req: Request, res: Response) => {
    try {
      const { name, description, deadline, labels, assignee, status } =
        req.body;
      if (!name || !description || !deadline || !labels || !status) {
        res.status(400).json({ message: "Please fill all the task details" });
        return;
      }
      let newTask = await Task.create({
        name,
        description,
        deadline,
        labels,
        status,
        assignee,
      });
      if (assignee) {
        newTask = await newTask.populate("assignee", "-password");
      }
      res
        .status(200)
        .json({ message: "Task Added Successfully", data: newTask });
    } catch (error) {
      res.status(500).json({ message: error });
    }
  }
);

export const getAllTasks: RequestHandler = asyncHandler(
  async (req: Request, res: Response) => {
    try {
      let allTask = await Task.find().populate("assignee");
      if (!allTask) {
        res.status(400).json({ message: "No Tasks to display!" });
        return;
      }
      res.status(200).json({ data: allTask });
    } catch (error) {
      res.status(500).json({ message: error });
    }
  }
);

export const deleteTask: RequestHandler = asyncHandler(
  async (req: Request, res: Response) => {
    try {
      const { taskId } = req.body;
      if (!taskId) {
        res.status(400).json({ message: "Unable to find the task!" });
      }
      let tasks = await Task.findByIdAndDelete(taskId, {
        new: true,
      });
      res
        .status(200)
        .json({ message: "Task Deleted Successfully!", data: tasks });
    } catch (error) {
      res.status(500).json({ message: error });
    }
  }
);

export const searchTask: RequestHandler = asyncHandler(
  async (req: Request, res: Response) => {
    try {
      const { keyword, status } = req.query;
      const searchQuery: any = {};
      if (keyword) {
        const keywordAsString = keyword as string;
        searchQuery.$or = [
          { name: { $regex: new RegExp(keywordAsString, "i") } },
          { description: { $regex: new RegExp(keywordAsString, "i") } },
        ];
      }
      if (status) {
        searchQuery.status = status;
      }
      const tasks = await Task.find(searchQuery).populate(
        "assignee",
        "-password"
      );
      res.status(200).json({ data: tasks });
    } catch (error) {
      res.status(500).json({ message: error });
    }
  }
);

export const pendingTask: RequestHandler = asyncHandler(
  async (req: Request, res: Response) => {
    try {
      const pendingTasks = await Task.find({ status: "pending" }).populate(
        "assignee",
        "-password"
      );
      if (!pendingTasks) {
        res.status(400).json({ message: "No Pending Tasks" });
        return;
      }

      res.status(200).json({ message: "success", data: pendingTasks });
    } catch (error) {
      res.status(500).json({ message: error });
    }
  }
);
export const approvedTask: RequestHandler = asyncHandler(
  async (req: Request, res: Response) => {
    try {
      const approvedTasks = await Task.find({ status: "approved" }).populate(
        "assignee",
        "-password"
      );
      if (!approvedTasks) {
        res.status(400).json({ message: "No Approved Tasks" });
        return;
      }

      res.status(200).json({ message: "success", data: approvedTasks });
    } catch (error) {
      res.status(500).json({ message: error });
    }
  }
);
export const assignWork: RequestHandler = asyncHandler(
  async (req: Request, res: Response) => {
    try {
      const { taskId, userId } = req.body;
      if (!userId || !taskId) {
        res.status(400).json({ message: "No Assignee or Task Found!" });
        return;
      }
      let task = await Task.findByIdAndUpdate(
        taskId,
        {
          assignee: userId,
        },
        {
          new: true,
        }
      );
      if (task) {
        task = await task.populate("assignee", "-password");
      }
      res
        .status(200)
        .json({ message: "Task Assigned Successfully!", data: task });
    } catch (error) {
      res.status(500).json({ message: error });
    }
  }
);

export const approveTaskStatus: RequestHandler = asyncHandler(
  async (req: Request, res: Response) => {
    try {
      const { taskId } = req.body;
      if (!taskId) {
        res.status(400).json({ message: "No task found!" });
        return;
      }
      const task = await Task.findByIdAndUpdate(
        taskId,
        {
          status: "approved",
        },
        {
          new: true,
        }
      ).populate("assignee", "-password");
      res.status(200).json({ message: "success", data: task });
    } catch (error) {
      res.status(500).json({ message: error });
    }
  }
);

export const getSubmissions: RequestHandler = asyncHandler(
  async (req: Request, res: Response) => {
    try {
      const tasks = await Task.find({
        submission: {
          $exists: true,
          $ne: null,
        },
      }).populate("assignee", "-password");
      res.status(200).json({ message: "success", tasks });
    } catch (error) {
      res.status(500).json({ message: error });
    }
  }
);

//////////////////////--------------------------------MAINTAINER USER API'S ---------------------------------///////////////

export const addUserToProject = asyncHandler(
  async (req: Request, res: Response) => {
    const { userId, projectId } = req.body;
    if (!userId || !projectId) {
      res.status(400).json({ message: "No user or project found!" });
      return;
    }

    const user = await Project.findByIdAndUpdate(
      projectId,
      {
        $push: { members: userId },
      },
      {
        new: true,
      }
    ).populate("owners maintainers members", "-password");
    res.status(200).json({ message: "success", data: user });
  }
);

export const removeUserFromProject = asyncHandler(
  async (req: Request, res: Response) => {
    const { userId, projectId } = req.body;
    if (!userId || !projectId) {
      res.status(400).json({ message: "No user or project found!" });
      return;
    }

    const user = await Project.findByIdAndUpdate(
      projectId,
      {
        $pull: { members: userId },
      },
      {
        new: true,
      }
    ).populate("owners maintainers members", "-password");
    res.status(200).json({ message: "success", data: user });
  }
);

///////// ----------------------------  MAINTAINER PERSONAL API'S  -----------------------//////////////////

export const getMaintainerProjects = asyncHandler(
  async (req: Request, res: Response) => {
    try {
      const { userId } = req.params;
      if (!userId) {
        res.status(400).json({ message: "No parameter found!" });
        return;
      }
      let projects = await Project.find({
        maintainers: userId,
      })
        .populate("owners maintainers members", "-password")
        .exec();
      if (projects.length === 0) {
        res.status(400).json({ message: "No maintainer found!" });
        return;
      }
      res.status(200).json({ message: "success", data: projects });
    } catch (error) {
      res.status(500).json({ message: error });
    }
  }
);
