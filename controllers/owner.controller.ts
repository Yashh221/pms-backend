import { Request, Response } from "express";
import asyncHandler from "express-async-handler";
import { Project } from "../models/project.model";

///////////// ------------------------  OWNER PROJECT API'S  ------------------------///////////////////////
export const createProject = asyncHandler(
  async (req: Request, res: Response) => {
    try {
      const { name, deadline, subject, owners, maintainers, members } =
        req.body;
      if (!name || !deadline || !subject || !owners) {
        res.status(400).json({ message: "Please provide all the details!" });
        return;
      }
      let project = await Project.create({
        name,
        deadline,
        subject,
        owners,
        maintainers,
        members,
      });

      project = await project.populate(
        "owners maintainers members",
        "-password"
      );
      res.status(201).json({ message: "Project created", data: project });
    } catch (error) {
      res.status(500).json({ message: "Internal Server Error", data: error });
    }
  }
);
export const deleteProject = asyncHandler(
  async (req: Request, res: Response) => {
    try {
      const { projectId } = req.body;
      if (!projectId) {
        res.status(400).json({ message: "Please provide all the details!" });
        return;
      }
      let project = await Project.findByIdAndDelete(projectId);
      res.status(200).json({ message: "Project created", data: project });
    } catch (error) {
      res.status(500).json({ message: "Internal Server Error", data: error });
    }
  }
);

export const renameProject = asyncHandler(
  async (req: Request, res: Response) => {
    try {
      const { projectId, name } = req.body;
      if (!projectId) {
        res.status(400).json({ message: "Please Provide all the details!" });
        return;
      }

      let project = await Project.findByIdAndUpdate(
        projectId,
        {
          name,
        },
        {
          new: true,
        }
      ).populate("owners maintainers members", "-password");
      res.status(200).json({ message: "success", data: project });
    } catch (error) {
      res.status(500).json({ message: "Internal Server Error", data: error });
    }
  }
);

////////////---------------------   OWNERS MAINTAINER API'S   ----------------------------////////////////////

export const addMaintainerToProject = asyncHandler(
  async (req: Request, res: Response) => {
    try {
      const { maintainerId, projectId } = req.body;
      if (!maintainerId || !projectId) {
        res.status(400).json({ message: "No user or project found!" });
        return;
      }

      const user = await Project.findByIdAndUpdate(
        projectId,
        {
          $push: { maintainers: maintainerId },
        },
        {
          new: true,
        }
      ).populate("owners maintainers members", "-password");
      res.status(200).json({ message: "success", data: user });
    } catch (error) {
      res.status(500).json({ message: "Internal Server Error", data: error });
    }
  }
);

export const removeMaintainerFromProject = asyncHandler(
  async (req: Request, res: Response) => {
    try {
      const { maintainerId, projectId } = req.body;
      if (!maintainerId || !projectId) {
        res.status(400).json({ message: "No user or project found!" });
        return;
      }

      const user = await Project.findByIdAndUpdate(
        projectId,
        {
          $pull: { maintainers: maintainerId },
        },
        {
          new: true,
        }
      ).populate("owners maintainers members", "-password");
      res.status(200).json({ message: "success", data: user });
    } catch (error) {
      res.status(500).json({ message: "Internal Server Error", data: error });
    }
  }
);

////////////////----------------- OWNER PERSONAL API's   ----------------////////////////////

export const getOwnerProjects = asyncHandler(
  async (req: Request, res: Response) => {
    try {
      const { userId } = req.params;
      if (!userId) {
        res.status(400).json({ message: "No parameter found!" });
        return;
      }
      let projects = await Project.find({
        owners: userId,
      })
        .populate("owners maintainers members", "-password")
        .exec();
      if (projects.length === 0) {
        res.status(400).json({ message: "No Owner found!" });
        return;
      }
      res.status(200).json({ message: "success", data: projects });
    } catch (error) {
      res.status(500).json({ message: "Internal Server Error", data: error });
    }
  }
);
