"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.getOwnerProjects = exports.removeMaintainerFromProject = exports.addMaintainerToProject = exports.renameProject = exports.deleteProject = exports.createProject = void 0;
const express_async_handler_1 = __importDefault(require("express-async-handler"));
const project_model_1 = require("../models/project.model");
///////////// ------------------------  OWNER PROJECT API'S  ------------------------///////////////////////
exports.createProject = (0, express_async_handler_1.default)((req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const { name, deadline, subject, owners, maintainers, members } = req.body;
        if (!name || !deadline || !subject || !owners) {
            res.status(400).json({ message: "Please provide all the details!" });
            return;
        }
        let project = yield project_model_1.Project.create({
            name,
            deadline,
            subject,
            owners,
            maintainers,
            members,
        });
        project = yield project.populate("owners maintainers members", "-password");
        res.status(201).json({ message: "Project created", data: project });
    }
    catch (error) {
        res.status(500).json({ message: "Internal Server Error", data: error });
    }
}));
exports.deleteProject = (0, express_async_handler_1.default)((req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const { projectId } = req.body;
        if (!projectId) {
            res.status(400).json({ message: "Please provide all the details!" });
            return;
        }
        let project = yield project_model_1.Project.findByIdAndDelete(projectId);
        res.status(200).json({ message: "Project created", data: project });
    }
    catch (error) {
        res.status(500).json({ message: "Internal Server Error", data: error });
    }
}));
exports.renameProject = (0, express_async_handler_1.default)((req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const { projectId, name } = req.body;
        if (!projectId) {
            res.status(400).json({ message: "Please Provide all the details!" });
            return;
        }
        let project = yield project_model_1.Project.findByIdAndUpdate(projectId, {
            name,
        }, {
            new: true,
        }).populate("owners maintainers members", "-password");
        res.status(200).json({ message: "success", data: project });
    }
    catch (error) {
        res.status(500).json({ message: "Internal Server Error", data: error });
    }
}));
////////////---------------------   OWNERS MAINTAINER API'S   ----------------------------////////////////////
exports.addMaintainerToProject = (0, express_async_handler_1.default)((req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const { maintainerId, projectId } = req.body;
        if (!maintainerId || !projectId) {
            res.status(400).json({ message: "No user or project found!" });
            return;
        }
        const user = yield project_model_1.Project.findByIdAndUpdate(projectId, {
            $push: { maintainers: maintainerId },
        }, {
            new: true,
        }).populate("owners maintainers members", "-password");
        res.status(200).json({ message: "success", data: user });
    }
    catch (error) {
        res.status(500).json({ message: "Internal Server Error", data: error });
    }
}));
exports.removeMaintainerFromProject = (0, express_async_handler_1.default)((req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const { maintainerId, projectId } = req.body;
        if (!maintainerId || !projectId) {
            res.status(400).json({ message: "No user or project found!" });
            return;
        }
        const user = yield project_model_1.Project.findByIdAndUpdate(projectId, {
            $pull: { maintainers: maintainerId },
        }, {
            new: true,
        }).populate("owners maintainers members", "-password");
        res.status(200).json({ message: "success", data: user });
    }
    catch (error) {
        res.status(500).json({ message: "Internal Server Error", data: error });
    }
}));
////////////////----------------- OWNER PERSONAL API's   ----------------////////////////////
exports.getOwnerProjects = (0, express_async_handler_1.default)((req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const { userId } = req.params;
        if (!userId) {
            res.status(400).json({ message: "No parameter found!" });
            return;
        }
        let projects = yield project_model_1.Project.find({
            owners: userId,
        })
            .populate("owners maintainers members", "-password")
            .exec();
        if (projects.length === 0) {
            res.status(400).json({ message: "No Owner found!" });
            return;
        }
        res.status(200).json({ message: "success", data: projects });
    }
    catch (error) {
        res.status(500).json({ message: "Internal Server Error", data: error });
    }
}));
